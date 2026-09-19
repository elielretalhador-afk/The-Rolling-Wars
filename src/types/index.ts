export const DEFAULT_ZONE_RADIUS_METERS = 40;

export type TabType = 'mapa' | 'feed' | 'ranking' | 'desafios' | 'perfil' | 'rotas' | 'social';

export type ZoneType = 'street' | 'speed' | 'free_skate' | 'slalom';
export type ZoneStatus = 'free' | 'controlled' | 'contested';
export type ZoneActivityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'baixa' | 'media' | 'alta';
export type ZoneFilterType = 'ALL' | 'FREE' | 'CONTESTED' | 'CONTROLLED' | 'HIGH_ACTIVITY' | 'NEARBY';

export interface ZoneCreator {
  id?: string;
  name: string;
  avatar?: string;
  nickname?: string;
}

export interface ZoneController {
  id?: string;
  name: string;
  nickname?: string;
  avatar?: string;
  level: number;
  clan?: string;
  crew?: string;
  clanId?: string;
  clanName?: string;
  clanIcon?: string;
}

export interface ZoneRecord {
  playerName: string;
  playerNickname?: string;
  playerAvatar?: string;
  timeSeconds?: number;
  speedKmH?: number;
  date?: string;
  description?: string;
}

export interface Zone {
  id: string;
  authId?: string;
  name: string;
  type: ZoneType;
  center: [number, number]; // [lat, lng]
  radius: number; // in meters
  color: string; // visual hex color
  creator: ZoneCreator | string;
  controller: ZoneController | null;
  description: string;
  rules: string;
  surface: string; // qualidade/característica do piso
  referencePoint: string; // ponto de referência próximo à zona
  status: ZoneStatus; // 'free' | 'controlled' | 'contested'
  dominance: number; // 0 - 100%
  skatersCount: number; // quantidade de patinadores
  xpPerHour: number; // XP por hora
  createdAt: string; // data de criação
  // Estrutura expandida para suportar segmentos e zonas fechadas desenhadas
  shape?: 'circle' | 'segment' | 'zone';
  path?: [number, number][]; // Coordenadas do desenho
  creatorId?: string;
  ownerId?: string;
  points?: number;
  length?: number;
  area?: number;
  perimeter?: number;
  record?: string;
  recordHolder?: string;
  updatedAt?: string;

  captureRequirements?: {
    minDistance?: number; // em metros (padrão 100m)
  };

  // Nível de atividade e exploração estrutural
  activityLevel?: ZoneActivityLevel;
  totalVisitorsCount?: number; // total de jogadores que já passaram pela zona
  dominionTimeDays?: number; // tempo de domínio atual em dias
  bestRecord?: ZoneRecord | null; // melhor desempenho registrado
  distanceFromUserMeters?: number; // distância calculada dinamicamente

  // Helper/backward compatibility fields
  activeDispute?: ZoneDisputeInfo | null;
    conquestHistory?: Array<{
    operationId?: string;
    playerId: string;
    playerName: string;
    playerNickname?: string;
    playerAvatar?: string;
    conqueredAt: string;
    durationSeconds: number;
    distanceMeters: number;
    trackPoints?: ActivityTrackPoint[];
  }>;
  accentColor?: string;
  fillColor?: string;
  category?: 'Street' | 'Speed' | 'Freeskate' | 'Free Skate' | 'Slalom';
  controllerName?: string;
  controllerNickname?: string;
  controllerAvatar?: string;
  controllerLevel?: number;
  controllerCrew?: string;
  dominancePercent?: number;
  activeSkatersCount?: number;
  pointsPerHour?: number;
  contested?: boolean;
  lastConquered?: string;
  conqueredAtUnix?: number;
  clanCooldowns?: Record<string, number>;
}

export interface PublicProfile {
  id: string;
  name: string;
  nickname: string;
  tag: string;
  avatar: string;
  level: number;
  xp: number;
  totalKm: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  achievementsCount?: number;
  clanTag?: string;
}

export interface UserProfile {
  id: string;
  authId?: string;
  name: string;
  nickname: string;
  tag: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins?: number; // Saldo de moedas virtuais do jogador
  wallet?: VirtualWallet; // Carteira virtual interna
  globalRank: number;
  weeklyRank?: number;
  monthlyRank?: number;
  weeklyXp?: number;
  monthlyXp?: number;
  weeklyKm?: number;
  monthlyKm?: number;
  weeklyChallengesCount?: number;
  weeklyChallengeWins?: number;
  monthlyChallengesCount?: number;
  monthlyChallengeWins?: number;
  controlledZonesCount: number;
  totalKm: number;
  currentSpeedKmH: number;
  streakDays: number;
  crew?: string;
  clanId?: string;
  clanTag?: string;
  clanRole?: ClanRole;
  activeTitle?: string;
  activeTitleId?: string;
  progression?: PlayerProgression;
  equippedCosmetics?: EquippedCosmetics;
  profileCosmetics?: ProfileCosmetics;
  totalXP?: number;
  unlockedAchievementsCount?: number;
  unlockedMedalsCount?: number;
  unlockedTitlesCount?: number;
  achievementsCount?: number;
  medalsCount?: number;
  titlesCount?: number;
  seasonalStats?: PlayerSeasonalStats;
  skateSetup: {
    model?: string;
    wheels?: any;
    bearings?: any;
  };
}

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp?: number;
  speedKmH?: number;
  altitude?: number;
  heading?: number;
  accuracy?: number;
}

export interface SkateRoute {
  id: string;
  authId?: string;
  name: string;
  distanceKm: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Insano';
  estimatedTimeMin: number;
  asphaltQuality: 'Perfeito' | 'Bom' | 'Desafiador';
  location: string;
  points: number;
  tags: string[];
  center: [number, number]; // [lat, lng] for centering on map
  path: [number, number][]; // Sequential GPS coordinate breadcrumb trace
  gpsTrack?: GPSPoint[]; // Timestamped track points for recording & telemetry
  routeType?: 'recorded_trace' | 'planned_route'; // Distinguishes between recorded real skater trace and planned route
  isCircuit?: boolean; // True if start point connects back to end point (closed loop / star)
  startPointName?: string;
  endPointName?: string;
  elevationGainMeters?: number;
}

// ==========================================
// SISTEMA DE MISSÕES (THE ROLLING WARS)
// ==========================================
export type MissionType =
  | 'DISTANCE'
  | 'TIME'
  | 'SPEED'
  | 'ZONE'
  | 'CHALLENGE'
  | 'EVENT'
  | 'ROUTE'
  | 'EXPLORATION'
  | 'VICTORY'
  | 'SESSION'
  | 'COLLECTION'
  | 'SPECIAL';

export type MissionCategory =
  | 'DAILY'
  | 'WEEKLY'
  | 'LONG_TERM'
  | 'TIMED'
  | 'SPECIAL'
  | 'COMMUNITY';

export type MissionStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CLAIMED'
  | 'EXPIRED'
  | 'CANCELLED';

export type MissionDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EPIC';

export interface MissionReward {
  xpReward: number;
  coinsReward?: number;
  virtualCoins?: number;
  rewardType?: RewardType;
  rewardId?: string;
  name?: string;
  description?: string;
  icon?: string;
  rarity?: ItemRarity;
  titleReward?: string;
  titleId?: string;
  badgeReward?: string;
  medalReward?: string;
  medalId?: string;
  cosmeticName?: string;
  cosmeticItem?: PlayerInventoryItem | Reward;
}

export interface MissionRequirements {
  minLevel?: number;
  requiredMissionId?: string;
  requiredMissionTitle?: string;
  requiredZoneId?: string;
  requiredZoneName?: string;
  description?: string;
}

export interface MissionTimeWindow {
  availableFromHour: number; // e.g. 20 (20:00)
  availableToHour: number;   // e.g. 23 (23:59)
  label: string;             // e.g. "20:00 → 23:59"
  isCurrentlyActive?: boolean;
}

export interface MissionChain {
  chainId: string;
  chainTitle?: string;
  sequenceIndex: number; // 1, 2, 3...
  totalInChain: number;  // 3
  nextMissionId?: string;
  isFinalChainReward?: boolean;
}

