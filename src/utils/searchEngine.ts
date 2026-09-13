import {
  PlayerSearchResult,
  RankPlayer,
  RouteSearchResult,
  SearchFilterType,
  SearchResultsAggregated,
  SkateRoute,
  SocialPlayer,
  UserProfile,
  Zone,
  ZoneSearchResult,
} from '../types';

/**
 * Normaliza strings removendo acentos e convertendo para minúsculas
 */
export function normalizeSearchTerm(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export interface SearchOptions {
  query: string;
  filter?: SearchFilterType;
  currentUser?: UserProfile;
  socialPlayers?: SocialPlayer[];
  rankPlayers?: RankPlayer[];
  zones?: Zone[];
  routes?: SkateRoute[];
  blockedPlayerIds?: string[];
  userCoords?: [number, number];
  limitPerCategory?: number;
}

/**
 * Calcula distância aproximada entre duas coordenadas em metros (Fórmula Haversine)
 */
function calculateDistanceMeters(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function formatDistanceLabel(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Executa busca consolidada de Jogadores, Zonas e Rotas do Urbanozeiro
 */
export function performUrbanozeiroSearch({
  query,
  filter = 'TODOS',
  currentUser,
  socialPlayers = [],
  rankPlayers = [],
  zones = [],
  routes = [],
  blockedPlayerIds = [],
  userCoords,
  limitPerCategory = 20,
}: SearchOptions): SearchResultsAggregated {
  const normalizedQuery = normalizeSearchTerm(query);
  const isQueryEmpty = normalizedQuery.length === 0;

  // 1. COMBINAÇÃO & DEDUPLICAÇÃO DE JOGADORES (Respeitando Privacidade e Bloqueios)
  const combinedPlayerMap = new Map<string, SocialPlayer | RankPlayer>();

  socialPlayers.forEach((sp) => {
    if (sp.id && !blockedPlayerIds.includes(sp.id)) {
      combinedPlayerMap.set(sp.id, sp);
    }
  });

  rankPlayers.forEach((rp) => {
    const playerId = rp.userId || rp.id;
    if (playerId && !blockedPlayerIds.includes(playerId) && !combinedPlayerMap.has(playerId)) {
      combinedPlayerMap.set(playerId, rp);
    }
  });

  const allPlayersList = Array.from(combinedPlayerMap.values());

  // 2. BUSCA DE JOGADORES
  const matchedPlayers: PlayerSearchResult[] = [];
  if (filter === 'TODOS' || filter === 'JOGADORES') {
    for (const p of allPlayersList) {
      // Ignora o próprio usuário na busca se aplicável
      if (currentUser && (p.id === currentUser.id || (p as any).userId === currentUser.id)) {
        continue;
      }

      const nameNorm = normalizeSearchTerm(p.name || '');
      const nicknameNorm = normalizeSearchTerm(p.nickname || '');
      const tagNorm = normalizeSearchTerm((p as any).tag || '');
      const crewNorm = normalizeSearchTerm((p as any).crew || '');
      const cityNorm = normalizeSearchTerm((p as any).city || '');
      const titleNorm = normalizeSearchTerm((p as any).activeTitle || '');

      const isMatch =
        isQueryEmpty ||
        nameNorm.includes(normalizedQuery) ||
        nicknameNorm.includes(normalizedQuery) ||
        tagNorm.includes(normalizedQuery) ||
        crewNorm.includes(normalizedQuery) ||
        cityNorm.includes(normalizedQuery) ||
        titleNorm.includes(normalizedQuery);

      if (isMatch) {
        matchedPlayers.push({
          type: 'player',
          id: p.id || (p as any).userId || `usr_${Math.random()}`,
          name: p.name || p.nickname,
          nickname: p.nickname,
          tag: (p as any).tag || '#ZEIRO',
          avatar: p.avatar,
          level: p.level || 1,
          activeTitle: (p as any).activeTitle,
          crew: (p as any).crew || (p as any).clan,
          city: (p as any).city || 'São Paulo, SP',
          totalKm: (p as any).totalKm || (p as any).weeklyKm || 0,
          zonesControlled: (p as any).zonesControlled || 0,
          streakDays: (p as any).streakDays || 1,
          isFriend: (p as any).isFriend || false,
          isFollowing: (p as any).isFollowing || false,
          isBlocked: false,
          status: (p as any).status || 'ONLINE',
          statusLabel: (p as any).statusLabel,
          approximateDistanceLabel: (p as any).approximateDistanceLabel,
          rawPlayer: p,
        });
      }

      if (matchedPlayers.length >= limitPerCategory) break;
    }
  }

  // 3. BUSCA DE ZONAS
  const matchedZones: ZoneSearchResult[] = [];
  if (filter === 'TODOS' || filter === 'ZONAS') {
    for (const z of zones) {
      const nameNorm = normalizeSearchTerm(z.name || '');
      const typeNorm = normalizeSearchTerm(z.type || '');
      const refNorm = normalizeSearchTerm(z.referencePoint || '');
      const catNorm = normalizeSearchTerm(z.category || '');
      const descNorm = normalizeSearchTerm(z.description || '');
      const controllerNorm = normalizeSearchTerm(
        z.controller?.nickname || z.controller?.name || z.controllerNickname || z.controllerName || ''
      );

      const isMatch =
        isQueryEmpty ||
        nameNorm.includes(normalizedQuery) ||
        typeNorm.includes(normalizedQuery) ||
        refNorm.includes(normalizedQuery) ||
        catNorm.includes(normalizedQuery) ||
        descNorm.includes(normalizedQuery) ||
        controllerNorm.includes(normalizedQuery);

      if (isMatch) {
        let distanceFormatted: string | undefined = undefined;
        if (userCoords && z.center) {
          const meters = calculateDistanceMeters(userCoords, z.center);
          distanceFormatted = formatDistanceLabel(meters);
        }

        matchedZones.push({
          type: 'zone',
          id: z.id,
          name: z.name,
          category: z.category || (z.type === 'speed' ? 'Speed' : z.type === 'street' ? 'Street' : z.type === 'slalom' ? 'Slalom' : 'Freeskate'),
          zoneType: z.type,
          status: z.status,
          color: z.color || '#00ff66',
          controllerName: z.controller?.name || z.controllerName,
          controllerNickname: z.controller?.nickname || z.controllerNickname,
          controllerAvatar: z.controller?.avatar || z.controllerAvatar,
          controllerLevel: z.controller?.level || z.controllerLevel,
          controllerCrew: z.controller?.crew || z.controllerCrew,
          dominancePercent: z.dominance || z.dominancePercent || 0,
          skatersCount: z.skatersCount || z.activeSkatersCount || 0,
          referencePoint: z.referencePoint || 'São Paulo, SP',
          surface: z.surface || 'Asfalto Urbano',
          distanceFromUserFormatted: distanceFormatted,
          isContested: z.status === 'contested' || z.contested,
          rawZone: z,
        });
      }

      if (matchedZones.length >= limitPerCategory) break;
    }
  }

  // 4. BUSCA DE ROTAS
  const matchedRoutes: RouteSearchResult[] = [];
  if (filter === 'TODOS' || filter === 'ROTAS') {
    for (const r of routes) {
      const nameNorm = normalizeSearchTerm(r.name || '');
      const locNorm = normalizeSearchTerm(r.location || '');
      const diffNorm = normalizeSearchTerm(r.difficulty || '');
      const tagsNorm = normalizeSearchTerm((r.tags || []).join(' '));
      const aspNorm = normalizeSearchTerm(r.asphaltQuality || '');
      const startNorm = normalizeSearchTerm(r.startPointName || '');
      const endNorm = normalizeSearchTerm(r.endPointName || '');

      const isMatch =
        isQueryEmpty ||
        nameNorm.includes(normalizedQuery) ||
        locNorm.includes(normalizedQuery) ||
        diffNorm.includes(normalizedQuery) ||
        tagsNorm.includes(normalizedQuery) ||
        aspNorm.includes(normalizedQuery) ||
        startNorm.includes(normalizedQuery) ||
        endNorm.includes(normalizedQuery);

      if (isMatch) {
        matchedRoutes.push({
          type: 'route',
          id: r.id,
          name: r.name,
          distanceKm: r.distanceKm,
          difficulty: r.difficulty,
          location: r.location,
          estimatedTimeMin: r.estimatedTimeMin,
          asphaltQuality: r.asphaltQuality,
          tags: r.tags || [],
          points: r.points || 250,
          creatorName: 'Comunidade Urbanozeiro',
          bestRecordFormatted: undefined,
          isCircuit: r.isCircuit,
          rawRoute: r,
        });
      }

      if (matchedRoutes.length >= limitPerCategory) break;
    }
  }

  // 5. SUGESTÕES PARA ESTADO VAZIO / DESCOBERTA (Empty Query Suggestions)
  const recentPlayersSuggestions: PlayerSearchResult[] = allPlayersList.slice(0, 4).map((p) => ({
    type: 'player',
    id: p.id || (p as any).userId || `usr_${Math.random()}`,
    name: p.name || p.nickname,
    nickname: p.nickname,
    tag: (p as any).tag || '#ZEIRO',
    avatar: p.avatar,
    level: p.level || 1,
    activeTitle: (p as any).activeTitle,
    crew: (p as any).crew || (p as any).clan,
    city: (p as any).city || 'São Paulo, SP',
    totalKm: (p as any).totalKm || (p as any).weeklyKm || 0,
    zonesControlled: (p as any).zonesControlled || 0,
    streakDays: (p as any).streakDays || 1,
    isFriend: (p as any).isFriend || false,
    isFollowing: (p as any).isFollowing || false,
    isBlocked: false,
    status: (p as any).status || 'ONLINE',
    statusLabel: (p as any).statusLabel,
    approximateDistanceLabel: (p as any).approximateDistanceLabel,
    rawPlayer: p,
  }));

  const nearbyZonesSuggestions: ZoneSearchResult[] = zones.slice(0, 4).map((z) => {
    let distanceFormatted: string | undefined = undefined;
    if (userCoords && z.center) {
      const meters = calculateDistanceMeters(userCoords, z.center);
      distanceFormatted = formatDistanceLabel(meters);
    }
    return {
      type: 'zone',
      id: z.id,
      name: z.name,
      category: z.category || (z.type === 'speed' ? 'Speed' : z.type === 'street' ? 'Street' : z.type === 'slalom' ? 'Slalom' : 'Freeskate'),
      zoneType: z.type,
      status: z.status,
      color: z.color || '#00ff66',
      controllerName: z.controller?.name || z.controllerName,
      controllerNickname: z.controller?.nickname || z.controllerNickname,
      controllerAvatar: z.controller?.avatar || z.controllerAvatar,
      controllerLevel: z.controller?.level || z.controllerLevel,
      controllerCrew: z.controller?.crew || z.controllerCrew,
      dominancePercent: z.dominance || z.dominancePercent || 0,
      skatersCount: z.skatersCount || z.activeSkatersCount || 0,
      referencePoint: z.referencePoint || 'São Paulo, SP',
      surface: z.surface || 'Asfalto Urbano',
      distanceFromUserFormatted: distanceFormatted,
      isContested: z.status === 'contested' || z.contested,
      rawZone: z,
    };
  });

  const popularRoutesSuggestions: RouteSearchResult[] = routes.slice(0, 4).map((r) => ({
    type: 'route',
    id: r.id,
    name: r.name,
    distanceKm: r.distanceKm,
    difficulty: r.difficulty,
    location: r.location,
    estimatedTimeMin: r.estimatedTimeMin,
    asphaltQuality: r.asphaltQuality,
    tags: r.tags || [],
    points: r.points || 250,
    creatorName: 'Comunidade Urbanozeiro',
    bestRecordFormatted: undefined,
    isCircuit: r.isCircuit,
    rawRoute: r,
  }));

  const totalResultsCount =
    (filter === 'TODOS' || filter === 'JOGADORES' ? matchedPlayers.length : 0) +
    (filter === 'TODOS' || filter === 'ZONAS' ? matchedZones.length : 0) +
    (filter === 'TODOS' || filter === 'ROTAS' ? matchedRoutes.length : 0);

  return {
    query,
    filter,
    totalResultsCount,
    players: matchedPlayers,
    zones: matchedZones,
    routes: matchedRoutes,
    suggestions: {
      recentPlayers: recentPlayersSuggestions,
      nearbyZones: nearbyZonesSuggestions,
      popularRoutes: popularRoutesSuggestions,
    },
  };
}
