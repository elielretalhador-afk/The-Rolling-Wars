import {
  Collection,
  CollectionProgress,
  EquippedCosmetics,
  GameItem,
  LevelDefinition,
  PetItem,
  PlayerInventoryItem,
  PlayerProgression,
  ProfileFrameItem,
  Reward,
  StickerItem,
  UserProfile,
  XPTransaction,
} from '../types';

// =========================================================================
// DEFINIÇÃO DE NÍVEIS (LEVEL DEFINITIONS)
// Escalável para futuras temporadas e progressões sem reconstruir o sistema
// =========================================================================
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: 1,
    requiredXP: 500,
    cumulativeXP: 0,
    title: 'Iniciante do Asfalto',
    rewards: [
      {
        id: 'rew_lvl_1_1',
        type: 'BADGE',
        name: 'Primeiros Passos',
        description: 'Emblema comemorativo de entrada nas ruas do THE ROLLING WARS.',
        rarity: 'COMMON',
        unlockLevel: 1,
        icon: '🔰',
      },
      {
        id: 'rew_lvl_1_2',
        type: 'SKATE',
        name: 'Street Basic',
        description: 'Patins clássico de entrada, resistente ao asfalto áspero.',
        rarity: 'COMMON',
        unlockLevel: 1,
        icon: '🛼',
      },
    ],
  },
  {
    level: 2,
    requiredXP: 800,
    cumulativeXP: 500,
    title: 'Patinador Urbano',
    rewards: [
      {
        id: 'rew_lvl_2_1',
        type: 'TITLE',
        name: 'Patinador Urbano',
        description: 'Título desbloqueado ao alcançar o Nível 2.',
        rarity: 'COMMON',
        unlockLevel: 2,
        icon: '🏙️',
      },
      {
        id: 'rew_lvl_2_2',
        type: 'STICKER',
        name: 'Skate de Rua',
        description: 'Figurinha colecionável da série Asfalto.',
        rarity: 'COMMON',
        unlockLevel: 2,
        icon: '🛼',
      },
    ],
  },
  {
    level: 3,
    requiredXP: 1200,
    cumulativeXP: 1300,
    title: 'Explorador Noturno',
    rewards: [
      {
        id: 'rew_lvl_3_1',
        type: 'PROFILE_FRAME',
        name: 'Neon Pulse',
        description: 'Moldura de perfil com iluminação esmeralda pulsante.',
        rarity: 'RARE',
        unlockLevel: 3,
        icon: '🟢',
      },
    ],
  },
  {
    level: 4,
    requiredXP: 1800,
    cumulativeXP: 2500,
    title: 'Guardião de Pista',
    rewards: [
      {
        id: 'rew_lvl_4_1',
        type: 'MASCOT',
        name: 'Mini Urbano',
        description: 'Companheiro robótico inteligente que flutua ao lado do seu patins.',
        rarity: 'RARE',
        unlockLevel: 4,
        icon: '🤖',
      },
      {
        id: 'rew_lvl_4_2',
        type: 'EFFECT',
        name: 'Rastro de Fagulhas',
        description: 'Efeito visual com faíscas verdes atrás das rodas.',
        rarity: 'UNCOMMON',
        unlockLevel: 4,
        icon: '✨',
      },
    ],
  },
  {
    level: 5,
    requiredXP: 2500,
    cumulativeXP: 4300,
    title: 'Velocista das Ruas',
    rewards: [
      {
        id: 'rew_lvl_5_1',
        type: 'SKATE',
        name: 'Neon Rider',
        description: 'Chassi com filamentos fluorescentes brilhantes.',
        rarity: 'RARE',
        unlockLevel: 5,
        icon: '⚡',
      },
      {
        id: 'rew_lvl_5_2',
        type: 'TITLE',
        name: 'Velocista das Ruas',
        description: 'Título comemorativo de nível 5.',
        rarity: 'RARE',
        unlockLevel: 5,
        icon: '⚡',
      },
    ],
  },
  {
    level: 10,
    requiredXP: 4000,
    cumulativeXP: 18000,
    title: 'Conquistador de Zonas',
    rewards: [
      {
        id: 'rew_lvl_10_1',
        type: 'SKATE',
        name: 'Urban Phantom',
        description: 'Edição furtiva fosca com rolamentos de cerâmica.',
        rarity: 'EPIC',
        unlockLevel: 10,
        icon: '👻',
      },
      {
        id: 'rew_lvl_10_2',
        type: 'MASCOT',
        name: 'Gato Skatista Urbano',
        description: 'Mascote urbano com óculos de sol e capacete de pista.',
        rarity: 'UNCOMMON',
        unlockLevel: 10,
        icon: '🐱',
      },
    ],
  },
  {
    level: 14,
    requiredXP: 5000,
    cumulativeXP: 35000,
    title: 'Mestre do Elevado',
    rewards: [
      {
        id: 'rew_lvl_14_1',
        type: 'TITLE',
        name: 'Mestre do Elevado',
        description: 'Título de prestígio para quem domina os asfaltos elevados.',
        rarity: 'EPIC',
        unlockLevel: 14,
        icon: '🌉',
      },
    ],
  },
  {
    level: 15,
    requiredXP: 6000,
    cumulativeXP: 40000,
    title: 'Lenda do Asfalto',
    rewards: [
      {
        id: 'rew_lvl_15_1',
        type: 'SKATE',
        name: 'Golden Wheel',
        description: 'Rodas com acabamento de ouro escovado e brilho estroboscópico.',
        rarity: 'LEGENDARY',
        unlockLevel: 15,
        icon: '✨',
      },
      {
        id: 'rew_lvl_15_2',
        type: 'TITLE',
        name: 'Lenda do Asfalto',
        description: 'Título lendário concedido aos patinadores de elite.',
        rarity: 'LEGENDARY',
        unlockLevel: 15,
        icon: '👑',
      },
    ],
  },
  {
    level: 20,
    requiredXP: 10000,
    cumulativeXP: 75000,
    title: 'Soberano Noturno',
    rewards: [
      {
        id: 'rew_lvl_20_1',
        type: 'MASCOT',
        name: 'Fênix Urbana',
        description: 'Mascote mítico renascido das cinzas do asfalto com asas em chama.',
        rarity: 'EPIC',
        unlockLevel: 20,
        icon: '🦅',
      },
      {
        id: 'rew_lvl_20_2',
        type: 'PROFILE_FRAME',
        name: 'Ouro Metropolitano',
        description: 'Borda com acabamento dourado e insígnias de campeão.',
        rarity: 'EPIC',
        unlockLevel: 20,
        icon: '🟡',
      },
    ],
  },
  {
    level: 50,
    requiredXP: 25000,
    cumulativeXP: 350000,
    title: 'Imortal THE ROLLING WARS',
    rewards: [
      {
        id: 'rew_lvl_50_1',
        type: 'SKATE',
        name: 'Cosmic Glide',
        description: 'Aparência mística com partículas interestelares e rastro de luz.',
        rarity: 'LEGENDARY',
        unlockLevel: 50,
        icon: '🌌',
      },
      {
        id: 'rew_lvl_50_2',
        type: 'MASCOT',
        name: 'Dragão Cibernético',
        description: 'Mascote supremo lendário da metrópole futurista.',
        rarity: 'LEGENDARY',
        unlockLevel: 50,
        icon: '🐉',
      },
    ],
  },
];

