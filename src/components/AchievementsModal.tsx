import React, { useState } from 'react';
import {
  Award,
  Trophy,
  X,
  Zap,
  CheckCircle2,
  Lock,
  Flame,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  Layers,
  Search,
  Check,
  Crown,
  EyeOff,
} from 'lucide-react';
import { Achievement, AchievementCategory, ItemRarity, PlayerMedal, PlayerTitle } from '../types';
import { MOCK_MEDALS, MOCK_TITLES } from '../data/mockData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  medals?: PlayerMedal[];
  titles?: PlayerTitle[];
  activeTitleId?: string;
  onEquipTitle?: (title: PlayerTitle) => void;
  onTriggerAchievementUnlock?: (achievement: Achievement) => void;
  initialTab?: 'conquistas' | 'medalhas' | 'titulos';
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  medals = MOCK_MEDALS,
  titles = MOCK_TITLES,
  activeTitleId = 'tit_03',
  onEquipTitle,
  onTriggerAchievementUnlock,
  initialTab = 'conquistas',
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'conquistas' | 'medalhas' | 'titulos'>(initialTab);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'desbloqueadas' | 'em_progresso' | 'bloqueadas'>('todas');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [equippedTitleId, setEquippedTitleId] = useState<string>(activeTitleId);
  const [selectedMedalDetail, setSelectedMedalDetail] = useState<PlayerMedal | null>(null);

  if (!isOpen) return null;

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked || a.isUnlocked).length;
  const totalAchievementsCount = achievements.length;
  const overallPercentage = totalAchievementsCount > 0 ? Math.round((unlockedAchievementsCount / totalAchievementsCount) * 100) : 0;
  
  const unlockedMedalsCount = medals.filter((m) => m.unlocked).length;
  const unlockedTitlesCount = titles.filter((t) => t.unlocked).length;

  const totalXpEarned = achievements
    .filter((a) => a.unlocked || a.isUnlocked)
    .reduce((acc, curr) => acc + (curr.reward?.xp || curr.xpReward || 0), 0);

  // Normalização de categoria para filtro
  const normalizeCategory = (cat: string): string => {
    const map: Record<string, string> = {
      distancia: 'DISTÂNCIA',
      velocidade: 'VELOCIDADE',
      zonas: 'ZONAS',
      constancia: 'CONSISTÊNCIA',
      exploracao: 'EXPLORAÇÃO',
      noturno: 'COLEÇÃO',
      especial: 'COLEÇÃO',
    };
    return map[cat] || cat.toUpperCase();
  };

  const filteredAchievements = achievements.filter((ach) => {
    const isUnlocked = ach.unlocked ?? ach.isUnlocked ?? false;
    const progress = ach.progress ?? ach.currentProgress ?? 0;

    // Status Filter
    if (activeFilter === 'desbloqueadas' && !isUnlocked) return false;
    if (activeFilter === 'em_progresso' && (isUnlocked || progress === 0)) return false;
    if (activeFilter === 'bloqueadas' && (isUnlocked || progress > 0)) return false;

    // Category Filter
    if (selectedCategory !== 'todas') {
      const normAchCat = normalizeCategory(ach.category);
      const normSelCat = normalizeCategory(selectedCategory);
      if (normAchCat !== normSelCat) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ach.name.toLowerCase().includes(q) ||
        ach.description.toLowerCase().includes(q) ||
        ach.category.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getRarityBadge = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'lendario':
        return {
          label: 'Lendário',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
        };
      case 'epico':
        return {
          label: 'Épico',
          classes: 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
        };
      case 'raro':
        return {
          label: 'Raro',
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
        };
      case 'comum':
      default:
        return {
          label: 'Comum',
          classes: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
        };
    }
  };

  const handleEquip = (title: PlayerTitle) => {
    if (!title.unlocked) return;
    setEquippedTitleId(title.id);
    if (onEquipTitle) {
      onEquipTitle(title);
    }
  };

  return (
    <div
      id="modal-achievements-center"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg h-[92vh] max-h-[740px] rounded-3xl bg-[#000000] border-2 border-yellow-500/40 shadow-[0_0_50px_rgba(252,232,3,0.25)] flex flex-col relative overflow-hidden">
        {/* Glow Decorators */}
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-4 pb-3 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center text-xl text-yellow-400 shadow-sm">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-display uppercase tracking-wide">
                  CENTRAL DE HONRA
                </h2>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-stat uppercase">
                Conquistas • Medalhas • Títulos
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-achievements"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="p-2 bg-[#000000] border-b border-white/10 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            id="tab-conquistas-btn"
            onClick={() => setActiveMainTab('conquistas')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-mono-stat font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMainTab === 'conquistas'
                ? 'bg-yellow-400 text-black shadow-[0_0_14px_rgba(252,232,3,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Conquistas ({unlockedAchievementsCount}/{totalAchievementsCount})</span>
          </button>

          <button
            type="button"
            id="tab-medalhas-btn"
            onClick={() => setActiveMainTab('medalhas')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-mono-stat font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMainTab === 'medalhas'
                ? 'bg-yellow-400 text-black shadow-[0_0_14px_rgba(252,232,3,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Medalhas ({unlockedMedalsCount})</span>
          </button>

          <button
            type="button"
            id="tab-titulos-btn"
            onClick={() => setActiveMainTab('titulos')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-mono-stat font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMainTab === 'titulos'
                ? 'bg-yellow-400 text-black shadow-[0_0_14px_rgba(252,232,3,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Títulos ({unlockedTitlesCount})</span>
          </button>
        </div>

        {/* Global Progress Summary Header */}
        <div className="px-4 py-2.5 bg-[#0a0a0a] border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white font-mono-stat">
                {activeMainTab === 'conquistas' && `🏆 ${unlockedAchievementsCount} DE ${totalAchievementsCount} CONQUISTAS`}
                {activeMainTab === 'medalhas' && `🏅 ${unlockedMedalsCount} DE ${medals.length} MEDALHAS COLECIONADAS`}
                {activeMainTab === 'titulos' && `👑 ${unlockedTitlesCount} DE ${titles.length} TÍTULOS DISPONÍVEIS`}
              </span>
              <span className="text-[10px] text-yellow-400 font-bold font-mono-stat">
                ({overallPercentage}%)
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/15 border border-yellow-500/30 text-[10px] font-black text-yellow-300 font-mono-stat">
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400/30" />
              <span>+{totalXpEarned} XP GANHOS</span>
            </div>
          </div>

          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full shadow-[0_0_10px_#fce803] transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABA 1: CONQUISTAS */}
        {/* ========================================================================= */}
        {activeMainTab === 'conquistas' && (
          <>
            {/* Search & Filter Controls */}
            <div className="px-4 py-2.5 border-b border-white/5 bg-[#050505] shrink-0 space-y-2">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveFilter('todas')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all shrink-0 cursor-pointer ${
                    activeFilter === 'todas'
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.3)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({achievements.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('desbloqueadas')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all shrink-0 cursor-pointer ${
                    activeFilter === 'desbloqueadas'
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.3)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Desbloqueadas ({unlockedAchievementsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('em_progresso')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all shrink-0 cursor-pointer ${
                    activeFilter === 'em_progresso'
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.3)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Em Progresso
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('bloqueadas')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all shrink-0 cursor-pointer ${
                    activeFilter === 'bloqueadas'
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.3)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Bloqueadas
                </button>
              </div>

              {/* Categories Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[9px] font-mono-stat">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('todas')}
                  className={`px-2 py-0.5 rounded-md uppercase font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === 'todas'
                      ? 'bg-white/20 text-white border border-white/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Qualquer Categoria
                </button>
                {(['ATIVIDADE', 'DISTÂNCIA', 'ZONAS', 'DESAFIOS', 'VELOCIDADE', 'EXPLORAÇÃO', 'CONSISTÊNCIA', 'COLEÇÃO'] as AchievementCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-md uppercase font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar conquista ou requisito..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/60 font-mono-stat"
                />
              </div>
            </div>

            {/* List of Achievements */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAchievements.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-mono-stat text-xs">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  Nenhuma conquista encontrada com os filtros selecionados.
                </div>
              ) : (
                filteredAchievements.map((achievement) => {
                  const isUnlocked = achievement.unlocked ?? achievement.isUnlocked ?? false;
                  const currentProg = achievement.progress ?? achievement.currentProgress ?? 0;
                  const targetProg = achievement.target ?? achievement.targetProgress ?? 1;
                  const unit = achievement.unit || 'pts';
                  const progressPct = Math.min(100, Math.round((currentProg / targetProg) * 100));

                  return (
                    <div
                      key={achievement.id}
                      id={`achievement-card-${achievement.id}`}
                      className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                        isUnlocked
                          ? 'bg-[#0a0a0a] border-yellow-500/50 shadow-md shadow-yellow-500/5'
                          : achievement.isSecret && !isUnlocked
                          ? 'bg-[#050505] border-purple-500/30 opacity-80'
                          : 'bg-[#050505] border-white/10 opacity-90'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon Box */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border relative ${
                            isUnlocked
                              ? 'bg-yellow-500/15 border-yellow-400/60 shadow-[0_0_15px_rgba(252,232,3,0.3)]'
                              : achievement.isSecret
                              ? 'bg-purple-950/30 border-purple-500/40 text-purple-400'
                              : 'bg-slate-900 border-white/10 text-slate-500'
                          }`}
                        >
                          {achievement.isSecret && !isUnlocked ? '🔒' : (achievement.icon || achievement.iconEmoji || '🏆')}
                          {isUnlocked && (
                            <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-yellow-400 text-black">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-white/5 text-slate-400 border border-white/5">
                              {normalizeCategory(achievement.category)}
                            </span>

                            {/* Rewards Preview */}
                            <div className="flex items-center gap-1.5 text-[9px] font-mono-stat font-bold">
                              {(achievement.reward?.xp || achievement.xpReward) && (
                                <span className="text-yellow-400 flex items-center gap-0.5">
                                  ⚡ +{achievement.reward?.xp || achievement.xpReward} XP
                                </span>
                              )}
                              {achievement.reward?.medalId && (
                                <span className="text-cyan-300 flex items-center gap-0.5">
                                  🏅 Medalha
                                </span>
                              )}
                              {achievement.reward?.titleId && (
                                <span className="text-amber-300 flex items-center gap-0.5">
                                  👑 Título
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title & Description */}
                          <h3
                            className={`text-xs sm:text-sm font-black uppercase tracking-tight font-display ${
                              isUnlocked ? 'text-white' : achievement.isSecret ? 'text-purple-300' : 'text-slate-200'
                            }`}
                          >
                            {achievement.isSecret && !isUnlocked ? '??? Conquista Secreta' : achievement.name}
                          </h3>

                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {achievement.isSecret && !isUnlocked
                              ? achievement.secretHint || 'Conquista misteriosa. Continue explorando a cidade para desbloquear.'
                              : achievement.description}
                          </p>

                          {/* Requirement note */}
                          {achievement.requirement && !achievement.isSecret && (
                            <p className="text-[10px] text-slate-400 mt-1 font-mono-stat">
                              Requisito: {achievement.requirement}
                            </p>
                          )}

                          {/* Future Rewards Tag Box */}
                          {achievement.reward && (
                            <div className="mt-2 p-2 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center gap-2 text-[10px] font-mono-stat">
                              <span className="text-slate-400 text-[9px] uppercase font-bold">Recompensa:</span>
                              {achievement.reward.xp && (
                                <span className="text-yellow-400 font-bold">+{achievement.reward.xp} XP</span>
                              )}
                              {achievement.reward.medalName && (
                                <span className="text-cyan-300 font-bold flex items-center gap-1">
                                  {achievement.reward.medalIcon || '🏅'} {achievement.reward.medalName}
                                </span>
                              )}
                              {achievement.reward.titleName && (
                                <span className="text-amber-300 font-bold flex items-center gap-1">
                                  👑 "{achievement.reward.titleName}"
                                </span>
                              )}
                            </div>
                          )}

                          {/* Progress Bar & Numeric Target */}
                          <div className="mt-2.5 pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-mono-stat mb-1 font-bold">
                              <span className="text-slate-400">
                                {isUnlocked ? (
                                  <span className="text-yellow-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {achievement.unlockedAt ? `Desbloqueada em ${achievement.unlockedAt}` : 'Concluída'}
                                  </span>
                                ) : (
                                  'Progresso'
                                )}
                              </span>
                              <span className={isUnlocked ? 'text-yellow-400' : 'text-white'}>
                                {currentProg} / {targetProg} {unit}
                                {!isUnlocked && ` (${progressPct}%)`}
                              </span>
                            </div>

                            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden p-[1px] border border-white/10">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isUnlocked
                                    ? 'bg-yellow-400 shadow-[0_0_8px_#fce803]'
                                    : 'bg-gradient-to-r from-yellow-600 to-cyan-400'
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick test unlock trigger */}
                          {onTriggerAchievementUnlock && !isUnlocked && (
                            <div className="mt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => onTriggerAchievementUnlock(achievement)}
                                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-yellow-400/20 text-slate-400 hover:text-yellow-300 text-[9px] font-mono-stat font-bold transition-all cursor-pointer border border-white/5"
                              >
                                Simular Desbloqueio ⚡
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: MINHAS MEDALHAS */}
        {/* ========================================================================= */}
        {activeMainTab === 'medalhas' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-neutral-900/30 to-[#0a121c] border border-yellow-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white font-display uppercase tracking-wider">
                  GALERIA DE MEDALHAS URBANAS
                </h3>
                <p className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                  Conquiste feitos no asfalto para forjar insígnias exclusivas
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-yellow-400 font-mono-stat">
                  {unlockedMedalsCount} / {medals.length}
                </span>
                <div className="text-[9px] text-slate-500 uppercase font-mono-stat">Colecionadas</div>
              </div>
            </div>

            {/* Medals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {medals.map((medal) => {
                const rarityInfo = getRarityBadge(medal.rarity);
                const isSelected = selectedMedalDetail?.id === medal.id;

                return (
                  <div
                    key={medal.id}
                    id={`medal-card-${medal.id}`}
                    onClick={() => setSelectedMedalDetail(medal)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-center relative overflow-hidden flex flex-col items-center justify-between ${
                      medal.unlocked
                        ? 'bg-gradient-to-b from-[#111c28] to-[#0a1017] border-yellow-400/50 shadow-md hover:scale-[1.02]'
                        : 'bg-[#050505] border-white/5 opacity-60 hover:opacity-80'
                    } ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    {/* Glow on unlocked */}
                    {medal.unlocked && (
                      <div
                        className="absolute -top-8 -left-8 w-20 h-20 rounded-full blur-xl pointer-events-none opacity-40"
                        style={{ backgroundColor: medal.visualGlowColor || '#fce803' }}
                      />
                    )}

                    {/* Rarity Pill */}
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase font-mono-stat border mb-2 ${rarityInfo.classes}`}>
                      {rarityInfo.label}
                    </span>

                    {/* Medal Big Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl my-1 border relative ${
                        medal.unlocked
                          ? 'bg-black/50 border-yellow-400/60 shadow-[0_0_20px_rgba(252,232,3,0.3)]'
                          : 'bg-black/30 border-white/10 grayscale'
                      }`}
                    >
                      {medal.icon}
                      {!medal.unlocked && (
                        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Medal Name & Date */}
                    <div className="mt-2 w-full">
                      <h4 className="text-xs font-black text-white uppercase font-display truncate">
                        {medal.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-mono-stat mt-0.5 truncate">
                        {medal.unlocked
                          ? `🏅 ${medal.unlockedAt || 'Desbloqueada'}`
                          : 'Bloqueada'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Medal Detail Modal Card */}
            {selectedMedalDetail && (
              <div className="p-4 rounded-2xl bg-[#050505] border-2 border-yellow-400/60 shadow-xl mt-4 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-black/50 border border-yellow-400/50 flex items-center justify-center text-3xl">
                      {selectedMedalDetail.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white uppercase font-display">
                          {selectedMedalDetail.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono-stat border ${getRarityBadge(selectedMedalDetail.rarity).classes}`}>
                          {selectedMedalDetail.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {selectedMedalDetail.description}
                      </p>
                      {selectedMedalDetail.unlockedAt && (
                        <p className="text-[10px] text-yellow-400 font-mono-stat font-bold mt-1">
                          Conquistada em: {selectedMedalDetail.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMedalDetail(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: TÍTULOS */}
        {/* ========================================================================= */}
        {activeMainTab === 'titulos' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#0a121c] border border-amber-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white font-display uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>TÍTULOS DE HONRA</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                  Equipe o título que será exibido no seu perfil e nas disputas públicas
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400 font-mono-stat">
                  {unlockedTitlesCount} / {titles.length}
                </span>
                <div className="text-[9px] text-slate-500 uppercase font-mono-stat">Desbloqueados</div>
              </div>
            </div>

            {/* List of Titles */}
            <div className="space-y-2.5">
              {titles.map((title) => {
                const isEquipped = title.id === equippedTitleId;
                const rarityInfo = getRarityBadge(title.rarity);

                return (
                  <div
                    key={title.id}
                    id={`title-card-${title.id}`}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-gradient-to-r from-amber-950/40 via-[#131b26] to-[#0a0a0a] border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                        : title.unlocked
                        ? 'bg-[#0a0a0a] border-white/15 hover:border-yellow-400/50'
                        : 'bg-[#050505] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                          isEquipped
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                            : title.unlocked
                            ? 'bg-white/5 border-white/10 text-white'
                            : 'bg-black/40 border-white/5 text-slate-600'
                        }`}
                      >
                        {title.icon || '👑'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white uppercase font-display tracking-wide truncate">
                            "{title.name}"
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase font-mono-stat border ${rarityInfo.classes}`}>
                            {rarityInfo.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                          {title.description}
                        </p>

                        <p className="text-[9px] text-slate-400 font-mono-stat mt-0.5">
                          {title.unlocked
                            ? `✓ Desbloqueado ${title.unlockedAt ? `em ${title.unlockedAt}` : ''}`
                            : `Requisito: ${title.requirement}`}
                        </p>
                      </div>
                    </div>

                    {/* Action Button: Equip / Equipped / Locked */}
                    <div className="shrink-0">
                      {isEquipped ? (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-black text-[10px] font-mono-stat uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>EQUIPADO</span>
                        </div>
                      ) : title.unlocked ? (
                        <button
                          type="button"
                          id={`btn-equip-title-${title.id}`}
                          onClick={() => handleEquip(title)}
                          className="px-3 py-1.5 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 text-yellow-300 hover:text-black font-black text-[10px] font-mono-stat uppercase tracking-wider border border-yellow-400/40 active:scale-95 transition-all cursor-pointer"
                        >
                          EQUIPAR
                        </button>
                      ) : (
                        <div className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 font-bold text-[10px] font-mono-stat uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>BLOQUEADO</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-[#000000] border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono-stat shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span>Estrutura de Honra THE ROLLING WARS</span>
          </div>
          <span className="text-[9px] text-slate-500">v1.2</span>
        </div>
      </div>
    </div>
  );
};
