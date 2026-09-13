import { Activity, ActivityType, ActivityVisibility, UserProfile, SkateSession, PaginatedResult } from '../types';

const ACTIVITIES_DB_KEY = 'urbanozeiro_activities';

export const FeedService = {
  getActivitiesDB(): Activity[] {
    try {
      const data = localStorage.getItem(ACTIVITIES_DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveActivitiesDB(db: Activity[]) {
    localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(db));
  },

  createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>): Activity {
    const db = this.getActivitiesDB();
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      hasLiked: false,
      commentsCount: 0,
      reactions: {},
    };
    db.unshift(newActivity); // Add to beginning (most recent)
    this.saveActivitiesDB(db);
    return newActivity;
  },

  createSkateSessionActivity(session: SkateSession, user: UserProfile): Activity {
    return this.createActivity({
      playerId: user.id,
      authId: user.authId,
      playerNickname: user.nickname,
      playerAvatar: user.avatar,
      playerTag: user.tag,
      playerLevel: user.level,
      type: 'SESSION_COMPLETED',
      visibility: 'PUBLIC',
      title: 'Sessão Concluída',
      description: `${user.nickname} completou uma sessão de patinação de ${session.distanceKm.toFixed(1)} km.`,
      metadata: {
        distanceKm: session.distanceKm,
        durationSeconds: session.durationSeconds,
        maxSpeedKmH: session.maxSpeedKmH,
        avgSpeedKmH: session.avgSpeedKmH,
        xpEarned: session.xpEarned,
        zonesConqueredCount: session.zonesConquered?.length || 0,
        trackPreview: session.track,
      },
      relatedId: session.id,
      isOwnActivity: true,
    });
  },

  createChallengeActivity(challenge: any, user: UserProfile, isWinner: boolean): Activity {
    const oppName = challenge.loser?.nickname || 'Adversário';
    const wonText = isWinner ? 'venceu' : 'participou de';
    const typeText = isWinner ? 'CHALLENGE_WON' : 'CHALLENGE_COMPLETED';
    
    return this.createActivity({
      playerId: user.id,
      authId: user.authId,
      playerNickname: user.nickname,
      playerAvatar: user.avatar,
      playerTag: user.tag,
      playerLevel: user.level,
      type: typeText,
      visibility: 'PUBLIC',
      title: 'Desafio',
      description: `${user.nickname} ${wonText} um duelo contra ${oppName} em ${challenge.routeName}.`,
      metadata: {
        opponentNickname: oppName,
        challengeType: 'X1',
        rewardXP: isWinner ? (challenge.xpReward || 350) : 0,
        distanceKm: challenge.routeDistanceKm,
        trackPreview: challenge.routePath,
      },
      relatedId: challenge.id,
      isOwnActivity: true,
    });
  },

  createZoneConqueredActivity(zoneName: string, zoneId: string, user: UserProfile, dominancePercent: number): Activity {
    return this.createActivity({
      playerId: user.id,
      authId: user.authId,
      playerNickname: user.nickname,
      playerAvatar: user.avatar,
      playerTag: user.tag,
      playerLevel: user.level,
      type: 'ZONE_CONQUERED',
      visibility: 'PUBLIC',
      title: 'Zona Conquistada',
      description: `${user.nickname} dominou a zona ${zoneName}!`,
      metadata: {
        zoneName,
        zoneId,
        dominancePercent,
      },
      relatedId: zoneId,
      isOwnActivity: true,
    });
  },

  getFeed(currentUserId: string, followingIds: string[]): Activity[] {
    const db = this.getActivitiesDB();
    
    // Tag activities contextually
    return db.map(act => ({
      ...act,
      isOwnActivity: act.playerId === currentUserId,
      isFollowing: followingIds.includes(act.playerId),
    }));
  },
  
  getFollowingFeed(currentUserId: string, followingIds: string[]): Activity[] {
    return this.getFeed(currentUserId, followingIds).filter(
      act => act.isOwnActivity || act.isFollowing
    );
  },

  

  // ============================================================================
  // MÉTODOS OTIMIZADOS E PAGINADOS (Preparação para Firestore)
  // ============================================================================
  
  /**
   * Obtém o feed principal com paginação
   */
  async getFeedPaginated(
    currentUserId: string, 
    followingIds: string[], 
    pageSize: number = 10, 
    lastDocId?: string
  ): Promise<PaginatedResult<Activity>> {
    // Simulando latência de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let allActivities = this.getFeed(currentUserId, followingIds);
    
    // Simula ordenação do Firestore por 'createdAt' DESC
    allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    let startIndex = 0;
    if (lastDocId) {
      const lastIndex = allActivities.findIndex(act => act.id === lastDocId);
      if (lastIndex !== -1) {
        startIndex = lastIndex + 1;
      }
    }
    
    const paginatedSlice = allActivities.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < allActivities.length;
    
    return {
      data: paginatedSlice,
      lastDocId: paginatedSlice.length > 0 ? paginatedSlice[paginatedSlice.length - 1].id : undefined,
      hasMore
    };
  },
  
  /**
   * Obtém feed de quem o usuário segue, com paginação
   */
  async getFollowingFeedPaginated(
    currentUserId: string, 
    followingIds: string[], 
    pageSize: number = 10, 
    lastDocId?: string
  ): Promise<PaginatedResult<Activity>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let allActivities = this.getFollowingFeed(currentUserId, followingIds);
    allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    let startIndex = 0;
    if (lastDocId) {
      const lastIndex = allActivities.findIndex(act => act.id === lastDocId);
      if (lastIndex !== -1) {
        startIndex = lastIndex + 1;
      }
    }
    
    const paginatedSlice = allActivities.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < allActivities.length;
    
    return {
      data: paginatedSlice,
      lastDocId: paginatedSlice.length > 0 ? paginatedSlice[paginatedSlice.length - 1].id : undefined,
      hasMore
    };
  },

  seedMockActivitiesIfEmpty(user: UserProfile) {
    const db = this.getActivitiesDB();
    if (db.length === 0) {
      const mocks: Activity[] = [
        {
          id: 'act_mock_1',
          playerId: 'usr_mock_fox',
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
          },
          relatedId: 'zone_roosevelt',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likesCount: 14,
          hasLiked: false,
          reactions: { '🔥': 8, '🛹': 6 },
        },
        {
          id: 'act_mock_2',
          playerId: 'usr_mock_blade',
          playerNickname: 'BladeRunner',
          playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          playerTag: '#BLADE',
          playerLevel: 18,
          type: 'SESSION_COMPLETED',
          visibility: 'PUBLIC',
          title: 'Sessão Épica',
          description: 'BladeRunner completou uma sessão noturna intensa.',
          metadata: {
            distanceKm: 15.4,
            durationSeconds: 3600,
            maxSpeedKmH: 42.5,
            avgSpeedKmH: 15.4,
            xpEarned: 450,
            zonesConqueredCount: 2,
          },
          createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          likesCount: 32,
          hasLiked: true,
          reactions: { '⚡': 12, '🏆': 5 },
        }
      ];
      this.saveActivitiesDB(mocks);
    }
  }
};
