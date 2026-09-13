import React from 'react';
import { Trophy, Zap, Clock, Navigation, CheckCircle2, Shield, ArrowRight, X } from 'lucide-react';
import { ConquestResultModalData } from '../types';

interface ZoneConqueredModalProps {
  data: ConquestResultModalData | null;
  onClose: () => void;
  onViewZoneDetails?: () => void;
}

export const ZoneConqueredModal: React.FC<ZoneConqueredModalProps> = ({
  data,
  onClose,
  onViewZoneDetails,
}) => {
  if (!data) return null;

  const { zone, zoneName, durationFormatted, distanceKmFormatted, xpEarned, player } = data;
  const zoneColor = zone.color || zone.accentColor || '#00FF66';

  return (
    <div
      id="modal-zone-conquered"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#090d13] border-2 shadow-[0_0_60px_rgba(0,255,102,0.4)] text-center flex flex-col items-center relative overflow-hidden p-6"
        style={{ borderColor: zoneColor }}
      >
        {/* Ambient Glows */}
        <div
          className="absolute -top-16 -left-16 w-40 h-40 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ backgroundColor: zoneColor }}
        />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-yellow-500/25 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          id="btn-close-conquest-modal"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy Icon with pulsing neon aura */}
        <div className="relative mb-3 mt-1">
          <div
            className="w-16 h-16 rounded-2xl bg-[#0e1620] border-2 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(0,255,102,0.5)]"
            style={{ borderColor: zoneColor }}
          >
            🏆
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 border-2 border-black" />
          </span>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider font-mono-stat">
            ZONA CONQUISTADA!
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-display leading-tight mb-1">
          {zoneName}
        </h2>

        {/* Subtitle */}
        <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed max-w-[280px]">
          Você assumiu o controle da <strong className="text-white">{zoneName}</strong> com <span className="text-emerald-300 font-bold">100% de domínio</span>.
        </p>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 mb-4 font-mono-stat">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold">
              <Clock className="w-3 h-3 text-cyan-400" />
              Tempo
            </div>
            <div className="text-xs sm:text-sm font-black text-white mt-1">
              {durationFormatted}
            </div>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold">
              <Navigation className="w-3 h-3 text-yellow-400" />
              Distância
            </div>
            <div className="text-xs sm:text-sm font-black text-emerald-300 mt-1">
              {distanceKmFormatted}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold">
              <Zap className="w-3 h-3 text-amber-400" />
              XP Ganho
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-400 mt-1">
              +{xpEarned} XP
            </div>
          </div>
        </div>

        {/* Controller Badge Box */}
        <div className="w-full p-2.5 rounded-xl bg-[#0c1219] border border-yellow-500/30 flex items-center justify-between gap-2.5 mb-4 text-left">
          <div className="flex items-center gap-2.5 min-w-0">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.nickname}
                className="w-9 h-9 rounded-lg object-cover border-2 border-yellow-400 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-800 border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {player.nickname?.[0] || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[9px] text-neutral-400 uppercase font-bold font-mono-stat">Novo Controlador</div>
              <div className="text-xs font-black text-white font-display uppercase truncate">
                {player.nickname}
              </div>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-emerald-300 border border-yellow-400/40 text-[9px] font-black uppercase font-mono-stat shrink-0">
            CONTROLADA
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            id="btn-conquest-continue-skating"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_25px_rgba(0,255,102,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            CONTINUAR PATINANDO
          </button>

          {onViewZoneDetails && (
            <button
              type="button"
              id="btn-conquest-view-zone"
              onClick={() => {
                onClose();
                onViewZoneDetails();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-black text-[11px] uppercase font-mono-stat border border-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              VER DETALHES DA ZONA
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
