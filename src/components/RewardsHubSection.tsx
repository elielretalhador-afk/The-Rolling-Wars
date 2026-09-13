import React, { useState } from 'react';
import {
  Gift,
  Lock,
  CheckCircle2,
  Sparkles,
  Crown,
  Shield,
  Layers,
  ChevronRight,
  Zap,
  Tag,
  Flame,
  Check,
} from 'lucide-react';
import {
  INITIAL_REWARDS_CATALOG,
  LevelRewardItem,
  REWARD_CATEGORY_TABS,
  RewardCategory,
  getRarityBadgeStyle,
} from '../data/rewardsData';
import { UserProfile } from '../types';

interface RewardsHubSectionProps {
  currentUser: UserProfile;
  onItemEquipToggle?: (itemId: string, category: RewardCategory) => void;
}

export const RewardsHubSection: React.FC<RewardsHubSectionProps> = ({
  currentUser,
  onItemEquipToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'desbloqueados' | 'bloqueados' | 'equipados'>('todos');
  const [items, setItems] = useState<LevelRewardItem[]>(INITIAL_REWARDS_CATALOG);

  // Dynamic unlock checking against current user level
  const userLevel = currentUser.level || 12;

  const handleToggleEquip = (item: LevelRewardItem) => {
    if (!item.isUnlocked && userLevel < item.unlockedLevel) return;

    setItems((prevItems) => {
      const isCurrentlyEquipped = item.isEquipped;
      return prevItems.map((it) => {
        // If it's in the same category and we are equipping this item, unequip other items in the same category
        if (it.category === item.category) {
          if (it.id === item.id) {
            return { ...it, isEquipped: !isCurrentlyEquipped };
          } else if (!isCurrentlyEquipped) {
            return { ...it, isEquipped: false };
          }
        }
        return it;
      });
    });

    if (onItemEquipToggle) {
      onItemEquipToggle(item.id, item.category);
    }
  };

  const processedItems = items.map((item) => {
    const isUnlocked = item.isUnlocked || userLevel >= item.unlockedLevel;
    return {
      ...item,
      isUnlocked,
    };
  });

  const filteredItems = processedItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'todos' || item.category === selectedCategory;

    if (!matchesCategory) return false;

    if (statusFilter === 'desbloqueados') return item.isUnlocked;
    if (statusFilter === 'bloqueados') return !item.isUnlocked;
    if (statusFilter === 'equipados') return item.isEquipped;

    return true;
  });

  const totalUnlocked = processedItems.filter((i) => i.isUnlocked).length;
  const totalItems = processedItems.length;
  const progressPercent = Math.round((totalUnlocked / totalItems) * 100);

  // Find next unlock item for motivation
  const nextUnlockItem = processedItems
    .filter((i) => !i.isUnlocked && i.unlockedLevel > userLevel)
    .sort((a, b) => a.unlockedLevel - b.unlockedLevel)[0];

  return (
    <div id="recompensas-section" className="mt-4">
      {/* Section Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#111e28] to-[#090e14] border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-display uppercase tracking-tight">
                  RECOMPENSAS & DESBLOQUEIOS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-black font-mono-stat">
                  PROGRESSÃO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Itens virtuais, cosméticos e colecionáveis liberados por nível e conquistas.
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono-stat mb-1.5">
            <span className="text-slate-400 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Total Desbloqueado:
            </span>
            <span className="text-amber-300 font-black">
              {totalUnlocked} de {totalItems} itens ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-[#0a0a0a] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 transition-all duration-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Next unlock prompt */}
          {nextUnlockItem && (
            <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-400/30 text-[10px] font-mono-stat">
              <div className="flex items-center gap-1.5 text-amber-300 truncate">
                <span className="text-base">{nextUnlockItem.icon}</span>
                <span className="font-bold truncate">Próximo Desbloqueio: {nextUnlockItem.name}</span>
              </div>
              <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40 shrink-0 ml-2">
                NÍVEL {nextUnlockItem.unlockedLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs (Scrollable horizontal pill bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 mt-1">
        {REWARD_CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-reward-category-${tab.id}`}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-amber-400 text-black font-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'bg-[#0a0a0a] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Status Sub-filter (Todos / Desbloqueados / Bloqueados / Equipados) */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#000000] border border-white/10 rounded-2xl mb-3">
        <button
          type="button"
          onClick={() => setStatusFilter('todos')}
          className={`py-1.5 text-[10px] font-black uppercase font-mono-stat rounded-xl transition-all ${
            statusFilter === 'todos'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('desbloqueados')}
          className={`py-1.5 text-[10px] font-black uppercase font-mono-stat rounded-xl transition-all ${
            statusFilter === 'desbloqueados'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Liberados
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('bloqueados')}
          className={`py-1.5 text-[10px] font-black uppercase font-mono-stat rounded-xl transition-all ${
            statusFilter === 'bloqueados'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bloqueados
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('equipados')}
          className={`py-1.5 text-[10px] font-black uppercase font-mono-stat rounded-xl transition-all ${
            statusFilter === 'equipados'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Equipados
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center">
            <Gift className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-bold uppercase font-mono-stat">
              Nenhum item nesta categoria com o filtro selecionado.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const rarityStyle = getRarityBadgeStyle(item.rarity);
            return (
              <div
                key={item.id}
                id={`reward-card-${item.id}`}
                className={`p-3.5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  item.isEquipped
                    ? 'bg-gradient-to-r from-[#102a70] via-[#06102b] to-[#102a70] border-yellow-400/80 shadow-[0_0_20px_rgba(252,232,3,0.2)]'
                    : item.isUnlocked
                    ? 'bg-[#000000] border-white/10 hover:border-white/20'
                    : 'bg-[#090d12]/90 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border relative ${
                        item.isUnlocked
                          ? `${rarityStyle.bgClass} ${rarityStyle.borderClass} ${rarityStyle.glowClass}`
                          : 'bg-black/60 border-slate-700 text-slate-500'
                      }`}
                    >
                      <span>{item.icon}</span>
                      {!item.isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 [1px] rounded-2xl flex items-center justify-center">
                          <Lock className="w-5 h-5 text-amber-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase font-mono-stat border ${rarityStyle.bgClass} ${rarityStyle.borderClass} ${rarityStyle.textClass}`}
                        >
                          {item.rarity}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.2 rounded font-mono-stat uppercase">
                          {item.categoryLabel}
                        </span>
                        {item.collectionName && (
                          <span className="text-[8px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono-stat">
                            {item.collectionName}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white uppercase font-display mt-0.5 truncate">
                        {item.name}
                      </h4>

                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Requirement or Bonus */}
                      <div className="mt-1.5 flex items-center gap-2">
                        {item.isUnlocked ? (
                          <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-1 font-mono-stat">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.unlockRequirement.label}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 font-mono-stat bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                            <Lock className="w-3 h-3 text-amber-400" />
                            Requisito: {item.unlockRequirement.label}
                          </span>
                        )}

                        {item.metadata?.bonusLabel && (
                          <span className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono-stat">
                            {item.metadata.bonusLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Equip / Status Action */}
                  <div className="shrink-0 flex flex-col items-end justify-center">
                    {item.isUnlocked ? (
                      <button
                        type="button"
                        id={`btn-equip-${item.id}`}
                        onClick={() => handleToggleEquip(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase font-mono-stat tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          item.isEquipped
                            ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(252,232,3,0.4)]'
                            : 'bg-[#0c1b47] text-yellow-400 border border-yellow-500/50 hover:bg-[#193227]'
                        }`}
                      >
                        {item.isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>EQUIPADO</span>
                          </>
                        ) : (
                          <span>EQUIPAR</span>
                        )}
                      </button>
                    ) : (
                      <div className="px-2.5 py-1 rounded-xl bg-[#0a0a0a] border border-slate-800 text-[9px] font-black text-slate-500 uppercase font-mono-stat flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>BLOQUEADO</span>
                      </div>
                    )}
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
