import React from 'react';
import { Trophy, Clock, Zap, Gauge, MapPin, Check, Play, X, Flag, Sparkles } from 'lucide-react';
import { ActivitySession } from '../types';

interface ActivitySummaryModalProps {
  isOpen: boolean;
  session: ActivitySession | null;
  onClose: () => void;
  onDismiss: () => void;
  onNewSession?: () => void;
}

export const ActivitySummaryModal: React.FC<ActivitySummaryModalProps> = ({
  isOpen,
  session,
  onClose,
  onDismiss,
  onNewSession,
}) => {
  if (!isOpen || !session) return null;

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const distanceVal = session.distance ?? session.distanceKm ?? 0;
  const formattedDistance =
    distanceVal < 1.0
      ? `${Math.round(distanceVal * 1000)} m`
      : `${distanceVal.toFixed(2)} km`;

  const durationVal = session.duration ?? session.durationSeconds ?? 0;
  const maxSpeedVal = session.maxSpeed ?? session.maxSpeedKmH ?? 0;
  const avgSpeedVal = session.averageSpeed ?? session.avgSpeedKmH ?? 0;
  const pointsCount = session.gpsPoints?.length ?? session.track?.length ?? session.pointsCount ?? 0;
  const xpEarnedVal = session.xpEarned ?? 0;
  const conqueredCount = session.zonesConquered?.length ?? 0;
  const visitedCount = session.zonesVisited?.length ?? session.zoneActivities?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-200">
      <div
        id="activity-summary-card"
        className="relative w-full max-w-sm rounded-3xl bg-[#090d12] border-2 border-[#00ff66] shadow-[0_0_50px_rgba(0,255,102,0.35)] p-6 overflow-hidden text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Neon decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00ff66]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge, Title & X Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl bg-[#00ff66]/20 border border-[#00ff66]/50 text-[#00ff66] shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-[#00ff66] uppercase tracking-widest font-mono-stat block">
                SESSÃO CONCLUÍDA
              </span>
              <h2 className="text-lg font-black text-white uppercase font-display leading-tight truncate">
                {session.title || 'ATIVIDADE FINALIZADA'}
              </h2>
            </div>
          </div>

          {/* Close X Button (closes summary and hides ended track from map) */}
          <button
            type="button"
            id="btn-dismiss-activity-summary"
            onClick={onDismiss}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/10 active:scale-95 transition-all shrink-0 ml-2"
            title="Fechar resumo e ocultar rastro"
            aria-label="Fechar resumo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Metric: Distância */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center mb-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono-stat block">
            DISTÂNCIA TOTAL PERCORRIDA
          </span>
          <div className="text-4xl font-black text-[#00ff66] font-mono-stat tracking-tight mt-1 drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]">
            {formattedDistance}
          </div>
        </div>

        {/* Highlight Banner: XP + Zonas (se houver) */}
        {(xpEarnedVal > 0 || conqueredCount > 0 || visitedCount > 0) && (
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-3 font-mono-stat text-xs">
            {xpEarnedVal > 0 && (
              <div className="flex items-center gap-1.5 text-amber-300 font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+{xpEarnedVal} XP</span>
              </div>
            )}
            {conqueredCount > 0 ? (
              <div className="flex items-center gap-1 text-yellow-400 font-bold text-[11px]">
                <Flag className="w-3 h-3" />
                <span>{conqueredCount} {conqueredCount === 1 ? 'zona conquistada' : 'zonas conquistadas'}</span>
              </div>
            ) : visitedCount > 0 ? (
              <div className="flex items-center gap-1 text-cyan-300 font-bold text-[11px]">
                <MapPin className="w-3 h-3" />
                <span>{visitedCount} {visitedCount === 1 ? 'zona visitada' : 'zonas visitadas'}</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Grid Metrics */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 font-mono-stat">
          {/* Tempo */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TEMPO</span>
            </div>
            <div className="text-lg font-black text-white">
              {formatDuration(durationVal)}
            </div>
          </div>

          {/* Velocidade Máxima */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase mb-1">
              <Zap className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>VEL. MÁXIMA</span>
            </div>
            <div className="text-lg font-black text-[#00ff66]">
              {maxSpeedVal.toFixed(1)}{' '}
              <span className="text-[10px] text-neutral-400 font-bold">KM/H</span>
            </div>
          </div>

          {/* Velocidade Média */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase mb-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>VEL. MÉDIA</span>
            </div>
            <div className="text-lg font-black text-cyan-300">
              {avgSpeedVal.toFixed(1)}{' '}
              <span className="text-[10px] text-neutral-400 font-bold">KM/H</span>
            </div>
          </div>

          {/* Pontos GPS */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase mb-1">
              <MapPin className="w-3.5 h-3.5 text-yellow-400" />
              <span>PONTOS GPS</span>
            </div>
            <div className="text-lg font-black text-white">
              {pointsCount}{' '}
              <span className="text-[10px] text-neutral-400 font-bold">PTS</span>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="p-2.5 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 text-neutral-300 text-[11px] font-medium text-center mb-4">
          Percurso registrado na sessão. O rastro continua desenhado no mapa!
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            id="btn-close-activity-summary"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-[#00ff66] hover:bg-[#00e55b] text-black font-black text-xs uppercase font-mono-stat tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            VER RASTRO NO MAPA
          </button>

          {onNewSession && (
            <button
              type="button"
              id="btn-new-activity-session"
              onClick={() => {
                onClose();
                onNewSession();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase font-mono-stat border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#00ff66]" />
              INICIAR NOVA PATINAÇÃO
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