export interface Mission {
  id: string;
  authId?: string;
  title: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  status: MissionStatus;
  difficulty: MissionDifficulty;
  target: number;
  currentProgress: number;
  unit: string;
  startAt?: string;
  endAt?: string;
  duration?: string; // e.g. "72h", "24h", "4h"
  timeWindow?: MissionTimeWindow;
  reward: MissionReward;
  requirements?: MissionRequirements;
  chain?: MissionChain;
  createdAt?: string;
  completedAt?: string;
  claimedAt?: string;
  expiresInLabel?: string; // e.g. "Termina em 18h 32min", "Termina hoje às 23:59"

  // Contextos geoespaciais e de jogo opcionais
  targetZoneId?: string;
  targetZoneName?: string;
  targetCoords?: [number, number];
  targetRouteId?: string;
  targetRouteName?: string;
  challengeRoute?: [number, number][];
  startPointName?: string;
  endPointName?: string;
  requiredSpeedKmH?: number;
  minDurationSec?: number;

  // Propriedades legadas para compatibilidade
  progress?: number;
  completed?: boolean;
  rewardXp?: number;
  expiresIn?: string;
  objective?: string;
  instructions?: string;
  mainRequirement?: string;
  timeRestriction?: {
    availableFromHour: number;
    availableToHour?: number;
    label: string;
    isCurrentlyActive?: boolean;
  };
}

export interface Challenge {
  id: string;
  authId?: string;
  title: string;
  description: string;
  objective?: string;
  instructions?: string;
  mainRequirement?: string;
  category: 'Diário' | 'Semanal' | 'Conquista' | 'Contínua';
  progress: number;
  target: number;
  unit: string;
  rewardXp: number;
  completed: boolean;
  expiresIn: string;
  targetZoneId?: string;
  targetZoneName?: string;
  targetCoords?: [number, number];
  challengeRoute?: [number, number][];
  startPointName?: string;
  endPointName?: string;
  requiredSpeedKmH?: number;
  minDurationSec?: number;
  timeRestriction?: {
    availableFromHour: number; // e.g. 20 (20:00)
    availableToHour?: number; // e.g. 4 (04:00)
    label: string;
    isCurrentlyActive?: boolean;
  };
}

export interface RankPlayer {
  id?: string;
  userId?: string;
  rank: number;
  nickname: string;
  name?: string;
  tag?: string;
  avatar: string;
  crew: string;
  city?: string;
  level: number;
  xp?: number;
  nextLevelXp?: number;
  zonesControlled: number;
  controlledZoneNames?: string[];
  weeklyKm: number;
  monthlyKm?: number;
  points: number;
  streakDays?: number;
  totalKm?: number;
  challengesCount?: number;
  challengeWins?: number;
  weeklyRank?: number;
  monthlyRank?: number;
  activeTitle?: string;
  achievementsCount?: number;
  medalsCount?: number;
  skateSetup?: {
    model: string;
    wheels: string;
    bearings: string;
  };
  isCurrentUser?: boolean;
}

export type SeasonStatus = 'UPCOMING' | 'ACTIVE' | 'ENDING_SOON' | 'FINISHED' | 'ARCHIVED';

export type SeasonRewardTierType = 'TOP_1' | 'TOP_3' | 'TOP_10' | 'TOP_50' | 'TOP_100' | 'PARTICIPATION';

export interface SeasonRewardItem {
  type: 'TITLE' | 'BADGE' | 'FRAME' | 'SKATE' | 'PET' | 'STICKER' | 'XP_BONUS' | 'SPECIAL';
  name: string;
  icon: string;
  rarity?: ItemRarity;
  description?: string;
  itemId?: string;
}

export interface SeasonRewardTier {
  id: string;
  authId?: string;
  tier: SeasonRewardTierType;
  tierLabel: string;
  minRank: number;
  maxRank: number;
  title: string;
  description: string;
  rewards: SeasonRewardItem[];
  xpBonus?: number;
}

export interface SeasonRankingEntry {
  seasonId: string;
  playerId: string;
  nickname: string;
  name?: string;
  avatar: string;
  title?: string;
  crew?: string;
  level?: number;
  points: number;
  position: number;
  wins: number;
  zones: number;
  events: number;
  challenges: number;
  isCurrentUser?: boolean;
}

export interface Season {
  id: string;
  authId?: string;
  name: string;
  description: string;
  number: number;
  status: SeasonStatus;
  startAt: string;
  endAt: string;
  theme: string;
  banner?: string;
  icon?: string;
  seasonColor?: string;
  accentColor?: string;
  rewards: SeasonRewardTier[];
  featuredEvents?: string[]; // IDs of events
  featuredMissions?: string[]; // IDs of missions
  featuredCollections?: string[]; // IDs of collections
  createdAt?: string;
  timeRemainingLabel?: string;
  rulesSummary?: string[];
  finalTopWinner?: {
    playerId?: string;
    nickname: string;
    avatar: string;
    points: number;
    title?: string;
    crew?: string;
  };
  totalParticipants?: number;
}

export interface PlayerSeasonalStats {
  currentSeasonId: string;
  currentSeasonPoints: number;
  currentSeasonPosition: number;
  bestPlacement?: {
    seasonNumber: number;
    seasonName: string;
    position: number;
    points: number;
    closedAt?: string;
  };
  completedSeasonsCount: number;
  seasonalHistory?: Array<{
    seasonId: string;
    seasonNumber: number;
    seasonName: string;
    finalPosition: number;
    finalPoints: number;
    rewardEarned?: string;
    closedAt: string;
  }>;
}

export interface SeasonReward {
  rankMin: number;
  rankMax: number;
  title: string;
  badgeIcon: string;
  badgeName: string;
  xpReward: number;
  virtualCoins?: number;
  titleReward?: string;
  description: string;
}

export type RankingPeriod = 'semanal' | 'mensal' | 'geral' | 'temporada';

export interface RankingEntry {
  playerId: string;
  position: number;
  nickname: string;
  name?: string;
  avatar: string;
  tag?: string;
  level: number;
  crew?: string;
  city?: string;
  score: number;
  xp: number;
  zonesControlled: number;
  distanceKm: number;
  challengesCount: number;
  challengeWins: number;
  isCurrentUser?: boolean;
}

export interface RankingSeason {
  id: string;
  authId?: string;
  seasonNumber: number;
  type: 'semanal' | 'mensal';
  title: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'upcoming';
  participantsCount: number;
  timeRemaining?: string;
  topWinner?: {
    nickname: string;
    avatar: string;
    level: number;
    crew: string;
    xp: number;
    zones: number;
    distanceKm: number;
    wins: number;
  };
  currentUserResult?: {
    position: number;
    xp: number;
    zonesControlled: number;
    distanceKm: number;
    challengesCount: number;
    challengeWins: number;
  };
  finalResults?: RankingEntry[];
  rewardsConfig?: SeasonReward[];
}

export interface PlayerSeasonHistoryEntry {
  seasonId: string;
  seasonNumber: number;
  type: 'semanal' | 'mensal';
  seasonTitle: string;
  periodLabel: string;
  position: number;
  xp: number;
  distanceKm: number;
  zonesControlled: number;
  challengesCount: number;
  challengeWins: number;
  badgeEarned?: string;
  titleEarned?: string;
  closedAt: string;
}

export interface ActivityTrackPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number; // km/h
  altitude?: number;
  accuracy?: number;
}

export interface ZoneOperation {
  operationId: string;
  zoneId: string;
  type: 'CONQUEST';
  playerId: string;
  payload: {
    controller: ZoneController;
    conquestHistoryEntry: any; // Ideally we can define this better, but `any` matches the ad-hoc usage
  };
  createdAt: number;
  syncStatus: 'pending' | 'error' | 'synced';
  retryCount: number;
}

export interface ZoneActivity {
  id: string;
  authId?: string;
  zoneId: string;
  zoneName?: string;
  activityId: string;
  enteredAt: string; // ISO String
  exitedAt: string | null; // ISO String or null if still active inside
  trackPoints: ActivityTrackPoint[];
  distanceInsideZone: number; // in meters
}

