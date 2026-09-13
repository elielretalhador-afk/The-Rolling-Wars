import { Activity, ActivityFilterType, ActivityType, ActivityVisibility } from '../types';

export const INITIAL_ACTIVITIES: Activity[] = [

  {
    id: 'act_post_001',
    playerId: 'p_streetfox',
    playerNickname: 'StreetFox',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    playerTag: '#FOX99',
    playerLevel: 14,
    type: 'PHOTO_POST',
    visibility: 'PUBLIC',
    title: 'Sessão Matinal',
    description: 'A pista estava perfeita hoje! Muito sol e asfalto liso.',
    metadata: {
      image: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likesCount: 12,
    hasLiked: false,
    commentsCount: 3,
  },
  {
    id: 'act_post_002',
    playerId: 'usr_mock_001',
    playerNickname: 'Eliel',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    playerLevel: 5,
    type: 'TEXT_POST',
    visibility: 'PUBLIC',
    title: 'Dica do dia',
    description: 'Lembrem-se sempre de aquecer antes de sair para patinar. Evita muitas lesões bobas.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likesCount: 5,
    hasLiked: true,
    commentsCount: 0,
    isOwnActivity: true
  },
  {
    id: 'act_post_003',
    playerId: 'p_ninaroll',
    playerNickname: 'NinaRoll',
    playerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    playerLevel: 12,
    type: 'ROUTE_SHARED',
    visibility: 'PUBLIC',
    title: 'Rota Compartilhada',
    description: 'Fiz essa rota nova perto do parque, muito boa para treinar resistência.',
    metadata: {
      routeId: 'route_mock_01',
      routeName: 'Volta no Parque',
      distance: 5.2,
      difficulty: 'MÉDIO',
      trackPreview: [[-23.5505, -46.6333], [-23.5510, -46.6340]]
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 22,
    hasLiked: false,
    commentsCount: 5,
  },

  {
    id: 'act_001',
    playerId: 'p_streetfox',
    playerNickname: 'StreetFox',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    playerTag: '#FOX99',
    playerLevel: 14,
    type: 'ZONE_CONQUERED',
    visibility: 'PUBLIC',
    title: 'Zona Conquistada',
    description: 'StreetFox dominou a Praça Roosevelt com 87% de presença urbana.',
    metadata: {
      zoneName: 'Praça Roosevelt',
      zoneId: 'zone_roosevelt',
      dominancePercent: 87,
      xpPerHour: 120,
    },
    relatedId: 'zone_roosevelt',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min atrás
    likesCount: 14,
    hasLiked: false,
    reactions: { '🔥': 8, '🛹': 6 },
    isFriend: true,
    isFollowing: true,
  },
  {
    id: 'act_002',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'LEVEL_UP',
    visibility: 'PUBLIC',
    title: 'Novo Nível Alcançado',
    description: 'Você atingiu o Nível 12 (Patinador Urbano Avançado)!',
    metadata: {
      newLevel: 12,
      unlockedReward: 'Título: Mestre do Asfalto',
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min atrás
    likesCount: 22,
    hasLiked: true,
    reactions: { '⚡': 12, '🏆': 10 },
    isOwnActivity: true,
  },
  {
    id: 'act_003',
    playerId: 'p_urbanskater',
    playerNickname: 'UrbanSkater',
    playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    playerTag: '#URB4N',
    playerLevel: 16,
    type: 'CHALLENGE_WON',
    visibility: 'FRIENDS',
    title: 'Vitória em Desafio X1',
    description: 'UrbanSkater venceu o duelo direto de Sprint contra BladeRunner.',
    metadata: {
      opponentNickname: 'BladeRunner',
      challengeType: 'SPRINT_1KM',
      winnerSpeedKmH: 38.6,
      rewardXP: 300,
    },
    relatedId: 'ch_sprint_01',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h atrás
    likesCount: 9,
    hasLiked: false,
    reactions: { '⚔️': 5, '🔥': 4 },
    isFriend: true,
  },
  {
    id: 'act_004',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'ACHIEVEMENT_UNLOCKED',
    visibility: 'PUBLIC',
    title: 'Conquista Desbloqueada',
    description: 'Você desbloqueou o troféu de honra: "Asfalto em Chamas"!',
    metadata: {
      achievementId: 'ach_speed_flame',
      achievementTitle: 'Asfalto em Chamas',
      rarity: 'RARO',
      rewardXP: 500,
    },
    relatedId: 'ach_speed_flame',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h atrás
    likesCount: 31,
    hasLiked: false,
    reactions: { '🏆': 19, '✨': 12 },
    isOwnActivity: true,
  },
  {
    id: 'act_005',
    playerId: 'p_bladerunner',
    playerNickname: 'BladeRunner',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    playerTag: '#BLADE',
    playerLevel: 18,
    type: 'EVENT_COMPLETED',
    visibility: 'PUBLIC',
    title: 'Evento Urbano Concluído',
    description: 'BladeRunner completou o evento comunitário "Rolê Noturno Paulista".',
    metadata: {
      eventName: 'Rolê Noturno Paulista',
      distanceCoveredKm: 14.2,
      eventRank: 3,
    },
    relatedId: 'ev_noite_sp',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // 6h atrás
    likesCount: 15,
    hasLiked: false,
    reactions: { '🌙': 8, '🛹': 7 },
    isFollowing: true,
  },
  {
    id: 'act_006',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'RECORD_BROKEN',
    visibility: 'FOLLOWERS',
    title: 'Novo Recorde Pessoal',
    description: 'Você superou seu recorde de velocidade na Ciclovia Faria Lima (36.8 km/h)!',
    metadata: {
      routeTitle: 'Ciclovia Faria Lima',
      maxSpeedKmH: 36.8,
      previousRecordKmH: 34.2,
    },
    relatedId: 'route_faria_lima',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12h atrás
    likesCount: 18,
    hasLiked: true,
    reactions: { '⚡': 14, '🔥': 4 },
    isOwnActivity: true,
  },
  {
    id: 'act_007',
    playerId: 'p_shadow',
    playerNickname: 'ShadowSkater',
    playerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    playerTag: '#SH4DOW',
    playerLevel: 20,
    type: 'TOURNAMENT_COMPLETED',
    visibility: 'PUBLIC',
    title: 'Final do Torneio Regional',
    description: 'ShadowSkater conquistou o 1º Lugar no Torneio Metropolitano de Slalom!',
    metadata: {
      tournamentName: 'Torneio Metropolitano de Slalom',
      podiumPosition: 1,
      rewardCoins: 2500,
      rewardXP: 1500,
    },
    relatedId: 'tourn_metro_slalom',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 dia atrás
    likesCount: 54,
    hasLiked: false,
    reactions: { '👑': 32, '🏆': 22 },
    isFollowing: true,
  },
  {
    id: 'act_008',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'MISSION_COMPLETED',
    visibility: 'FRIENDS',
    title: 'Missão Diária Concluída',
    description: 'Você completou a missão: "Domínio Urbano: Patinar 5 km em Zona".',
    metadata: {
      missionTitle: 'Domínio Urbano: Patinar 5 km',
      rewardXP: 250,
      rewardCoins: 100,
    },
    relatedId: 'm_daily_03',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    likesCount: 7,
    hasLiked: false,
    reactions: { '✅': 7 },
    isOwnActivity: true,
  },
  {
    id: 'act_009',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'COLLECTION_COMPLETED',
    visibility: 'PUBLIC',
    title: 'Coleção Concluída',
    description: 'Você completou o álbum colecionável "Lendas do Asfalto Paulista"!',
    metadata: {
      collectionName: 'Lendas do Asfalto Paulista',
      itemsCount: 12,
      rewardBadge: 'Selo Lendário de Colecionador',
    },
    relatedId: 'col_lendas_sp',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    likesCount: 26,
    hasLiked: false,
    reactions: { '⭐': 16, '🎉': 10 },
    isOwnActivity: true,
  },
  {
    id: 'act_010',
    playerId: 'p_streetfox',
    playerNickname: 'StreetFox',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    playerTag: '#FOX99',
    playerLevel: 14,
    type: 'SESSION_COMPLETED',
    visibility: 'FRIENDS',
    title: 'Treino de Longa Distância',
    description: 'StreetFox completou uma patinada noturna de 12.8 km pela cidade.',
    metadata: {
      distanceKm: 12.8,
      durationMinutes: 44,
      avgSpeedKmH: 17.4,
    },
    relatedId: 'sess_fox_09',
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    likesCount: 11,
    hasLiked: false,
    reactions: { '🛹': 11 },
    isFriend: true,
    isFollowing: true,
  },
  {
    id: 'act_011',
    playerId: 'p_neonblade',
    playerNickname: 'NeonBlade',
    playerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    playerTag: '#NEON',
    playerLevel: 15,
    type: 'ZONE_LOST',
    visibility: 'PUBLIC',
    title: 'Disputa de Território',
    description: 'A Zona Parque Villa-Lobos mudou de liderança após disputa acirrada.',
    metadata: {
      zoneName: 'Parque Villa-Lobos',
      previousOwner: 'NeonBlade',
      newOwner: 'CyberBlade',
    },
    relatedId: 'zone_villa_lobos',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    likesCount: 8,
    hasLiked: false,
    reactions: { '⚔️': 8 },
  },
  {
    id: 'act_012',
    playerId: 'usr_current_01',
    playerNickname: 'Você',
    playerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    playerTag: '#ZEIRO01',
    playerLevel: 12,
    type: 'SEASON_RESULT',
    visibility: 'PUBLIC',
    title: 'Resultado da Temporada',
    description: 'Você finalizou a Temporada 1 no Top 50 do ranking regional!',
    metadata: {
      seasonNumber: 1,
      finalRank: 42,
      tier: 'OURO',
      rewardCoins: 1200,
    },
    relatedId: 'season_01',
    createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    likesCount: 38,
    hasLiked: true,
    reactions: { '🏆': 24, '🔥': 14 },
    isOwnActivity: true,
  },
];

export function filterActivities(
  activities: Activity[] = [],
  filter: ActivityFilterType,
  currentUserId: string,
  friendIds: string[] = ['p_streetfox', 'p_urbanskater'],
  followingIds: string[] = ['p_streetfox', 'p_bladerunner', 'p_shadow'],
  blockedIds: string[] = []
): Activity[] {
  return (activities || []).filter((act) => {
    // 1. Bloqueio mútuo: remover se autor está bloqueado
    if (blockedIds.includes(act.playerId)) {
      return false;
    }

    // 2. Respeito estrito à visibilidade
    const isOwner = act.playerId === currentUserId || act.isOwnActivity;
    const isFriend = isOwner || friendIds.includes(act.playerId) || act.isFriend;
    const isFollowing = isOwner || followingIds.includes(act.playerId) || act.isFollowing;

    if (act.visibility === 'PRIVATE' && !isOwner) {
      return false;
    }
    if (act.visibility === 'FRIENDS' && !isFriend) {
      return false;
    }
    if (act.visibility === 'FOLLOWERS' && !isFollowing && !isFriend) {
      return false;
    }

    // 3. Aplicação do filtro selecionado
    switch (filter) {
      case 'MEUS_AMIGOS':
        return isFriend && !isOwner;
      case 'SEGUINDO':
        return isFollowing || isOwner;
      case 'MINHAS_ATIVIDADES':
        return isOwner;
      case 'CONQUISTAS':
        return act.type === 'ACHIEVEMENT_UNLOCKED' || act.type === 'LEVEL_UP' || act.type === 'COLLECTION_COMPLETED';
      case 'DESAFIOS':
        return act.type === 'CHALLENGE_STARTED' || act.type === 'CHALLENGE_COMPLETED' || act.type === 'CHALLENGE_WON';
      case 'EVENTOS':
        return act.type === 'EVENT_COMPLETED' || act.type === 'TOURNAMENT_COMPLETED' || act.type === 'SEASON_RESULT';
      case 'TODAS':
      default:
        return true;
    }
  });
}

export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'ZONE_CONQUERED':
      return '🛡️';
    case 'ZONE_LOST':
      return '⚔️';
    case 'CHALLENGE_WON':
    case 'CHALLENGE_COMPLETED':
      return '🥇';
    case 'CHALLENGE_STARTED':
      return '⚔️';
    case 'LEVEL_UP':
      return '⚡';
    case 'ACHIEVEMENT_UNLOCKED':
      return '🏆';
    case 'RECORD_BROKEN':
      return '🚀';
    case 'MISSION_COMPLETED':
      return '🎯';
    case 'COLLECTION_COMPLETED':
      return '⭐';
    case 'EVENT_COMPLETED':
      return '🎪';
    case 'TOURNAMENT_COMPLETED':
      return '👑';
    case 'SEASON_RESULT':
      return '🌟';
    case 'TEXT_POST': return '📝';
    case 'PHOTO_POST': return '📸';
    case 'ROUTE_SHARED': return '🗺️';
    case 'SESSION_COMPLETED':
    case 'ROUTE_COMPLETED':
      return '🛹';
    case 'REWARD_UNLOCKED':
      return '🎁';
    default:
      return '📌';
  }
}

export function getActivityStyle(type: ActivityType): {
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
} {
  switch (type) {
    case 'ZONE_CONQUERED':
      return {
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-emerald-300',
        borderColor: 'border-yellow-500/40',
        accentColor: 'text-yellow-400',
      };
    case 'ZONE_LOST':
      return {
        badgeBg: 'bg-rose-500/20',
        badgeText: 'text-rose-300',
        borderColor: 'border-rose-500/30',
        accentColor: 'text-rose-400',
      };
    case 'CHALLENGE_WON':
    case 'CHALLENGE_COMPLETED':
    case 'CHALLENGE_STARTED':
      return {
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300',
        borderColor: 'border-amber-500/40',
        accentColor: 'text-amber-400',
      };
    case 'LEVEL_UP':
    case 'RECORD_BROKEN':
      return {
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300',
        borderColor: 'border-cyan-500/40',
        accentColor: 'text-cyan-400',
      };
    case 'ACHIEVEMENT_UNLOCKED':
    case 'COLLECTION_COMPLETED':
      return {
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-300',
        borderColor: 'border-yellow-500/40',
        accentColor: 'text-yellow-400',
      };
    case 'EVENT_COMPLETED':
    case 'TOURNAMENT_COMPLETED':
    case 'SEASON_RESULT':
      return {
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300',
        borderColor: 'border-purple-500/40',
        accentColor: 'text-purple-400',
      };
    case 'MISSION_COMPLETED':
    case 'REWARD_UNLOCKED':
    case 'SESSION_COMPLETED':
    case 'ROUTE_COMPLETED':
    default:
      return {
        badgeBg: 'bg-yellow-500/15',
        badgeText: 'text-emerald-300',
        borderColor: 'border-white/10',
        accentColor: 'text-yellow-400',
      };
  }
}

export function formatActivityTimeAgo(isoDate: string): string {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMin = Math.floor(diffMs / (60 * 1000));
    if (diffMin < 1) return 'Agora mesmo';
    if (diffMin < 60) return `${diffMin} min atrás`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return new Date(isoDate).toLocaleDateString('pt-BR');
  } catch {
    return 'Recente';
  }
}
