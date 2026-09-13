import { Activity, ActivityFilterType, ActivityType } from '../types';

export const INITIAL_ACTIVITIES: Activity[] = [];

export const filterActivities = (
  activities: Activity[], 
  filter: ActivityFilterType, 
  currentUserId: string,
  friendIds?: string[],
  followingIds?: string[],
  blockedIds?: string[]
): Activity[] => {
  if (filter === 'TODAS') return activities;
  if (filter === 'MINHAS_ATIVIDADES') return activities.filter(a => a.playerId === currentUserId || a.isOwnActivity);
  // Basic fallback for other filters if not fully implemented in mock
  return activities;
};

export const formatActivityTimeAgo = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} d`;
};

export const getActivityIcon = (type: ActivityType | string): string => {
  switch(type) {
    case 'ZONE_CONQUERED': return '👑';
    case 'ROUTE_COMPLETED': return '🛹';
    case 'CHALLENGE_WON': return '⚔️';
    case 'MEDAL_EARNED': return '🎖️';
    case 'NEW_FOLLOWER': return '👥';
    case 'TEXT': return '💬';
    case 'IMAGE': return '📸';
    case 'VIDEO': return '🎥';
    default: return '🛹';
  }
};

export const getActivityStyle = (type: ActivityType | string): { borderColor: string; accentColor: string } => {
  switch(type) {
    case 'ZONE_CONQUERED': return { borderColor: 'border-yellow-400/30', accentColor: 'text-yellow-400' };
    case 'ROUTE_COMPLETED': return { borderColor: 'border-emerald-400/30', accentColor: 'text-emerald-400' };
    case 'CHALLENGE_WON': return { borderColor: 'border-rose-400/30', accentColor: 'text-rose-400' };
    case 'MEDAL_EARNED': return { borderColor: 'border-amber-400/30', accentColor: 'text-amber-400' };
    default: return { borderColor: 'border-slate-400/30', accentColor: 'text-slate-300' };
  }
};