export interface ZoneDisputeInfo {
  playerId: string;
  playerName: string;
  playerNickname?: string;
  playerAvatar?: string;
  playerLevel?: number;
  startedAt: string; // ISO String
  startPosition?: [number, number];
  mode?: 'solo' | 'duo' | 'trio' | 'squad';
  participants?: Array<{
    playerId: string;
    playerName: string;
    avatar?: string;
    distanceCoveredMeters?: number;
  }>;
  comparisonType?: 'time' | 'distance' | 'requirements';
}

export interface CaptureAttempt {
  id?: string;
  zoneId: string;
  zoneName: string;
  active: boolean;
  playerId?: string;
  playerName?: string;
  playerNickname?: string;
  playerAvatar?: string;
  playerLevel?: number;
  startedAt: string | null;
  startPosition?: [number, number];
  endPosition?: [number, number];
  distanceInsideZone: number; // in meters
  minDistanceMeters: number; // in meters
  trackPoints: ActivityTrackPoint[];
  durationSeconds?: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';
  color?: string;
  type?: string;
  xpReward?: number;
  // Future multiplayer preparation
  mode?: 'solo' | 'duo' | 'trio' | 'squad';
  participants?: Array<{
    playerId: string;
    playerName: string;
    avatar?: string;
    distanceCoveredMeters?: number;
  }>;
  comparisonType?: 'time' | 'distance' | 'requirements';
}

export interface ConquestResultModalData {
  zone: Zone;
  zoneName: string;
  durationFormatted: string; // e.g. "02:38"
  durationSeconds: number;
  distanceKmFormatted: string; // e.g. "1,42 km" or "150 m"
  distanceMeters: number;
  xpEarned: number; // e.g. 320
  player: UserProfile;
  trackPoints: ActivityTrackPoint[];
  isPending?: boolean;
  clanWar?: {
    points: number;
    result: string;
    clanName: string;
  };
}

export interface ZoneConquestProgress {
  zoneId: string;
  zoneName: string;
  accumulatedDistanceMeters: number;
  minDistanceMeters: number;
  isConquered: boolean;
  isPlayerCurrentlyInside: boolean;
  attemptStatus: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';
  startedAt?: string | null;
  color?: string;
  type?: string;
}

// =========================================================================
// SESSÃO DE PATINAÇÃO (SKATE SESSION ENGINE)
// =========================================================================
export type SessionStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface SessionZoneVisit {
  zoneId: string;
  zoneName: string;
  enteredAt: string; // ISO String
  exitedAt: string | null; // ISO String
  durationSeconds?: number;
  distanceMeters?: number;
  status?: 'visited' | 'disputed' | 'conquered' | 'lost';
}

export interface SessionChallengeRecord {
  challengeId: string;
  title: string;
  category?: string;
  participantsCount: number;
  result: 'vitoria' | 'derrota' | 'concluido' | 'em_andamento';
  routeName?: string;
  xpEarned?: number;
}

export interface SkateSession {
  syncStatus?: 'pending' | 'synced' | 'error';
  id: string;
  authId?: string;
  playerId: string;
  sessionNumber?: number;
  title?: string;
  startedAt: number | null;
  endedAt?: number | null;
  status: SessionStatus;
  distance: number; // in km
  duration: number; // in seconds
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  gpsPoints: ActivityTrackPoint[];
  routeId?: string;
  routeName?: string;
  zonesVisited: SessionZoneVisit[];
  zonesConquered: string[];
  challengesParticipated: SessionChallengeRecord[];
  xpEarned: number;
  completed: boolean;

  // Propriedades mantidas para 100% de compatibilidade retroativa com visualizações existentes
  distanceKm: number;
  durationSeconds: number;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  currentSpeedKmH?: number;
  pointsCount?: number;
  track: ActivityTrackPoint[];
  dateFormatted?: string;
  isActive?: boolean;
  isPaused?: boolean;
  startTime?: number | null;
  endTime?: number | null;
  zoneActivities?: ZoneActivity[];
  repeatedFromActivityId?: string;
  repeatedFromTitle?: string;
}

export type ActivitySession = SkateSession;

export type AppNotificationType =
  | 'zona'
  | 'conquista'
  | 'disputa'
  | 'ranking'
  | 'desafio'
  | 'xp'
  | 'sistema'
  | 'cla'
  | 'evento'
  | 'patrocinador'
  | 'mensagem'
  | 'social'
  | 'friend_request'
  | 'friend_accept'
  | 'new_record'
  | 'record_beaten'
  | 'social_activity';

export interface AppNotification {
  id: string;
  authId?: string;
  type: AppNotificationType;
  title: string;
  message: string;
  timeAgo: string;
  timestamp?: string; // ISO string
  isRead: boolean;
  actionType?: 'open_clan_profile' | 'open_zone' | 'open_challenge' | 'open_ranking' | 'open_routes' | 'open_profile' | 'open_direct_challenge' | 'open_event' | 'open_progression' | 'open_social_hub';
  actionPayload?: {
    zoneId?: string;
    challengeId?: string;
    routeId?: string;
    directChallengeId?: string;
    eventId?: string;
    rankingPeriod?: string;
    xpAmount?: number;
    tab?: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
  mediaUrl?: string;
}

// ==========================================
// CONQUISTAS, MEDALHAS E TÍTULOS (THE ROLLING WARS)
// ==========================================
export type AchievementCategory =
  | 'ATIVIDADE'
  | 'DISTÂNCIA'
  | 'ZONAS'
  | 'DESAFIOS'
  | 'VELOCIDADE'
  | 'EXPLORAÇÃO'
  | 'CONSISTÊNCIA'
  | 'RANKING'
  | 'COLEÇÃO'
  // Compatibilidade com categorias legadas
  | 'distancia'
  | 'velocidade'
  | 'zonas'
  | 'constancia'
  | 'exploracao'
  | 'noturno'
  | 'especial';

export type AchievementTierType = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';
export type ItemRarity =
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'MYTHIC'
  | 'comum'
  | 'incomum'
  | 'raro'
  | 'epico'
  | 'lendario'
  | 'mitico';

export interface AchievementTier {
  level: number;
  name: string;
  tier: AchievementTierType;
  target: number;
  xpReward: number;
  iconEmoji: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementReward {
  xp?: number;
  medalId?: string;
  medalName?: string;
  medalIcon?: string;
  titleId?: string;
  titleName?: string;
  virtualCoins?: number;
  cosmeticItem?: string;
  rewardItemId?: string;
  rewardItemName?: string;
}

export interface Achievement {
  id: string;
  authId?: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: string;
  progress: number;
  target: number;
  unit?: string;
  unlocked: boolean;
  unlockedAt?: string;
  isSecret?: boolean;
  secretHint?: string;
  reward?: AchievementReward;
  medalId?: string;
  titleId?: string;

