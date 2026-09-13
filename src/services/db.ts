import { db } from "../lib/firebase";
import { collection, getDocs, doc, runTransaction, setDoc } from "firebase/firestore";
import { get as idbGet, set as idbSet } from 'idb-keyval';
import { CacheManager } from './cache';
import { PaginatedResult } from '../types';
import { 
  UserProfile, 
  Zone, 
  ActivitySession,
  ZoneOperation, 
  SegmentOperation,
  AppNotification, 
  Achievement,
  LiveChallenge,
  PlayerSettings,
  TutorialState,
  Clan,
  PlayerPublicActivity
} from '../types';
import { 
  CURRENT_USER, 
  INITIAL_ZONES, 
  INITIAL_SESSION_HISTORY, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_CLANS,
  MOCK_ROUTES,
  MOCK_CHALLENGES,
  INITIAL_DIRECT_CHALLENGES,
  INITIAL_EVENTS
} from '../data/mockData';
import { DEFAULT_PLAYER_SETTINGS } from '../data/settingsData';
import { INITIAL_ACTIVITIES } from '../data/activityData';



// Constantes de chaves do LocalStorage
const KEYS = {
  USER: 'urb_db_user',
  ZONES: 'urb_db_zones',
  ZONE_OUTBOX: 'urb_db_zone_outbox',
  SEGMENT_OUTBOX: 'urb_db_segment_outbox',
  SESSIONS: 'urb_db_sessions',
  NOTIFICATIONS: 'urb_db_notifications',
  ACHIEVEMENTS: 'urb_db_achievements',
  SETTINGS: 'urb_db_settings',
  TUTORIAL: 'urbanozeiro_tutorial',
  ACTIVITIES: 'urb_db_activities',
  CLANS: 'urb_db_clans',
  ROUTES: 'urb_db_routes',
  CHALLENGES: 'urb_db_challenges',
  DIRECT_CHALLENGES: 'urb_db_direct_challenges',
  EVENTS: 'urb_db_events'
};

// Simulador de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const loadLocal = <T>(key: string, mockFallback: T): T => {
  try {
    const data = (() => { try { return localStorage.getItem(key); } catch(e) { return null; } })();
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return mockFallback;
};

const saveLocal = <T>(key: string, data: T): void => {
  try {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
  } catch (e) {
    console.error(e);
  }
};

const loadIdb = async <T>(key: string, mockFallback: T): Promise<T> => {
  try {
    const data = await idbGet<T>(key);
    if (data) return data;
  } catch (e) {
    console.error(e);
  }
  return mockFallback;
};

const saveIdb = async <T>(key: string, data: T): Promise<void> => {
  try {
    await idbSet(key, data);
  } catch (e) {
    console.error(e);
  }
};


let isSyncing = false;



class AsyncMutex {
  private promise: Promise<void> = Promise.resolve();
  async acquire(): Promise<() => void> {
    let release: () => void = () => {};
    const next = new Promise<void>(resolve => release = resolve);
    const wait = this.promise;
    this.promise = wait.then(() => next);
    await wait;
    return release;
  }
}
const idbMutex = new AsyncMutex();

