import React, { useState, useMemo } from 'react';
import {
  X,
  Activity as ActivityIcon,
  Flame,
  Trophy,
  Swords,
  Shield,
  Zap,
  Users,
  Eye,
  Lock,
  Compass,
  ArrowRight,
  Filter,
  Sparkles,
  Heart, MessageSquare, Share2,
  ChevronDown,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  Activity,
  ActivityFilterType,
  ActivityType,
  ActivityVisibility,
  UserProfile,
  SocialPlayer,
} from '../types';
import {
  filterActivities,
  formatActivityTimeAgo,
  getActivityIcon,
  getActivityStyle,
} from '../data/activityData';

interface ActivityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activities: Activity[];
  onToggleLike?: (activityId: string) => void;
  onSelectPlayer?: (playerId: string) => void;
  onOpenZone?: (zoneId?: string) => void;
  onOpenChallenge?: (challengeId?: string) => void;
  onOpenEvent?: (eventId?: string) => void;
  onOpenAchievements?: () => void;
  onRedoRoute?: (activityId: string, metadata: any) => void;
  friendIds?: string[];
  followingIds?: string[];
  blockedIds?: string[];
  initialFilter?: ActivityFilterType;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const ActivityFeedModal: React.FC<ActivityFeedModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activities,
  onToggleLike,
  onSelectPlayer,
  onOpenZone,
  onOpenChallenge,
  onOpenEvent,
  onOpenAchievements,
  onRedoRoute,
  friendIds = ['p_streetfox', 'p_urbanskater'],
  followingIds = ['p_streetfox', 'p_bladerunner', 'p_shadow'],
  blockedIds = [],
  initialFilter = 'TODAS',
  onLoadMore,
  hasMore = false,
  isLoading = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<ActivityFilterType>(initialFilter);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const filterOptions: { id: ActivityFilterType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'TODAS', label: 'TODAS', icon: ActivityIcon },
    { id: 'MEUS_AMIGOS', label: 'AMIGOS', icon: Users },
    { id: 'SEGUINDO', label: 'SEGUINDO', icon: Compass },
    { id: 'MINHAS_ATIVIDADES', label: 'MINHAS', icon: Flame },
    { id: 'CONQUISTAS', label: 'CONQUISTAS', icon: Trophy },
    { id: 'DESAFIOS', label: 'DESAFIOS', icon: Swords },
    { id: 'EVENTOS', label: 'EVENTOS', icon: Calendar },
  ];

  const filteredActivities = useMemo(() => {
    const list = filterActivities(
      activities,
      activeFilter,
      currentUser.id,
      friendIds,
      followingIds,
      blockedIds
    );
    // Ordenação estrita: mais recentes primeiro
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities, activeFilter, currentUser.id, friendIds, followingIds, blockedIds]);

  const pagedActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  // O hasMore agora vêm das props (Server-side/Paginated) ou faz fallback para local
  const localHasMore = visibleCount < filteredActivities.length;
  const showLoadMore = hasMore || localHasMore;

  const handleLoadMore = () => {
    if (localHasMore) {
      setVisibleCount((prev) => prev + 6);
    } else if (onLoadMore) {
      onLoadMore();
    }
  };

  const getVisibilityBadge = (visibility: ActivityVisibility) => {
    switch (visibility) {
      case 'PUBLIC':
        return (
          <span className="flex items-center gap-1 text-[9px] font-mono-stat text-neutral-400">
            <Eye className="w-2.5 h-2.5 text-neutral-400" />
            PÚBLICO
          </span>
        );
      case 'FRIENDS':
        return (
          <span className="flex items-center gap-1 text-[9px] font-mono-stat text-yellow-400">
            <Users className="w-2.5 h-2.5 text-yellow-400" />
            AMIGOS
          </span>
        );
      case 'FOLLOWERS':
        return (
          <span className="flex items-center gap-1 text-[9px] font-mono-stat text-cyan-400">
            <Compass className="w-2.5 h-2.5 text-cyan-400" />
            SEGUIDORES
          </span>
        );
      case 'PRIVATE':
        return (
          <span className="flex items-center gap-1 text-[9px] font-mono-stat text-amber-400">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            PRIVADO
          </span>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="activity-feed-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#070b10] border-2 border-yellow-500/40 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0d141e] via-[#091119] to-[#0d141e] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              <ActivityIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-display uppercase tracking-wider">
                  CENTRAL DE ATIVIDADES
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-yellow-400/20 text-emerald-300 border border-yellow-400/40 text-[9px] font-mono-stat font-bold">
                  FEED
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Acontecimentos e conquistas recentes da comunidade urbana
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-activity-feed"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar Central de Atividades"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Bar */}
        <div className="px-3 py-2.5 bg-[#090e15] border-b border-white/10 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          {filterOptions.map((f) => {
            const isActive = activeFilter === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                id={`filter-btn-${f.id.toLowerCase()}`}
                onClick={() => {
                  setActiveFilter(f.id);
                  setVisibleCount(8);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase font-mono-stat transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Activities List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3">
          {pagedActivities.length > 0 ? (
            pagedActivities.map((act) => {
              const style = getActivityStyle(act.type);
              const icon = getActivityIcon(act.type);
              const isOwner = act.playerId === currentUser.id || act.isOwnActivity;

              return (
                <div
                  key={act.id}
                  id={`activity-card-${act.id}`}
                  className={`p-3.5 rounded-2xl bg-[#0d141e] border ${style.borderColor} hover:border-yellow-400/50 transition-all shadow-md relative overflow-hidden`}
                >
                  {/* Top Bar: Author, Level & Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      onClick={() => !isOwner && onSelectPlayer && onSelectPlayer(act.playerId)}
                      className={`flex items-center gap-2.5 min-w-0 ${
                        !isOwner && onSelectPlayer ? 'cursor-pointer hover:opacity-90' : ''
                      }`}
                    >
                      <img
                        src={
                          isOwner
                            ? currentUser.avatar
                            : act.playerAvatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={isOwner ? currentUser.nickname : act.playerNickname || 'Patinador'}
                        className="w-9 h-9 rounded-xl object-cover border border-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white uppercase font-display truncate">
                            {isOwner ? 'Você' : act.playerNickname || 'Patinador'}
                          </h4>
                          {act.playerTag && (
                            <span className="text-[10px] text-neutral-400 font-mono-stat">
                              {act.playerTag}
                            </span>
                          )}
                          {isOwner && (
                            <span className="px-1.5 py-0.2 rounded bg-yellow-500/20 text-emerald-300 text-[8px] font-bold font-mono-stat border border-yellow-500/40">
                              VOCÊ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono-stat">
                          <span>LVL {isOwner ? currentUser.level : act.playerLevel || 1}</span>
                          <span>•</span>
                          <span>{formatActivityTimeAgo(act.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Visibility Badge */}
                    <div className="shrink-0">{getVisibilityBadge(act.visibility)}</div>
                  </div>

                  {/* Activity Body */}
                  <div className="mt-1 pl-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0">{icon}</span>
                      <h5 className={`text-xs font-black uppercase font-display ${style.accentColor}`}>
                        {act.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans pl-6">
                      {act.description}
                    </p>

                    {/* Contextual Badges / Metadata preview */}
                    {/* Route Preview Map Placeholder */}
                    {act.metadata?.trackPreview && act.metadata.trackPreview.length > 0 && (
                      <div className="mt-2 pl-6">
                        <div className="h-24 w-full bg-[#111824] rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                           <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                           <Compass className="w-8 h-8 text-yellow-500/50" />
                           <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-end">
                             {onRedoRoute && (
                               <button 
                                 onClick={() => onRedoRoute(act.id, act.metadata)}
                                 className="px-2 py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-bold rounded cursor-pointer uppercase font-display"
                               >
                                 Refazer Rota
                               </button>
                             )}
                           </div>
                        </div>
                      </div>
                    )}

                    {act.metadata && (
                      <div className="flex flex-wrap gap-1.5 pt-1 pl-6">
                        {act.metadata.zoneName && (
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-emerald-300 text-[10px] font-mono-stat font-bold">
                            📍 {act.metadata.zoneName}
                          </span>
                        )}
                        {act.metadata.dominancePercent && (
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-emerald-300 text-[10px] font-mono-stat font-bold">
                            Domínio {act.metadata.dominancePercent}%
                          </span>
                        )}
                        {act.metadata.maxSpeedKmH && (
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono-stat font-bold">
                            ⚡ {act.metadata.maxSpeedKmH} km/h
                          </span>
                        )}
                        {act.metadata.rewardXP && (
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-[10px] font-mono-stat font-bold">
                            +{act.metadata.rewardXP} XP
                          </span>
                        )}
                        {act.metadata.rewardCoins && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono-stat font-bold">
                            🪙 +{act.metadata.rewardCoins}
                          </span>
                        )}
                        {act.metadata.distanceKm && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-white/10 text-neutral-300 text-[10px] font-mono-stat">
                            🛹 {act.metadata.distanceKm} km
                          </span>
                        )}
                        {act.metadata.tournamentName && (
                          <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono-stat font-bold">
                            👑 {act.metadata.tournamentName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Interactive Row */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    {/* Left Actions: Like, Comment, Share & Reactions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        id={`btn-like-activity-${act.id}`}
                        onClick={() => onToggleLike && onToggleLike(act.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer ${
                          act.hasLiked
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${act.hasLiked ? 'fill-current' : ''}`} />
                        <span>{act.likesCount || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const c = prompt('Escreva seu comentário:');
                          if (c) alert('Comentário mockado enviado com sucesso!');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{act.commentsCount || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert('Estrutura de compartilhamento preparada. Mock ativado.');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Display reaction emojis if available */}
                      {act.reactions && Object.keys(act.reactions).length > 0 && (
                        <div className="flex items-center gap-1 ml-1">
                          {Object.entries(act.reactions).map(([emoji, count]) => (
                            <span
                              key={emoji}
                              className="px-1.5 py-0.5 rounded-lg bg-white/5 text-[10px] font-mono-stat text-neutral-300 flex items-center gap-1"
                            >
                              <span>{emoji}</span>
                              <span className="text-[9px] text-neutral-400 font-bold">{count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Action: Contextual Action Button (e.g., Open Zone, Achievements, Profile) */}
                    <div className="flex items-center gap-1.5">
                      
                      {act.type === 'SESSION_COMPLETED' && act.relatedId && onRedoRoute && (
                        <button
                          type="button"
                          onClick={() => {
                            onRedoRoute(act.id, act.metadata);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/40 text-neutral-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>VER ATIVIDADE</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {act.type === 'ROUTE_SHARED' && act.metadata && act.metadata.routeId && onRedoRoute && (
                        <button
                          type="button"
                          onClick={() => {
                            onRedoRoute(act.id, act.metadata);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>VER ROTA</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {act.type.includes('ZONE') && act.relatedId && onOpenZone && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenZone(act.relatedId);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/40 text-emerald-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>VER ZONA</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {act.type.includes('CHALLENGE') && act.relatedId && onOpenChallenge && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenChallenge(act.relatedId);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>VER DESAFIO</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {(act.type === 'EVENT_COMPLETED' || act.type === 'TOURNAMENT_COMPLETED') && act.relatedId && onOpenEvent && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenEvent(act.relatedId);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>VER EVENTO</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {act.type === 'ACHIEVEMENT_UNLOCKED' && onOpenAchievements && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenAchievements();
                          }}
                          className="px-2.5 py-1 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/40 text-yellow-300 text-[10px] font-bold uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>TROFÉUS</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-[#0d141e] border border-white/10 rounded-2xl space-y-2">
              <ActivityIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-300 uppercase font-mono-stat">
                Nenhuma atividade encontrada
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Não há acontecimentos registrados para o filtro selecionado no momento.
              </p>
            </div>
          )}

          {/* Pagination: Load More */}
          {showLoadMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                id="btn-load-more-activities"
                onClick={handleLoadMore}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-black uppercase font-mono-stat text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Carregar mais atividades ({filteredActivities.length - visibleCount} restantes)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer with Privacy Notice */}
        <div className="p-3 bg-[#080d14] border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-neutral-400 font-mono-stat">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Lock className="w-3 h-3 text-yellow-400 shrink-0" />
            <span className="truncate">
              Privacidade: Apenas resumos e conquistas esportivas públicas são exibidas.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat shrink-0 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
