import React, { useState } from 'react';
import {
  X,
  Shield,
  MapPin,
  Activity,
  Flame,
  Compass,
  Disc,
  Swords,
  Trophy,
  Award,
  Crown,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Ban,
  Flag,
  Share2,
  Lock,
  Radio,
MessageSquare } from 'lucide-react';
import { RankPlayer, RankingPeriod, SocialPlayer, UserProfile } from '../types';

interface PublicProfileModalProps {
  onMessage?: (userId: string) => void;
  player: (RankPlayer | SocialPlayer) | null;
  period?: RankingPeriod;
  currentUser?: UserProfile;
  onClose: () => void;
  onSendChallenge?: (player: any) => void;
  onToggleFollow?: (playerId: string) => void;
  onSendFriendRequest?: (playerId: string) => void;
  onAcceptFriendRequest?: (playerId: string) => void;
  onRemoveFriend?: (playerId: string) => void;
  onBlockPlayer?: (playerId: string) => void;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  onUnblockPlayer?: (playerId: string) => void;
  onOpenReportModal?: (player: any) => void;
  isFollowing?: boolean;
  isFriend?: boolean;
  friendRequestStatus?: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED';
  isBlocked?: boolean;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  player,
  period = 'semanal',
  currentUser,
  onClose,
  onSendChallenge,
  onToggleFollow,
  onMessage,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onRemoveFriend,
  onBlockPlayer,
  onOpenFollowers,
  onOpenFollowing,
  onUnblockPlayer,
  onOpenReportModal,
  isFollowing = false,
  isFriend = false,
  friendRequestStatus = 'NONE',
  isBlocked = false,
}) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  if (!player) return null;

  const isOwnProfile =
    (player as any).isCurrentUser ||
    (currentUser && (player.nickname === currentUser.nickname || player.tag === currentUser.tag));

  const currentXp = player.xp || (player as any).points || 1000;
  const targetXp = player.nextLevelXp || Math.round(currentXp * 1.3);
  const xpProgress = Math.min(100, Math.round((currentXp / targetXp) * 100));

  const activeTitle =
    player.activeTitle ||
    (player.level >= 20 ? 'Lenda Urbana' : player.level >= 15 ? 'Velocista de Elite' : 'Patinador Urbano');
  const achievementsCount =
    player.achievementsCount || (player.level >= 20 ? 18 : player.level >= 15 ? 12 : 5);
  const medalsCount = player.medalsCount || achievementsCount;
  const totalKm = (player as any).totalKm || (player as any).weeklyKm * 10 || 120.0;
  const zonesControlled = (player as any).zonesControlled || 0;
  const followersCount = (player as any).followersCount || 128;
  const followingCount = (player as any).followingCount || 74;
  const status = (player as any).status || 'ONLINE';
  const approximateDistanceLabel = (player as any).approximateDistanceLabel;

  const handleChallengeClick = () => {
    if (onSendChallenge) {
      onSendChallenge(player);
    }
  };

  const handleBlockToggle = () => {
    if (isBlocked) {
      if (onUnblockPlayer && player.id) onUnblockPlayer(player.id);
    } else {
      setShowBlockConfirm(true);
    }
  };

  const confirmBlock = () => {
    if (onBlockPlayer && player.id) {
      onBlockPlayer(player.id);
    }
    setShowBlockConfirm(false);
  };

  return (
    <div
      id="modal-public-profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85  animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#090e15] border-2 border-yellow-500/60 shadow-[0_0_40px_rgba(0,255,102,0.25)] overflow-hidden flex flex-col max-h-[92vh] text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="relative p-5 pb-3 bg-gradient-to-b from-emerald-950/40 via-[#0a121c] to-[#090e15] border-b border-white/10">
          {/* Top Actions: Block, Report, Close */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {!isOwnProfile && (
              <>
                <button
                  type="button"
                  id="btn-report-player-header"
                  onClick={() => onOpenReportModal && onOpenReportModal(player)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                  title="Denunciar jogador"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  id="btn-block-player-header"
                  onClick={handleBlockToggle}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isBlocked
                      ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                      : 'bg-white/10 hover:bg-red-500/20 text-neutral-400 hover:text-red-400'
                  }`}
                  title={isBlocked ? 'Desbloquear jogador' : 'Bloquear jogador'}
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              id="btn-close-public-profile"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Fechar perfil"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badges: Status & Ranking/Distance */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 pr-20">
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/60 text-yellow-400 text-[10px] font-black uppercase font-mono-stat tracking-wider">
              {isOwnProfile ? 'MEU PERFIL' : 'PERFIL PÚBLICO'}
            </span>

            {/* Social Activity Indicator */}
            {status === 'ACTIVE_SKATING' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-[10px] font-black uppercase font-mono-stat">
                <span>🛼</span>
                <span>PATINANDO</span>
              </span>
            ) : status === 'ONLINE' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-400 text-[10px] font-black uppercase font-mono-stat">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#00ff66]" />
                <span>ONLINE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-neutral-400 text-[10px] font-bold uppercase font-mono-stat">
                <span>OFFLINE</span>
              </span>
            )}

            {approximateDistanceLabel && !isOwnProfile && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-bold font-mono-stat">
                📍 ~{approximateDistanceLabel}
              </span>
            )}
          </div>

          {/* Avatar and Essential Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-[0_0_20px_rgba(0,255,102,0.5)] bg-[#0c141f]">
                <img
                  src={player.avatar}
                  alt={player.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-black border border-yellow-400 text-[9px] font-black text-yellow-400 font-mono-stat">
                NV {player.level}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-white uppercase font-display tracking-tight truncate">
                {player.nickname}
              </h3>

              {/* Title Badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-[9px] font-black text-amber-300 font-mono-stat uppercase tracking-wide my-0.5">
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                <span className="truncate max-w-[140px]">{activeTitle}</span>
              </div>

              <p className="text-xs text-neutral-400 font-medium truncate">
                {player.name || player.nickname}{' '}
                <span className="text-yellow-400/80 font-mono-stat">{player.tag || '#000'}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-300 font-mono-stat">
                <span className="text-yellow-400 font-bold truncate max-w-[100px]">{player.crew || 'Sem Crew'}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-neutral-400 truncate">
                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                  {player.city || 'São Paulo, SP'}
                </span>
              </div>
            </div>
          </div>

          {/* Social Stats: Followers & Following Counter */}
          <div className="grid grid-cols-2 gap-2 mt-3 p-2 rounded-2xl bg-black/40 border border-white/5 text-center">
            <div onClick={onOpenFollowers} className="cursor-pointer hover:bg-white/5 rounded-xl transition-colors py-1">
              <span className="text-sm font-black text-white font-mono-stat">{followersCount}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono-stat block">
                Seguidores
              </span>
            </div>
            <div onClick={onOpenFollowing} className="cursor-pointer hover:bg-white/5 rounded-xl transition-colors py-1">
              <span className="text-sm font-black text-white font-mono-stat">{followingCount}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono-stat block">
                Seguindo
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-3 pt-2.5 border-t border-white/10">
            <div className="flex justify-between text-[10px] font-bold font-mono-stat mb-1">
              <span className="text-neutral-400 uppercase">PROGRESSO DE NÍVEL</span>
              <span className="text-yellow-400">
                {currentXp} / {targetXp} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_#00ff66]"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Block Confirmation Banner */}
        {showBlockConfirm && (
          <div className="p-3 bg-red-950/90 border-y border-red-500/50 flex flex-col gap-2 animate-in fade-in">
            <div className="text-xs font-bold text-red-200">
              Bloquear <strong>{player.nickname}</strong>? Vocês não poderão enviar desafios ou interagir no aplicativo.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white hover:bg-white/20"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBlock}
                className="flex-1 py-1.5 rounded-lg bg-red-600 text-xs font-black text-white hover:bg-red-500"
              >
                Confirmar Bloqueio
              </button>
            </div>
          </div>
        )}

        {isBlocked ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white uppercase font-display">
              JOGADOR BLOQUEADO
            </h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Você bloqueou as interações com este patinador. Informações privadas e desafios estão ocultos.
            </p>
            <button
              onClick={handleBlockToggle}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat"
            >
              Desbloquear Jogador
            </button>
          </div>
        ) : (
          /* Scrollable Content Details */
          <div className="p-4 space-y-3.5 overflow-y-auto max-h-[50vh]">
            {/* Key Metric Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-[#0d141e] border border-white/10 text-center">
                <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono-stat">
                  TOTAL KM
                </div>
                <div className="text-sm font-black text-cyan-300 font-mono-stat mt-0.5">
                  {typeof totalKm === 'number' ? totalKm.toFixed(1) : totalKm}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#0d141e] border border-white/10 text-center">
                <Shield className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono-stat">
                  ZONAS
                </div>
                <div className="text-sm font-black text-yellow-400 font-mono-stat mt-0.5">
                  {zonesControlled}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#0d141e] border border-white/10 text-center">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono-stat">
                  VITÓRIAS
                </div>
                <div className="text-sm font-black text-amber-400 font-mono-stat mt-0.5">
                  {(player as any).challengeWins || (player as any).challengesCount || 0}
                </div>
              </div>
            </div>

            {/* Achievements & Medals */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0d141e] border border-yellow-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                <div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono-stat">
                    CONQUISTAS
                  </div>
                  <div className="text-xs font-black text-white font-mono-stat">
                    {achievementsCount} Desbloqueadas
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono-stat">
                    MEDALHAS
                  </div>
                  <div className="text-xs font-black text-cyan-300 font-mono-stat">
                    {medalsCount} 🏅 Forjadas
                  </div>
                </div>
              </div>
            </div>

            {/* Controlled Zones List */}
            <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10">
              <div className="flex items-center gap-1.5 mb-2">
                <Shield className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono-stat">
                  TERRITÓRIOS CONQUISTADOS ({zonesControlled})
                </span>
              </div>
              {(player as any).controlledZoneNames && (player as any).controlledZoneNames.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {(player as any).controlledZoneNames.map((zoneName: string, index: number) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-yellow-500/40 text-emerald-300 text-xs font-bold font-mono-stat"
                    >
                      🚩 {zoneName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  Nenhum território dominado no momento.
                </p>
              )}
            </div>

            {/* Skate Gear / Setup */}
            {player.skateSetup && (
              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <Disc className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono-stat">
                    SETUP DE PATINS & EQUIPAMENTOS
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono-stat">
                  <div className="flex justify-between py-0.5 border-b border-white/5">
                    <span className="text-neutral-400">PATINS:</span>
                    <span className="font-bold text-white text-right truncate max-w-[170px]">
                      {player.skateSetup.model}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-white/5">
                    <span className="text-neutral-400">RODAS:</span>
                    <span className="font-bold text-cyan-300 text-right truncate max-w-[170px]">
                      {player.skateSetup.wheels}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-400">ROLAMENTOS:</span>
                    <span className="font-bold text-amber-300 text-right truncate max-w-[170px]">
                      {player.skateSetup.bearings}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3 bg-[#080c12] border-t border-white/10 space-y-2">
          {!isOwnProfile && !isBlocked && (
            <div className="grid grid-cols-2 gap-2">
              {/* Message Button */}
              {onMessage && (
                <button
                  type="button"
                  id="btn-social-message"
                  onClick={() => onMessage(player.id || 'usr_unknown')}
                  className="col-span-2 py-2 px-3 mb-1 rounded-xl font-bold text-xs uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-500/30"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>MENSAGEM</span>
                </button>
              )}
              {/* Follow Button */}
              {onToggleFollow && (
                <button
                  type="button"
                  id="btn-social-follow"
                  onClick={() => onToggleFollow(player.id || 'usr_unknown')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFollowing
                      ? 'bg-yellow-500/20 border border-yellow-400/50 text-emerald-300 hover:bg-yellow-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
                      <span>SEGUINDO</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>SEGUIR</span>
                    </>
                  )}
                </button>
              )}

              {/* Friend Button */}
              {isFriend ? (
                <button
                  type="button"
                  id="btn-social-remove-friend"
                  onClick={() => onRemoveFriend && onRemoveFriend(player.id || 'usr_unknown')}
                  className="py-2 px-3 rounded-xl bg-emerald-950/40 border border-yellow-500/40 text-emerald-300 text-xs font-bold font-mono-stat uppercase tracking-wider hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Clique para desfazer amizade"
                >
                  <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
                  <span>AMIGOS ✓</span>
                </button>
              ) : friendRequestStatus === 'PENDING_SENT' ? (
                <button
                  type="button"
                  id="btn-social-request-sent"
                  disabled
                  className="py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono-stat uppercase tracking-wider opacity-90 flex items-center justify-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>ENVIADA</span>
                </button>
              ) : friendRequestStatus === 'PENDING_RECEIVED' ? (
                <button
                  type="button"
                  id="btn-social-accept-friend"
                  onClick={() => onAcceptFriendRequest && onAcceptFriendRequest(player.id || 'usr_unknown')}
                  className="py-2 px-3 rounded-xl bg-yellow-500 text-black text-xs font-black font-mono-stat uppercase tracking-wider hover:bg-yellow-400 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_#00ff66]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ACEITAR</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-social-add-friend"
                  onClick={() => onSendFriendRequest && onSendFriendRequest(player.id || 'usr_unknown')}
                  className="py-2 px-3 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-emerald-300 hover:bg-yellow-400/25 text-xs font-bold font-mono-stat uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ADICIONAR</span>
                </button>
              )}
            </div>
          )}

          {/* Primary Action: Send Challenge or Close */}
          {!isOwnProfile && !isBlocked && onSendChallenge ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-close-profile-secondary"
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat tracking-wider transition-all"
              >
                Fechar
              </button>

              <button
                id="btn-enviar-desafio-perfil"
                onClick={handleChallengeClick}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00ff66] hover:from-emerald-300 hover:to-yellow-400 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_18px_rgba(0,255,102,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>ENVIAR DESAFIO</span>
              </button>
            </div>
          ) : (
            <button
              id="btn-close-profile-main"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat tracking-wider transition-all"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
