import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  UserCheck,
  Search,
  MapPin,
  Radio,
  Swords,
  Shield,
  Crown,
  Flame,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Compass,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  PlayerPrivacySettings,
  PlayerPublicActivity,
  PlayerRelationship,
  RankPlayer,
  SocialPlayer,
  UserProfile,
} from '../types';

export type SocialTabType = 'amigos' | 'proximos' | 'sugestoes' | 'solicitacoes' | 'buscar' | 'atividade';

interface SocialHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  players: SocialPlayer[];
  relationships: PlayerRelationship[];
  publicActivities: PlayerPublicActivity[];
  privacySettings: PlayerPrivacySettings;
  onUpdatePrivacySettings: (settings: PlayerPrivacySettings) => void;
  onSelectPlayer: (player: SocialPlayer) => void;
  onSendChallenge: (player: SocialPlayer) => void;
  onSendFriendRequest: (playerId: string) => void;
  onAcceptFriendRequest: (playerId: string) => void;
  onDeclineFriendRequest: (playerId: string) => void;
  onCancelFriendRequest: (playerId: string) => void;
  onRemoveFriend: (playerId: string) => void;
  onToggleFollow: (playerId: string) => void;
  onOpenActivityFeed?: () => void;
  initialTab?: SocialTabType;
}

