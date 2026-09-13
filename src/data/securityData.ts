import {
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  SecurityEventStatus,
  PlayerAccountStatus,
  AuditLog,
  PlayerReport,
} from '../types';

/**
 * =========================================================================
 * ESQUELETO DE SEGURANÇA, MODERAÇÃO E INTEGRIDADE DO JOGO (URBANOZEIRO)
 * =========================================================================
 * 
 * DIRETRIZES FUNDAMENTAIS DE SEGURANÇA & FAIR PLAY:
 * 1. Detecção e sinalização NÃO significam banimento automático.
 * 2. GPS do mundo real apresenta imprecisões e perdas naturais de sinal (túneis, prédios altos, modo economia).
 *    Falsos positivos são tratados como INFO / LOW sem interrupção da experiência de jogo.
 * 3. Proteção rigorosa de integridade com idempotência para XP, Moedas, Conquistas de Zona e Desafios.
 * 4. Privacidade estrita: Nenhum dado sensível ou PII desnecessário é persistido nos logs de auditoria.
 * 5. Arquitetura desacoplada e modular pronta para futuras regras de moderação e análise de confiança.
 */

// Limites físicos de plausibilidade para patinação urbana (utilizados apenas como gatilho de sinalização, nunca bloqueio)
export const MAX_PLAUSIBLE_SKATING_SPEED_KMH = 65.0; // Velocidade máxima plausível para downhill/patins de velocidade
export const MAX_PLAUSIBLE_JUMP_SPEED_MPS = 30.0;   // ~108 km/h - salto anômalo brusco de coordenadas
export const RATE_LIMIT_CHALLENGE_INVITES_PER_MIN = 6;
export const RATE_LIMIT_REPORTS_PER_HOUR = 8;

/**
 * Eventos de Segurança Mock Iniciais Demonstrativos
 */
export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec_evt_001',
    playerId: 'usr_001',
    type: 'GPS_ANOMALY',
    severity: 'LOW',
    description: 'Instabilidade momentânea de sinal GPS detectada próximo a túnel urbano. Variação absorvida.',
    relatedId: 'session_mock_01',
    metadata: {
      locationContext: 'Túnel Paulista',
      accuracyMeters: 48,
      detectedSpeedKmh: 42.5,
      handling: 'Tolerated as environmental noise',
    },
    createdAt: '2026-08-15T19:22:00.000Z',
    status: 'RESOLVED',
  },
  {
    id: 'sec_evt_002',
    playerId: 'usr_001',
    type: 'SPEED_ANOMALY',
    severity: 'INFO',
    description: 'Pico de velocidade pontual registrado durante descida em ladeira (downhill).',
    relatedId: 'session_mock_02',
    metadata: {
      peakSpeedKmh: 58.2,
      durationSeconds: 4,
      segment: 'Descida Sumaré',
    },
    createdAt: '2026-08-16T14:05:00.000Z',
    status: 'DISMISSED',
  },
  {
    id: 'sec_evt_003',
    playerId: 'usr_001',
    type: 'LOCATION_JUMP',
    severity: 'LOW',
    description: 'Salto de antena de celular / torre de rede (handover). Percurso mantido intacto.',
    relatedId: 'session_mock_03',
    metadata: {
      jumpDistanceMeters: 280,
      intervalSeconds: 3,
    },
    createdAt: '2026-08-17T11:45:00.000Z',
    status: 'RESOLVED',
  },
];

