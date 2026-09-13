import React, { useState, useMemo } from 'react';
import { Share } from '@capacitor/share';
import { Camera, Video, X, User, Activity as ActivityIcon, Trophy, Swords, Calendar, Layers, Users, Compass, Heart, MessageSquare, Share2, ChevronDown, Lock, Eye, ArrowRight, Filter, ChevronLeft } from 'lucide-react';
import { publishPost } from '../lib/feedService';
import { Activity, ActivityFilterType, UserProfile, RankPlayer, Clan, Zone, Challenge, UrbanozeiroEvent } from '../types';

interface FeedViewProps {
  currentUser: UserProfile;
  activities: Activity[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  onClose?: () => void;
  onToggleLike?: (activityId: string) => void;
  onAddComment?: (activityId: string, text: string) => void;
  onSelectPlayer?: (playerId: string) => void;
  onOpenZone?: (zoneId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
  onOpenEvent?: (eventId: string) => void;
  onOpenAchievements?: () => void;
  onNewPost?: (post: Activity) => void;
  onRedoRoute?: (activityId: string, metadata: any) => void;
  friendIds?: string[];
  followingIds?: string[];
  blockedIds?: string[];
  initialFilter?: ActivityFilterType;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  activities,
  hasMore = false,
  onLoadMore,
  isLoading = false,
  onClose,
  onToggleLike,
  onAddComment,
  onSelectPlayer,
  onOpenZone,
  onOpenChallenge,
  onOpenEvent,
  onOpenAchievements,
  onNewPost,
  onRedoRoute,
  friendIds = [],
  followingIds = [],
  blockedIds = [],
  initialFilter = "TODAS",
}) => {
  const [activeFilter, setActiveFilter] = useState<ActivityFilterType>(initialFilter || "TODAS");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const filters: { id: ActivityFilterType; label: string; icon: React.ElementType }[] = [
    { id: 'TODAS', label: 'TODAS', icon: Layers },
    { id: 'MEUS_AMIGOS', label: 'AMIGOS', icon: Users },
    { id: 'SEGUINDO', label: 'SEGUINDO', icon: Compass },
    { id: 'MINHAS_ATIVIDADES', label: 'MINHAS', icon: User },
    { id: 'DESAFIOS', label: 'DESAFIOS', icon: Swords },
    { id: 'EVENTOS', label: 'EVENTOS', icon: Calendar },
  ];

  // Helper arrays for filtering

  const filteredActivities = useMemo(() => {
    let list = activities.filter((act) => !blockedIds.includes(act.playerId));

    switch (activeFilter) {
      case 'MEUS_AMIGOS':
        list = list.filter((act) => friendIds.includes(act.playerId) || act.playerId === currentUser.id);
        break;
      case 'SEGUINDO':
        list = list.filter((act) => followingIds.includes(act.playerId) || act.playerId === currentUser.id);
        break;
      case 'MINHAS_ATIVIDADES':
        list = list.filter((act) => act.playerId === currentUser.id);
        break;
      case 'DESAFIOS':
        list = list.filter((act) => act.type.includes('CHALLENGE'));
        break;
      case 'EVENTOS':
        list = list.filter((act) => act.type.includes('EVENT') || act.type.includes('TOURNAMENT'));
        break;
      default:
        break;
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities, activeFilter, currentUser.id, friendIds, followingIds, blockedIds]);

  const pagedActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  const localHasMore = visibleCount < filteredActivities.length;
  const showLoadMore = hasMore || localHasMore;

  const handleLoadMore = () => {
    if (localHasMore) {
      setVisibleCount((prev) => prev + 6);
    } else if (onLoadMore) {
      onLoadMore();
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return (
          <span className="flex items-center gap-1 text-[9px] font-mono-stat text-slate-400">
            <Eye className="w-2.5 h-2.5 text-slate-400" />
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
      default:
        return null;
    }
  };


  const handlePublish = async () => {
    if (!postText.trim() && !mediaFile) return;
    
    try {
      setIsPublishing(true);
      const newPost = await publishPost(postText, mediaFile, currentUser);
      
      // Update UI
      if (onNewPost) {
        onNewPost(newPost);
      }
      
      // Clear form
      setPostText('');
      clearMedia();
      setIsComposerOpen(false);
    } catch (e) {
      console.error("Error publishing post:", e);
      alert("Erro ao publicar. Verifique sua conexão.");
    } finally {
      setIsPublishing(false);
    }
  };

  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };


  return (
    <div className="absolute inset-0 z-50 w-full h-full flex flex-col bg-[#070b10] text-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#0a0a0a] via-[#091119] to-[#0a0a0a] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (onClose) onClose(); }} className="p-1.5 -ml-1.5 mr-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-base font-black text-white font-display uppercase tracking-wider">FEED</h3>
        </div>
        <button onClick={() => setIsFiltersOpen(true)} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="text-[10px] font-bold font-mono-stat uppercase">{activeFilter}</span>
        </button>
      </div>

      {/* Post Creation Area */}
      <div className="p-4 bg-[#0a0a0a] border-b border-white/10 flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setIsComposerOpen(true)}>
        <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
        <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-slate-400 font-medium">
          O que você está pensando?
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 pb-24">
        {pagedActivities.length > 0 ? (
          pagedActivities.map((act) => {
            const isOwner = act.playerId === currentUser.id;
            return (
              <div key={act.id} className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-yellow-400/50 transition-all shadow-md relative overflow-hidden">
                {/* Top Bar: Author & Metadata */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => !isOwner && onSelectPlayer && onSelectPlayer(act.playerId)}>
                    <img src={isOwner ? currentUser.avatar : act.playerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} alt="Avatar" className="w-9 h-9 rounded-xl border border-white/20 object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate font-display">{isOwner ? currentUser.nickname : act.playerNickname || 'Patinador'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                        <span>{new Date(act.createdAt).toLocaleString()}</span>
                        {getVisibilityBadge(act.visibility || 'PUBLIC')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-2 mb-3">
                  <h4 className="text-sm font-bold text-white leading-snug">{act.title}</h4>
                  {act.description && (
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{act.description}</p>
                  )}
                  
                  {act.mediaUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      {act.type === 'VIDEO' ? (
                        <video src={act.mediaUrl} controls className="w-full max-h-[400px] object-contain" />
                      ) : (
                        <img src={act.mediaUrl} alt="Post media" className="w-full max-h-[400px] object-cover" loading="lazy" />
                      )}
                    </div>
                  )}
                  {act.metadata && (

                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {act.metadata.distanceKm && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 text-[10px] font-mono-stat">
                          🛹 {act.metadata.distanceKm} km
                        </span>
                      )}
                      {act.metadata.durationFormatted && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 text-[10px] font-mono-stat">
                          ⏱️ {act.metadata.durationFormatted}
                        </span>
                      )}
                      {act.metadata.avgSpeedKmH && (
                        <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono-stat font-bold">
                          ⚡ {act.metadata.avgSpeedKmH} km/h (Méd)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Interactive Row */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onToggleLike && onToggleLike(act.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer ${act.hasLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'}`}>
                      <Heart className={`w-3.5 h-3.5 ${act.hasLiked ? 'fill-current' : ''}`} />
                      <span>{act.likesCount || 0}</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{act.commentsCount || 0}</span>
                    </button>
                    <button type="button" onClick={async () => {
                      try {
                        if (window.navigator && window.navigator.share) {
                          await window.navigator.share({ title: act.title, text: act.description, url: 'https://therollingwars.com/activity/' + act.id });
                        }
                      } catch (e) {
                        console.warn('Share error', e);
                      }
                    }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black font-mono-stat transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-[#0a0a0a] border border-white/10 rounded-2xl space-y-4 mt-8">
            <ActivityIcon className="w-12 h-12 text-yellow-500/40 mx-auto" />
            <div>
              <h4 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">O Feed está vazio</h4>
              <p className="text-sm text-slate-400 mt-2">Comece uma conversa ou compartilhe uma foto da sua sessão.</p>
            </div>
            <button onClick={() => setIsComposerOpen(true)} className="px-5 py-2.5 bg-yellow-500 text-black font-bold uppercase font-mono-stat text-[11px] rounded-xl hover:bg-yellow-400">
              Criar Publicação
            </button>
          </div>
        )}

        {showLoadMore && pagedActivities.length > 0 && (
          <div className="pt-2 text-center">
            <button type="button" onClick={handleLoadMore} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-black uppercase font-mono-stat text-slate-300 hover:text-white transition-all flex items-center gap-1.5 mx-auto cursor-pointer">
              <ChevronDown className="w-4 h-4" />
              <span>Carregar mais</span>
            </button>
          </div>
        )}
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col justify-end">
          <div className="bg-[#0a0a0a] rounded-t-3xl p-4 h-[90vh] flex flex-col animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <button onClick={() => setIsComposerOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">Cancelar</button>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Nova Publicação</h3>
              <button disabled={isPublishing} onClick={handlePublish} className="bg-yellow-500 text-black px-4 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50">{isPublishing ? "Publicando..." : "Publicar"}</button>
            </div>
            
            
            <div className="flex gap-3 mb-4">
              <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
              <div className="flex-1 flex flex-col gap-2">
                <textarea 
                  autoFocus
                  placeholder="O que você está pensando?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-transparent border-none text-white text-base resize-none focus:ring-0 focus:outline-none placeholder:text-slate-500 min-h-[100px]"
                />
                
                {mediaPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 mt-2">
                    <button 
                      onClick={clearMedia}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 text-white z-10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {mediaFile?.type.startsWith('video') ? (
                      <video src={mediaPreview} controls className="w-full max-h-[300px] object-contain" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="w-full max-h-[300px] object-contain" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto border-t border-white/10 pt-4 flex gap-3">
              <label htmlFor="image-upload" className={`flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-yellow-500/20 cursor-pointer ${isPublishing ? 'opacity-50 pointer-events-none' : ''}`}>
                <Camera className="w-5 h-5" /> Foto
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </label>
              <label htmlFor="video-upload" className={`flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-yellow-500/20 cursor-pointer ${isPublishing ? 'opacity-50 pointer-events-none' : ''}`}>
                <Video className="w-5 h-5" /> Vídeo
                <input 
                  id="video-upload"
                  type="file" 
                  accept="video/*"
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Lateral Filters Drawer */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-black/60 " onClick={() => setIsFiltersOpen(false)} />
          <div className="relative w-64 bg-[#091119] h-full flex flex-col border-r border-white/10 animate-in slide-in-from-left-8">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Filtros do Feed</h3>
              <button onClick={() => setIsFiltersOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {filters.map((f) => {
                const isActive = activeFilter === f.id;
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setVisibleCount(8);
                      setIsFiltersOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold font-mono-stat uppercase">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
