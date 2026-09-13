import React, { useState } from 'react';
import {
  X,
  Swords,
  MapPin,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trophy,
  Activity,
  History,
  Send,
  Ban,
  Shield,
  ArrowRight,
  Sparkles,
  Users,
  AlertCircle,
} from 'lucide-react';
import { DirectChallenge, UserProfile } from '../types';

interface DirectChallengeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: DirectChallenge | null;
  currentUser: UserProfile;
  onAcceptChallenge: (challengeId: string) => void;
  onNegotiateSchedule: (challengeId: string, newDate: string, newTime: string, note?: string) => void;
  onRejectChallenge?: (challengeId: string) => void;
  onCancelChallenge?: (challengeId: string) => void;
  onViewRouteOnMap?: (routeId: string) => void;
  onStartLiveChallenge?: (challengeId: string) => void;
}

export const DirectChallengeDetailsModal: React.FC<DirectChallengeDetailsModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentUser,
  onAcceptChallenge,
  onNegotiateSchedule,
  onRejectChallenge,
  onCancelChallenge,
  onViewRouteOnMap,
  onStartLiveChallenge,
}) => {
  const [isNegotiating, setIsNegotiating] = useState<boolean>(false);
  const [newProposedDate, setNewProposedDate] = useState<string>('');
  const [newProposedTime, setNewProposedTime] = useState<string>('20:00');
  const [negotiationNote, setNegotiationNote] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !challenge) return null;

  const mode = challenge.mode || (challenge.participants && challenge.participants.length > 2 ? 'x2' : 'x1');
  const participants = challenge.participants || [
    {
      playerId: challenge.challengerId,
      name: challenge.challengerName,
      nickname: challenge.challengerNickname,
      avatar: challenge.challengerAvatar,
      tag: challenge.challengerTag,
      level: challenge.challengerLevel,
      crew: challenge.challengerCrew,
      role: 'challenger' as const,
      invitationStatus: 'aceito' as const,
      joinedAt: challenge.createdAt,
    },
    {
      playerId: challenge.challengedId,
      name: challenge.challengedName,
      nickname: challenge.challengedNickname,
      avatar: challenge.challengedAvatar,
      tag: challenge.challengedTag,
      level: challenge.challengedLevel,
      crew: challenge.challengedCrew,
      role: 'opponent' as const,
      invitationStatus: challenge.status === 'confirmado' ? 'aceito' as const : 'pendente' as const,
      joinedAt: challenge.createdAt,
    },
  ];

  const myParticipantRecord = participants.find(
    (p) => p.playerId === currentUser.id || p.nickname.toLowerCase() === currentUser.nickname.toLowerCase()
  );

  const isCreator = challenge.creatorId === currentUser.id || challenge.challengerId === currentUser.id;
  const isChallenger = myParticipantRecord?.role === 'challenger' || isCreator;
  const isOpponent = !isChallenger;

  const isPending = challenge.status === 'pendente';
  const isWaitingOthers = challenge.status === 'aguardando_participantes';
  const isNegotiatingState = challenge.status === 'negociando';
  const isConfirmed = challenge.status === 'confirmado';
  const isRejected = challenge.status === 'recusado';
  const isCancelled = challenge.status === 'cancelado';
  const isCompleted = challenge.status === 'concluido';

  // Can the current user respond?
  // User can respond if:
  // 1. Is an opponent and their own invitationStatus is 'pendente'
  // 2. Or is on NEGOCIANDO where lastActionBy wasn't currentUser
  const myStatusIsPending = myParticipantRecord?.invitationStatus === 'pendente';
  const canRespond =
    (isOpponent && myStatusIsPending) ||
    ((isPending || isNegotiatingState || isWaitingOthers) && challenge.lastActionBy !== currentUser.id);

  const handleStartNegotiate = () => {
    setNewProposedDate(challenge.proposedDate || '16/08/2026');
    setNewProposedTime(challenge.proposedTime || '20:00');
    setIsNegotiating(true);
    setActionSuccessMessage(null);
  };

  const handleSendNewProposal = () => {
    if (!newProposedDate.trim() || !newProposedTime.trim()) return;
    onNegotiateSchedule(challenge.id, newProposedDate.trim(), newProposedTime.trim(), negotiationNote.trim());
    setIsNegotiating(false);
    setActionSuccessMessage(`Nova proposta enviada: ${newProposedDate} às ${newProposedTime}`);
  };

  const handleAccept = () => {
    onAcceptChallenge(challenge.id);
    setActionSuccessMessage(`Você aceitou o desafio para ${challenge.proposedDate} às ${challenge.proposedTime}!`);
  };

  const handleReject = () => {
    if (onRejectChallenge) {
      onRejectChallenge(challenge.id);
      setActionSuccessMessage('Desafio recusado.');
    }
  };

  const handleCancel = () => {
    if (onCancelChallenge) {
      onCancelChallenge(challenge.id);
      setActionSuccessMessage('Desafio cancelado.');
    }
  };

  // Quick date chips helper
  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    setNewProposedDate(`${day}/${month}/${year}`);
  };

  const opponents = participants.filter((p) => p.role === 'opponent');
  const challenger = participants.find((p) => p.role === 'challenger') || participants[0];

  return (
    <div
      id="modal-direct-challenge-details"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#090e15] border-2 border-yellow-500/60 shadow-[0_0_50px_rgba(252,232,3,0.3)] flex flex-col max-h-[92vh] overflow-hidden text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-white/10 bg-gradient-to-b from-neutral-900/40 via-[#0a121c] to-[#090e15] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-cyan-500 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(252,232,3,0.4)]">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {/* Mode Tag */}
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase font-mono-stat tracking-wider ${
                    mode === 'x2'
                      ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                      : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
                  }`}
                >
                  🎯 DESAFIO {mode.toUpperCase()}
                </span>

                {/* State Badge */}
                {isPending && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    🟡 PENDENTE
                  </span>
                )}
                {isWaitingOthers && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    ⏳ AGUARDANDO DEMAIS
                  </span>
                )}
                {isNegotiatingState && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-black uppercase font-mono-stat tracking-wider animate-pulse">
                    🔵 NEGOCIAÇÃO
                  </span>
                )}
                {isConfirmed && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    🟢 CONFIRMADO
                  </span>
                )}
                {isRejected && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    🔴 RECUSADO
                  </span>
                )}
                {isCancelled && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700/40 border border-slate-600/50 text-slate-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    ⚪ CANCELADO
                  </span>
                )}
                {isCompleted && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-[10px] font-black uppercase font-mono-stat tracking-wider">
                    🏆 CONCLUÍDO
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-tight mt-0.5">
                {isChallenger ? 'DESAFIO ENVIADO' : 'DESAFIO RECEBIDO'}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-challenge-details"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(92vh-140px)] space-y-4">
          {/* Success Banner Alert if action taken */}
          {actionSuccessMessage && (
            <div className="p-3 rounded-2xl bg-neutral-900/60 border-2 border-yellow-400/60 text-yellow-300 text-xs font-mono-stat flex items-center gap-2 shadow-[0_0_20px_rgba(252,232,3,0.3)] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* PARTICIPANTS OVERVIEW */}
          <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat">
                <Users className="w-3.5 h-3.5 text-yellow-400" />
                <span>PARTICIPANTES ({participants.length})</span>
              </div>
              <span className="text-[10px] font-mono-stat text-slate-400">
                Modo {mode.toUpperCase()}
              </span>
            </div>

            {/* Challenger Card */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={challenger.avatar}
                    alt={challenger.nickname}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-yellow-400"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black border border-yellow-400 text-[7px] font-black text-yellow-400 font-mono-stat">
                    NV {challenger.level || 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-display">
                      {challenger.nickname}
                    </span>
                    <span className="text-yellow-400 text-[10px] font-mono-stat">
                      {challenger.tag || '#000'}
                    </span>
                    {challenger.playerId === currentUser.id && (
                      <span className="px-1 py-0.2 rounded bg-yellow-500/20 text-yellow-300 text-[8px] font-mono-stat">
                        Você
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-stat block">
                    👑 Desafiante (Criador) • {challenger.crew || 'Sem Clã'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[9px] font-bold font-mono-stat uppercase">
                Confirmado
              </span>
            </div>

            {/* Opponents Cards */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono-stat block">
                Adversários ({opponents.length}):
              </span>
              {opponents.map((opp, idx) => {
                const isOppCurrentUser = opp.playerId === currentUser.id;
                const isAccepted = opp.invitationStatus === 'aceito';
                const isOppPending = opp.invitationStatus === 'pendente';
                const isOppRejected = opp.invitationStatus === 'recusado';

                return (
                  <div
                    key={opp.playerId || idx}
                    className="p-2.5 rounded-xl bg-[#0e1724] border border-cyan-500/20 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={opp.avatar}
                          alt={opp.nickname}
                          className="w-9 h-9 rounded-lg object-cover border-2 border-cyan-400"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black border border-cyan-400 text-[7px] font-black text-cyan-400 font-mono-stat">
                          NV {opp.level || 1}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white font-display truncate">
                            {opp.nickname}
                          </span>
                          <span className="text-cyan-400 text-[10px] font-mono-stat">
                            {opp.tag || '#000'}
                          </span>
                          {isOppCurrentUser && (
                            <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[8px] font-mono-stat">
                              Você
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-stat truncate block">
                          ⚔️ Adversário #{idx + 1} • {opp.crew || 'Sem Clã'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isAccepted && (
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-[9px] font-bold font-mono-stat uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Aceitou
                        </span>
                      )}
                      {isOppPending && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-bold font-mono-stat uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 animate-spin" />
                          Pendente
                        </span>
                      )}
                      {isOppRejected && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-400/40 text-red-300 text-[9px] font-bold font-mono-stat uppercase flex items-center gap-1">
                          <Ban className="w-2.5 h-2.5" />
                          Recusou
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROTA DETAILS */}
          <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                <span>ROTA ESCOLHIDA</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat ${
                  challenge.routeDifficulty === 'Iniciante'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                    : challenge.routeDifficulty === 'Intermediário'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : challenge.routeDifficulty === 'Avançado'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-red-500/20 text-red-300 border border-red-400/40'
                }`}
              >
                {challenge.routeDifficulty}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-display">
                  {challenge.routeName}
                </h3>
                <p className="text-xs text-slate-400 font-mono-stat mt-0.5">
                  📍 {challenge.routeLocation}
                </p>
                {challenge.routeDescription && (
                  <p className="text-[11px] text-slate-300 mt-1 italic">
                    {challenge.routeDescription}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 font-mono-stat">
                <div className="text-sm font-black text-yellow-400">
                  {challenge.routeDistanceKm.toFixed(1)} KM
                </div>
                <div className="text-[10px] text-amber-400 font-bold">
                  +{challenge.routeXp || 300} XP
                </div>
              </div>
            </div>

            {onViewRouteOnMap && (
              <button
                type="button"
                onClick={() => onViewRouteOnMap(challenge.routeId)}
                className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono-stat flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ver rota e trajeto no mapa</span>
              </button>
            )}
          </div>

          {/* TIPO DE DESAFIO & HORÁRIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tipo */}
            <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>TIPO DE DESAFIO</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{challenge.challengeTypeIcon}</span>
                  <span className="text-sm font-bold text-cyan-300 uppercase font-display">
                    {challenge.challengeTypeLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {challenge.challengeTypeDescription}
                </p>
              </div>
            </div>

            {/* Horário */}
            <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat mb-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>HORÁRIO PROPOSTO</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-slate-400 font-mono-stat">Data do Desafio:</div>
                <div className="text-sm font-black text-amber-400 font-mono-stat">
                  📅 {challenge.proposedDate}
                </div>
                <div className="text-xs text-slate-400 font-mono-stat mt-1">Horário:</div>
                <div className="text-sm font-black text-white font-mono-stat">
                  ⏰ {challenge.proposedTime}
                </div>
              </div>
            </div>
          </div>

          {/* NEGOTIATION TIMELINE / HISTORY */}
          {challenge.negotiationHistory && challenge.negotiationHistory.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>HISTÓRICO DE NEGOCIAÇÃO ({challenge.negotiationHistory.length})</span>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {challenge.negotiationHistory.map((item, idx) => {
                  const isCurrent = item.playerId === currentUser.id;
                  return (
                    <div
                      key={item.id || idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono-stat"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {item.action === 'create'
                            ? '🚀 Criado por'
                            : item.action === 'propose'
                            ? '🕐 Proposta de'
                            : item.action === 'accept'
                            ? '✅ Aceito por'
                            : '❌ Ação de'}{' '}
                          <b className="text-white">{isCurrent ? 'Você' : item.playerNickname}</b>
                        </span>
                      </div>
                      <div className="text-right text-yellow-400 font-bold">
                        {item.proposedDate} às {item.proposedTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NEGOTIATION INPUT VIEW (When user clicks NEGOCIAR HORÁRIO) */}
          {isNegotiating ? (
            <div className="p-4 rounded-2xl bg-[#0c1420] border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.25)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono-stat flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  PROPOR NOVO HORÁRIO
                </h4>
                <button
                  type="button"
                  onClick={() => setIsNegotiating(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-stat text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">
                    Nova Data (DD/MM/AAAA)
                  </span>
                  <input
                    type="text"
                    id="input-negotiate-date"
                    value={newProposedDate}
                    onChange={(e) => setNewProposedDate(e.target.value)}
                    placeholder="Ex: 16/08/2026"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickDate(0)}
                      className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 cursor-pointer"
                    >
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDate(1)}
                      className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 cursor-pointer"
                    >
                      Amanhã
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDate(2)}
                      className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 cursor-pointer"
                    >
                      +2 dias
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">
                    Novo Horário (HH:MM)
                  </span>
                  <input
                    type="text"
                    id="input-negotiate-time"
                    value={newProposedTime}
                    onChange={(e) => setNewProposedTime(e.target.value)}
                    placeholder="Ex: 20:00"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    {['19:00', '20:00', '20:30', '21:00'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewProposedTime(t)}
                        className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold font-mono-stat">
                  Mensagem rápida (Opcional)
                </span>
                <input
                  type="text"
                  value={negotiationNote}
                  onChange={(e) => setNegotiationNote(e.target.value)}
                  placeholder="Ex: Fica melhor para mim após as 20h"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono-stat focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNegotiating(false)}
                  className="py-2 px-3 rounded-xl bg-white/10 text-slate-300 text-xs font-mono-stat cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  id="btn-submit-negotiation-proposal"
                  type="button"
                  onClick={handleSendNewProposal}
                  className="py-2 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ENVIAR NOVA PROPOSTA</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* CONFIRMED BANNER */}
          {isConfirmed && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900/60 to-[#0a121c] border-2 border-yellow-400/60 text-center space-y-3 shadow-[0_0_25px_rgba(252,232,3,0.3)]">
              <div className="w-10 h-10 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center text-yellow-400 mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase font-display">
                DESAFIO {mode.toUpperCase()} CONFIRMADO!
              </h3>
              <p className="text-xs text-yellow-300 font-mono-stat">
                Todos os participantes confirmaram para <b>{challenge.proposedDate} às {challenge.proposedTime}</b> no <b>{challenge.routeName}</b>.
              </p>
              
              {onStartLiveChallenge && (
                <button
                  id="btn-start-live-challenge-from-modal"
                  type="button"
                  onClick={() => onStartLiveChallenge(challenge.id)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-[#fce803] to-cyan-400 hover:opacity-95 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_20px_rgba(252,232,3,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Swords className="w-4 h-4 stroke-[2.5]" />
                  <span>INICIAR DISPUTA AO VIVO NO MAPA</span>
                </button>
              )}
            </div>
          )}

          {/* SENDER WAITING STATUS BANNER */}
          {!isConfirmed && !isRejected && !isCancelled && !canRespond && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono-stat flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span>
                  {isWaitingOthers
                    ? 'Aguardando confirmação dos demais adversários...'
                    : `Aguardando resposta de ${opponents.map((o) => o.nickname).join(', ')}...`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleStartNegotiate}
                className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-[10px] font-bold uppercase font-mono-stat transition-all cursor-pointer"
              >
                Mudar Horário
              </button>
            </div>
          )}

          {/* ACTION BUTTONS (ACCEPT / NEGOTIATE / REJECT / CANCEL) */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            {canRespond && !isNegotiating && !isConfirmed && (
              <>
                <button
                  id="btn-accept-direct-challenge"
                  type="button"
                  onClick={handleAccept}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-[#fce803] hover:from-yellow-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm uppercase font-mono-stat tracking-wider shadow-[0_0_20px_rgba(252,232,3,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>ACEITAR DESAFIO</span>
                </button>

                <button
                  id="btn-negotiate-direct-challenge"
                  type="button"
                  onClick={handleStartNegotiate}
                  className="py-3 px-4 rounded-xl bg-[#0e1724] hover:bg-[#142032] border border-cyan-400/50 text-cyan-300 font-bold text-xs uppercase font-mono-stat tracking-wider active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NEGOCIAR HORÁRIO</span>
                </button>
              </>
            )}

            {/* Cancel/Reject Options */}
            {!isConfirmed && !isRejected && !isCancelled && (
              <div className="w-full flex items-center justify-between pt-1">
                {canRespond && onRejectChallenge && (
                  <button
                    id="btn-reject-direct-challenge"
                    type="button"
                    onClick={handleReject}
                    className="text-[11px] text-red-400/80 hover:text-red-300 font-mono-stat flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Recusar Desafio</span>
                  </button>
                )}

                {isChallenger && onCancelChallenge && (
                  <button
                    id="btn-cancel-direct-challenge"
                    type="button"
                    onClick={handleCancel}
                    className="text-[11px] text-slate-400 hover:text-red-400 font-mono-stat flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Cancelar Desafio Enviado</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] text-slate-400 hover:text-white font-mono-stat ml-auto cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            )}

            {isConfirmed && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat transition-all cursor-pointer"
              >
                Fechar Detalhes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
