import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';
import { SocialPlayer } from '../types';
import { SocialService } from '../services/social';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: string;
  currentUserId: string;
  mode: 'followers' | 'following';
  onSelectPlayer: (player: SocialPlayer) => void;
  onToggleFollow: (playerId: string) => void;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  title,
  userId,
  currentUserId,
  mode,
  onSelectPlayer,
  onToggleFollow
}) => {
  const [players, setPlayers] = useState<SocialPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const fetchList = async () => {
        try {
          let list: SocialPlayer[] = [];
          if (mode === 'followers') {
            list = await SocialService.getFollowers(userId, currentUserId);
          } else {
            list = await SocialService.getFollowing(userId, currentUserId);
          }
          setPlayers(list);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchList();
    } else {
      setPlayers([]);
    }
  }, [isOpen, userId, currentUserId, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-[85vh] max-h-[600px] rounded-3xl bg-[#090e15] border-2 border-yellow-500/40 shadow-[0_0_50px_rgba(0,255,102,0.25)] flex flex-col relative overflow-hidden text-left">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0c121a]">
          <h2 className="text-base font-black text-white font-display uppercase tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-neutral-400 font-medium py-10">
              Carregando...
            </div>
          ) : players.length === 0 ? (
            <div className="text-center text-neutral-400 font-medium py-10">
              Nenhum jogador encontrado.
            </div>
          ) : (
            players.map(player => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#0c121a] border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                onClick={() => onSelectPlayer(player)}
              >
                <img
                  src={player.avatar}
                  alt={player.nickname}
                  className="w-12 h-12 rounded-xl bg-[#1a2332] object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{player.name}</div>
                  <div className="text-xs text-neutral-400 font-mono-stat">{player.nickname}</div>
                </div>
                {player.id !== currentUserId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(player.id);
                      // optimistic update
                      setPlayers(prev => prev.map(p => {
                        if (p.id === player.id) {
                           return { ...p, isFollowing: !p.isFollowing };
                        }
                        return p;
                      }));
                    }}
                    className={`shrink-0 p-2 rounded-xl border ${
                      player.isFollowing
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    {player.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
