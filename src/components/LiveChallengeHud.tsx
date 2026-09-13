import React, { useState } from 'react';
import { Swords, Trophy, Zap, Clock, Navigation, ChevronDown, ChevronUp, Flag, Sparkles, FastForward, CheckCircle2, X } from 'lucide-react';
import { LiveChallenge, LiveChallengeParticipant } from '../types';

interface LiveChallengeHudProps {
  challenge: LiveChallenge;
  onAdvanceStep?: () => void; // Ação para simular o avanço na rota (mock / demo)
  onFinishChallenge?: () => void;
  onCancelChallenge?: () => void;
  onFocusParticipant?: (coords: [number, number]) => void;
}

export const LiveChallengeHud: React.FC<LiveChallengeHudProps> = ({
  challenge,
  onAdvanceStep,
  onFinishChallenge,
  onCancelChallenge,
  onFocusParticipant,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Ordenar participantes pelo progresso (ou critério configurado)
  const sortedParticipants = [...challenge.participants].sort((a, b) => {
    if (challenge.rankingCriteria === 'time') {
      return a.elapsedTime - b.elapsedTime;
    }
    if (challenge.rankingCriteria === 'speed') {
      return b.averageSpeed - a.averageSpeed;
    }
    if (challenge.rankingCriteria === 'distance') {
      return b.distance - a.distance;
    }
    return b.progress - a.progress; // Critério padrão: maior progresso
  });

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400 text-amber-300 font-mono-stat font-black text-[9px] flex items-center gap-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
          🥇 1º
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-slate-300/20 border border-slate-300 text-slate-200 font-mono-stat font-black text-[9px] flex items-center gap-0.5">
          🥈 2º
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-slate-300 font-mono-stat font-bold text-[9px]">
        {index + 1}º
      </span>
    );
  };

  return (
    <div
      id="live-challenge-hud"
      className="absolute top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-20 pointer-events-auto select-none"
    >
      <div className="bg-[#090d14]/95 border-2 border-yellow-400/60 rounded-2xl shadow-[0_0_30px_rgba(252,232,3,0.25)]  overflow-hidden transition-all duration-300">
        {/* Header Compacto */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-neutral-900/80 via-[#0b131e] to-black border-b border-yellow-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <Swords className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-xs font-black text-white uppercase font-display tracking-wider truncate">
                DISPUTA AO VIVO
              </span>
            </div>
            {challenge.isDemoMode && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[8px] font-black font-mono-stat uppercase">
                DEMO X1
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title={isMinimized ? 'Expandir painel' : 'Minimizar painel'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {onCancelChallenge && (
              <button
                type="button"
                onClick={onCancelChallenge}
                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Cancelar Disputa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Informações da Rota */}
        <div className="px-3.5 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] text-slate-300 font-mono-stat">
          <span className="truncate text-slate-300 font-bold">
            📍 {challenge.routeName}
          </span>
          <span className="text-yellow-400 font-bold shrink-0 ml-2">
            {challenge.routeDistanceKm ? `${challenge.routeDistanceKm.toFixed(1)} km` : 'Percurso Ativo'}
          </span>
        </div>

        {/* Lista de Participantes (Máximo 2 no esqueleto atual, iterável para N) */}
        {!isMinimized && (
          <div className="p-3 space-y-2.5">
            {sortedParticipants.map((p, idx) => {
              const isFirst = idx === 0;
              const accentColor = p.color || (isFirst ? '#00FF66' : '#F59E0B');

              return (
                <div
                  key={p.playerId || idx}
                  className="p-2.5 rounded-xl bg-black/60 border transition-all cursor-pointer hover:border-white/25"
                  style={{ borderColor: `${accentColor}40` }}
                  onClick={() => onFocusParticipant && onFocusParticipant(p.position)}
                  title={`Clique para localizar ${p.nickname} no mapa`}
                >
                  {/* Topo do Participante: Rank + Avatar + Nome + % */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {getRankBadge(idx)}

                      {/* Avatar com borda com cor do participante */}
                      <div className="relative shrink-0">
                        <img
                          src={p.avatar}
                          alt={p.nickname}
                          className="w-7 h-7 rounded-full object-cover border-2"
                          style={{ borderColor: accentColor }}
                        />
                        {p.isCurrentUser && (
                          <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-black border border-yellow-400 text-[7px] font-black text-yellow-400 font-mono-stat">
                            EU
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white uppercase font-display block truncate">
                          {p.nickname}
                        </span>
                      </div>
                    </div>

                    {/* Porcentagem em Destaque */}
                    <div className="text-right shrink-0">
                      <span
                        className="text-sm font-black font-mono-stat"
                        style={{ color: accentColor }}
                      >
                        {Math.round(p.progress)}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso Customizada */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        width: `${Math.min(100, Math.max(0, p.progress))}%`,
                        backgroundColor: accentColor,
                        boxShadow: `0 0 10px ${accentColor}`,
                      }}
                    />
                  </div>

                  {/* Telemetria: Distância • Tempo • Velocidade */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 text-[10px] font-mono-stat text-slate-300">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-bold text-white">
                        {p.distance >= 1000 ? `${(p.distance / 1000).toFixed(2)} km` : `${Math.round(p.distance)} m`}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-bold text-white">{formatSeconds(p.elapsedTime)}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-bold text-white">{p.averageSpeed.toFixed(1)} km/h</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Ações da Disputa (Simulação / Finalização) */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              {onAdvanceStep && (
                <button
                  type="button"
                  onClick={onAdvanceStep}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold uppercase font-mono-stat tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Simula o avanço do percurso dos dois patinadores na rota"
                >
                  <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AVANÇAR (+10%)</span>
                </button>
              )}

              {onFinishChallenge && (
                <button
                  type="button"
                  onClick={onFinishChallenge}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[11px] uppercase font-mono-stat tracking-wider shadow-[0_0_15px_rgba(252,232,3,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>FINALIZAR</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
