import React from 'react';
import { Trophy, Award, Medal, Swords, Clock, Zap, MapPin, CheckCircle2, ArrowRight, X, Sparkles, Navigation } from 'lucide-react';
import { LiveChallenge, LiveChallengeParticipant } from '../types';

interface LiveChallengeResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: LiveChallenge | null;
  onViewRouteOnMap?: () => void;
  onRematch?: () => void;
}

export const LiveChallengeResultModal: React.FC<LiveChallengeResultModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onViewRouteOnMap,
  onRematch,
}) => {
  if (!isOpen || !challenge) return null;

  // Ordenar participantes pelo progresso e tempo
  const sorted = [...challenge.participants].sort((a, b) => {
    if (b.progress !== a.progress) {
      return b.progress - a.progress;
    }
    return a.elapsedTime - b.elapsedTime;
  });

  const winner = sorted[0];
  const secondPlace = sorted.length > 1 ? sorted[1] : null;
  const isCurrentUserWinner = winner?.isCurrentUser;

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      id="modal-live-challenge-result"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85  animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#000000] border-2 border-yellow-400/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(252,232,3,0.35)] overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Botão fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header com Troféu */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(251,191,36,0.5)]">
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>

          <div>
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest font-mono-stat flex items-center justify-center gap-1">
              <Swords className="w-3 h-3" />
              DISPUTA AO VIVO CONCLUÍDA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-0.5">
              RESULTADO DO CONFRONTO
            </h2>
            <p className="text-xs text-slate-400 font-mono-stat mt-0.5">
              {challenge.routeName}
            </p>
          </div>
        </div>

        {/* Banner de Celebração */}
        <div
          className={`p-3 rounded-2xl border text-center mb-4 ${
            isCurrentUserWinner
              ? 'bg-neutral-900/40 border-yellow-400/60 shadow-[0_0_20px_rgba(252,232,3,0.2)]'
              : 'bg-[#101722] border-white/10'
          }`}
        >
          <p className="text-xs font-black uppercase font-display tracking-wide text-white">
            {isCurrentUserWinner ? '🏆 VOCÊ VENCEU A DISPUTA!' : `🥇 ${winner?.nickname || 'Vencedor'} LEVOU A VITÓRIA!`}
          </p>
          {challenge.xpReward && (
            <p className="text-[11px] font-bold text-yellow-300 font-mono-stat mt-0.5">
              +{challenge.xpReward} XP de Bônus de Confronto adicionados ao perfil
            </p>
          )}
        </div>

        {/* Pódio dos Participantes (1º e 2º Lugar) */}
        <div className="space-y-2.5 mb-5">
          {/* 1º LUGAR */}
          {winner && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#050505] border-2 border-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs font-mono-stat shrink-0">
                    1º
                  </div>

                  <img
                    src={winner.avatar}
                    alt={winner.nickname}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 bg-black shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white uppercase font-display truncate">
                        {winner.nickname}
                      </span>
                      {winner.isCurrentUser && (
                        <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black text-[8px] font-black font-mono-stat uppercase">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono-stat font-bold">
                      👑 Campeão da Disputa ({Math.round(winner.progress)}% concluído)
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-yellow-400 font-mono-stat">
                    {formatSeconds(winner.elapsedTime)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-stat">
                    {winner.averageSpeed.toFixed(1)} km/h
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2º LUGAR */}
          {secondPlace && (
            <div className="p-3 rounded-2xl bg-[#090e16] border border-slate-400/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-slate-400/20 border border-slate-400 flex items-center justify-center text-slate-200 font-black text-xs font-mono-stat shrink-0">
                    2º
                  </div>

                  <img
                    src={secondPlace.avatar}
                    alt={secondPlace.nickname}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-slate-400 bg-black shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white uppercase font-display truncate">
                        {secondPlace.nickname}
                      </span>
                      {secondPlace.isCurrentUser && (
                        <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black text-[8px] font-black font-mono-stat uppercase">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-stat font-bold">
                      🥈 Segundo Colocado ({Math.round(secondPlace.progress)}%)
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-slate-300 font-mono-stat">
                    {formatSeconds(secondPlace.elapsedTime)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-stat">
                    {secondPlace.averageSpeed.toFixed(1)} km/h
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          {onRematch && (
            <button
              id="btn-challenge-rematch"
              type="button"
              onClick={onRematch}
              className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_20px_rgba(252,232,3,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Swords className="w-4 h-4 stroke-[2.5]" />
              <span>REVANCHE / NOVA DISPUTA</span>
            </button>
          )}

          {onViewRouteOnMap && (
            <button
              id="btn-view-challenge-result-map"
              type="button"
              onClick={onViewRouteOnMap}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>VER RESULTADO NO MAPA</span>
            </button>
          )}

          <button
            id="btn-close-challenge-result"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase font-mono-stat transition-all cursor-pointer"
          >
            Fechar Confronto
          </button>
        </div>
      </div>
    </div>
  );
};
