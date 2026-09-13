import React from 'react';
import { Target, Flag, X, Zap, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { Zone } from '../types';

interface ZoneEntryPromptModalProps {
  zone: Zone;
  onAccept: (zone: Zone) => void;
  onDecline: (zone: Zone) => void;
}

export const ZoneEntryPromptModal: React.FC<ZoneEntryPromptModalProps> = ({
  zone,
  onAccept,
  onDecline,
}) => {
  const minMeters = zone.captureRequirements?.minDistance || 100;
  const zoneColor = zone.color || zone.accentColor || '#00FF66';

  return (
    <div
      id="modal-zone-entry-prompt"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#050505] border-2 border-yellow-400/80 shadow-[0_0_50px_rgba(252,232,3,0.4)] text-center flex flex-col items-center relative overflow-hidden p-5 sm:p-6">
        {/* Glow backdrop accent */}
        <div
          className="absolute -top-16 -left-16 w-36 h-36 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: zoneColor }}
        />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-yellow-500/20 blur-3xl pointer-events-none" />

        {/* Close / Ignore button top-right */}
        <button
          type="button"
          id="btn-zone-prompt-dismiss"
          onClick={() => onDecline(zone)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulsing Icon */}
        <div className="relative mb-3 mt-1">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/15 border-2 border-yellow-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(252,232,3,0.4)]">
            <Target className="w-7 h-7 text-yellow-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400" />
          </span>
        </div>

        {/* Eyebrow / Banner */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-2">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider font-mono-stat">
            Você entrou em uma zona!
          </span>
        </div>

        {/* Zone Name */}
        <h2 className="text-lg sm:text-xl font-black text-white uppercase font-display leading-tight mb-2 max-w-[260px] truncate">
          {zone.name}
        </h2>

        {/* Zone Meta Pills */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <span
            className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md font-mono-stat text-black"
            style={{ backgroundColor: zoneColor }}
          >
            {zone.type?.toUpperCase() || 'STREET'}
          </span>
          <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md bg-white/10 text-yellow-300 border border-yellow-400/30 font-mono-stat flex items-center gap-1">
            <Flag className="w-2.5 h-2.5 text-yellow-400" />
            Controlador: Livre
          </span>
        </div>

        {/* Question & Objective Box */}
        <div className="w-full p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 text-left font-mono-stat">
          <div className="text-xs font-black text-white flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Quer tentar conquistar esta zona?</span>
          </div>
          <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
            Patine no mínimo <strong className="text-yellow-300 font-bold">{minMeters}m</strong> dentro do raio da zona durante a sua patinação para assumir o controle com 100% de domínio.
          </p>
        </div>

        {/* Action Buttons: BORA! vs AGORA NÃO */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="btn-zone-conquest-decline"
            onClick={() => onDecline(zone)}
            className="w-full py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-black text-xs uppercase font-mono-stat border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            AGORA NÃO
          </button>

          <button
            type="button"
            id="btn-zone-conquest-accept"
            onClick={() => onAccept(zone)}
            className="w-full py-3 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase font-mono-stat shadow-[0_0_25px_rgba(252,232,3,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            BORA!
          </button>
        </div>
      </div>
    </div>
  );
};
