import React from 'react';
import { ArrowRight, CheckCircle2, Crown, Sparkles, X, Zap } from 'lucide-react';
import { LevelDefinition, Reward } from '../types';
import { getRarityColor } from '../data/progressionData';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  levelDefinition?: LevelDefinition;
  onOpenInventory?: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  levelDefinition,
  onOpenInventory,
}) => {
  if (!isOpen) return null;

  const rewards = levelDefinition?.rewards || [];

  return (
    <div
      id="modal-level-up"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85  animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#101e28] to-[#070c12] border-2 border-yellow-400/90 shadow-[0_0_70px_rgba(252,232,3,0.4)] p-6 relative overflow-hidden text-center">
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-yellow-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-[10px] font-black text-yellow-300 font-mono-stat uppercase tracking-widest mb-3">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
          <span>LEVEL UP • SUBIDA DE NÍVEL</span>
        </div>

        {/* Level Number Showcase */}
        <div className="relative my-3">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-b from-yellow-500/20 to-blue-950/40 border-2 border-yellow-400 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(252,232,3,0.5)]">
            <span className="text-[10px] font-black text-yellow-300 font-mono-stat tracking-wider">NÍVEL</span>
            <span className="text-4xl font-black text-white font-display tracking-tight mt-[-4px]">
              {newLevel}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
          PARABÉNS, PATINADOR!
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-[260px] mx-auto leading-relaxed">
          Você acumulou XP suficiente e alcançou o patamar de <strong className="text-yellow-400">{levelDefinition?.title || `Nível ${newLevel}`}</strong>!
        </p>

        {/* Unlocked Rewards List */}
        {rewards.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-yellow-500/30 text-left space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase font-mono-stat flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>RECOMPENSAS DESBLOQUEADAS ({rewards.length})</span>
            </div>

            <div className="space-y-1.5">
              {rewards.map((reward) => {
                const rarityStyle = getRarityColor(reward.rarity);
                return (
                  <div
                    key={reward.id}
                    className={`p-2 rounded-xl border ${rarityStyle.border} ${rarityStyle.bg} flex items-center justify-between gap-2`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{reward.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white font-display truncate">
                          {reward.name}
                        </div>
                        <div className="text-[9px] text-slate-300 truncate">
                          {reward.description}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase shrink-0 font-mono-stat ${rarityStyle.badge}`}>
                      {reward.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          {onOpenInventory && (
            <button
              type="button"
              id="btn-level-up-view-inventory"
              onClick={() => {
                onClose();
                onOpenInventory();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_20px_rgba(252,232,3,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VER NO INVENTÁRIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs font-mono-stat uppercase tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            CONTINUAR PATINANDO
          </button>
        </div>
      </div>
    </div>
  );
};
