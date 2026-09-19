import { db, functions } from '../lib/firebase';
import { collection, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { UserEnergy, EnergyTransaction } from '../types';
import { DatabaseService } from './db';

export const MAX_ENERGY = 100;
export const FULL_DURATION_SECONDS = 5400; // 90 minutos = 5400 segundos (100% de patinação)
export const MAX_DAILY_REWARDED_ADS = 5;
export const REWARDED_AD_PERCENT_BOOST = 20;

export const DEFAULT_USER_ENERGY: UserEnergy = {
  current: 100,
  max: 100,
  dailyFreeRechargeUsed: false,
  dailyRewardedAdsUsed: 0,
  dailyPeriodKey: new Date().toISOString().split('T')[0],
  version: 1
};

export class EnergyService {
  /**
   * Converte a porcentagem de energia (0-100) para segundos restantes de atividade.
   * Regra oficial: 100% = 90 minutos (5400s), 1% = 54s.
   */
  static energyToSeconds(energyPercent: number): number {
    const clamped = Math.max(0, Math.min(MAX_ENERGY, energyPercent));
    return Math.round((clamped / MAX_ENERGY) * FULL_DURATION_SECONDS);
  }

  /**
   * Formata a energia restante em texto legível de tempo (ex: "56 min 42 s").
   * Quando a energia chega a 0%, exibe "ESGOTADA".
   */
  static formatRemainingTime(energyPercent: number): string {
    if (energyPercent <= 0) return 'ESGOTADA';
    const totalSecs = this.energyToSeconds(energyPercent);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} min ${String(secs).padStart(2, '0')} s`;
  }

  /**
   * Calcula o consumo oficial com base no tempo de atividade ativo (segundos).
   * Fórmula: energiaConsumida = minutosAtivos / 90 * 100 = (segundos / 5400) * 100
   */
  static calculateConsumption(durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const raw = (durationSeconds / FULL_DURATION_SECONDS) * 100;
    return Math.round(raw * 10) / 10;
  }

  /**
   * Assina em tempo real a energia do jogador no Firestore com cache Offline-First.
   */
  static subscribeToEnergy(
    userId: string,
    callback: (energy: UserEnergy) => void
  ): () => void {
    // Carrega cache offline imediatamente
    DatabaseService.getEnergyCache(DEFAULT_USER_ENERGY).then((cached) => {
      if (cached) callback(cached);
    });

    const docRef = doc(db, 'users', userId, 'energy', 'main');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserEnergy;
          DatabaseService.saveEnergyCache(data);
          callback(data);

          // Checagem lazy de novo dia: se a data do snapshot difere do dia atual, reconcilia com o servidor
          const localDayKey = new Date().toISOString().split('T')[0];
          if (data.dailyPeriodKey && data.dailyPeriodKey !== localDayKey) {
            this.fetchUserEnergyServer().catch(() => {});
          }
        } else {
          // Documento ainda não existe no Firestore: dispara consulta autoritativa para bootstrap
          this.fetchUserEnergyServer().catch(() => {});
          callback(DEFAULT_USER_ENERGY);
        }
      },
      (error) => {
        console.warn('[EnergyService] Falha na escuta Firestore, mantendo cache local:', error);
      }
    );
  }

  /**
   * Assina o histórico de transações de energia.
   */
  static subscribeToTransactions(
    userId: string,
    callback: (transactions: EnergyTransaction[]) => void
  ): () => void {
    const q = query(
      collection(db, 'users', userId, 'energyTransactions'),
      orderBy('createdAt', 'desc'),
      limit(25)
    );

    return onSnapshot(
      q,
      (snap) => {
        const txs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<EnergyTransaction, 'id'>)
        }));
        callback(txs);
      },
      (err) => {
        console.warn('[EnergyService] Erro ao assinar transações:', err);
      }
    );
  }

  /**
   * Busca e inicializa/reconcilia a energia autoritativamente no servidor via Cloud Function.
   */
  static async fetchUserEnergyServer(): Promise<UserEnergy> {
    try {
      const fn = httpsCallable(functions, 'getUserEnergy');
      const res = await fn({});
      const data = (res.data as any)?.energy as UserEnergy;
      if (data) {
        await DatabaseService.saveEnergyCache(data);
        return data;
      }
      return DEFAULT_USER_ENERGY;
    } catch (e) {
      console.warn('[EnergyService] Falha ao consultar servidor, usando cache:', e);
      return await DatabaseService.getEnergyCache(DEFAULT_USER_ENERGY);
    }
  }

  /**
   * Resgata a recarga diária gratuita (100% / 90 minutos) via Cloud Function.
   */
  static async claimDailyFreeRecharge(): Promise<{ success: boolean; energy?: UserEnergy; error?: string }> {
    try {
      const fn = httpsCallable(functions, 'claimDailyFreeRecharge');
      const res = await fn({});
      const energy = (res.data as any)?.energy as UserEnergy;
      if (energy) {
        await DatabaseService.saveEnergyCache(energy);
      }
      return { success: true, energy };
    } catch (e: any) {
      console.error('[EnergyService] Erro na recarga diária:', e);
      return { success: false, error: e.message || 'Erro ao realizar recarga diária.' };
    }
  }

  /**
   * Resgata recarga de +20% (18 minutos) via Rewarded Ads (Server-authoritative).
   * Limite de 5 por período diário.
   */
  static async claimRewardedAdEnergy(): Promise<{ success: boolean; energy?: UserEnergy; error?: string }> {
    try {
      const fn = httpsCallable(functions, 'claimRewardedAdEnergy');
      const res = await fn({});
      const energy = (res.data as any)?.energy as UserEnergy;
      if (energy) {
        await DatabaseService.saveEnergyCache(energy);
      }
      return { success: true, energy };
    } catch (e: any) {
      console.error('[EnergyService] Erro na recompensa de anúncio:', e);
      return { success: false, error: e.message || 'Erro ao resgatar recompensa.' };
    }
  }

  /**
   * Finaliza o consumo de energia de uma sessão com idempotência estrita via Cloud Function.
   */
  static async finalizeSessionEnergy(
    sessionId: string,
    durationSeconds: number
  ): Promise<{ success: boolean; energy?: UserEnergy; consumed?: number; idempotent?: boolean; error?: string }> {
    try {
      const fn = httpsCallable(functions, 'finalizeSessionEnergy');
      const res = await fn({ sessionId, durationSeconds });
      const data = res.data as any;
      if (data?.energy) {
        await DatabaseService.saveEnergyCache(data.energy);
      }
      return {
        success: true,
        energy: data?.energy,
        consumed: data?.consumed,
        idempotent: data?.idempotent
      };
    } catch (e: any) {
      console.error('[EnergyService] Erro ao consolidar energia da sessão:', e);
      return { success: false, error: e.message || 'Erro de conexão na finalização de energia.' };
    }
  }

  /**
   * Validador de fontes futuras: estritamente bloqueadas na versão 1.0.
   */
  static assertFutureSourceDisabled(source: string): never {
    throw new Error(
      `A fonte '${source}' é um módulo futuro e está estritamente desativada na versão oficial da Energia 1.0.`
    );
  }
}
