import { ItemRarity } from '../types';

export type RewardCategory =
  | 'skates'
  | 'acessorios'
  | 'mascotes'
  | 'emblemas'
  | 'titulos'
  | 'efeitos'
  | 'colecoes';

export type UnlockRequirementType =
  | 'LEVEL'
  | 'ZONE_CONQUEST'
  | 'DISTANCE_KM'
  | 'STREAK_DAYS'
  | 'MISSION_COMPLETE'
  | 'EVENT_VICTORY';

export interface UnlockRequirement {
  type: UnlockRequirementType;
  threshold: number;
  label: string;
  description: string;
  currentProgress?: number;
}

export interface LevelRewardItem {
  id: string;
  name: string;
  category: RewardCategory;
  categoryLabel: string;
  description: string;
  icon: string;
  rarity: ItemRarity;
  unlockRequirement: UnlockRequirement;
  unlockedLevel: number;
  isUnlocked: boolean;
  isEquipped: boolean;
  unlockedAt?: string;
  visualPreview?: string;
  collectionName?: string;
  metadata?: {
    glowColor?: string;
    borderStyle?: string;
    effectType?: string;
    bonusLabel?: string;
  };
}

export const REWARD_CATEGORY_TABS: { id: RewardCategory | 'todos'; label: string; icon: string }[] = [
  { id: 'todos', label: 'Todos', icon: '✨' },
  { id: 'skates', label: 'Skates', icon: '🛹' },
  { id: 'acessorios', label: 'Acessórios', icon: '🦺' },
  { id: 'mascotes', label: 'Mascotes', icon: '🐾' },
  { id: 'emblemas', label: 'Emblemas', icon: '🛡️' },
  { id: 'titulos', label: 'Títulos', icon: '👑' },
  { id: 'efeitos', label: 'Efeitos', icon: '⚡' },
  { id: 'colecoes', label: 'Coleções', icon: '🎴' },
];