/**
 * Logs de Auditoria Iniciais Demonstrativos (Sem dados pessoais sensíveis)
 */
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_log_001',
    actorId: 'usr_001',
    action: 'PLAYER_CREATED',
    targetType: 'PLAYER',
    targetId: 'usr_001',
    metadata: { initialLevel: 1, starterBadge: 'fundador' },
    timestamp: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'audit_log_002',
    actorId: 'usr_001',
    action: 'ZONE_CONQUERED',
    targetType: 'ZONE',
    targetId: 'zone_praca_roosevelt',
    metadata: { zoneName: 'Praça Roosevelt', pointsEarned: 150 },
    timestamp: '2026-08-12T16:30:00.000Z',
  },
  {
    id: 'audit_log_003',
    actorId: 'usr_001',
    action: 'CHALLENGE_COMPLETED',
    targetType: 'CHALLENGE',
    targetId: 'chal_x1_001',
    metadata: { outcome: 'VICTORY', opponentId: 'usr_002', challengeType: 'X1_SPEED' },
    timestamp: '2026-08-16T17:10:00.000Z',
  },
  {
    id: 'audit_log_004',
    actorId: 'usr_001',
    action: 'REWARD_GRANTED',
    targetType: 'MISSION_REWARD',
    targetId: 'm_daily_01',
    metadata: { xp: 150, coins: 100, missionTitle: 'Primeiro Rolê do Dia' },
    timestamp: '2026-08-18T08:00:00.000Z',
  },
  {
    id: 'audit_log_005',
    actorId: 'usr_001',
    action: 'CURRENCY_TRANSACTION',
    targetType: 'VIRTUAL_WALLET',
    targetId: 'wallet_usr_001',
    metadata: { type: 'SPEND', amount: 300, itemCategory: 'Molduras' },
    timestamp: '2026-08-17T11:20:00.000Z',
  },
];

/**
 * Denúncias Iniciais Mock
 */
export const INITIAL_PLAYER_REPORTS: PlayerReport[] = [
  {
    id: 'rep_demo_001',
    reporterId: 'usr_001',
    reportedPlayerId: 'usr_bot_09',
    reason: 'SPAM',
    description: 'Envio repetitivo de mensagens automáticas no chat público.',
    relatedId: 'chat_global_msg_89',
    status: 'REVIEWING',
    createdAt: '2026-08-17T20:15:00.000Z',
  },
];

/**
 * =========================================================================
 * MOTORES DE VALIDAÇÃO E AUDITORIA EM TEMPO DE EXECUÇÃO
 * =========================================================================
 */

/**
 * Criação segura de log de auditoria
 */
export function createAuditLog(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, any>
): AuditLog {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    actorId,
    action,
    targetType,
    targetId,
    metadata,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analisador de Telemetria de GPS:
 * Identifica se dois pontos consecutivos representam um salto de velocidade ou localização impossível.
 * Retorna um SecurityEvent sinalizador se necessário, mas NUNCA interrompe o traçado nem penaliza o atleta.
 */
export function analyzeTelemetryPlausibility(
  playerId: string,
  sessionId: string,
  prevPoint: { lat: number; lng: number; timestamp?: number },
  currPoint: { lat: number; lng: number; timestamp?: number }
): SecurityEvent | null {
  if (!prevPoint || !currPoint) return null;

  const prevTime = prevPoint.timestamp || Date.now() - 2000;
  const currTime = currPoint.timestamp || Date.now();
  const timeDeltaSec = Math.max(0.5, (currTime - prevTime) / 1000);

  // Distância haversine simplificada em metros
  const R = 6371e3; // raio da terra em metros
  const phi1 = (prevPoint.lat * Math.PI) / 180;
  const phi2 = (currPoint.lat * Math.PI) / 180;
  const deltaPhi = ((currPoint.lat - prevPoint.lat) * Math.PI) / 180;
  const deltaLambda = ((currPoint.lng - prevPoint.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = R * c;

  const speedKmh = (distanceMeters / timeDeltaSec) * 3.6;

  // 1. Detecção de Salto Extremo de Localização (> 500m em menos de 2s)
  if (distanceMeters > 500 && timeDeltaSec < 3) {
    return {
      id: `sec_jump_${Date.now()}`,
      playerId,
      type: 'LOCATION_JUMP',
      severity: 'LOW',
      description: `Salto de posição de ${Math.round(distanceMeters)}m em ${timeDeltaSec.toFixed(1)}s (possível perda de sinal de GPS ou triangulação).`,
      relatedId: sessionId,
      metadata: {
        distanceMeters: Math.round(distanceMeters),
        timeDeltaSec,
        speedKmh: Math.round(speedKmh),
      },
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };
  }

  // 2. Detecção de Velocidade Impossível (> 85 km/h)
  if (speedKmh > 85.0) {
    return {
      id: `sec_spd_${Date.now()}`,
      playerId,
      type: 'SPEED_ANOMALY',
      severity: 'LOW',
      description: `Pico de velocidade atípico (${Math.round(speedKmh)} km/h). Registrado para análise sem bloqueio.`,
      relatedId: sessionId,
      metadata: {
        speedKmh: Math.round(speedKmh),
        distanceMeters: Math.round(distanceMeters),
      },
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };
  }

  return null;
}

/**
 * Validador de Idempotência de Recompensas:
 * Garante que uma recompensa com chave única (ex: 'mission_m_daily_01_2026-08-18') nunca seja resgatada em dobro.
 */
export function validateRewardClaimIdempotency(
  claimedRewardKeys: string[],
  uniqueRewardKey: string
): { isEligible: boolean; reason?: string } {
  if (!uniqueRewardKey) {
    return { isEligible: true };
  }

  if (claimedRewardKeys.includes(uniqueRewardKey)) {
    return {
      isEligible: false,
      reason: 'Recompensa já resgatada anteriormente (duplicidade prevenida).',
    };
  }

  return { isEligible: true };
}

/**
 * Helper de Rótulos de Severidade
 */
export function getSeverityBadgeStyle(severity: SecuritySeverity): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'CRÍTICO',
        bg: 'bg-rose-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/50',
      };
    case 'HIGH':
      return {
        label: 'ALTO',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
      };
    case 'MEDIUM':
      return {
        label: 'MÉDIO',
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/50',
      };
    case 'LOW':
      return {
        label: 'BAIXO',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/50',
      };
    case 'INFO':
    default:
      return {
        label: 'INFORMATIVO',
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/50',
      };
  }
}

