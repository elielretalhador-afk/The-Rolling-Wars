import { PlayerPrivacySettings, SocialPlayer, PlayerRelationship, PlayerPublicActivity } from '../types';

export const DEFAULT_PLAYER_PRIVACY_SETTINGS: PlayerPrivacySettings = {
  appearInNearby: true,
  showStats: true,
  allowFriendRequests: true,
  allowChallengeInvites: true,
  showActivity: true,
};

export const INITIAL_SOCIAL_PLAYERS: SocialPlayer[] = [];
export const INITIAL_PLAYER_RELATIONSHIPS: PlayerRelationship[] = [];
export const INITIAL_PUBLIC_ACTIVITIES: PlayerPublicActivity[] = [];
