import React, { useState } from 'react';
import {
  Swords,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trophy,
  History,
  Send,
  User,
  Plus,
  ArrowRight,
  Filter,
  Users,
  Shield,
} from 'lucide-react';
import { DirectChallenge, DirectChallengeStatus, UserProfile } from '../types';

interface DirectChallengesHubProps {
  challenges: DirectChallenge[];
  currentUser: UserProfile;
  onSelectChallenge: (challenge: DirectChallenge) => void;
  onOpenCreateChallenge?: () => void;
  onStartLiveChallenge?: (challengeId: string) => void;
}

type HubTab = 'recebidos' | 'enviados' | 'confirmados' | 'historico';

export const DirectChallengesHub: React.FC<DirectChallengesHubProps> = ({
  challenges,
  currentUser,
  onSelectChallenge,
  onOpenCreateChallenge,
  onStartLiveChallenge,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<HubTab>('recebidos');

  const isCurrentChallenger = (c: DirectChallenge) => {
    if (c.creatorId === currentUser.id || c.challengerId === currentUser.id) return true;
    if (c.challengerNickname === currentUser.nickname) return true;
    if (c.participants) {
      const p = c.participants.find(
        (part) => part.playerId === currentUser.id || part.nickname.toLowerCase() === currentUser.nickname.toLowerCase()
      );
      return p?.role === 'challenger';
    }
    return false;
  };

  const isCurrentOpponent = (c: DirectChallenge) => {
    if (isCurrentChallenger(c)) return false;
    if (c.challengedId === currentUser.id || c.challengedNickname === currentUser.nickname) return true;
    if (c.participants) {
      return c.participants.some(
        (part) =>
          part.role === 'opponent' &&
          (part.playerId === currentUser.id || part.nickname.toLowerCase() === currentUser.nickname.toLowerCase())
      );
    }
    return false;
  };

  const userNeedsToRespond = (c: DirectChallenge) => {
    if (c.status === 'confirmado' || c.status === 'concluido' || c.status === 'recusado' || c.status === 'cancelado') {
      return false;
    }
    if (c.participants) {
      const myPart = c.participants.find(
        (p) => p.playerId === currentUser.id || p.nickname.toLowerCase() === currentUser.nickname.toLowerCase()
      );
      if (myPart && myPart.role === 'opponent' && myPart.invitationStatus === 'pendente') {
        return true;
      }
    }
    return (c.status === 'pendente' || c.status === 'negociando' || c.status === 'aguardando_participantes') && c.lastActionBy !== currentUser.id;
  };

  // Filtered lists
  const receivedChallenges = challenges.filter(
    (c) => isCurrentOpponent(c) && (c.status === 'pendente' || c.status === 'negociando' || c.status === 'aguardando_participantes')
  );

  const sentChallenges = challenges.filter(
    (c) => isCurrentChallenger(c) && (c.status === 'pendente' || c.status === 'negociando' || c.status === 'aguardando_participantes')
  );

  const confirmedChallenges = challenges.filter((c) => c.status === 'confirmado');

  const historyChallenges = challenges.filter(
    (c) => c.status === 'concluido' || c.status === 'recusado' || c.status === 'cancelado'
  );

  const displayedList =
    activeSubTab === 'recebidos'
      ? receivedChallenges
      : activeSubTab === 'enviados'
      ? sentChallenges
      : activeSubTab === 'confirmados'
      ? confirmedChallenges
      : historyChallenges;

  const pendingReceivedCount = receivedChallenges.filter((c) => userNeedsToRespond(c)).length;

  const getStatusBadge = (status: DirectChallengeStatus, lastActionBy: string) => {
    switch (status) {
      case 'pendente':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-black uppercase font-mono-stat">
            🟡 PENDENTE
          </span>
        );
      case 'aguardando_participantes':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-300 text-[9px] font-black uppercase font-mono-stat">
            ⏳ AGUARDANDO
          </span>
        );
      case 'negociando':
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[9px] font-black uppercase font-mono-stat animate-pulse">
            🔵 NEGOCIANDO
          </span>
        );
      case 'confirmado':
        return (
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-[9px] font-black uppercase font-mono-stat">
            🟢 CONFIRMADO
          </span>
        );
      case 'recusado':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 text-[9px] font-black uppercase font-mono-stat">
            🔴 RECUSADO
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-700/40 border border-slate-600/50 text-slate-300 text-[9px] font-black uppercase font-mono-stat">
            ⚪ CANCELADO
          </span>
        );
      case 'concluido':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-[9px] font-black uppercase font-mono-stat">
            🏆 CONCLUÍDO
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Subtabs Selector: RECEBIDOS | ENVIADOS | CONFIRMADOS | HISTÓRICO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-[#090e15] border border-white/10 rounded-2xl gap-1">
        <button
          id="tab-direct-recebidos"
          type="button"
          onClick={() => setActiveSubTab('recebidos')}
          className={`py-2 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all relative flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'recebidos'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Recebidos</span>
          {pendingReceivedCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono-stat ${
                activeSubTab === 'recebidos' ? 'bg-black text-yellow-400' : 'bg-yellow-400 text-black'
              }`}
            >
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          id="tab-direct-enviados"
          type="button"
          onClick={() => setActiveSubTab('enviados')}
          className={`py-2 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'enviados'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Enviados</span>
          {sentChallenges.length > 0 && (
            <span className="text-[10px] opacity-80">({sentChallenges.length})</span>
          )}
        </button>

        <button
          id="tab-direct-confirmados"
          type="button"
          onClick={() => setActiveSubTab('confirmados')}
          className={`py-2 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'confirmados'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Confirmados</span>
          {confirmedChallenges.length > 0 && (
            <span className="text-[10px] opacity-80">({confirmedChallenges.length})</span>
          )}
        </button>

        <button
          id="tab-direct-historico"
          type="button"
          onClick={() => setActiveSubTab('historico')}
          className={`py-2 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'historico'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Histórico</span>
          {historyChallenges.length > 0 && (
            <span className="text-[10px] opacity-80">({historyChallenges.length})</span>
          )}
        </button>
      </div>

      {/* Challenges Cards List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0c1420] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-display">
                NENHUM DESAFIO NESTA ABA
              </h4>
              <p className="text-xs text-slate-400 font-mono-stat mt-1 max-w-xs mx-auto">
                {activeSubTab === 'recebidos'
                  ? 'Você não tem propostas de desafio pendentes de resposta.'
                  : activeSubTab === 'enviados'
                  ? 'Você ainda não enviou desafios para outros patinadores.'
                  : activeSubTab === 'confirmados'
                  ? 'Nenhum desafio confirmado agendado no momento.'
                  : 'Nenhum desafio no histórico finalizado.'}
              </p>
            </div>
          </div>
        ) : (
          displayedList.map((item) => {
            const isChallenger = isCurrentChallenger(item);
            const mode = item.mode || (item.participants && item.participants.length > 2 ? 'x2' : 'x1');
            const participants = item.participants || [];
            const opponents = participants.filter((p) => p.role === 'opponent');
            const challenger = participants.find((p) => p.role === 'challenger') || {
              nickname: item.challengerNickname,
              avatar: item.challengerAvatar,
              tag: item.challengerTag,
              crew: item.challengerCrew,
            };

            const otherPlayers = isChallenger
              ? opponents
              : participants.filter(
                  (p) => p.playerId !== currentUser.id && p.nickname.toLowerCase() !== currentUser.nickname.toLowerCase()
                );

            const needsMyResponse = userNeedsToRespond(item);

            return (
              <div
                key={item.id}
                id={`direct-challenge-card-${item.id}`}
                onClick={() => onSelectChallenge(item)}
                className={`p-4 rounded-2xl bg-[#0a0a0a] border-2 transition-all cursor-pointer hover:border-yellow-500/50 hover:shadow-lg flex flex-col justify-between gap-3 ${
                  needsMyResponse
                    ? 'border-cyan-400/50 bg-gradient-to-r from-[#0c1622] to-[#0a0a0a] shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : item.status === 'confirmado'
                    ? 'border-yellow-500/40'
                    : 'border-white/10'
                }`}
              >
                {/* Card Top: Mode Badge + Adversaries + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatars Stack */}
                    <div className="relative shrink-0 flex items-center">
                      {otherPlayers.length > 0 ? (
                        <div className="flex -space-x-3">
                          {otherPlayers.map((p, pIdx) => (
                            <img
                              key={p.playerId || pIdx}
                              src={p.avatar}
                              alt={p.nickname}
                              className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-400 bg-black"
                              title={p.nickname}
                            />
                          ))}
                        </div>
                      ) : (
                        <img
                          src={isChallenger ? item.challengedAvatar : item.challengerAvatar}
                          alt="Adversário"
                          className="w-10 h-10 rounded-xl object-cover border-2 border-yellow-400"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {/* Mode Tag X1 / X2 */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase font-mono-stat ${
                            mode === 'x2'
                              ? 'bg-purple-500/20 border border-purple-400/40 text-purple-300'
                              : 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-400'
                          }`}
                        >
                          🎯 {mode.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase font-mono-stat">
                          {isChallenger ? 'Desafio enviado para' : 'Desafio recebido de'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-white uppercase font-display truncate">
                        {isChallenger
                          ? opponents.map((o) => o.nickname).join(' + ') || item.challengedNickname
                          : challenger.nickname}
                      </h3>

                      <p className="text-[11px] text-slate-400 font-mono-stat truncate">
                        {isChallenger
                          ? `${opponents.length} adversário(s) no confronto`
                          : challenger.crew || 'Patinador Urbano'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {getStatusBadge(item.status, item.lastActionBy)}
                    {needsMyResponse && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-[9px] font-black text-cyan-300 font-mono-stat uppercase">
                        Sua vez
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Middle: Rota & Tipo */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-stat">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{item.challengeTypeIcon}</span>
                    <div className="min-w-0">
                      <span className="font-bold text-white truncate block">
                        {item.routeName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.challengeTypeLabel} • {item.routeDistanceKm.toFixed(1)} km
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-amber-400 font-bold block">
                      📅 {item.proposedDate}
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      ⏰ {item.proposedTime}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Action CTA */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono-stat">
                  <span className="text-slate-400 text-[11px]">
                    {item.status === 'confirmado'
                      ? '⚡ Desafio agendado e pronto'
                      : needsMyResponse
                      ? 'Toque para responder ou negociar'
                      : 'Aguardando confirmações'}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status === 'confirmado' && onStartLiveChallenge && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartLiveChallenge(item.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[10px] font-black uppercase font-mono-stat shadow-[0_0_10px_rgba(252,232,3,0.4)] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Swords className="w-3 h-3 stroke-[2.5]" />
                        <span>DISPUTA AO VIVO</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