export const INITIAL_REWARDS_CATALOG: LevelRewardItem[] = [
  // 1. SKATES COLECIONÁVEIS
  {
    id: 'skate-01',
    name: 'Street Cruiser Black',
    category: 'skates',
    categoryLabel: 'Skates Colecionáveis',
    description: 'Setup clássico urbano de 80mm balanceado para deslocamento rápido no asfalto.',
    icon: '🛹',
    rarity: 'comum',
    unlockedLevel: 1,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 1,
      label: 'Desbloqueado no Nível 1',
      description: 'Disponível no início da sua jornada urbana.',
    },
    metadata: {
      bonusLabel: '+0% Bônus Base',
      glowColor: '#00FF66',
    },
  },
  {
    id: 'skate-02',
    name: 'Neon Blade 3000',
    category: 'skates',
    categoryLabel: 'Skates Colecionáveis',
    description: 'Bota rígida com base de alumínio aeronáutico e rodas translúcidas fluorescentes.',
    icon: '🛼',
    rarity: 'raro',
    unlockedLevel: 5,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 5,
      label: 'Nível 5 Requerido',
      description: 'Alcance o nível 5 de patinador.',
    },
    metadata: {
      bonusLabel: '+5% XP em sessões noturnas',
      glowColor: '#06b6d4',
    },
  },
  {
    id: 'skate-03',
    name: 'Asphalt Crusher 90mm',
    category: 'skates',
    categoryLabel: 'Skates Colecionáveis',
    description: 'Rodas de alta densidade 90mm feitas para resistir às irregularidades de grandes avenidas.',
    icon: '⚡',
    rarity: 'epico',
    unlockedLevel: 12,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 12,
      label: 'Nível 12 Requerido',
      description: 'Alcance o nível 12 de patinador.',
    },
    metadata: {
      bonusLabel: '+10% XP em rotas avançadas',
      glowColor: '#a855f7',
    },
  },
  {
    id: 'skate-04',
    name: 'Cyber Phantom Pro Carbon',
    category: 'skates',
    categoryLabel: 'Skates Colecionáveis',
    description: 'Chassi integral em fibra de carbono 3x110mm para máxima velocidade e absorção.',
    icon: '🌌',
    rarity: 'lendario',
    unlockedLevel: 20,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 20,
      label: 'Nível 20 Requerido',
      description: 'Alcance o nível 20 de mestre urbano.',
    },
    metadata: {
      bonusLabel: '+15% XP de Domínio de Zonas',
      glowColor: '#fbbf24',
    },
  },
  {
    id: 'skate-05',
    name: 'Viper Speed Circuit 125mm',
    category: 'skates',
    categoryLabel: 'Skates Colecionáveis',
    description: 'Setup de corrida veloz para bater recordes de velocidade nas retas da cidade.',
    icon: '🏆',
    rarity: 'lendario',
    unlockedLevel: 25,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 25,
      label: 'Nível 25 Requerido',
      description: 'Alcance o nível 25 de elite metropolitana.',
    },
    metadata: {
      bonusLabel: '+20% XP de Duelos X1',
      glowColor: '#f59e0b',
    },
  },

  // 2. ACESSÓRIOS
  {
    id: 'acc-01',
    name: 'Capacete Urbano Matte',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Proteção',
    description: 'Proteção aerodinâmica em preto fosco com ventilação de alto fluxo.',
    icon: '🪖',
    rarity: 'comum',
    unlockedLevel: 1,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 1,
      label: 'Desbloqueado no Nível 1',
      description: 'Item padrão de segurança urbana.',
    },
  },
  {
    id: 'acc-02',
    name: 'Joelheiras Reforçadas Grafite',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Proteção',
    description: 'Placas de policarbonato absorventes com rebites táticos reforçados.',
    icon: '🛡️',
    rarity: 'raro',
    unlockedLevel: 3,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 3,
      label: 'Nível 3 Requerido',
      description: 'Alcance o nível 3 de patinador.',
    },
  },
  {
    id: 'acc-03',
    name: 'Óculos Speed Holo Visor',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Proteção',
    description: 'Lentes polarizadas com tratamento anti-reflexo e tonalidade âmbar noturna.',
    icon: '🕶️',
    rarity: 'raro',
    unlockedLevel: 8,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 8,
      label: 'Nível 8 Requerido',
      description: 'Alcance o nível 8 de patinador.',
    },
  },
  {
    id: 'acc-04',
    name: 'Jaqueta Street Bomber Neon',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Proteção',
    description: 'Corta-vento impermeável com fitas refletivas 3M e corte atlético.',
    icon: '🧥',
    rarity: 'epico',
    unlockedLevel: 15,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 15,
      label: 'Nível 15 Requerido',
      description: 'Alcance o nível 15 de patinador.',
    },
  },
  {
    id: 'acc-05',
    name: 'Luvas Táticas de Asfalto',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Proteção',
    description: 'Sliders rígidos nas palmas para proteção em manobras de slides urbanos.',
    icon: '🧤',
    rarity: 'epico',
    unlockedLevel: 18,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 18,
      label: 'Nível 18 Requerido',
      description: 'Alcance o nível 18 de patinador.',
    },
  },

  // 3. MASCOTES
  {
    id: 'pet-01',
    name: 'Capivara do Ibirapuera',
    category: 'mascotes',
    categoryLabel: 'Mascotes Virtuais',
    description: 'Companheira tranquila dos rolês de fim de tarde, adora pistas planas e parques.',
    icon: '🐾',
    rarity: 'raro',
    unlockedLevel: 4,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 4,
      label: 'Nível 4 Requerido',
      description: 'Alcance o nível 4 de patinador.',
    },
    metadata: {
      bonusLabel: 'Companheiro Leal',
      glowColor: '#10b981',
    },
  },
  {
    id: 'pet-02',
    name: 'Pombo Mensageiro Radical',
    category: 'mascotes',
    categoryLabel: 'Mascotes Virtuais',
    description: 'Conhece cada praça, viaduto e calçadão da cidade como a palma da asa.',
    icon: '🕊️',
    rarity: 'comum',
    unlockedLevel: 2,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 2,
      label: 'Nível 2 Requerido',
      description: 'Alcance o nível 2 de patinador.',
    },
  },
  {
    id: 'pet-03',
    name: 'Gato Noturno da Paulista',
    category: 'mascotes',
    categoryLabel: 'Mascotes Virtuais',
    description: 'Ágil e silencioso, reina pelas marquises e ciclovias sob a luz dos postes.',
    icon: '🐱',
    rarity: 'epico',
    unlockedLevel: 10,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 10,
      label: 'Nível 10 Requerido',
      description: 'Alcance o nível 10 de patinador.',
    },
  },
  {
    id: 'pet-04',
    name: 'Falcão Urbano do Vale',
    category: 'mascotes',
    categoryLabel: 'Mascotes Virtuais',
    description: 'Sobrevoa os prédios históricos alertando sobre novas zonas e disputas ativas.',
    icon: '🦅',
    rarity: 'lendario',
    unlockedLevel: 22,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 22,
      label: 'Nível 22 Requerido',
      description: 'Alcance o nível 22 de patinador.',
    },
  },

  // 4. EMBLEMAS
  {
    id: 'emb-01',
    name: 'Brasão do Asfalto',
    category: 'emblemas',
    categoryLabel: 'Emblemas & Brasões',
    description: 'Selo oficial de patinador ativo da metrópole.',
    icon: '🛡️',
    rarity: 'comum',
    unlockedLevel: 1,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 1,
      label: 'Desbloqueado no Nível 1',
      description: 'Inicie sua jornada urbana.',
    },
  },
  {
    id: 'emb-02',
    name: 'Dominador Territorial',
    category: 'emblemas',
    categoryLabel: 'Emblemas & Brasões',
    description: 'Reconhecimento concedido por conquistar e defender zonas urbanas.',
    icon: '⚔️',
    rarity: 'raro',
    unlockedLevel: 6,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 6,
      label: 'Nível 6 Requerido',
      description: 'Alcance o nível 6 de patinador.',
    },
  },
  {
    id: 'emb-03',
    name: 'Velocista Noturno',
    category: 'emblemas',
    categoryLabel: 'Emblemas & Brasões',
    description: 'Emblema concedido a quem atinge altas velocidades nas retas metropolitanas.',
    icon: '⚡',
    rarity: 'epico',
    unlockedLevel: 14,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 14,
      label: 'Nível 14 Requerido',
      description: 'Alcance o nível 14 de patinador.',
    },
  },
  {
    id: 'emb-04',
    name: 'Mestre da Metrópole',
    category: 'emblemas',
    categoryLabel: 'Emblemas & Brasões',
    description: 'A mais alta insígnia honorária de domínio sobre a cidade.',
    icon: '👑',
    rarity: 'lendario',
    unlockedLevel: 30,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 30,
      label: 'Nível 30 Requerido',
      description: 'Alcance o nível 30 de lenda suprema.',
    },
  },

  // 5. TÍTULOS
  {
    id: 'tit-01',
    name: 'Patinador da Quebrada',
    category: 'titulos',
    categoryLabel: 'Títulos de Perfil',
    description: 'Exibido com orgulho ao lado do seu nickname em rankings e perfis públicos.',
    icon: '🏷️',
    rarity: 'comum',
    unlockedLevel: 1,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 1,
      label: 'Desbloqueado no Nível 1',
      description: 'Título inicial do THE ROLLING WARS.',
    },
  },
  {
    id: 'tit-02',
    name: 'Rei da Paulista',
    category: 'titulos',
    categoryLabel: 'Títulos de Perfil',
    description: 'Reconhecimento para quem domina a principal artéria urbana da cidade.',
    icon: '👑',
    rarity: 'raro',
    unlockedLevel: 7,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 7,
      label: 'Nível 7 Requerido',
      description: 'Alcance o nível 7 de patinador.',
    },
  },
  {
    id: 'tit-03',
    name: 'Guardião do Vale',
    category: 'titulos',
    categoryLabel: 'Títulos de Perfil',
    description: 'Protetor dos picos históricos do centro metropolitano.',
    icon: '🏛️',
    rarity: 'epico',
    unlockedLevel: 12,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 12,
      label: 'Nível 12 Requerido',
      description: 'Alcance o nível 12 de patinador.',
    },
  },
  {
    id: 'tit-04',
    name: 'Lenda Metropolitana',
    category: 'titulos',
    categoryLabel: 'Títulos de Perfil',
    description: 'Título exclusivo de elite conferido aos maiores patinadores urbanos.',
    icon: '🌟',
    rarity: 'lendario',
    unlockedLevel: 25,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 25,
      label: 'Nível 25 Requerido',
      description: 'Alcance o nível 25 de lenda urbana.',
    },
  },

  // 6. EFEITOS VISUAIS
  {
    id: 'eff-01',
    name: 'Fagulhas Neon Verdes',
    category: 'efeitos',
    categoryLabel: 'Efeitos Visuais',
    description: 'Efeito luminoso que acompanha os movimentos e frenagens no mapa.',
    icon: '✨',
    rarity: 'raro',
    unlockedLevel: 5,
    isUnlocked: true,
    isEquipped: true,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 5,
      label: 'Nível 5 Requerido',
      description: 'Alcance o nível 5 de patinador.',
    },
    metadata: {
      glowColor: '#00FF66',
    },
  },
  {
    id: 'eff-02',
    name: 'Rastro Asfáltico Azul Ciano',
    category: 'efeitos',
    categoryLabel: 'Efeitos Visuais',
    description: 'Linha de energia ciano que ilumina a trajetória GPS durante a sessão.',
    icon: '💠',
    rarity: 'epico',
    unlockedLevel: 11,
    isUnlocked: true,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 11,
      label: 'Nível 11 Requerido',
      description: 'Alcance o nível 11 de patinador.',
    },
    metadata: {
      glowColor: '#06b6d4',
    },
  },
  {
    id: 'eff-03',
    name: 'Chamas Douradas de Troféu',
    category: 'efeitos',
    categoryLabel: 'Efeitos Visuais',
    description: 'Aura incandescente de ouro ao cruzar checkpoints de velocidade e zonas.',
    icon: '🔥',
    rarity: 'lendario',
    unlockedLevel: 20,
    isUnlocked: false,
    isEquipped: false,
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 20,
      label: 'Nível 20 Requerido',
      description: 'Alcance o nível 20 de mestre.',
    },
    metadata: {
      glowColor: '#fbbf24',
    },
  },

  // 7. COLEÇÕES & FIGURINHAS
  {
    id: 'col-01',
    name: 'Figurinha #01: Viaduto do Chá',
    category: 'colecoes',
    categoryLabel: 'Coleções & Figurinhas',
    description: 'Colecionável histórico da ponte mais emblemática do centro urbano.',
    icon: '🎴',
    rarity: 'comum',
    unlockedLevel: 2,
    isUnlocked: true,
    isEquipped: false,
    collectionName: 'Picos Históricos de SP',
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 2,
      label: 'Nível 2 Requerido',
      description: 'Alcance o nível 2 de patinador.',
    },
  },
  {
    id: 'col-02',
    name: 'Figurinha #07: Monumento às Bandeiras',
    category: 'colecoes',
    categoryLabel: 'Coleções & Figurinhas',
    description: 'Colecionável clássico do ponto de encontro no Ibirapuera.',
    icon: '🗿',
    rarity: 'raro',
    unlockedLevel: 8,
    isUnlocked: true,
    isEquipped: false,
    collectionName: 'Picos Históricos de SP',
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 8,
      label: 'Nível 8 Requerido',
      description: 'Alcance o nível 8 de patinador.',
    },
  },
  {
    id: 'col-03',
    name: 'Figurinha #15: Pista Chácara do Jockey',
    category: 'colecoes',
    categoryLabel: 'Coleções & Figurinhas',
    description: 'Colecionável da icônica pista e circuito da zona oeste.',
    icon: '🛹',
    rarity: 'epico',
    unlockedLevel: 16,
    isUnlocked: false,
    isEquipped: false,
    collectionName: 'Pistas & Bowls da Cidade',
    unlockRequirement: {
      type: 'LEVEL',
      threshold: 16,
      label: 'Nível 16 Requerido',
      description: 'Alcance o nível 16 de patinador.',
    },
  },
];

export function getRarityBadgeStyle(rarity: ItemRarity): {
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
} {
  switch (rarity) {
    case 'lendario':
      return {
        bgClass: 'bg-amber-500/20',
        borderClass: 'border-amber-400/60',
        textClass: 'text-amber-300',
        glowClass: 'shadow-[0_0_12px_rgba(251,191,36,0.3)]',
      };
    case 'epico':
      return {
        bgClass: 'bg-purple-500/20',
        borderClass: 'border-purple-400/60',
        textClass: 'text-purple-300',
        glowClass: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
      };
    case 'raro':
      return {
        bgClass: 'bg-cyan-500/20',
        borderClass: 'border-cyan-400/60',
        textClass: 'text-cyan-300',
        glowClass: 'shadow-[0_0_10px_rgba(6,182,212,0.25)]',
      };
    case 'comum':
    default:
      return {
        bgClass: 'bg-yellow-500/15',
        borderClass: 'border-yellow-400/40',
        textClass: 'text-yellow-300',
        glowClass: 'shadow-[0_0_8px_rgba(252,232,3,0.2)]',
      };
  }
}