export const DatabaseService = {
  // Inicialização pesada / Sincronização inicial
  async initializeApp(): Promise<{
    user: UserProfile;
    zones: Zone[];
    sessions: ActivitySession[];
    notifications: AppNotification[];
    achievements: Achievement[];
    settings: PlayerSettings;
    tutorial: TutorialState;
    activities: PlayerPublicActivity[];
    routes: any[];
    challenges: any[];
    directChallenges: any[];
    events: any[];
  }> {
    // Simula tempo de requisição ao Backend
    await delay(600);
    
    // Verifica conexão simulada (preparação para offline)
    if (!navigator.onLine) {
      console.warn("Dispositivo offline, carregando cache local.");
    }

    return {
      user: loadLocal<UserProfile>(KEYS.USER, CURRENT_USER),
      zones: await loadIdb<Zone[]>(KEYS.ZONES, INITIAL_ZONES),
      sessions: await loadIdb<ActivitySession[]>(KEYS.SESSIONS, INITIAL_SESSION_HISTORY),
      notifications: loadLocal<AppNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
      achievements: loadLocal<Achievement[]>(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
      settings: loadLocal<PlayerSettings>(KEYS.SETTINGS, DEFAULT_PLAYER_SETTINGS),
      tutorial: loadLocal<TutorialState>(KEYS.TUTORIAL, { isCompleted: false, isSkipped: false, currentStep: 0 }),
      activities: await loadIdb<PlayerPublicActivity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES as any),
      routes: await loadIdb<any[]>(KEYS.ROUTES, MOCK_ROUTES),
      challenges: await loadIdb<any[]>(KEYS.CHALLENGES, MOCK_CHALLENGES),
      directChallenges: await loadIdb<any[]>(KEYS.DIRECT_CHALLENGES, INITIAL_DIRECT_CHALLENGES),
      events: await loadIdb<any[]>(KEYS.EVENTS, INITIAL_EVENTS)
    };
  },

    // ============================================================================
  // SINCRONIZAÇÃO OFFLINE-FIRST (FILA DE ATIVIDADES)
  // ============================================================================
  async queueSessionForSync(session: ActivitySession,
activity: PlayerPublicActivity): Promise<void> {
    // 1. Marca como pendente
    session.syncStatus = 'pending';
    activity.syncStatus = 'pending';
    
    // 2. Salva localmente (Garantia Offline)
    await this.saveSession(session);
    await this.saveActivity(activity);

    // 3. Tenta sincronizar imediatamente se houver rede
    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }
  },

  async processSyncQueue(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Dispositivo offline: Sincronização em nuvem adiada na fila.');
      return;
    }

    if (isSyncing) {
      console.log('[SyncQueue] Sincronização já em andamento. Ignorando nova chamada (Mutex ativo).');
      return;
    }
    isSyncing = true;

    try {
      const initialSessions = await loadIdb<ActivitySession[]>(KEYS.SESSIONS, []);
      const initialActivities = await loadIdb<PlayerPublicActivity[]>(KEYS.ACTIVITIES, []);
      const initialZoneOutbox = await loadIdb<ZoneOperation[]>(KEYS.ZONE_OUTBOX, []);
      const initialSegmentOutbox = await loadIdb<SegmentOperation[]>(KEYS.SEGMENT_OUTBOX, []);

      const pendingSessions = initialSessions.filter(s => s.syncStatus === 'pending' || s.syncStatus === 'error');
      const pendingActivities = initialActivities.filter(a => a.syncStatus === 'pending' || a.syncStatus === 'error');
      const pendingZones = initialZoneOutbox.filter(z => z.syncStatus === 'pending' || z.syncStatus === 'error');
      const pendingSegments = initialSegmentOutbox.filter(s => s.syncStatus === 'pending' || s.syncStatus === 'error');

      if (pendingSessions.length === 0 && pendingActivities.length === 0 && pendingZones.length === 0 && pendingSegments.length === 0) {
        return; // Fila vazia
      }

      console.log(`[SyncQueue] Enviando ${pendingSessions.length} sessões, ${pendingActivities.length} atividades, ${pendingZones.length} zonas e ${pendingSegments.length} segmentos para o Firestore...`);

      const successfulSessionIds = new Set<string>();
      const failedSessionIds = new Set<string>();
      const successfulActivityIds = new Set<string>();
      const failedActivityIds = new Set<string>();
      const successfulZoneIds = new Set<string>();
      const failedZoneIds = new Set<string>();
      const successfulSegmentIds = new Set<string>();
      const failedSegmentIds = new Set<string>();

      for (const s of pendingSessions) {
        try {
          const sessionRef = doc(db, 'sessions', s.id);
          await setDoc(sessionRef, s);
          successfulSessionIds.add(s.id);
        } catch (error) {
          console.error(`[SyncQueue] Falha ao enviar sessão ${s.id}:`, error);
          failedSessionIds.add(s.id);
        }
      }

      for (const a of pendingActivities) {
        try {
          const activityRef = doc(db, 'activities', a.id);
          await setDoc(activityRef, a);
          successfulActivityIds.add(a.id);
        } catch (error) {
          console.error(`[SyncQueue] Falha ao enviar atividade ${a.id}:`, error);
          failedActivityIds.add(a.id);
        }
      }

      for (const op of pendingZones) {
        try {
          // Utiliza a transaction para processar a conquista garantindo regras de timeline e idempotência
          await this.conquerZoneTransaction(op.zoneId, op);
          successfulZoneIds.add(op.operationId);
        } catch (error) {
          console.error(`[SyncQueue] Falha ao enviar zona ${op.operationId}:`, error);
          failedZoneIds.add(op.operationId);
        }
      }

      for (const op of pendingSegments) {
        try {
          await this.syncSegmentTransaction(op);
          successfulSegmentIds.add(op.operationId);
        } catch (error) {
          console.error(`[SyncQueue] Falha ao enviar segmento ${op.operationId}:`, error);
          failedSegmentIds.add(op.operationId);
        }
      }

      // Re-load and update state to prevent stale writes
      if (successfulSessionIds.size > 0 || failedSessionIds.size > 0) {
        const release = await idbMutex.acquire();
        try {
          const currentSessions = await loadIdb<ActivitySession[]>(KEYS.SESSIONS, []);
        const updatedSessions = currentSessions.map(s => {
          if (successfulSessionIds.has(s.id)) return { ...s, syncStatus: 'synced' as const };
          if (failedSessionIds.has(s.id)) return { ...s, syncStatus: 'error' as const };
          return s;
        });
          await saveIdb(KEYS.SESSIONS, updatedSessions);
        } finally {
          release();
        }
      }

      if (successfulActivityIds.size > 0 || failedActivityIds.size > 0) {
        const release = await idbMutex.acquire();
        try {
          const currentActivities = await loadIdb<PlayerPublicActivity[]>(KEYS.ACTIVITIES, []);
        const updatedActivities = currentActivities.map(a => {
          if (successfulActivityIds.has(a.id)) return { ...a, syncStatus: 'synced' as const };
          if (failedActivityIds.has(a.id)) return { ...a, syncStatus: 'error' as const };
          return a;
        });
          await saveIdb(KEYS.ACTIVITIES, updatedActivities);
        } finally {
          release();
        }
      }

      if (successfulZoneIds.size > 0 || failedZoneIds.size > 0) {
        const release = await idbMutex.acquire();
        try {
          const currentZones = await loadIdb<ZoneOperation[]>(KEYS.ZONE_OUTBOX, []);
          const updatedZones = currentZones
            .filter(z => !successfulZoneIds.has(z.operationId))
            .map(z => {
              if (failedZoneIds.has(z.operationId)) return { ...z, syncStatus: 'error' as const, retryCount: (z.retryCount || 0) + 1 };
              return z;
            });
          await saveIdb(KEYS.ZONE_OUTBOX, updatedZones);
        } finally {
          release();
        }
      }

      if (successfulSegmentIds.size > 0 || failedSegmentIds.size > 0) {
        const release = await idbMutex.acquire();
        try {
          const currentSegments = await loadIdb<SegmentOperation[]>(KEYS.SEGMENT_OUTBOX, []);
          const updatedSegments = currentSegments
            .filter(s => !successfulSegmentIds.has(s.operationId))
            .map(s => {
              if (failedSegmentIds.has(s.operationId)) return { ...s, syncStatus: 'error' as const, retryCount: (s.retryCount || 0) + 1 };
              return s;
            });
          await saveIdb(KEYS.SEGMENT_OUTBOX, updatedSegments);
        } finally {
          release();
        }
      }

      // Invalidate zone cache so the next request pulls the consolidated data from Firestore
      if (successfulZoneIds.size > 0) {
        this.invalidateZonesCache();
      }

    } catch (error) {
      console.error('[SyncQueue] Erro crítico no loop de sincronização:', error);
    } finally {
      isSyncing = false;
    }
  },
  
  // Persistência de Jogador (XP, Nível, Perfil)
  async saveUser(user: UserProfile): Promise<void> {
    saveLocal(KEYS.USER, user);
  },

  // Persistência de Zonas (Concorrência simulada: lê o atual, aplica a mudança, salva)
  

  // ============================================================================
  // OTIMIZAÇÕES ARQUITETURAIS PARA FIRESTORE (Paginação e Caching Geográfico)
  // ============================================================================

  /**
   * Obtém zonas por viewport do mapa (simulando Geohash query).
   * Utiliza cache agressivo para evitar releituras desnecessárias ao arrastar o mapa.
   */
    async getZonesInRegion(bounds: any): Promise<Zone[]> {
    const cacheKey = 'urb_zones_all_cached';
    let cachedZones = CacheManager.get<Zone[]>(cacheKey);
    
    if (navigator.onLine) {
      try {
        const zonesSnap = await getDocs(collection(db, 'zones'));
        const zones: Zone[] = [];
        zonesSnap.forEach(doc => {
          zones.push({ id: doc.id, ...doc.data() } as Zone);
        });
        
        CacheManager.set(cacheKey, zones);
        await saveIdb(KEYS.ZONES, zones); // Persist official zones to IDB
        return zones;
      } catch (error) {
        console.warn('Error fetching zones from Firestore:', error);
      }
    }
    
    if (cachedZones) {
      return cachedZones;
    }
    
    // If offline and no memory cache, load from IndexedDB. Do NOT use INITIAL_ZONES fallback for real users.
    const storedZones = await loadIdb<Zone[]>(KEYS.ZONES, []);
    CacheManager.set(cacheKey, storedZones);
    return storedZones;
  },

  async queueZoneOperation(operation: ZoneOperation): Promise<void> {
    const release = await idbMutex.acquire();
    try {
      const outbox = await loadIdb<ZoneOperation[]>(KEYS.ZONE_OUTBOX, []);
      outbox.push(operation);
      await saveIdb(KEYS.ZONE_OUTBOX, outbox);
    } finally {
      release();
    }

    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }
  },

  async conquerZoneTransaction(zoneId: string, operation: ZoneOperation): Promise<Zone> {
    const zoneRef = doc(db, 'zones', zoneId);
    return await runTransaction(db, async (transaction) => {
      const zoneDoc = await transaction.get(zoneRef);
      if (!zoneDoc.exists()) {
        throw new Error("Zona não existe no banco oficial.");
      }
      
      const currentZone = zoneDoc.data() as Zone;
      
      // Idempotency check
      const currentHistory = currentZone.conquestHistory || [];
      if (currentHistory.some(h => h.operationId === operation.operationId)) {
        return currentZone; // Already processed
      }

      const newEntry = { ...operation.payload.conquestHistoryEntry };
      const trackPoints = newEntry.trackPoints || [];
      delete newEntry.trackPoints;

      // Add the new entry to history
      const newHistory = [newEntry, ...currentHistory];
      
      const updatedData: Partial<Zone> = {
        conquestHistory: newHistory,
      };

      // Concurrency check: Does this operation's createdAt beat the lastConquered time?
      const lastConqueredTimestamp = currentZone.lastConquered ? new Date(currentZone.lastConquered).getTime() : 0;
      
      // If the zone is free, OR the operation is newer than the last conquer, update controller
      if (currentZone.status === 'free' || operation.createdAt >= lastConqueredTimestamp) {
        updatedData.status = 'controlled';
        updatedData.controller = operation.payload.controller;
        updatedData.dominance = 100;
        updatedData.activeDispute = null;
        updatedData.contested = false;
        
        // Flattened fields for easy access in views (if they are used)
        if (operation.payload.controller) {
          updatedData.controllerName = operation.payload.controller.name;
          updatedData.controllerNickname = operation.payload.controller.nickname;
          updatedData.controllerAvatar = operation.payload.controller.avatar;
          updatedData.controllerLevel = operation.payload.controller.level;
          updatedData.controllerCrew = operation.payload.controller.crew;
        }
        updatedData.lastConquered = new Date(operation.createdAt).toISOString();
        updatedData.conqueredAtUnix = operation.createdAt;
      }

      // Merge manually, respecting rules
      const mergedZone = { ...currentZone, ...updatedData };
      
      transaction.update(zoneRef, updatedData);

      // Save the trackpoints to a subcollection document for anti-cheat audit
      const proofRef = doc(db, 'zones', zoneId, 'history', operation.operationId);
      transaction.set(proofRef, {
        operationId: operation.operationId,
        playerId: operation.playerId,
        createdAt: operation.createdAt,
        trackPoints: trackPoints
      });

      return mergedZone;
    });
  },

  async queueSegmentOperation(operation: SegmentOperation): Promise<void> {
    const release = await idbMutex.acquire();
    try {
      const outbox = await loadIdb<SegmentOperation[]>(KEYS.SEGMENT_OUTBOX, []);
      outbox.push(operation);
      await saveIdb(KEYS.SEGMENT_OUTBOX, outbox);
    } finally {
      release();
    }

    if (navigator.onLine) {
      this.processSyncQueue().catch(console.error);
    }
  },

  async syncSegmentTransaction(operation: SegmentOperation): Promise<void> {
    const segmentRef = doc(db, 'segments', operation.segmentId);
    const attemptRef = doc(db, 'segments', operation.segmentId, 'attempts', operation.attemptId);

    await runTransaction(db, async (transaction) => {
      const segmentDoc = await transaction.get(segmentRef);
      // Even if segment metadata doesn't exist, we can still record attempts or initialize it.
      let currentRecord = null;
      if (segmentDoc.exists()) {
        const data = segmentDoc.data();
        currentRecord = data.bestRecord || null;
      }

      // Check idempotency for the attempt
      const attemptDoc = await transaction.get(attemptRef);
      if (attemptDoc.exists()) {
        // Already processed
        return;
      }

      // Record the attempt
      transaction.set(attemptRef, {
        operationId: operation.operationId,
        attemptId: operation.attemptId,
        playerId: operation.playerId,
        playerName: operation.playerName || 'Anônimo',
        createdAt: operation.createdAt,
        durationMs: operation.durationMs,
        timeSeconds: operation.timeSeconds,
        averageSpeedKmH: operation.averageSpeedKmH,
        maxSpeedKmH: operation.maxSpeedKmH,
        direction: operation.direction,
        trackPoints: operation.trackPoints
      });

      // Update best record if it's better or if there is no record
      if (!currentRecord || operation.timeSeconds < currentRecord.timeSeconds) {
        transaction.set(segmentRef, {
          bestRecord: {
            playerId: operation.playerId,
            playerName: operation.playerName || 'Anônimo',
            timeSeconds: operation.timeSeconds,
            averageSpeedKmH: operation.averageSpeedKmH,
            date: new Date(operation.createdAt).toISOString()
          },
          updatedAt: new Date(operation.createdAt).toISOString()
        }, { merge: true });
      }
    });
  },

  /**
   * Invalida o cache local de zonas
   */
  invalidateZonesCache(): void {
    CacheManager.invalidate('urb_zones_all_cached');
  },

  /**
   * Obtém o histórico de sessões com paginação
   */
  async getSessionsPaginated(userId: string, pageSize: number = 10, lastDocId?: string): Promise<PaginatedResult<ActivitySession>> {
    await delay(200);
    
    const allSessions = await loadIdb<ActivitySession[]>(KEYS.SESSIONS, INITIAL_SESSION_HISTORY);
    // Filtrar pelo usuário atual (mock)
    const userSessions = allSessions.filter(s => s.playerId === userId || s.playerId === 'usr_me');
    userSessions.sort((a, b) => (b.startedAt ? new Date(b.startedAt).getTime() : 0) - (a.startedAt ? new Date(a.startedAt).getTime() : 0));
    
    let startIndex = 0;
    if (lastDocId) {
      const lastIndex = userSessions.findIndex(s => s.id === lastDocId);
      if (lastIndex !== -1) {
        startIndex = lastIndex + 1;
      }
    }
    
    const paginatedSlice = userSessions.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < userSessions.length;
    
    return {
      data: paginatedSlice,
      lastDocId: paginatedSlice.length > 0 ? paginatedSlice[paginatedSlice.length - 1].id : undefined,
      hasMore
    };
  },

  async updateZoneList(zones: Zone[]): Promise<void> {
    await saveIdb(KEYS.ZONES, zones);
    this.invalidateZonesCache();
  },
  async updateZone(zoneId: string, updates: Partial<Zone>): Promise<Zone> {
    const zones = await loadIdb<Zone[]>(KEYS.ZONES, INITIAL_ZONES);
    const index = zones.findIndex(z => z.id === zoneId);
    if (index === -1) throw new Error("Zona não encontrada.");
    
    // Simula transação atômica
    const updatedZone = { ...zones[index], ...updates };
    zones[index] = updatedZone;
    await saveIdb(KEYS.ZONES, zones);
    this.invalidateZonesCache(); // Evita stale data
    
    return updatedZone;
  },

  // Persistência de Sessões (Histórico)
  async saveSession(session: ActivitySession): Promise<void> {
    const release = await idbMutex.acquire();
    try {
      const sessions = await loadIdb<ActivitySession[]>(KEYS.SESSIONS, INITIAL_SESSION_HISTORY);
      if (!sessions.some(s => s.id === session.id)) {
        sessions.unshift(session);
        await saveIdb(KEYS.SESSIONS, sessions);
      }
    } finally {
      release();
    }
  },

  // Notificações
  async saveNotifications(notifications: AppNotification[]): Promise<void> {
    saveLocal(KEYS.NOTIFICATIONS, notifications);
  },

  // Conquistas
  async saveAchievements(achievements: Achievement[]): Promise<void> {
    saveLocal(KEYS.ACHIEVEMENTS, achievements);
  },

  // Configurações
  async saveSettings(settings: PlayerSettings): Promise<void> {
    saveLocal(KEYS.SETTINGS, settings);
  },

  async updateActivitiesList(activities: PlayerPublicActivity[]): Promise<void> {
    await saveIdb(KEYS.ACTIVITIES, activities);
  },
  // Atividades (Feed)
  async saveActivity(activity: PlayerPublicActivity): Promise<void> {
    const release = await idbMutex.acquire();
    try {
      const activities = await loadIdb<PlayerPublicActivity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES as any);
      if (!activities.some(a => a.id === activity.id)) {
        activities.unshift(activity);
        await saveIdb(KEYS.ACTIVITIES, activities);
      }
    } finally {
      release();
    }
  }
};
