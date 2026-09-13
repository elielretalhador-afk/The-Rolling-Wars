import React from 'react';
import { Award, Sparkles, X, Zap, ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import { Achievement, PlayerTitle } from '../types';

interface AchievementUnlockedModalProps {
  achievement: Achievement | null;
  onClose: () => void;
  onViewAllAchievements?: () => void;
  onEquipTitle?: (title: PlayerTitle) => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  onClose,
  onViewAllAchievements,
  onEquipTitle,
}) => {
  if (!achievement) return null;

  const xpReward = achievement.reward?.xp || achievement.xpReward || 100;
  const medalReward = achievement.reward?.medalName || null;
  const titleReward = achievement.reward?.titleName || null;
  const titleIdReward = achievement.reward?.titleId || null;

  const handleEquipNewlyUnlockedTitle = () => {
    if (titleReward && titleIdReward && onEquipTitle) {
      onEquipTitle({
        id: titleIdReward,
        name: titleReward,
        description: `Título desbloqueado ao concluir "${achievement.name}"`,
        rarity: 'raro',
        unlocked: true,
        requirement: achievement.requirement,
      });
    }
    onClose();
  };

  return (
    <div
      id="modal-achievement-unlocked"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85  animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#101b26] to-[#070c12] border-2 border-yellow-400/80 shadow-[0_0_60px_rgba(252,232,3,0.35)] p-6 relative overflow-hidden text-center">
        {/* Glowing backdrop elements */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Icon / Badge */}
        <div className="relative inline-flex items-center justify-center mt-2 mb-4">
          <div className="w-20 h-20 rounded-3xl bg-yellow-500/15 border-2 border-yellow-400/80 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(252,232,3,0.4)] animate-bounce">
            {achievement.icon || achievement.iconEmoji || '🏆'}
          </div>
          <div className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-yellow-400 text-black shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
          </div>
        </div>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-[10px] font-black text-yellow-300 font-mono-stat uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span>CONQUISTA DESBLOQUEADA!</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-white uppercase font-display tracking-tight leading-tight">
          "{achievement.name}"
        </h3>

        <p className="text-xs text-slate-300 mt-2 px-2 leading-relaxed">
          {achievement.description}
        </p>

        {/* Rewards Section */}
        <div className="mt-4 p-3 rounded-2xl bg-black/60 border border-yellow-500/40 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400/30" />
            <span className="text-sm font-black text-yellow-400 font-mono-stat">
              +{xpReward} XP ADICIONADOS
            </span>
          </div>

          {(medalReward || titleReward) && (
            <div className="pt-2 border-t border-white/10 flex flex-col gap-1 text-[11px] font-mono-stat">
              {medalReward && (
                <div className="flex items-center justify-center gap-1 text-cyan-300 font-bold">
                  <span>🏅 Medalha Forjada:</span>
                  <span className="text-white">{medalReward}</span>
                </div>
              )}
              {titleReward && (
                <div className="flex items-center justify-center gap-1 text-amber-300 font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Novo Título:</span>
                  <span className="text-white">"{titleReward}"</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          {titleReward && (
            <button
              type="button"
              onClick={handleEquipNewlyUnlockedTitle}
              className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              <span>EQUIPAR TÍTULO "{titleReward}"</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_20px_rgba(252,232,3,0.4)] active:scale-[0.98] transition-all cursor-pointer"
          >
            CONTINUAR PATINANDO
          </button>

          {onViewAllAchievements && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewAllAchievements();
              }}
              className="w-full py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs font-mono-stat uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver todas as conquistas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