export const SocialHubModal: React.FC<SocialHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  players,
  relationships,
  publicActivities,
  privacySettings,
  onUpdatePrivacySettings,
  onSelectPlayer,
  onSendChallenge,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onCancelFriendRequest,
  onRemoveFriend,
  onToggleFollow,
  onOpenActivityFeed,
  initialTab = 'amigos',
}) => {
  const [activeTab, setActiveTab] = useState<SocialTabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivacyConfig, setShowPrivacyConfig] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return players.filter(
      (p) =>
        !p.isBlocked &&
        (p.nickname.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          (p.crew && p.crew.toLowerCase().includes(q)))
    );
  }, [players, searchQuery]);

  if (!isOpen) return null;

  // Derive filtered player subsets
  const friends = players.filter((p) => p.isFriend && !p.isBlocked);
  const nearbyPlayers = players.filter(
    (p) => p.approximateDistanceMeters !== undefined && !p.isBlocked
  );
  const suggestions = players.filter(
    (p) => !p.isFriend && p.friendRequestStatus !== 'PENDING_SENT' && !p.isBlocked
  );
  const receivedRequests = players.filter(
    (p) => p.friendRequestStatus === 'PENDING_RECEIVED' && !p.isBlocked
  );
  const sentRequests = players.filter(
    (p) => p.friendRequestStatus === 'PENDING_SENT' && !p.isBlocked
  );

  const totalPendingRequests = receivedRequests.length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE_SKATING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[9px] font-black uppercase font-mono-stat shrink-0">
            <span>🛼</span>
            <span>PATINANDO</span>
          </span>
        );
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-400 text-[9px] font-black uppercase font-mono-stat shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#00ff66]" />
            <span>ONLINE</span>
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-bold uppercase font-mono-stat shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>INATIVO</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-neutral-400 text-[9px] font-bold uppercase font-mono-stat shrink-0">
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  return (
    <div
      id="modal-social-hub"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#090e15] border-2 border-yellow-500/50 shadow-[0_0_50px_rgba(0,255,102,0.2)] overflow-hidden flex flex-col h-[88vh] text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-b from-[#0e1724] via-[#0b121c] to-[#090e15] border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-400 shadow-[0_0_15px_rgba(0,255,102,0.25)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase font-display tracking-tight flex items-center gap-2">
                  <span>CENTRAL SOCIAL</span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[9px] font-black font-mono-stat border border-yellow-400/30">
                    ESQUELETO URBANO
                  </span>
                </h2>
                <p className="text-[10px] text-neutral-400 font-mono-stat">
                  Patinadores, Amigos e Disputas nas Ruas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Privacy Config Button */}
              <button
                type="button"
                id="btn-toggle-social-privacy"
                onClick={() => setShowPrivacyConfig(!showPrivacyConfig)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  showPrivacyConfig
                    ? 'bg-yellow-500/20 border-yellow-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Configurações de Privacidade"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="btn-close-social-hub"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Navigation Tabs */}
          <div className="grid grid-cols-5 gap-1 mt-3.5 p-1 rounded-2xl bg-black/40 border border-white/10">
            <button
              type="button"
              id="tab-social-amigos"
              onClick={() => setActiveTab('amigos')}
              className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activeTab === 'amigos'
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                  : 'text-neutral-400 hover:text-slate-200'
              }`}
            >
              <span>AMIGOS</span>
              <span className="text-[9px] opacity-80">({friends.length})</span>
            </button>

            <button
              type="button"
              id="tab-social-proximos"
              onClick={() => setActiveTab('proximos')}
              className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activeTab === 'proximos'
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                  : 'text-neutral-400 hover:text-slate-200'
              }`}
            >
              <span>PRÓXIMOS</span>
              <span className="text-[9px] opacity-80">({nearbyPlayers.length})</span>
            </button>

            <button
              type="button"
              id="tab-social-sugestoes"
              onClick={() => setActiveTab('sugestoes')}
              className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activeTab === 'sugestoes'
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                  : 'text-neutral-400 hover:text-slate-200'
              }`}
            >
              <span>SUGESTÕES</span>
              <span className="text-[9px] opacity-80">({suggestions.length})</span>
            </button>

            <button
              type="button"
              id="tab-social-solicitacoes"
              onClick={() => setActiveTab('solicitacoes')}
              className={`relative py-2 px-1 rounded-xl text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activeTab === 'solicitacoes'
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                  : 'text-neutral-400 hover:text-slate-200'
              }`}
            >
              <span>PEDIDOS</span>
              <span className="text-[9px] opacity-80">({receivedRequests.length + sentRequests.length})</span>
              {totalPendingRequests > 0 && activeTab !== 'solicitacoes' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-black text-[9px] font-black flex items-center justify-center border border-black shadow-[0_0_8px_#00ff66]">
                  {totalPendingRequests}
                </span>
              )}
            </button>

            <button
              type="button"
              id="tab-social-buscar"
              onClick={() => setActiveTab('buscar')}
              className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                activeTab === 'buscar'
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                  : 'text-neutral-400 hover:text-slate-200'
              }`}
            >
              <span>BUSCAR</span>
              <Search className="w-3 h-3 mt-0.5" />
            </button>
          </div>
        </div>

        {/* Privacy Settings Overlay / Quick Panel */}
        {showPrivacyConfig && (
          <div className="p-4 bg-[#0c1420] border-b border-yellow-500/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <h4 className="text-xs font-black text-white uppercase font-mono-stat">
                  CONTROLE DE PRIVACIDADE SOCIAL
                </h4>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono-stat">Apenas Dados Públicos</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <div className="font-bold text-white">Aparecer para Jogadores Próximos</div>
                  <div className="text-[10px] text-neutral-400">Mostra distância aproximada (ex: 350 m), nunca coordenadas.</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePrivacySettings({
                      ...privacySettings,
                      appearInNearby: !privacySettings.appearInNearby,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    privacySettings.appearInNearby ? 'bg-yellow-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacySettings.appearInNearby ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <div className="font-bold text-white">Permitir Convites para Desafios</div>
                  <div className="text-[10px] text-neutral-400">Outros patinadores podem enviar duelos X1 / X2.</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePrivacySettings({
                      ...privacySettings,
                      allowChallengeInvites: !privacySettings.allowChallengeInvites,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    privacySettings.allowChallengeInvites ? 'bg-yellow-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacySettings.allowChallengeInvites ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <div className="font-bold text-white">Permitir Solicitações de Amizade</div>
                  <div className="text-[10px] text-neutral-400">Receber pedidos de amizade de outros usuários.</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePrivacySettings({
                      ...privacySettings,
                      allowFriendRequests: !privacySettings.allowFriendRequests,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    privacySettings.allowFriendRequests ? 'bg-yellow-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacySettings.allowFriendRequests ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB: AMIGOS */}
          {activeTab === 'amigos' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 font-mono-stat uppercase px-1">
                <span>SEUS AMIGOS ({friends.length})</span>
                <span className="text-yellow-400">Disponíveis para Desafios</span>
              </div>

              {friends.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#0d141e] border border-white/10 space-y-2">
                  <UserPlus className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-bold text-white">Nenhum amigo adicionado ainda</div>
                  <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                    Explore os jogadores próximos ou as sugestões de patinadores para enviar solicitações.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sugestoes')}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-yellow-400 text-black text-xs font-black uppercase font-mono-stat"
                  >
                    Ver Sugestões →
                  </button>
                </div>
              ) : (
                friends.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 hover:border-yellow-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    {/* Player Info (Click to view profile) */}
                    <div
                      onClick={() => onSelectPlayer(player)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={player.avatar}
                          alt={player.nickname}
                          className="w-12 h-12 rounded-xl object-cover border border-yellow-400/60"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black text-yellow-400 border border-yellow-400/40 text-[8px] font-black font-mono-stat">
                          LVL {player.level}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white uppercase font-display truncate group-hover:text-emerald-300 transition-colors">
                            {player.nickname}
                          </h4>
                          {renderStatusBadge(player.status)}
                        </div>

                        <div className="text-[10px] text-amber-300 font-mono-stat font-bold truncate">
                          👑 {player.activeTitle || 'Patinador Urbano'}
                        </div>

                        <div className="text-[10px] text-neutral-400 truncate">
                          {player.crew || 'Sem Crew'} • {player.totalKm} km rodados
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        id={`btn-challenge-friend-${player.id}`}
                        onClick={() => onSendChallenge(player)}
                        className="py-1.5 px-2.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)] active:scale-95 flex items-center gap-1 cursor-pointer"
                        title="Enviar desafio direto"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">DESAFIAR</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-view-profile-friend-${player.id}`}
                        onClick={() => onSelectPlayer(player)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        title="Ver perfil completo"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: JOGADORES PRÓXIMOS */}
          {activeTab === 'proximos' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0d141e] to-cyan-950/30 border border-yellow-500/30 flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300">
                  <span className="font-bold text-white">Radar de Patinadores nas Proximidades:</span> Mostra distâncias aproximadas para conectar treinos e disputas sem expor coordenadas exatas.
                </div>
              </div>

              {nearbyPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => onSelectPlayer(player)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={player.avatar}
                        alt={player.nickname}
                        className="w-12 h-12 rounded-xl object-cover border border-cyan-400/60"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black text-cyan-400 border border-cyan-400/40 text-[8px] font-black font-mono-stat">
                        LVL {player.level}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white uppercase font-display truncate group-hover:text-cyan-300 transition-colors">
                          {player.nickname}
                        </h4>
                        {renderStatusBadge(player.status)}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono-stat">
                        <span className="text-cyan-300 font-bold">
                          📍 ~{player.approximateDistanceLabel}
                        </span>
                        <span>•</span>
                        <span className="text-neutral-400">{player.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id={`btn-challenge-nearby-${player.id}`}
                      onClick={() => onSendChallenge(player)}
                      className="py-1.5 px-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all shadow-[0_0_10px_rgba(0,229,255,0.3)] active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">DESAFIO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectPlayer(player)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SUGESTÕES */}
          {activeTab === 'sugestoes' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 font-mono-stat uppercase px-1">
                <span>JOGADORES QUE VOCÊ PODE CONHECER</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>

              {suggestions.map((player) => (
                <div
                  key={player.id}
                  className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 hover:border-yellow-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => onSelectPlayer(player)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={player.avatar}
                        alt={player.nickname}
                        className="w-12 h-12 rounded-xl object-cover border border-white/20"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black text-white text-[8px] font-black font-mono-stat">
                        LVL {player.level}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-white uppercase font-display truncate">
                          {player.nickname}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono-stat">{player.tag}</span>
                      </div>

                      <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {player.commonContext || `${player.crew || 'Sem Crew'} • ${player.city || 'SP'}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id={`btn-add-friend-sug-${player.id}`}
                      onClick={() => onSendFriendRequest(player.id)}
                      className="py-1.5 px-3 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-emerald-300 hover:bg-yellow-400 hover:text-black text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>ADICIONAR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SOLICITAÇÕES */}
          {activeTab === 'solicitacoes' && (
            <div className="space-y-4">
              {/* Recebidas */}
              <div>
                <div className="text-[11px] font-bold text-neutral-400 font-mono-stat uppercase mb-2 px-1 flex items-center justify-between">
                  <span>SOLICITAÇÕES RECEBIDAS ({receivedRequests.length})</span>
                  {receivedRequests.length > 0 && (
                    <span className="text-yellow-400">Aguardando sua resposta</span>
                  )}
                </div>

                {receivedRequests.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#0d141e] border border-white/5 text-center text-xs text-neutral-400">
                    Nenhuma solicitação de amizade pendente no momento.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {receivedRequests.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-2xl bg-[#0d141e] border border-yellow-500/40 flex items-center justify-between gap-3"
                      >
                        <div
                          onClick={() => onSelectPlayer(player)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <img
                            src={player.avatar}
                            alt={player.nickname}
                            className="w-11 h-11 rounded-xl object-cover border border-yellow-400/50 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white uppercase font-display truncate">
                              {player.nickname}
                            </h4>
                            <div className="text-[10px] text-neutral-400 font-mono-stat">
                              LVL {player.level} • {player.crew || 'Sem Crew'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            id={`btn-accept-request-${player.id}`}
                            onClick={() => onAcceptFriendRequest(player.id)}
                            className="py-1.5 px-3 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black uppercase font-mono-stat tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                          >
                            ACEITAR
                          </button>

                          <button
                            type="button"
                            id={`btn-decline-request-${player.id}`}
                            onClick={() => onDeclineFriendRequest(player.id)}
                            className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 text-[10px] font-bold uppercase font-mono-stat tracking-wider transition-all cursor-pointer"
                          >
                            RECUSAR
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enviadas */}
              <div>
                <div className="text-[11px] font-bold text-neutral-400 font-mono-stat uppercase mb-2 px-1">
                  SOLICITAÇÕES ENVIADAS ({sentRequests.length})
                </div>

                {sentRequests.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#0d141e] border border-white/5 text-center text-xs text-neutral-400">
                    Você não possui solicitações pendentes de resposta.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sentRequests.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div
                          onClick={() => onSelectPlayer(player)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <img
                            src={player.avatar}
                            alt={player.nickname}
                            className="w-11 h-11 rounded-xl object-cover border border-white/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white uppercase font-display truncate">
                              {player.nickname}
                            </h4>
                            <div className="text-[10px] text-amber-300 font-mono-stat flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Aguardando resposta do jogador</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          id={`btn-cancel-request-${player.id}`}
                          onClick={() => onCancelFriendRequest(player.id)}
                          className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 text-[10px] font-bold uppercase font-mono-stat tracking-wider transition-all cursor-pointer"
                        >
                          CANCELAR
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BUSCAR */}
          {activeTab === 'buscar' && (
            <div className="space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, nickname, #tag ou crew..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0d141e] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchQuery.trim() === '' ? (
                <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                  <Search className="w-8 h-8 text-slate-600 mx-auto" />
                  <div>Digite o nome ou a tag de um patinador para localizá-lo.</div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  Nenhum patinador encontrado para "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 font-mono-stat uppercase px-1">
                    RESULTADOS ({searchResults.length})
                  </div>
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 hover:border-yellow-400/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onSelectPlayer(player)}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <img
                          src={player.avatar}
                          alt={player.nickname}
                          className="w-11 h-11 rounded-xl object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-white uppercase font-display truncate">
                              {player.nickname}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-mono-stat">{player.tag}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono-stat">
                            LVL {player.level} • {player.crew || 'Sem Crew'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {player.isFriend ? (
                          <span className="px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-400/40 text-emerald-300 text-[10px] font-bold font-mono-stat">
                            AMIGOS ✓
                          </span>
                        ) : player.friendRequestStatus === 'PENDING_SENT' ? (
                          <span className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold font-mono-stat">
                            ENVIADA
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSendFriendRequest(player.id)}
                            className="py-1.5 px-3 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-emerald-300 hover:bg-yellow-400 hover:text-black text-[10px] font-black uppercase font-mono-stat transition-all"
                          >
                            ADICIONAR
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectPlayer(player)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Public Activity Feed Preview Bar (Section 20 & 21) */}
        <div className="p-3 bg-[#080c12] border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <div
            onClick={onOpenActivityFeed ? onOpenActivityFeed : undefined}
            className={`flex items-center gap-2 min-w-0 flex-1 ${
              onOpenActivityFeed ? 'cursor-pointer hover:opacity-90' : ''
            }`}
          >
            <Activity className="w-4 h-4 text-yellow-400 shrink-0" />
            <div className="text-[11px] text-neutral-300 truncate">
              {publicActivities[0] ? (
                <>
                  <strong className="text-white">{publicActivities[0].playerNickname}</strong>{' '}
                  {publicActivities[0].description}{' '}
                  <span className="text-yellow-400">{publicActivities[0].targetName}</span>{' '}
                  <span className="text-slate-500 text-[10px]">({publicActivities[0].timeAgo})</span>
                </>
              ) : (
                'Atividade social da comunidade urbana'
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenActivityFeed && (
              <button
                type="button"
                id="btn-open-activity-feed-from-social"
                onClick={onOpenActivityFeed}
                className="px-2.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-emerald-300 font-bold text-xs uppercase font-mono-stat flex items-center gap-1 cursor-pointer"
              >
                <span>VER FEED</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              id="btn-close-social-hub-footer"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat shrink-0 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