  // Campos de compatibilidade
  iconEmoji?: string;
  currentProgress?: number;
  targetProgress?: number;
  isUnlocked?: boolean;
  xpReward?: number;
  currentTierLevel?: number;
  maxTierLevel?: number;
  tiers?: AchievementTier[];
}

export type PersonalAchievement = Achievement;

export interface PlayerMedal {
  id: string;
  authId?: string;
  name: string;
  description: string;
  icon: string;
  rarity: ItemRarity;
  category: AchievementCategory;
  achievementId?: string;
  unlocked: boolean;
  unlockedAt?: string;
  visualGlowColor?: string;
}

export interface PlayerTitle {
  id: string;
  authId?: string;
  name: string;
  description: string;
  category?: AchievementCategory | string;
  rarity: ItemRarity;
  icon?: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
  achievementId?: string;
  isEquipped?: boolean;
}

// ==========================================
// SISTEMA DE CLÃS (THE ROLLING WARS)
// ==========================================
export type ClanRole = 'lider' | 'vice_lider' | 'veterano' | 'membro' | 'recruta';

export interface ClanContribution {
  xpContributed: number;
  kmContributed: number;
  zonesConqueredCount: number;
  routesCompletedCount: number;
  challengesCompletedCount: number;
}

export interface ClanMember {
  id: string;
  authId?: string;
  userId: string;
  name: string;
  nickname: string;
  tag: string;
  avatar: string;
  level: number;
  xp: number;
  totalKm: number;
  role: ClanRole;
  joinedAt: string;
  contribution: ClanContribution;
  controlledZonesCount: number;
  city?: string;
  skateSetup?: {
    model: string;
    wheels: string;
    bearings: string;
  };
}

export interface ClanControlledZone {
  zoneId: string;
  zoneName: string;
  conqueredByMemberName: string;
  dominance: number;
  xpPerHour: number;
}


export type ClanMissionType = 'EXPANSION' | 'WAR' | 'DOMINANCE';

export interface ClanMission {
  id: string;
  type: ClanMissionType;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardXp: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export interface Clan {
  missions?: ClanMission[];
  id: string;
  authId?: string;
  name: string;
  tag?: string; // Ex: "SR", "NR", "SW"
  description?: string;
  symbol?: string; // Emoji or glyph, ex: "🐺", "⚡", "🦅"
  icon?: string;
  color?: string; // Hex color code, ex: "#00FF66"
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  membersCount?: number;
  memberCount?: number;
  memberIds?: string[];
  maxMembers?: number;
  controlledZonesCount?: number;
  territoryScore?: number;
  zonesControlledCount?: number;
  zonesContestedCount?: number;
  rankPosition?: number;
  totalKm?: number;
  leaderId: string;
  leaderName?: string;
  createdAt: any;
  members?: ClanMember[];
  controlledZones?: ClanControlledZone[];
  // Future extensions
  isRecruiting?: boolean;
  minLevelToJoin?: number;
}

export interface ClanCreationInput {
  name: string;
  tag?: string;
  description?: string;
  symbol?: string;
  color?: string;
}

// ==========================================
// DESAFIOS DIRETOS ENTRE JOGADORES (PVP - X1 E X2)
// ==========================================
export type DirectChallengeType = 'corrida' | 'velocidade' | 'precisao' | 'melhor_tempo';

export type DirectChallengeMode = 'x1' | 'x2' | 'multiplayer';

export type DirectChallengeStatus =
  | 'pendente'
  | 'aguardando_participantes'
  | 'negociando'
  | 'confirmado'
  | 'recusado'
  | 'cancelado'
  | 'concluido';

// Limite configurável de adversários por desafio (atualmente: no máximo 2 adversários)
export const MAX_DIRECT_CHALLENGE_OPPONENTS = 2;

// ==========================================
// ESTRUTURA DE DISPUTA AO VIVO NO MAPA (LIVE CHALLENGE)
// ==========================================
export type LiveChallengeStatus =
  | 'WAITING'
  | 'READY'
  | 'ACTIVE'
  | 'FINISHED'
  | 'CANCELLED';

export type LiveChallengeRankingCriteria = 'progress' | 'time' | 'distance' | 'speed';

export interface LiveChallengeParticipant {
  playerId: string;
  name: string;
  nickname: string;
  avatar: string;
  tag?: string;
  color: string; // Ex: '#00FF66' (Jogador A / Verde Neon) e '#F59E0B' (Jogador B / Laranja/Âmbar)
  position: [number, number]; // [lat, lng] atual no mapa
  distance: number; // Distância percorrida em metros
  elapsedTime: number; // Tempo decorrido em segundos
  averageSpeed: number; // Velocidade média em km/h
  maxSpeed: number; // Velocidade máxima em km/h
  progress: number; // Progresso na rota de 0 a 100%
  rankPosition: number; // 1 (1º lugar), 2 (2º lugar)...
  status: 'ready' | 'racing' | 'finished' | 'dnf';
  isCurrentUser?: boolean;
  trailTrack?: [number, number][]; // Rastro próprio percorrido pelo jogador na disputa
}

export interface LiveChallenge {
  id: string;
  authId?: string;
  challengeId: string; // ID do DirectChallenge ou Challenge de origem
  challengeTitle?: string;
  routeId: string;
  routeName: string;
  routePath: [number, number][]; // Percurso/linha de trajeto da disputa
  routeDistanceKm?: number;
  status: LiveChallengeStatus;
  startedAt: number | null; // Timestamp de início
  finishedAt: number | null; // Timestamp de término
  participants: LiveChallengeParticipant[]; // Máximo 2 jogadores no esqueleto atual (expansível para 3, 4, 5...)
  winner: LiveChallengeParticipant | null;
  loser?: LiveChallengeParticipant | null;
  rankingCriteria?: LiveChallengeRankingCriteria;
  xpReward?: number;
  isDemoMode?: boolean;
}

export interface DirectChallengeParticipantResult {
  timeSeconds?: number;
  maxSpeedKmh?: number;
  distanceKm?: number;
  xpEarned?: number;
  rankPosition?: number;
  isWinner?: boolean;
  completedAt?: string;
}

export interface DirectChallengeParticipant {
  playerId: string;
  name: string;
  nickname: string;
  avatar: string;
  tag?: string;
  level?: number;
  crew?: string;
  role: 'challenger' | 'opponent';
  invitationStatus: 'pendente' | 'aceito' | 'recusado';
  joinedAt: string;
  proposedDate?: string;
  proposedTime?: string;
  result?: DirectChallengeParticipantResult;
}

export interface DirectChallengeNegotiation {
  id?: string;
  playerId: string;
  playerName: string;
  playerNickname: string;
  playerAvatar?: string;
  proposedDate: string;
  proposedTime: string;
  timestamp: string; // ISO String
  action: 'create' | 'propose' | 'accept' | 'reject' | 'cancel';
  note?: string;
}

export interface DirectChallenge {
  id: string;
  authId?: string;
  mode: DirectChallengeMode; // 'x1' ou 'x2' (expansível futuramente)
  creatorId: string;
  creatorNickname: string;
  participants: DirectChallengeParticipant[];

  // Campos mantidos para compatibilidade direta com visualizações existentes
  challengerId: string;
  challengerName: string;
  challengerNickname: string;
  challengerAvatar: string;
  challengerTag?: string;
  challengerLevel?: number;
  challengerCrew?: string;

  challengedId: string;
  challengedName: string;
  challengedNickname: string;
  challengedAvatar: string;
  challengedTag?: string;
  challengedLevel?: number;
  challengedCrew?: string;

  routeId: string;
  routeName: string;
  routeDistanceKm: number;
  routeDifficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Insano';
  routeLocation: string;
  routeXp?: number;
  routeIsCircuit?: boolean;
  routeDescription?: string;

  challengeType: DirectChallengeType;
  challengeTypeLabel: string;
  challengeTypeDescription: string;
  challengeTypeIcon: string;

  proposedDate: string; // e.g. "15/08/2026"
  proposedTime: string; // e.g. "19:30"
  status: DirectChallengeStatus;