/**
 * Helper de Rótulo de Tipos de Eventos de Segurança
 */
export function getSecurityEventTypeLabel(type: SecurityEventType): {
  label: string;
  icon: string;
} {
  switch (type) {
    case 'GPS_ANOMALY':
      return { label: 'Anomalia de GPS', icon: '📡' };
    case 'SPEED_ANOMALY':
      return { label: 'Velocidade Incompatível', icon: '⚡' };
    case 'LOCATION_JUMP':
      return { label: 'Salto de Posição', icon: '📍' };
    case 'DUPLICATE_REWARD':
      return { label: 'Recompensa Duplicada', icon: '🎁' };
    case 'DUPLICATE_TRANSACTION':
      return { label: 'Transação Duplicada', icon: '🪙' };
    case 'SUSPICIOUS_SESSION':
      return { label: 'Sessão com Sinalizações', icon: '⏱️' };
    case 'SUSPICIOUS_CHALLENGE':
      return { label: 'Desafio Suspeito', icon: '⚔️' };
    case 'SPAM':
      return { label: 'Frequência Excessiva (Spam)', icon: '🚫' };
    case 'REPORT':
      return { label: 'Denúncia de Usuário', icon: '📢' };
    default:
      return { label: 'Evento de Integridade', icon: '🛡️' };
  }
}

/**
 * Helper para status da conta do jogador
 */
export function getAccountStatusDetails(status: PlayerAccountStatus = 'ACTIVE'): {
  label: string;
  badgeBg: string;
  badgeText: string;
  description: string;
} {
  switch (status) {
    case 'BANNED':
      return {
        label: 'CONTA BANIDA',
        badgeBg: 'bg-rose-600/30',
        badgeText: 'text-rose-400',
        description: 'Acesso suspenso permanentemente por infração às diretrizes de Fair Play.',
      };
    case 'SUSPENDED':
      return {
        label: 'CONTA SUSPENSA',
        badgeBg: 'bg-amber-600/30',
        badgeText: 'text-amber-400',
        description: 'Conta sob moderação temporária para avaliação de integridade.',
      };
    case 'RESTRICTED':
      return {
        label: 'CONTA RESTRITA',
        badgeBg: 'bg-yellow-600/30',
        badgeText: 'text-yellow-400',
        description: 'Algumas funções sociais ou de ranking estão limitadas temporariamente.',
      };
    case 'ACTIVE':
    default:
      return {
        label: 'CONTA ÍNTEGRA (ATIVO)',
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-400',
        description: 'Status verificado de Fair Play. Todas as funcionalidades ativas e seguras.',
      };
  }
}