// =========================================================================
// HISTÓRICO INICIAL DE TRANSAÇÕES DE XP (XP TRANSACTIONS)
// =========================================================================
export const INITIAL_XP_TRANSACTIONS: XPTransaction[] = [
  {
    id: 'xp_tx_01',
    playerId: 'usr_01',
    amount: 350,
    source: 'ZONE_CONQUEST',
    description: 'Zona conquistada: Arena Minhocão Speed',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    relatedId: 'zone_01',
  },
  {
    id: 'xp_tx_02',
    playerId: 'usr_01',
    amount: 250,
    source: 'CHALLENGE_VICTORY',
    description: 'Vitória no duelo X1 contra BladeHunter',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    relatedId: 'dc_03',
  },
  {
    id: 'xp_tx_03',
    playerId: 'usr_01',
    amount: 180,
    source: 'ROUTE_COMPLETED',
    description: 'Rota concluída: Avenida Paulista Night Cruise',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    relatedId: 'route_03',
  },
  {
    id: 'xp_tx_04',
    playerId: 'usr_01',
    amount: 500,
    source: 'EVENT_VICTORY',
    description: 'Vitória na Maratona Urbana Noturna #1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    relatedId: 'ev_06',
  },
  {
    id: 'xp_tx_05',
    playerId: 'usr_01',
    amount: 120,
    source: 'ZONE_DISCOVERY',
    description: 'Zona descoberta: Parque Ibirapuera Flow',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedId: 'zone_02',
  },
  {
    id: 'xp_tx_06',
    playerId: 'usr_01',
    amount: 200,
    source: 'SESSION_COMPLETED',
    description: 'Sessão de treino concluída (14.2 km)',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'xp_tx_07',
    playerId: 'usr_01',
    amount: 100,
    source: 'RECORD_BROKEN',
    description: 'Recorde pessoal de velocidade batido (28.4 km/h)',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// =========================================================================
// INVENTÁRIO INICIAL DE ITENS DO JOGADOR (PLAYER INVENTORY)
// =========================================================================
export const INITIAL_PLAYER_INVENTORY: PlayerInventoryItem[] = [
  // --- MASCOTES (PETS) ---
  {
    id: 'inv_masc_01',
    rewardId: 'rew_lvl_4_1',
    type: 'PET',
    name: 'Mini Urbano',
    description: 'Droide companheiro em miniatura que acompanha seus rolês noturnos.',
    rarity: 'RARE',
    category: 'mascotes',
    icon: '🤖',
    status: 'EQUIPPED',
    isEquipped: true,
    unlockedAt: '15/05/2026',
    unlockCondition: 'Desbloqueado ao atingir o Nível 4.',
    unlockLevel: 4,
    source: 'LEVEL_REWARD',
    metadata: {
      quote: '"Pronto para o asfalto, mestre!"',
      glowColor: '#fce803',
    },
  },
  {
    id: 'inv_masc_02',
    type: 'PET',
    name: 'Lobo Urbano',
    description: 'Companheiro ágil que corre ao lado das rodas em noites de lua cheia.',
    rarity: 'RARE',
    category: 'mascotes',
    icon: '🐺',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '20/05/2026',
    unlockCondition: 'Vença 3 desafios noturnos.',
    source: 'ACHIEVEMENT',
    metadata: {
      quote: '"O asfalto é nossa alcateia!"',
      glowColor: '#00e5ff',
    },
  },
  {
    id: 'inv_masc_03',
    type: 'PET',
    name: 'Raposa Neon',
    description: 'Mascote inteligente com rastro esmeralda brilhante e alta agilidade.',
    rarity: 'EPIC',
    category: 'mascotes',
    icon: '🦊',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '01/06/2026',
    unlockCondition: 'Conclua a trilha de missões da Temporada Neon.',
    source: 'SEASON_PASS',
    metadata: {
      quote: '"Mais rápida que o vento urbano."',
      glowColor: '#10b981',
    },
  },
  {
    id: 'inv_masc_04',
    type: 'PET',
    name: 'Falcão de Rua',
    description: 'Guardião dos céus metropolitanos que avista rotas e zonas a distância.',
    rarity: 'RARE',
    category: 'mascotes',
    icon: '🦅',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '10/06/2026',
    unlockCondition: 'Mapeie e descubra 5 zonas no mapa.',
    source: 'ACHIEVEMENT',
    metadata: {
      quote: '"Visão panorâmica de campeão."',
      glowColor: '#38bdf8',
    },
  },
  {
    id: 'inv_masc_05',
    type: 'PET',
    name: 'Cão de Pista',
    description: 'Fiel companheiro com bandana que nunca abandona uma boa sessão de rua.',
    rarity: 'UNCOMMON',
    category: 'mascotes',
    icon: '🐕',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '18/04/2026',
    unlockCondition: 'Complete sua primeira sessão em grupo.',
    source: 'INITIAL',
    metadata: {
      quote: '"Sempre na pegada do rolê!"',
      glowColor: '#f59e0b',
    },
  },
  {
    id: 'inv_masc_06',
    rewardId: 'rew_lvl_10_2',
    type: 'PET',
    name: 'Gato Skatista Urbano',
    description: 'Felino veloz com óculos escuros e bandana do asfalto.',
    rarity: 'UNCOMMON',
    category: 'mascotes',
    icon: '🐱',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '01/06/2026',
    unlockCondition: 'Desbloqueado ao atingir o Nível 10.',
    unlockLevel: 10,
    source: 'LEVEL_REWARD',
    metadata: {
      quote: '"Sete vidas e oito rodas."',
      glowColor: '#00e5ff',
    },
  },
  {
    id: 'inv_masc_07',
    rewardId: 'rew_lvl_50_2',
    type: 'PET',
    name: 'Dragão Cibernético',
    description: 'Mascote supremo de prestígio lendário da metrópole.',
    rarity: 'LEGENDARY',
    category: 'mascotes',
    icon: '🐉',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Alcance o Nível 50 de Progressão.',
    unlockLevel: 50,
    source: 'LEVEL_REWARD',
    metadata: {
      glowColor: '#eab308',
    },
  },

  // --- SKATES E PATINS VIRTUAIS (COSMÉTICOS) ---
  {
    id: 'inv_sk_01',
    rewardId: 'rew_lvl_1_2',
    type: 'SKATE',
    name: 'Street Basic',
    description: 'Configuração clássica de rua com rodas 80mm e base de alumínio reforçada.',
    rarity: 'COMMON',
    category: 'skates',
    icon: '🛼',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '12/04/2026',
    unlockCondition: 'Disponível desde o Nível 1.',
    unlockLevel: 1,
    source: 'INITIAL',
  },
  {
    id: 'inv_sk_02',
    type: 'SKATE',
    name: 'Neon Runner',
    description: 'Chassi com filamentos fluorescentes brilhantes e rastro luminoso.',
    rarity: 'RARE',
    category: 'skates',
    icon: '⚡',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '22/04/2026',
    unlockCondition: 'Desbloqueado ao atingir o Nível 5.',
    unlockLevel: 5,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_sk_03',
    type: 'SKATE',
    name: 'Powerslide Next Core 110',
    description: 'Triskate profissional com rodas 110mm para velocidade e absorção de impacto no asfalto.',
    rarity: 'EPIC',
    category: 'skates',
    icon: '🛹',
    status: 'EQUIPPED',
    isEquipped: true,
    unlockedAt: '01/05/2026',
    unlockCondition: 'Setup Profissional Personalizado.',
    source: 'INITIAL',
  },
  {
    id: 'inv_sk_04',
    rewardId: 'rew_lvl_10_1',
    type: 'SKATE',
    name: 'Urban Phantom',
    description: 'Pintura camuflada preta fosca com rolamentos blindados anti-poeira.',
    rarity: 'EPIC',
    category: 'skates',
    icon: '👻',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '05/06/2026',
    unlockCondition: 'Desbloqueado ao atingir o Nível 10.',
    unlockLevel: 10,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_sk_05',
    type: 'SKATE',
    name: 'Circuit X',
    description: 'Setup aerodinâmico desenvolvido para curvas fechadas e disputas de alta precisão.',
    rarity: 'RARE',
    category: 'skates',
    icon: '🏎️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '12/06/2026',
    unlockCondition: 'Conclua o Desafio Circuito das Pontes.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_sk_06',
    type: 'SKATE',
    name: 'Valkyrie Pro',
    description: 'Bota rígida de fibra de carbono com rolamentos cerâmicos de corrida.',
    rarity: 'EPIC',
    category: 'skates',
    icon: '🛡️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '25/06/2026',
    unlockCondition: 'Vença 5 duelos diretos X1 no asfalto.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_sk_07',
    type: 'SKATE',
    name: 'Skate Evento 2026',
    description: 'Edição limitada comemorativa do Desafio THE ROLLING WARS 2026 com acabamento holográfico.',
    rarity: 'EPIC',
    category: 'skates',
    icon: '🌟',
    status: 'UNLOCKED',
    isEquipped: false,
    isLimited: true,
    unlockedAt: '10/08/2026',
    unlockCondition: 'Participação no Torneio Oficial THE ROLLING WARS 2026.',
    source: 'EVENT',
  },
  {
    id: 'inv_sk_08',
    rewardId: 'rew_lvl_15_1',
    type: 'SKATE',
    name: 'Golden Wheel',
    description: 'Acabamento em ouro polido e rolamentos cerâmicos ultra velozes de prestígio.',
    rarity: 'LEGENDARY',
    category: 'skates',
    icon: '✨',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Alcance o Nível 15 de Progressão.',
    unlockLevel: 15,
    source: 'LEVEL_REWARD',
  },

  // --- FIGURINHAS COLECIONÁVEIS (COLEÇÃO "PRIMEIRA TEMPORADA" & OUTRAS) ---
  {
    id: 'inv_fig_01',
    type: 'STICKER',
    name: '01 - Primeiro Rolê',
    description: 'Comemora o início da jornada sobre rodas no asfalto urbano.',
    rarity: 'COMMON',
    category: 'figurinhas',
    icon: '🛼',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '14/04/2026',
    unlockCondition: 'Conclua a 1ª sessão de patinação.',
    collectionId: 'col_s01',
    collectionName: 'Primeira Temporada',
    collectorNumber: 1,
    source: 'INITIAL',
  },
  {
    id: 'inv_fig_02',
    type: 'STICKER',
    name: '02 - Primeira Zona',
    description: 'Marcador histórico da primeira conquista territorial na metrópole.',
    rarity: 'UNCOMMON',
    category: 'figurinhas',
    icon: '🏴',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '28/04/2026',
    unlockCondition: 'Conquiste e domine uma zona urbana.',
    collectionId: 'col_s01',
    collectionName: 'Primeira Temporada',
    collectorNumber: 2,
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_fig_03',
    type: 'STICKER',
    name: '03 - Primeiro Desafio',
    description: 'Figurinha concedida após a conclusão do primeiro duelo X1.',
    rarity: 'RARE',
    category: 'figurinhas',
    icon: '⚔️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '10/05/2026',
    unlockCondition: 'Dispute um duelo direto com outro jogador.',
    collectionId: 'col_s01',
    collectionName: 'Primeira Temporada',
    collectorNumber: 3,
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_fig_04',
    type: 'STICKER',
    name: '04 - Primeiro Recorde',
    description: 'Registro reluzente do primeiro recorde de velocidade ou distância superado.',
    rarity: 'EPIC',
    category: 'figurinhas',
    icon: '⚡',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '20/05/2026',
    unlockCondition: 'Supere o recorde em um segmento ou rota.',
    collectionId: 'col_s01',
    collectionName: 'Primeira Temporada',
    collectorNumber: 4,
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_fig_05',
    type: 'STICKER',
    name: '05 - Mestre Urbano',
    description: 'Figurinha lendária de encerramento do álbum da Primeira Temporada.',
    rarity: 'LEGENDARY',
    category: 'figurinhas',
    icon: '👑',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Complete todas as 4 figurinhas anteriores e atinja o Nível 15.',
    collectionId: 'col_s01',
    collectionName: 'Primeira Temporada',
    collectorNumber: 5,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_fig_06',
    type: 'STICKER',
    name: 'Figurinha 100 KM',
    description: 'Figurinha especial comemorativa de 100 km rodados pela cidade.',
    rarity: 'RARE',
    category: 'figurinhas',
    icon: '🗺️',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Atinja a marca histórica de 100 km rodados.',
    collectionId: 'col_circ',
    collectionName: 'Temporada Circuito',
    collectorNumber: 1,
    source: 'ACHIEVEMENT',
  },

  // --- MOLDURAS DE PERFIL (PROFILE FRAMES) ---
  {
    id: 'inv_frm_01',
    rewardId: 'rew_lvl_3_1',
    type: 'PROFILE_FRAME',
    name: 'Neon Pulse',
    description: 'Borda luminosa com gradiente esmeralda cibernético e pulso verde neon.',
    rarity: 'RARE',
    category: 'molduras',
    icon: '🟢',
    status: 'EQUIPPED',
    isEquipped: true,
    unlockedAt: '20/04/2026',
    unlockCondition: 'Desbloqueado no Nível 3.',
    unlockLevel: 3,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_frm_02',
    type: 'PROFILE_FRAME',
    name: 'Moldura Conquistador',
    description: 'Moldura de ferro forjado e insígnias territoriais para dominadores de zonas.',
    rarity: 'RARE',
    category: 'molduras',
    icon: '🏴',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '02/05/2026',
    unlockCondition: 'Recompensa da conquista "Conquistador de Zonas".',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_frm_03',
    type: 'PROFILE_FRAME',
    name: 'Elite Urbana',
    description: 'Moldura com detalhes em fibra de carbono e reflexos azul-ciano.',
    rarity: 'EPIC',
    category: 'molduras',
    icon: '💎',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '15/05/2026',
    unlockCondition: 'Alcançar o Top 10 no ranking regional.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_frm_04',
    type: 'PROFILE_FRAME',
    name: 'Desafio THE ROLLING WARS 2026',
    description: 'Moldura holográfica limitada do grande evento de 2026.',
    rarity: 'EPIC',
    category: 'molduras',
    icon: '🏆',
    status: 'UNLOCKED',
    isEquipped: false,
    isLimited: true,
    unlockedAt: '10/08/2026',
    unlockCondition: 'Participação no Evento Oficial 2026.',
    source: 'EVENT',
  },
  {
    id: 'inv_frm_05',
    rewardId: 'rew_lvl_20_2',
    type: 'PROFILE_FRAME',
    name: 'Ouro Metropolitano',
    description: 'Moldura dourada reluzente com louros de vitória e prestígio.',
    rarity: 'EPIC',
    category: 'molduras',
    icon: '🟡',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Desbloqueado ao atingir o Nível 20.',
    unlockLevel: 20,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_frm_06',
    type: 'PROFILE_FRAME',
    name: 'Cyber Lendária',
    description: 'Moldura mítica com partículas holográficas de névoa esmeralda.',
    rarity: 'MYTHIC',
    category: 'molduras',
    icon: '🔮',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Complete uma coleção inteira de temporada.',
    source: 'SEASON_PASS',
  },

  // --- TÍTULOS DESBLOQUEÁVEIS ---
  {
    id: 'inv_tit_01',
    type: 'TITLE',
    name: 'NOVATO',
    description: 'Primeiro título de boas-vindas ao asfalto.',
    rarity: 'COMMON',
    category: 'titulos',
    icon: '🛼',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '12/04/2026',
    unlockCondition: 'Disponível no Nível 1.',
    source: 'INITIAL',
  },
  {
    id: 'inv_tit_02',
    rewardId: 'rew_lvl_2_1',
    type: 'TITLE',
    name: 'PATINADOR URBANO',
    description: 'Título comemorativo de patinador ativo.',
    rarity: 'COMMON',
    category: 'titulos',
    icon: '🏙️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '15/04/2026',
    unlockCondition: 'Nível 2 alcançado.',
    unlockLevel: 2,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_tit_03',
    type: 'TITLE',
    name: 'CONQUISTADOR',
    description: 'Ostenta a honra de quem controla territórios na metrópole.',
    rarity: 'RARE',
    category: 'titulos',
    icon: '🏴',
    status: 'EQUIPPED',
    isEquipped: true,
    unlockedAt: '02/05/2026',
    unlockCondition: 'Conquiste e domine uma zona urbana.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_tit_04',
    type: 'TITLE',
    name: 'CAÇADOR DE ZONAS',
    description: 'Para quem desbrava e desafia guardiões de territórios.',
    rarity: 'EPIC',
    category: 'titulos',
    icon: '🎯',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '18/05/2026',
    unlockCondition: 'Dispute 5 zonas controladas por outros jogadores.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_tit_05',
    type: 'TITLE',
    name: 'MESTRE DAS ROTAS',
    description: 'Título honorífico para quem domina os circuitos da cidade.',
    rarity: 'EPIC',
    category: 'titulos',
    icon: '🗺️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '30/05/2026',
    unlockCondition: 'Complete 10 rotas oficiais registradas.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_tit_06',
    rewardId: 'rew_lvl_15_2',
    type: 'TITLE',
    name: 'LENDÁRIO',
    description: 'Título supremo reservado aos ícones do THE ROLLING WARS.',
    rarity: 'LEGENDARY',
    category: 'titulos',
    icon: '👑',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Alcance o Nível 15 de Progressão.',
    unlockLevel: 15,
    source: 'LEVEL_REWARD',
  },

  // --- ROUPAS, CAPACETES, ACESSÓRIOS & EFEITOS ---
  {
    id: 'inv_clo_01',
    type: 'CLOTHING',
    name: 'Jaqueta Asfalto Night',
    description: 'Jaqueta corta-vento refletiva para rolês noturnos com faixas luminescentes.',
    rarity: 'UNCOMMON',
    category: 'roupas',
    icon: '🧥',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '19/04/2026',
    unlockCondition: 'Complete 3 sessões após as 20h.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_hlm_01',
    type: 'HELMET',
    name: 'Capacete Aero Speed',
    description: 'Capacete aerodinâmico esportivo fosco com viseira magnética.',
    rarity: 'RARE',
    category: 'capacetes',
    icon: '🪖',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '22/05/2026',
    unlockCondition: 'Alcance velocidade acima de 25 km/h.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_acc_01',
    type: 'ACCESSORY',
    name: 'Luvas Neon Reflex',
    description: 'Luvas com palmar reforçado de kevlar e detalhes verdes.',
    rarity: 'COMMON',
    category: 'acessorios',
    icon: '🧤',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '12/04/2026',
    unlockCondition: 'Kit inicial do jogador.',
    source: 'INITIAL',
  },
  {
    id: 'inv_eff_01',
    rewardId: 'rew_lvl_4_2',
    type: 'EFFECT',
    name: 'Rastro de Fagulhas',
    description: 'Efeito visual que solta faíscas verdes cintilantes ao acelerar nos patins.',
    rarity: 'UNCOMMON',
    category: 'efeitos',
    icon: '✨',
    status: 'EQUIPPED',
    isEquipped: true,
    unlockedAt: '25/04/2026',
    unlockCondition: 'Desbloqueado no Nível 4.',
    unlockLevel: 4,
    source: 'LEVEL_REWARD',
  },
  {
    id: 'inv_eff_02',
    type: 'EFFECT',
    name: 'Onda Sônica Neon',
    description: 'Pulso de luz ciano circular emitido nas paradas de emergência e slides.',
    rarity: 'EPIC',
    category: 'efeitos',
    icon: '💫',
    status: 'LOCKED',
    isEquipped: false,
    unlockCondition: 'Vença o Desafio de Velocidade Noturna.',
    source: 'EVENT',
  },

  // --- EMBLEMAS (BADGES) ---
  {
    id: 'inv_emb_01',
    rewardId: 'rew_lvl_1_1',
    type: 'BADGE',
    name: 'Primeiros Passos',
    description: 'Emblema de estreia concedido na primeira sessão.',
    rarity: 'COMMON',
    category: 'emblemas',
    icon: '🔰',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '12/04/2026',
    unlockCondition: 'Conclua a 1ª atividade.',
    source: 'INITIAL',
  },
  {
    id: 'inv_emb_02',
    type: 'BADGE',
    name: 'Dominador de Zonas',
    description: 'Insígnia de controle concedida a quem toma posse de uma zona.',
    rarity: 'RARE',
    category: 'emblemas',
    icon: '🏴',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '02/05/2026',
    unlockCondition: 'Conquiste uma zona urbana no mapa.',
    source: 'ACHIEVEMENT',
  },
  {
    id: 'inv_emb_03',
    type: 'BADGE',
    name: 'Gladiador X1',
    description: 'Insígnia de bravura de quem já venceu confronto direto.',
    rarity: 'RARE',
    category: 'emblemas',
    icon: '⚔️',
    status: 'UNLOCKED',
    isEquipped: false,
    unlockedAt: '24/05/2026',
    unlockCondition: 'Vença um duelo X1 no asfalto.',
    source: 'ACHIEVEMENT',
  },
];

// =========================================================================
// COLEÇÕES DE ITENS E FIGURINHAS (COLLECTIONS)
// =========================================================================
export const COLLECTIONS_DATA: Collection[] = [
  {
    id: 'col_s01',
    name: 'Primeira Temporada',
    description: 'Coleção comemorativa inaugural da fundação do THE ROLLING WARS.',
    icon: '🎴',
    season: 'Temporada 1',
    totalItems: 5,
    unlockedItemsCount: 4,
    rewardItemId: 'inv_frm_06',
    rewardItemName: 'Moldura Cyber Lendária',
    rewardItemIcon: '🔮',
    isCompleted: false,
    stickers: [
      {
        id: 'stk_01',
        name: '01 - Primeiro Rolê',
        icon: '🛼',
        rarity: 'COMMON',
        collectionId: 'col_s01',
        collectionName: 'Primeira Temporada',
        number: 1,
        description: 'Primeira sessão concluída na cidade.',
        isUnlocked: true,
        unlockedAt: '14/04/2026',
      },
      {
        id: 'stk_02',
        name: '02 - Primeira Zona',
        icon: '🏴',
        rarity: 'UNCOMMON',
        collectionId: 'col_s01',
        collectionName: 'Primeira Temporada',
        number: 2,
        description: 'Primeiro território conquistado no mapa.',
        isUnlocked: true,
        unlockedAt: '28/04/2026',
      },
      {
        id: 'stk_03',
        name: '03 - Primeiro Desafio',
        icon: '⚔️',
        rarity: 'RARE',
        collectionId: 'col_s01',
        collectionName: 'Primeira Temporada',
        number: 3,
        description: 'Primeiro duelo direto disputado.',
        isUnlocked: true,
        unlockedAt: '10/05/2026',
      },
      {
        id: 'stk_04',
        name: '04 - Primeiro Recorde',
        icon: '⚡',
        rarity: 'EPIC',
        collectionId: 'col_s01',
        collectionName: 'Primeira Temporada',
        number: 4,
        description: 'Primeiro recorde pessoal quebrado.',
        isUnlocked: true,
        unlockedAt: '20/05/2026',
      },
      {
        id: 'stk_05',
        name: '05 - Mestre Urbano',
        icon: '👑',
        rarity: 'LEGENDARY',
        collectionId: 'col_s01',
        collectionName: 'Primeira Temporada',
        number: 5,
        description: 'Conquista máxima da Primeira Temporada.',
        isUnlocked: false,
        unlockCondition: 'Alcance o Nível 15 de Progressão.',
      },
    ],
  },
  {
    id: 'col_neon',
    name: 'Temporada Neon',
    description: 'Itens luminescentes e mascotes das corridas sob as luzes da metrópole.',
    icon: '✨',
    season: 'Especial Noturno',
    totalItems: 8,
    unlockedItemsCount: 5,
    rewardItemId: 'inv_eff_02',
    rewardItemName: 'Efeito Onda Sônica Neon',
    rewardItemIcon: '💫',
    isCompleted: false,
  },
  {
    id: 'col_circ',
    name: 'Temporada Circuito',
    description: 'Rotas lendárias, pontes e avenidas da grande São Paulo.',
    icon: '🛣️',
    season: 'Circuito Urbano',
    totalItems: 6,
    unlockedItemsCount: 3,
    rewardItemId: 'inv_sk_05',
    rewardItemName: 'Skate Circuit X',
    rewardItemIcon: '🏎️',
    isCompleted: false,
  },
  {
    id: 'col_ev',
    name: 'Temporada Eventos',
    description: 'Colecionáveis exclusivos de torneios e competições especiais.',
    icon: '🏆',
    season: 'Torneios 2026',
    totalItems: 4,
    unlockedItemsCount: 2,
    rewardItemId: 'inv_frm_04',
    rewardItemName: 'Moldura Desafio 2026',
    rewardItemIcon: '🌟',
    isCompleted: false,
  },
];

// =========================================================================
// COSMÉTICOS EQUIPADOS INICIAIS
// =========================================================================
export const INITIAL_EQUIPPED_COSMETICS: EquippedCosmetics = {
  titleId: 'inv_tit_03',
  titleName: 'CONQUISTADOR',
  skateId: 'inv_sk_03',
  skateName: 'Powerslide Next Core 110',
  skateModel: 'Powerslide Next Core 110',
  mascotId: 'inv_masc_01',
  mascotName: 'Mini Urbano',
  mascotIcon: '🤖',
  frameId: 'inv_frm_01',
  frameName: 'Neon Pulse',
  frameBorderColor: '#fce803',
  effectId: 'inv_eff_01',
  effectName: 'Rastro de Fagulhas',
  accessoryId: 'inv_acc_01',
  accessoryName: 'Luvas Neon Reflex',
};

// =========================================================================
// PROGRESSÃO COMPLETA DO JOGADOR
// =========================================================================
export const INITIAL_PLAYER_PROGRESSION: PlayerProgression = {
  playerId: 'usr_01',
  level: 14,
  currentXP: 3840,
  totalXP: 38840,
  xpToNextLevel: 5000,
  progressionPercentage: 76,
  unlockedRewardsCount: 18,
  equippedItems: INITIAL_EQUIPPED_COSMETICS,
  xpHistory: INITIAL_XP_TRANSACTIONS,
  inventory: INITIAL_PLAYER_INVENTORY,
  collections: COLLECTIONS_DATA,
};

// =========================================================================
// FUNÇÕES UTILITÁRIAS DE PROGRESSÃO E PERSONALIZAÇÃO
// =========================================================================

/**
 * Calcula a próxima recompensa prevista para o jogador com base no nível
 */
export function getNextLevelDefinition(currentLevel: number): LevelDefinition | undefined {
  return LEVEL_DEFINITIONS.find((def) => def.level > currentLevel);
}

/**
 * Retorna as recompensas associadas a um nível específico
 */
export function getRewardsForLevel(level: number): Reward[] {
  const def = LEVEL_DEFINITIONS.find((d) => d.level === level);
  return def ? def.rewards : [];
}

/**
 * Retorna o progresso detalhado de uma coleção com base no inventário
 */
export function getCollectionProgress(
  collection: Collection,
  inventory: PlayerInventoryItem[]
): CollectionProgress {
  const itemsInCollection = inventory.filter(
    (item) => item.collectionId === collection.id || item.collectionName === collection.name
  );
  const unlockedCount = itemsInCollection.filter((item) => item.status !== 'LOCKED').length;
  const totalCount = collection.totalItems || itemsInCollection.length || 1;
  const isCompleted = unlockedCount >= totalCount;

  return {
    collectionId: collection.id,
    unlockedCount,
    totalCount,
    isCompleted,
  };
}

/**
 * Retorna o estilo CSS / classes para a moldura de perfil equipada
 */
export function getEquippedFrameStyle(frameId?: string): {
  borderClass: string;
  glowClass: string;
  badgeClass: string;
} {
  switch (frameId) {
    case 'frame_gold':
      return {
        borderClass: 'border-2 border-yellow-400',
        glowClass: 'shadow-[0_0_20px_rgba(252,232,3,0.5)] ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-yellow-400 text-black',
      };
    case 'inv_frm_01': // Neon Pulse
      return {
        borderClass: 'border-2 border-yellow-400',
        glowClass: 'shadow-[0_0_20px_rgba(252,232,3,0.5)] ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-yellow-400 text-black',
      };
    case 'inv_frm_02': // Moldura Conquistador
      return {
        borderClass: 'border-2 border-amber-500',
        glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-500/50 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-amber-400 text-black',
      };
    case 'inv_frm_03': // Elite Urbana
      return {
        borderClass: 'border-2 border-cyan-400',
        glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-cyan-400 text-black',
      };
    case 'inv_frm_04': // Desafio 2026
      return {
        borderClass: 'border-2 border-purple-400',
        glowClass: 'shadow-[0_0_22px_rgba(168,85,247,0.6)] ring-2 ring-purple-400/60 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-purple-400 text-black',
      };
    case 'inv_frm_05': // Ouro Metropolitano
      return {
        borderClass: 'border-2 border-amber-300',
        glowClass: 'shadow-[0_0_25px_rgba(252,211,77,0.7)] ring-2 ring-amber-300/70 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-amber-300 text-black',
      };
    case 'inv_frm_06': // Cyber Lendária
      return {
        borderClass: 'border-2 border-fuchsia-400',
        glowClass: 'shadow-[0_0_25px_rgba(232,121,249,0.7)] ring-2 ring-fuchsia-400/70 ring-offset-2 ring-offset-black',
        badgeClass: 'bg-fuchsia-400 text-black',
      };
    default:
      return {
        borderClass: 'border-2 border-yellow-400',
        glowClass: 'shadow-[0_0_20px_rgba(252,232,3,0.4)]',
        badgeClass: 'bg-yellow-400 text-black',
      };
  }
}

/**
 * Obtém a cor de destaque com base na raridade
 */
export function getRarityColor(rarity: string): {
  border: string;
  bg: string;
  text: string;
  badge: string;
  label: string;
} {
  const r = (rarity || '').toLowerCase();
  switch (r) {
    case 'mythic':
    case 'mitico':
      return {
        border: 'border-fuchsia-400',
        bg: 'bg-fuchsia-500/20',
        text: 'text-fuchsia-300',
        badge: 'bg-fuchsia-400 text-black',
        label: 'MÍTICO',
      };
    case 'legendary':
    case 'lendario':
      return {
        border: 'border-amber-400',
        bg: 'bg-amber-500/15',
        text: 'text-amber-300',
        badge: 'bg-amber-400 text-black',
        label: 'LENDÁRIO',
      };
    case 'epic':
    case 'epico':
      return {
        border: 'border-purple-400',
        bg: 'bg-purple-500/15',
        text: 'text-purple-300',
        badge: 'bg-purple-400 text-black',
        label: 'ÉPICO',
      };
    case 'rare':
    case 'raro':
      return {
        border: 'border-cyan-400',
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-300',
        badge: 'bg-cyan-400 text-black',
        label: 'RARO',
      };
    case 'uncommon':
    case 'incomum':
      return {
        border: 'border-yellow-400',
        bg: 'bg-yellow-500/15',
        text: 'text-yellow-300',
        badge: 'bg-yellow-400 text-black',
        label: 'INCOMUM',
      };
    case 'common':
    case 'comum':
    default:
      return {
        border: 'border-slate-600',
        bg: 'bg-slate-800/40',
        text: 'text-slate-300',
        badge: 'bg-slate-700 text-white',
        label: 'COMUM',
      };
  }
}