  lastActionBy: string; // userId who made the last proposal or update
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  negotiationHistory: DirectChallengeNegotiation[];
}

// ==========================================
// ESTRUTURA DE EVENTOS E TORNEIOS (THE ROLLING WARS)
// ==========================================

export type EventType =
  | 'RACE'
  | 'TOURNAMENT'
  | 'ZONE_EVENT'
  | 'TIME_TRIAL'
  | 'SPECIAL_CHALLENGE'
  | 'MISSION';

export type EventStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'REGISTRATION_OPEN'
  | 'ACTIVE'
  | 'FINISHED'
  | 'CANCELLED';

export type EventRegistrationStatus =
  | 'NOT_REGISTERED'
  | 'REGISTERED'
  | 'WAITING_LIST'
  | 'PARTICIPATING'
  | 'FINISHED';

export type EventRuleCriteria =
  | 'lowest_time'
  | 'max_distance'
  | 'max_score'
  | 'first_to_finish'
  | 'zone_dominance'
  | 'knockout';

export type EventRewardType =
  | 'XP'
  | 'TITLE'
  | 'MEDAL'
  | 'COSMETIC'
  | 'BADGE'
  | 'COLLECTIBLE';

export interface EventReward {
  id: string;
  authId?: string;
  type: EventRewardType;
  name: string;
  description: string;
  amount?: number;
  rarity: ItemRarity;
  icon?: string;
  badgeId?: string;
  titleId?: string;
  medalId?: string;
}

export interface EventRules {
  criteria: EventRuleCriteria;
  title: string;
  description: string;
  minLevel?: number;
  timeLimitMinutes?: number;
  requiredDistanceKm?: number;
  requiredCheckpoints?: number;
  allowedSkateTypes?: string[];
  scoringFormula?: string;
}

export interface EventParticipant {
  id: string;
  authId?: string;
  userId: string;
  name: string;
  nickname: string;
  avatar: string;
  tag?: string;
  level: number;
  crew?: string;
  clanTag?: string;
  registrationStatus: EventRegistrationStatus;
  registeredAt: string;
  position?: number;
  points?: number;
  score?: number;
  timeSeconds?: number;
  formattedTime?: string;
  winsCount?: number;
  isCurrentUser?: boolean;
}

export interface TournamentMatch {
  id: string;
  authId?: string;
  roundNumber: number; // 1: Quartas, 2: Semifinal, 3: Final
  roundName: string; // "Quartas de Final", "Semifinal", "Grande Final"
  matchIndex: number;
  player1?: EventParticipant | null;
  player2?: EventParticipant | null;
  winnerId?: string | null;
  winner?: EventParticipant | null;
  status: 'scheduled' | 'in_progress' | 'completed';
  score1?: number;
  score2?: number;
  time1Seconds?: number;
  time2Seconds?: number;
  summary?: string;
}

export interface TournamentRound {
  roundNumber: number;
  name: string; // 'Quartas de Final', 'Semifinal', 'Grande Final'
  matches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  authId?: string;
  eventId: string;
  participants: EventParticipant[];
  rounds: TournamentRound[];
  currentRound: number;
  totalRounds: number;
  winner?: EventParticipant | null;
  runnerUp?: EventParticipant | null;
  thirdPlace?: EventParticipant | null;
  format?: 'single_elimination' | 'double_elimination' | 'round_robin';
}

export interface EventLeaderboardEntry {
  position: number;
  playerId: string;
  name: string;
  nickname: string;
  avatar: string;
  tag?: string;
  crew?: string;
  clanTag?: string;
  points: number;
  wins: number;
  timeFormatted?: string;
  timeSeconds?: number;
  status: 'concluido' | 'na_pista' | 'desqualificado' | 'inscrito';
  isCurrentUser?: boolean;
}

export interface UrbanozeiroEvent {
  id: string;
  authId?: string;
  name: string;
  description: string;
  type: EventType;
  status: EventStatus;
  creatorId: string;
  creatorName?: string;
  creatorAvatar?: string;
  routeId?: string;
  route?: SkateRoute;
  zoneId?: string;
  zone?: Zone;
  locationName: string;
  startAt: string; // ISO ou data formatada
  endAt?: string;
  dateLabel: string; // ex: "Hoje • 19:00", "Amanhã • 15:00"
  timeLabel: string; // ex: "19:00"
  maxParticipants: number;
  currentParticipants: number;
  participants: EventParticipant[];
  rules: EventRules;
  rewards: EventReward[];
  tournament?: Tournament;
  leaderboard?: EventLeaderboardEntry[];
  createdAt: string;
  userRegistrationStatus?: EventRegistrationStatus;
  isSponsored?: boolean;
  sponsorName?: string;
  categoryTag?: string;
}

export type Event = UrbanozeiroEvent;

// ==========================================
// SISTEMA DE PROGRESSÃO DO JOGADOR (THE ROLLING WARS)
// ==========================================

export type RewardType =
  | 'TITLE'
  | 'BADGE'
  | 'MEDAL'
  | 'COSMETIC'
  | 'AVATAR_ITEM'
  | 'SKATE'
  | 'MASCOT'
  | 'STICKER'
  | 'EFFECT'
  | 'COLLECTIBLE'
  | 'PROFILE_FRAME'
  | 'XP';

export interface Reward {
  id: string;
  authId?: string;
  type: RewardType;
  name: string;
  description: string;
  rarity: ItemRarity;
  unlockLevel?: number;
  icon: string;
  image?: string;
  unlockCondition?: string;
  metadata?: Record<string, any>;
}

export type XPSource =
  | 'SESSION_COMPLETED'
  | 'ROUTE_COMPLETED'
  | 'DISPUTE_PARTICIPATION'
  | 'DISPUTE_VICTORY'
  | 'CHALLENGE_PARTICIPATION'
  | 'CHALLENGE_VICTORY'
  | 'EVENT_PARTICIPATION'
  | 'EVENT_VICTORY'
  | 'ZONE_CONQUEST'
  | 'ZONE_DISCOVERY'
  | 'MISSION_COMPLETED'
  | 'RECORD_BROKEN'
  | 'SPECIAL_OBJECTIVE'
  | 'LEVEL_BONUS'
  | string;

export interface XPTransaction {
  id: string;
  authId?: string;
  playerId: string;
  amount: number;
  source: XPSource;
  description: string;
  timestamp: string; // ISO string
  relatedId?: string;
}

export interface LevelDefinition {
  level: number;
  requiredXP: number; // XP necessário para este nível
  cumulativeXP: number;
  title?: string;
  rewards: Reward[];
}

export type InventoryItemStatus = 'UNLOCKED' | 'LOCKED' | 'EQUIPPED';

export type GameItemCategory =
  | 'SKATE'
  | 'SKATES'
  | 'CLOTHING'
  | 'ACCESSORY'
  | 'HELMET'
  | 'PET'
  | 'EFFECT'
  | 'BADGE'
  | 'STICKER'
  | 'PROFILE_FRAME'
  | 'TITLE'
  | 'SPECIAL';

export type InventoryCategory =
  | 'mascotes'
  | 'skates'
  | 'acessorios'
  | 'roupas'
  | 'capacetes'
  | 'efeitos'
  | 'figurinhas'
  | 'emblemas'
  | 'titulos'
  | 'molduras'
  | 'especiais';

export interface GameItem {
  id: string;
  authId?: string;
  name: string;
  description: string;
  category: GameItemCategory | InventoryCategory | string;
  rarity: ItemRarity;
  image?: string;
  icon: string;
  isLimited?: boolean;
  isTradable?: boolean;
  isPurchasable?: boolean;
  virtualPrice?: number;
  currencyType?: 'MOEDAS_URBANAS' | 'CREDITOS' | 'PONTOS_XP';
  unlockRequirement?: string;
  collectionId?: string;
  collectionName?: string;
  season?: string;
  source?: 'LEVEL_REWARD' | 'ACHIEVEMENT' | 'EVENT' | 'SEASON_PASS' | 'MISSION' | 'AD_REWARD' | 'INITIAL' | 'STORE';
  metadata?: {
    visualEffect?: string;
    glowColor?: string;
    animationClass?: string;
    quote?: string;
    badgeEmoji?: string;
    collectorNumber?: number;
    [key: string]: any;
  };
}

export interface PetItem {
  id: string;
  authId?: string;
  name: string;
  image?: string;
  icon: string;
  rarity: ItemRarity;
  description: string;
  ownerId?: string;
  isEquipped?: boolean;
  species?: 'Lobo Urbano' | 'Raposa Neon' | 'Falcão de Rua' | 'Cão de Pista' | 'Droide' | 'Felino' | 'Mítico' | string;
  personalityQuote?: string;
  glowColor?: string;
  acquiredAt?: string;
  source?: string;
}

export interface StickerItem {
  id: string;
  authId?: string;
  name: string;
  image?: string;
  icon: string;
  rarity: ItemRarity;
  collectionId: string;
  collectionName: string;
  number: number; // 01, 02, 03...
  description: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
  unlockCondition?: string;
}

export interface Collection {
  id: string;
  authId?: string;
  name: string;
  description: string;
  image?: string;
  icon?: string;
  season?: string;
  totalItems: number;
  unlockedItemsCount?: number;
  rewardItemId?: string;
  rewardItemName?: string;
  rewardItemIcon?: string;
  isCompleted?: boolean;
  stickers?: StickerItem[];
  items?: (GameItem | PlayerInventoryItem)[];
}

export interface CollectionProgress {
  collectionId: string;
  unlockedCount: number;
  totalCount: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ProfileFrameItem {
  id: string;
  authId?: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  icon?: string;
  borderStyle: string;
  glowColor: string;
  unlockRequirement: string;
  isEquipped?: boolean;
  isUnlocked?: boolean;
}

export interface PlayerInventoryItem {
  id: string;
  authId?: string;
  playerId?: string;
  itemId?: string;
  quantity?: number;
  acquiredAt?: string;
  equipped?: boolean;
  source?: 'LEVEL_REWARD' | 'ACHIEVEMENT' | 'EVENT' | 'SEASON_PASS' | 'MISSION' | 'AD_REWARD' | 'INITIAL' | 'STORE' | string;
  rewardId?: string;
  type: RewardType | GameItemCategory | string;
  name: string;
  description: string;
  rarity: ItemRarity;
  category: InventoryCategory | GameItemCategory | string;
  icon: string;
  image?: string;
  status: InventoryItemStatus;
  unlockedAt?: string;
  isEquipped?: boolean;
  unlockCondition: string;
  unlockLevel?: number;
  collectionId?: string;
  collectionName?: string;
  collectorNumber?: number;
  isLimited?: boolean;
  isPurchasable?: boolean;
  virtualPrice?: number;
  metadata?: {
    visualEffect?: string;
    glowColor?: string;
    animationClass?: string;
    badgeEmoji?: string;
    quote?: string;
    collectorNumber?: number;
    [key: string]: any;
  };
}

export interface EquippedItems {
  titleId?: string;
  titleName?: string;
  skateId?: string;
  skateName?: string;
  skateModel?: string;
  skateImage?: string;
  skateIcon?: string;
  clothingId?: string;
  clothingName?: string;
  accessoryId?: string;
  accessoryName?: string;
  helmetId?: string;
  helmetName?: string;
  mascotId?: string;
  mascotName?: string;
  mascotIcon?: string;
  mascotImage?: string;
  petId?: string;
  petName?: string;
  frameId?: string;
  frameName?: string;
  frameBorderColor?: string;
  effectId?: string;
  effectName?: string;
  badgeId?: string;
  badgeName?: string;
  stickerId?: string;
  stickerName?: string;
  [key: string]: any;
}

export type EquippedCosmetics = EquippedItems;

export interface PlayerInventory {
  id: string;
  authId?: string;
  playerId: string;
  items: PlayerInventoryItem[];
  equipped: EquippedItems;
  lastUpdatedAt: string;
}

export interface PlayerProgression {
  playerId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  progressionPercentage: number;
  unlockedRewardsCount: number;
  equippedItems: EquippedCosmetics;
  xpHistory: XPTransaction[];
  inventory: PlayerInventoryItem[];
  collections?: Collection[];
}

// ==========================================
// SISTEMA SOCIAL DE JOGADORES (THE ROLLING WARS)
// ==========================================

export type PlayerRelationshipType = 'FOLLOW' | 'FRIEND' | 'BLOCK' | 'REQUEST';

export type PlayerRelationshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';

export interface PlayerRelationship {
  id: string;
  authId?: string;
  fromPlayerId: string;
  toPlayerId: string;
  type: PlayerRelationshipType;
  status: PlayerRelationshipStatus;
  createdAt: string;
  updatedAt: string;
}

export type PlayerSocialStatus = 'ONLINE' | 'OFFLINE' | 'ACTIVE_SKATING' | 'INACTIVE';

export interface PlayerPrivacySettings {
  appearInNearby: boolean;
  showStats: boolean;
  allowFriendRequests: boolean;
  allowChallengeInvites: boolean;
  showActivity: boolean;
}

export type PlayerReportReason =
  | 'ABUSE'
  | 'HARASSMENT'
  | 'CHEATING'
  | 'SPAM'
  | 'INAPPROPRIATE_BEHAVIOR'
  | 'OTHER';

export interface PlayerReport {
  id: string;
  authId?: string;
  reporterId: string;
  reportedPlayerId: string;
  reason: PlayerReportReason;
  description: string;
  relatedId?: string;
  status: 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED' | 'PENDING' | 'REVIEWED';
  createdAt: string;
}

export interface SocialPlayer {
  id: string;
  authId?: string;
  name: string;
  nickname: string;
  tag: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp?: number;
  crew?: string;
  city?: string;
  activeTitle?: string;
  status: PlayerSocialStatus;
  statusLabel?: string;
  isNearby?: boolean;
  approximateDistanceMeters?: number;
  approximateDistanceLabel?: string;
  isFriend?: boolean;
  isFollowing?: boolean;
  isBlocked?: boolean;
  friendRequestStatus?: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED';
  followersCount: number;
  followingCount: number;
  zonesControlled: number;
  controlledZoneNames?: string[];
  totalKm: number;
  weeklyKm?: number;
  monthlyKm?: number;
  streakDays?: number;
  challengesCount?: number;
  challengeWins?: number;
  achievementsCount?: number;
  medalsCount?: number;
  skateSetup?: {
    model: string;
    wheels: string;
    bearings: string;
  };
  privacySettings?: PlayerPrivacySettings;
  commonContext?: string;
}

export interface PlayerPublicActivity {
  syncStatus?: 'pending' | 'synced' | 'error';
  id: string;
  authId?: string;
  playerId: string;
  playerNickname: string;
  playerAvatar: string;
  type: 'ZONE_CONQUERED' | 'ROUTE_COMPLETED' | 'CHALLENGE_WON' | 'LEVEL_UP' | 'MEDAL_EARNED';
  description: string;
  targetName?: string;
  timestamp: string;
  timeAgo: string;
}

// ==========================================
// ECONOMIA VIRTUAL INTERNA DO JOGO (THE ROLLING WARS VIRTUAL ECONOMY)
// ==========================================

export type CurrencyTransactionType =
  | 'EARN'
  | 'SPEND'
  | 'BONUS'
  | 'ADJUSTMENT'
  | 'REVERSAL';

export type CurrencySource =
  | 'MISSION'
  | 'CHALLENGE'
  | 'DISPUTE_WIN'
  | 'EVENT'
  | 'TOURNAMENT'
  | 'ACHIEVEMENT'
  | 'ZONE_CONQUEST'
  | 'SESSION'
  | 'SEASON_REWARD'
  | 'SPECIAL_REWARD'
  | 'REWARDED_AD'
  | 'COSMETIC_PURCHASE'
  | 'ADMIN_ADJUSTMENT'
  | 'REVERSAL'
  | 'INITIAL_BONUS'
  | string;

export interface CurrencyTransaction {
  id: string;
  authId?: string;
  playerId: string;
  type: CurrencyTransactionType;
  amount: number; // Valor da movimentação
  balanceAfter: number;
  source: CurrencySource;
  description: string;
  relatedId?: string;
  timestamp: string; // ISO string
  metadata?: Record<string, any>;
}

export interface VirtualWallet {
  id: string;
  authId?: string;
  playerId: string;
  currencyName: string; // Nome temporário: 'moedas' (estruturado para alteração futura)
  currencySymbol: string; // Símbolo visual: '🪙'
  balance: number; // Saldo de moedas virtuais
  totalEarned: number; // Total acumulado ganho
  totalSpent: number; // Total acumulado gasto
  transactions: CurrencyTransaction[];
  createdAt: string;
  updatedAt: string;
  lastTransactionAt?: string;
}

export interface WalletOperationResult {
  success: boolean;
  message: string;
  wallet?: VirtualWallet;
  transaction?: CurrencyTransaction;
  error?: string;
}

// ==========================================
// SISTEMA DE ENERGIA 1.0 (THE ROLLING WARS)
// ==========================================

export type ActiveEnergySourceType =
  | 'CONSUMPTION_SESSION'
  | 'DAILY_FREE_RECHARGE'
  | 'REWARDED_AD_RECHARGE';

// Fontes futuras reservadas na arquitetura (permanecem estritamente DESATIVADAS na Energia 1.0)
export type FutureEnergySourceType =
  | 'REST_ZONE_RECHARGE'
  | 'CLAN_BONUS'
  | 'ENERGY_ITEM'
  | 'SPONSOR_REWARD';

export type EnergyTransactionType = ActiveEnergySourceType | FutureEnergySourceType;

export interface UserEnergy {
  current: number; // 0 a 100
  max: number; // Capacidade máxima oficial da versão 1.0: 100% (90 minutos)
  dailyFreeRechargeUsed: boolean;
  dailyRewardedAdsUsed: number; // 0 a 5 por período diário
  dailyPeriodKey: string; // Formato 'YYYY-MM-DD' gerado autoritativamente no servidor
  lastUpdatedServerTime?: any;
  version: number;
}

export interface EnergyTransaction {
  id: string;
  playerId: string;
  type: EnergyTransactionType;
  amount: number; // Negativo para consumo (-X) ou positivo para recarga (+X)
  balanceAfter: number;
  sourceId?: string; // sessionId ou ID do evento de anúncio / recarga diária
  description?: string;
  createdAt: any;
}

// ==========================================
// SEGURANÇA, MODERAÇÃO E INTEGRIDADE DO JOGO (SECURITY & INTEGRITY)
// ==========================================

export type PlayerAccountStatus = 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';

export type SecurityEventType =
  | 'GPS_ANOMALY'
  | 'SPEED_ANOMALY'
  | 'LOCATION_JUMP'
  | 'DUPLICATE_REWARD'
  | 'DUPLICATE_TRANSACTION'
  | 'SUSPICIOUS_SESSION'
  | 'SUSPICIOUS_CHALLENGE'
  | 'SPAM'
  | 'REPORT'
  | 'OTHER';

export type SecuritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SecurityEventStatus = 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';

export interface SecurityEvent {
  id: string;
  authId?: string;
  playerId: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  relatedId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  status: SecurityEventStatus;
}

export type AuditActionType =
  | 'PLAYER_CREATED'
  | 'ZONE_CREATED'
  | 'ZONE_CONQUERED'
  | 'CHALLENGE_CREATED'
  | 'CHALLENGE_COMPLETED'
  | 'REWARD_GRANTED'
  | 'CURRENCY_TRANSACTION'
  | 'REPORT_CREATED'
  | 'SECURITY_FLAG_RAISED'
  | 'PLAYER_BLOCKED'
  | 'XP_GRANTED'
  | string;

export interface AuditLog {
  id: string;
  authId?: string;
  actorId: string;
  action: AuditActionType;
  targetType: string;
  targetId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SecurityIntegrityState {
  accountStatus: PlayerAccountStatus;
  isTrusted: boolean;
  securityEvents: SecurityEvent[];
  auditLogs: AuditLog[];
  claimedRewardKeys: string[];
}

// ==========================================
// FEED E CENTRAL DE ATIVIDADES (ACTIVITY FEED & CENTER)
// ==========================================

export type ActivityType =
  | 'TEXT_POST'
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'PHOTO_POST'
  | 'ROUTE_SHARED'
  | 'SESSION_COMPLETED'
  | 'ROUTE_COMPLETED'
  | 'ZONE_CONQUERED'
  | 'ZONE_LOST'
  | 'CHALLENGE_STARTED'
  | 'CHALLENGE_COMPLETED'
  | 'CHALLENGE_WON'
  | 'EVENT_COMPLETED'
  | 'TOURNAMENT_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'LEVEL_UP'
  | 'MISSION_COMPLETED'
  | 'REWARD_UNLOCKED'
  | 'COLLECTION_COMPLETED'
  | 'SEASON_RESULT'
  | 'RECORD_BROKEN';

export type ActivityVisibility = 'PUBLIC' | 'FRIENDS' | 'FOLLOWERS' | 'PRIVATE';

export type ActivityFilterType =
  | 'TODAS'
  | 'MEUS_AMIGOS'
  | 'SEGUINDO'
  | 'MINHAS_ATIVIDADES'
  | 'CONQUISTAS'
  | 'DESAFIOS'
  | 'EVENTOS';

export interface Activity {
  id: string;
  authId?: string;
  playerId: string;
  playerNickname?: string;
  playerAvatar?: string;
  playerTag?: string;
  playerLevel?: number;
  type: ActivityType;
  visibility: ActivityVisibility;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  mediaUrl?: string;
  relatedId?: string;
  createdAt: string;
  // Estruturas preparadas para interação futura
  likesCount?: number;
  hasLiked?: boolean;
  commentsCount?: number;
  reactions?: Record<string, number>;
  // Flags contextuais
  isOwnActivity?: boolean;
  isFriend?: boolean;
  isFollowing?: boolean;
}

// ==========================================
// SISTEMA DE ESTATÍSTICAS DO JOGADOR (THE ROLLING WARS)
// ==========================================
export type StatPeriod = 'TOTAL' | 'HOJE' | 'SEMANA' | 'MES' | 'TEMPORADA';

export interface GeneralStatistics {
  totalDistanceKm: number;
  totalDurationSeconds: number;
  totalSessionsCount: number;
  maxSpeedKmH: number;
  avgSpeedKmH: number | null;
  routesCompletedCount: number;
  zonesConqueredCount: number;
  disputesCount: number;
  victoriesCount: number;
  challengesCount: number;
  challengesWonCount: number;
  eventsCompletedCount: number;
  tournamentsCompletedCount: number;
  achievementsUnlockedCount: number;
}

export interface ZoneStatistics {
  zonesConquered: number;
  zonesLost: number;
  disputesWon: number;
  bestCaptureTimeSeconds: number | null;
  bestCaptureTimeFormatted: string | null;
  consecutiveConquests: number | null;
}

export interface ChallengeStatistics {
  challengesTotal: number;
  wins: number;
  losses: number;
  draws: number;
  winRatePct: number | null;
}

export interface SkatingStatistics {
  totalDistanceKm: number;
  totalDurationSeconds: number;
  maxSessionDistanceKm: number;
  maxSessionSpeedKmH: number;
  maxSessionDurationSeconds: number;
  sessionsCount: number;
}

export interface PlayerRecords {
  maxDistanceKm: number;
  maxSpeedKmH: number;
  bestRouteTimeSeconds: number | null;
  bestRouteTimeFormatted: string | null;
  bestCaptureTimeSeconds: number | null;
  bestCaptureTimeFormatted: string | null;
  maxStreakDays: number;
}

export interface ProgressionStatistics {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressPct: number;
  xpRemaining: number;
  totalXpAccumulated: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
  unlockedTitlesCount: number;
  unlockedRewardsCount: number;
}

export interface PlayerFullStatistics {
  period: StatPeriod;
  general: GeneralStatistics;
  zones: ZoneStatistics;
  challenges: ChallengeStatistics;
  skating: SkatingStatistics;
  records: PlayerRecords;
  progression: ProgressionStatistics;
}

// ==========================================
// SISTEMA DE BUSCA E DESCOBERTA (THE ROLLING WARS)
// ==========================================
export type SearchFilterType = 'TODOS' | 'JOGADORES' | 'ZONAS' | 'ROTAS';

export type SearchResultCategory = 'JOGADORES' | 'ZONAS' | 'ROTAS';

export interface PlayerSearchResult {
  type: 'player';
  id: string;
  authId?: string;
  name: string;
  nickname: string;
  tag: string;
  avatar: string;
  level: number;
  activeTitle?: string;
  crew?: string;
  city?: string;
  totalKm?: number;
  zonesControlled?: number;
  streakDays?: number;
  isFriend?: boolean;
  isFollowing?: boolean;
  isBlocked?: boolean;
  status?: string;
  statusLabel?: string;
  approximateDistanceLabel?: string;
  rawPlayer: SocialPlayer | RankPlayer | any;
}

export interface ZoneSearchResult {
  type: 'zone';
  id: string;
  authId?: string;
  name: string;
  category?: string;
  zoneType: ZoneType;
  status: ZoneStatus;
  color: string;
  controllerName?: string;
  controllerNickname?: string;
  controllerAvatar?: string;
  controllerLevel?: number;
  controllerCrew?: string;
  dominancePercent: number;
  skatersCount: number;
  referencePoint: string;
  surface: string;
  distanceFromUserFormatted?: string;
  isContested?: boolean;
  rawZone: Zone;
}

export interface RouteSearchResult {
  type: 'route';
  id: string;
  authId?: string;
  name: string;
  distanceKm: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Insano';
  location: string;
  estimatedTimeMin: number;
  asphaltQuality: string;
  tags: string[];
  points: number;
  creatorName?: string;
  bestRecordFormatted?: string;
  isCircuit?: boolean;
  rawRoute: SkateRoute;
}

export interface SearchResultsAggregated {
  query: string;
  filter: SearchFilterType;
  totalResultsCount: number;
  players: PlayerSearchResult[];
  zones: ZoneSearchResult[];
  routes: RouteSearchResult[];
  suggestions: {
    recentPlayers: PlayerSearchResult[];
    nearbyZones: ZoneSearchResult[];
    popularRoutes: RouteSearchResult[];
  };
}

// ==========================================
// SISTEMA DE CONFIGURAÇÕES DO JOGADOR (THE ROLLING WARS)
// ==========================================
export type SettingsCategory =
  | 'CONTA'
  | 'PRIVACIDADE'
  | 'NOTIFICACOES'
  | 'JOGO'
  | 'MAPA'
  | 'APARENCIA'
  | 'SOM_E_VIBRACAO'
  | 'SEGURANCA'
  | 'SOBRE';

export type ChallengePermission = 'EVERYONE' | 'FRIENDS_ONLY' | 'NOBODY';
export type AppThemeSetting = 'DARK' | 'LIGHT' | 'SYSTEM';
export type MapThemeSetting = 'DARK' | 'LIGHT' | 'AUTO';
export type AccentColorSetting = 'NEON_GREEN' | 'CYAN' | 'AMBER' | 'PURPLE';

export interface AccountSettings {
  email: string;
  phone?: string;
  registeredSince: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface PrivacySettingsConfig {
  isProfilePublic: boolean;
  showActivityInFeed: boolean;
  showStatsOnProfile: boolean;
  appearInNearbyRadar: boolean;
  allowFriendRequests: boolean;
  challengePermission: ChallengePermission;
}

export interface NotificationPreferences {
  enablePushNotifications: boolean;
  notifyZoneConquest: boolean;
  notifyDirectChallenges: boolean;
  notifyAchievements: boolean;
  notifyEvents: boolean;
  notifyMissions: boolean;
  notifySocialActivities: boolean;
}

export interface GameplayPreferences {
  confirmBeforeZoneCapture: boolean;
  showProximityAlerts: boolean;
  showInGameTutorialTips: boolean;
  enableInterfaceEffects: boolean;
  autoRecenterMap: boolean;
}

export interface MapPreferences {
  mapTheme: MapThemeSetting;
  defaultZoom: number;
  showZonesOnMap: boolean;
  showRoutesOnMap: boolean;
  showOtherSkatersOnMap: boolean;
  showHeatmapTrails: boolean;
}

export interface AppearancePreferences {
  appTheme: AppThemeSetting;
  accentColor: AccentColorSetting;
  compactMode: boolean;
}

export interface AudioHapticsPreferences {
  soundEffectsEnabled: boolean;
  soundVolume: number; // 0 a 100
  vibrationEnabled: boolean;
  vibrateOnZoneEntry: boolean;
  vibrateOnAchievement: boolean;
}

export interface SecurityPreferences {
  biometricLock: boolean;
  autoLockTimeoutMin: number;
  dataCollectionConsent: boolean;
}

export interface AppAboutInfo {
  appVersion: string;
  buildNumber: string;
  releaseDate: string;
  engineVersion: string;
  supportEmail: string;
  termsUrl: string;
  privacyPolicyUrl: string;
}

export interface PlayerSettings {
  account: AccountSettings;
  privacy: PrivacySettingsConfig;
  notifications: NotificationPreferences;
  gameplay: GameplayPreferences;
  map: MapPreferences;
  appearance: AppearancePreferences;
  audioHaptics: AudioHapticsPreferences;
  security: SecurityPreferences;
  about: AppAboutInfo;
}









// --- ONBOARDING & TUTORIAL ---
export interface TutorialState {
  isCompleted: boolean;
  isSkipped: boolean;
  currentStep: number;
}

export interface BugReport {
  id: string;
  authId?: string;
  playerId: string;
  category: 'GPS' | 'MAPA' | 'ZONA' | 'DESAFIO' | 'ROTA' | 'PERFIL' | 'NOTIFICAÇÃO' | 'OUTRO';
  description: string;
  relatedFeature?: string;
  createdAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface Feedback {
  id: string;
  authId?: string;
  playerId: string;
  type: 'SUGGESTION' | 'COMPLAINT' | 'PRAISE' | 'OTHER';
  message: string;
  createdAt: string;
  status: 'NEW' | 'REVIEWED' | 'ACTIONED';
}

// ==========================================
// ESTRUTURAS DE PAGINAÇÃO E PREPARAÇÃO PARA FIRESTORE
// ==========================================
export interface PaginatedResult<T> {
  data: T[];
  lastDocId?: string; // Cursor para a próxima página
  hasMore: boolean;   // Indica se existem mais registros
}

export interface SegmentAttempt {
  segmentId: string;
  status: 'approaching' | 'active' | 'finished' | 'aborted';
  direction: 'forward' | 'reverse';
  startTime: number;
  startPointIndex: number;
  trackPoints: ActivityTrackPoint[];
  distanceCovered: number;
  durationMs?: number;
}

export interface SegmentOperation {
  operationId: string;
  attemptId: string;
  segmentId: string;
  playerId: string;
  playerName?: string;
  createdAt: number;
  durationMs: number;
  timeSeconds: number;
  averageSpeedKmH: number;
  maxSpeedKmH: number;
  direction: 'forward' | 'reverse';
  trackPoints: ActivityTrackPoint[];
  retryCount: number;
  syncStatus: 'pending' | 'error' | 'synced';
  validationStatus?: 'pending_validation' | 'validated' | 'rejected';
  validation?: any;
}

export type ChestStatus = 'locked' | 'available' | 'opened';
export type ChestType = 'bronze' | 'silver' | 'gold' | 'epic' | 'legendary';

export interface ChestReward {
  type: 'currency' | 'seasonXp' | 'clanXp' | 'cosmeticUnlock' | 'chest';
  amount?: number;
  cosmeticId?: string;
  name?: string;
}

export interface Chest {
  id: string;
  userId: string;
  type: ChestType;
  source: string;
  sourceId: string;
  seasonId?: string;
  status: ChestStatus;
  createdAt: string;
  openedAt?: string;
  rewardTransactionId?: string;
  rewards?: ChestReward[];
}


export type CosmeticCategory = 'avatar_frame' | 'avatar_effect' | 'profile_badge' | 'trail_cosmetic' | 'clan_emblem' | 'title';
export type CosmeticRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  price: number;
  rarity: CosmeticRarity;
  seasonId?: string;
  isActive: boolean;
  visualKey: string;
}

export interface InventoryItem {
  itemId: string;
  acquiredAt: string;
  source: string;
  seasonId?: string;
  purchaseId?: string;
}

export interface OfficialTitle {
  id: string;
  name: string;
  description: string;
  rarity: CosmeticRarity;
  seasonId?: string;
  requirementType: string;
  requirementValue: number;
  isActive: boolean;
}

export interface ProfileCosmetics {
  avatar_frame?: string;
  avatar_effect?: string;
  profile_badge?: string;
  trail_cosmetic?: string;
  clan_emblem?: string;
  title?: string;
}
