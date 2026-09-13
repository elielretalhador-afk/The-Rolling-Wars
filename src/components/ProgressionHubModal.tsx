import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Disc,
  Flame,
  Globe,
  Grid,
  History,
  Info,
  Layers,
  Lock,
  Package,
  Search,
  Shield,
  Sparkles,
  Star,
  Tag,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import {
  Collection,
  EquippedCosmetics,
  InventoryCategory,
  InventoryItemStatus,
  LevelDefinition,
  PlayerInventoryItem,
  PlayerProgression,
  UserProfile,
  XPTransaction,
} from '../types';
import {
  COLLECTIONS_DATA,
  getCollectionProgress,
  getEquippedFrameStyle,
  getNextLevelDefinition,
  getRarityColor,
  LEVEL_DEFINITIONS,
} from '../data/progressionData';

interface ProgressionHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  progression: PlayerProgression;
  onEquipItem?: (item: PlayerInventoryItem) => void;
  onTriggerLevelUpDemo?: () => void;
  initialTab?: 'visao_geral' | 'inventario' | 'colecoes' | 'historico_xp';
}

export const ProgressionHubModal: React.FC<ProgressionHubModalProps> = ({
  isOpen,
  onClose,
  user,
  progression,
  onEquipItem,
  onTriggerLevelUpDemo,
  initialTab = 'visao_geral',
}) => {
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'inventario' | 'colecoes' | 'historico_xp'>(initialTab);
  const [inventoryCategory, setInventoryCategory] = useState<string>('todos');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<'todos' | 'unlocked' | 'equipped' | 'locked'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState<PlayerInventoryItem | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('col_s01');

  if (!isOpen) return null;

  const currentLevel = user.level || progression.level;
  const currentXP = user.xp || progression.currentXP;
  const nextLevelXP = user.nextLevelXp || progression.xpToNextLevel || 5000;
  const totalXP = user.totalXP || progression.totalXP || currentXP;
  const xpRemaining = Math.max(0, nextLevelXP - currentXP);
  const progressPct = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  const nextLevelDef = getNextLevelDefinition(currentLevel);
  const equippedItems = progression.equippedItems || {};
  const inventory = progression.inventory || [];
  const xpHistory = progression.xpHistory || [];
  const collections = progression.collections || COLLECTIONS_DATA;

  // Filtros de inventário
  const filteredInventory = inventory.filter((item) => {
    // Categoria
    if (inventoryCategory !== 'todos' && item.category !== inventoryCategory) {
      return false;
    }

    // Status
    if (inventoryStatusFilter === 'unlocked' && item.status !== 'UNLOCKED') return false;
    if (inventoryStatusFilter === 'equipped' && item.status !== 'EQUIPPED') return false;
    if (inventoryStatusFilter === 'locked' && item.status !== 'LOCKED') return false;

    // Busca textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.unlockCondition.toLowerCase().includes(q) ||
        (item.collectionName && item.collectionName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const unlockedCount = inventory.filter((i) => i.status !== 'LOCKED').length;
  const totalItemsCount = inventory.length;

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'ZONE_CONQUEST':
      case 'ZONE_DISCOVERY':
        return { label: 'ZONA', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' };
      case 'CHALLENGE_VICTORY':
      case 'CHALLENGE_PARTICIPATION':
        return { label: 'DESAFIO', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' };
      case 'EVENT_VICTORY':
      case 'EVENT_PARTICIPATION':
      case 'EVENT':
        return { label: 'EVENTO', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      case 'ROUTE_COMPLETED':
        return { label: 'ROTA', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
      case 'RECORD_BROKEN':
        return { label: 'RECORDE', color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' };
      case 'LEVEL_REWARD':
        return { label: 'NÍVEL', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' };
      case 'ACHIEVEMENT':
        return { label: 'CONQUISTA', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' };
      case 'SEASON_PASS':
        return { label: 'TEMPORADA', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40' };
      case 'STORE':
        return { label: 'LOJA', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      default:
        return { label: 'COSMÉTICO', color: 'bg-slate-500/20 text-slate-300 border-slate-400/40' };
    }
  };

  const currentSelectedCollection = collections.find((c) => c.id === selectedCollectionId) || collections[0];
  const collectionProgress = currentSelectedCollection
    ? getCollectionProgress(currentSelectedCollection, inventory)
    : { unlockedCount: 0, totalCount: 1, isCompleted: false };

  return (
    <div
      id="modal-progression-hub"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85  animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl h-[94vh] max-h-[880px] rounded-3xl bg-gradient-to-b from-[#101924] to-[#070b10] border-2 border-yellow-500/50 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0a0a]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-tight">
                  PERSONALIZAÇÃO & PROGRESSÃO
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-black font-mono-stat">
                  LVL.{currentLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-stat">
                Identidade Urbana • Cosméticos & Itens Virtuais • Coleções
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-progression-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tabs Navigation */}
        <div className="grid grid-cols-4 p-1.5 sm:p-2 bg-[#090e15] border-b border-white/10 shrink-0 font-mono-stat text-[11px] sm:text-xs font-bold gap-1">
          <button
            type="button"
            id="tab-btn-overview"
            onClick={() => setActiveTab('visao_geral')}
            className={`py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              activeTab === 'visao_geral'
                ? 'bg-yellow-400 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">VISÃO GERAL</span>
          </button>

          <button
            type="button"
            id="tab-btn-inventory"
            onClick={() => setActiveTab('inventario')}
            className={`py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              activeTab === 'inventario'
                ? 'bg-yellow-400 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">INVENTÁRIO ({unlockedCount})</span>
          </button>

          <button
            type="button"
            id="tab-btn-collections"
            onClick={() => setActiveTab('colecoes')}
            className={`py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              activeTab === 'colecoes'
                ? 'bg-yellow-400 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">ÁLBUM & COLEÇÕES</span>
          </button>

          <button
            type="button"
            id="tab-btn-xp-history"
            onClick={() => setActiveTab('historico_xp')}
            className={`py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              activeTab === 'historico_xp'
                ? 'bg-yellow-400 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">EXTRATO XP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {/* ======================================================== */}
          {/* ABA 1: VISÃO GERAL & TRILHA DE NÍVEIS                    */}
          {/* ======================================================== */}
          {activeTab === 'visao_geral' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Level Progress Hero Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#121c28] to-[#0a1017] border-2 border-yellow-500/40 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-yellow-400 font-mono-stat uppercase tracking-wider">
                      STATUS DE CARREIRA URBANA
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-0.5">
                      NÍVEL {currentLevel}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {nextLevelDef?.title || 'Mestre do Asfalto Urbano'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase font-mono-stat block">
                      XP TOTAL ACUMULADO
                    </span>
                    <span className="text-base font-black text-yellow-400 font-mono-stat">
                      {totalXP.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5 font-mono-stat">
                    <span className="text-white">
                      {currentXP} <span className="text-slate-400">/ {nextLevelXP} XP</span>
                    </span>
                    <span className="text-yellow-400">{progressPct}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-[1px]">
                    <div
                      className="h-full bg-yellow-400 rounded-full shadow-[0_0_12px_#fce803] transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] font-mono-stat">
                    <span className="text-slate-400">
                      Próximo nível: <strong className="text-white">{xpRemaining} XP restantes</strong>
                    </span>
                    <span className="text-cyan-300">
                      Rumo ao Nível {currentLevel + 1}
                    </span>
                  </div>
                </div>

                {/* Demo Action: Trigger Level Up */}
                {onTriggerLevelUpDemo && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono-stat">
                      Simulação do evento de progressão:
                    </span>
                    <button
                      type="button"
                      id="btn-simulate-level-up"
                      onClick={onTriggerLevelUpDemo}
                      className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-400 text-yellow-300 hover:text-black text-[10px] font-black font-mono-stat border border-yellow-400/40 transition-all cursor-pointer"
                    >
                      ⚡ SIMULAR LEVEL UP (+{xpRemaining} XP)
                    </button>
                  </div>
                )}
              </div>

              {/* Equipped Cosmetics Showcase Bento Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-stat mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>SETUPS & COSMÉTICOS EQUIPADOS</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventario')}
                    className="text-[10px] text-yellow-400 hover:underline cursor-pointer"
                  >
                    Ver todo inventário →
                  </button>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Skate */}
                  <div
                    onClick={() => {
                      setActiveTab('inventario');
                      setInventoryCategory('skates');
                    }}
                    className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                      🛹 SKATE / PATINS
                    </span>
                    <div className="text-2xl my-1.5">🛹</div>
                    <div className="text-xs font-black text-white font-display truncate">
                      {equippedItems.skateName || 'Powerslide Next'}
                    </div>
                    <span className="text-[8px] font-bold text-cyan-300 uppercase font-mono-stat">
                      EQUIPADO ✓
                    </span>
                  </div>

                  {/* Mascote */}
                  <div
                    onClick={() => {
                      setActiveTab('inventario');
                      setInventoryCategory('mascotes');
                    }}
                    className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-yellow-500/30 hover:border-yellow-400 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                      🐺 MASCOTE
                    </span>
                    <div className="text-2xl my-1.5">{equippedItems.mascotIcon || '🤖'}</div>
                    <div className="text-xs font-black text-white font-display truncate">
                      {equippedItems.mascotName || 'Mini Urbano'}
                    </div>
                    <span className="text-[8px] font-bold text-yellow-400 uppercase font-mono-stat">
                      EQUIPADO ✓
                    </span>
                  </div>

                  {/* Moldura */}
                  <div
                    onClick={() => {
                      setActiveTab('inventario');
                      setInventoryCategory('molduras');
                    }}
                    className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                      🟢 MOLDURA DE PERFIL
                    </span>
                    <div className="text-2xl my-1.5">🟢</div>
                    <div className="text-xs font-black text-white font-display truncate">
                      {equippedItems.frameName || 'Neon Pulse'}
                    </div>
                    <span className="text-[8px] font-bold text-purple-300 uppercase font-mono-stat">
                      EQUIPADO ✓
                    </span>
                  </div>

                  {/* Título */}
                  <div
                    onClick={() => {
                      setActiveTab('inventario');
                      setInventoryCategory('titulos');
                    }}
                    className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                      👑 TÍTULO ATIVO
                    </span>
                    <div className="text-2xl my-1.5">👑</div>
                    <div className="text-xs font-black text-white font-display truncate">
                      {user.activeTitle || equippedItems.titleName || 'CONQUISTADOR'}
                    </div>
                    <span className="text-[8px] font-bold text-amber-300 uppercase font-mono-stat">
                      EQUIPADO ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Trilha de Progressão de Níveis */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-stat flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>TRILHA DE RECOMPENSAS DE NÍVEL</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono-stat">
                    {LEVEL_DEFINITIONS.length} marcos mapeados
                  </span>
                </div>

                <div className="space-y-2.5">
                  {LEVEL_DEFINITIONS.map((lvlDef) => {
                    const isPassed = currentLevel > lvlDef.level;
                    const isCurrent = currentLevel === lvlDef.level;

                    return (
                      <div
                        key={lvlDef.level}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-[#102419] to-[#0a0a0a] border-yellow-400 shadow-md'
                            : isPassed
                            ? 'bg-[#0d131a] border-white/10 opacity-80'
                            : 'bg-[#050505] border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-base shrink-0 border ${
                                isCurrent
                                  ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_15px_rgba(252,232,3,0.5)]'
                                  : isPassed
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                                  : 'bg-slate-800 text-slate-400 border-white/10'
                              }`}
                            >
                              {isPassed ? '✓' : lvlDef.level}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-white font-display uppercase tracking-tight">
                                  {lvlDef.title || `Nível ${lvlDef.level}`}
                                </h5>
                                {isCurrent && (
                                  <span className="px-2 py-0.2 rounded text-[8px] font-black bg-yellow-400 text-black font-mono-stat uppercase">
                                    NÍVEL ATUAL
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono-stat">
                                Requer {lvlDef.requiredXP.toLocaleString()} XP
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-1 rounded-xl text-[9px] font-bold font-mono-stat uppercase shrink-0 ${
                              isPassed
                                ? 'bg-yellow-500/15 text-yellow-400'
                                : isCurrent
                                ? 'bg-yellow-400 text-black font-black'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isPassed ? 'DESBLOQUEADO' : isCurrent ? 'EM PROGRESSO' : 'BLOQUEADO'}
                          </span>
                        </div>

                        {/* Rewards previews */}
                        {lvlDef.rewards && lvlDef.rewards.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {lvlDef.rewards.map((rew) => {
                              const rStyle = getRarityColor(rew.rarity);
                              return (
                                <div
                                  key={rew.id}
                                  className={`p-2 rounded-xl border ${rStyle.border} ${rStyle.bg} flex items-center justify-between text-xs`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-base">{rew.icon}</span>
                                    <span className="font-bold text-white truncate">{rew.name}</span>
                                  </div>
                                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-black font-mono-stat ${rStyle.badge}`}>
                                    {rew.type}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 2: INVENTÁRIO & COSMÉTICOS                           */}
          {/* ======================================================== */}
          {activeTab === 'inventario' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-stat font-bold">
                {[
                  { id: 'todos', label: 'Todos', icon: '📦' },
                  { id: 'skates', label: 'Skates / Patins', icon: '🛹' },
                  { id: 'mascotes', label: 'Mascotes', icon: '🐺' },
                  { id: 'molduras', label: 'Molduras', icon: '🟢' },
                  { id: 'titulos', label: 'Títulos', icon: '👑' },
                  { id: 'figurinhas', label: 'Figurinhas', icon: '🎴' },
                  { id: 'roupas', label: 'Roupas', icon: '🧥' },
                  { id: 'capacetes', label: 'Capacetes', icon: '🪖' },
                  { id: 'acessorios', label: 'Acessórios', icon: '🧤' },
                  { id: 'efeitos', label: 'Efeitos', icon: '✨' },
                  { id: 'emblemas', label: 'Emblemas', icon: '🔰' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setInventoryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      inventoryCategory === cat.id
                        ? 'bg-yellow-400 text-black border-yellow-400 font-black shadow-sm'
                        : 'bg-[#0a0a0a] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar skates, mascotes, títulos, figurinhas..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 font-mono-stat"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1 w-full sm:w-auto text-[10px] font-mono-stat font-bold">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'unlocked', label: 'Obtidos' },
                    { id: 'equipped', label: 'Equipados' },
                    { id: 'locked', label: 'Bloqueados' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setInventoryStatusFilter(st.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        inventoryStatusFilter === st.id
                          ? 'bg-white/15 text-white border-white/40 font-black'
                          : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              {filteredInventory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredInventory.map((item) => {
                    const rarityStyle = getRarityColor(item.rarity);
                    const isEquipped = item.status === 'EQUIPPED';
                    const isUnlocked = item.status === 'UNLOCKED';
                    const isLocked = item.status === 'LOCKED';
                    const sourceBadge = getSourceBadge(item.source);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemDetail(item)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-gradient-to-b from-[#11241a] to-[#081330] border-yellow-400 shadow-md ring-1 ring-yellow-400/40'
                            : isUnlocked
                            ? 'bg-[#0a0a0a] border-white/10 hover:border-yellow-400/50'
                            : 'bg-[#080b0f] border-white/5 opacity-75'
                        }`}
                      >
                        {/* Limited / Event Ribbon */}
                        {item.isLimited && (
                          <div className="absolute -right-7 top-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[8px] font-black uppercase px-7 py-0.5 rotate-45 shadow-sm font-mono-stat">
                            LIMITADO
                          </div>
                        )}

                        {/* Top: Icon, Name & Rarity */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border shrink-0 ${
                                  isLocked
                                    ? 'bg-slate-800/40 text-slate-500 border-white/5'
                                    : `${rarityStyle.bg} ${rarityStyle.border}`
                                }`}
                              >
                                {isLocked ? <Lock className="w-5 h-5 text-slate-500" /> : item.icon}
                              </div>

                              <div className="min-w-0">
                                <h5 className="text-xs sm:text-sm font-black text-white font-display uppercase tracking-tight truncate">
                                  {item.name}
                                </h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase font-mono-stat ${rarityStyle.badge}`}>
                                    {rarityStyle.label}
                                  </span>
                                  {item.collectionName && (
                                    <span className="text-[8px] font-mono-stat text-slate-400 truncate">
                                      • {item.collectionName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isEquipped && (
                              <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-black text-[9px] font-black font-mono-stat shrink-0 shadow-[0_0_8px_rgba(252,232,3,0.4)]">
                                EQUIPADO
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          {item.metadata?.quote && (
                            <p className="text-[10px] text-yellow-400 italic mt-1 font-mono-stat">
                              {item.metadata.quote}
                            </p>
                          )}
                        </div>

                        {/* Bottom: Unlock requirement & Action */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 text-[10px] font-mono-stat">
                          <span className="text-slate-400 truncate flex items-center gap-1">
                            {isUnlocked ? (
                              <span className="text-yellow-400 font-bold">✓ Desbloqueado</span>
                            ) : (
                              <span>🔒 {item.unlockCondition}</span>
                            )}
                          </span>

                          {(isUnlocked || isEquipped) && onEquipItem && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEquipItem(item);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono-stat uppercase transition-all shrink-0 cursor-pointer ${
                                isEquipped
                                  ? 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300'
                                  : 'bg-yellow-400 hover:bg-yellow-300 text-black font-black active:scale-95'
                              }`}
                            >
                              {isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <p className="text-xs font-bold text-slate-300">Nenhum item encontrado</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ajuste os filtros de categoria ou termo de busca.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 3: ÁLBUM & COLEÇÕES DE FIGURINHAS                    */}
          {/* ======================================================== */}
          {activeTab === 'colecoes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Collection Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-stat font-bold">
                {collections.map((col) => {
                  const prog = getCollectionProgress(col, inventory);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedCollectionId(col.id)}
                      className={`px-3.5 py-2 rounded-2xl border shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                        selectedCollectionId === col.id
                          ? 'bg-yellow-400 text-black border-yellow-400 font-black shadow-md'
                          : 'bg-[#0a0a0a] text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-base">{col.icon || '🎴'}</span>
                      <div className="text-left">
                        <div className="leading-tight">{col.name}</div>
                        <div className="text-[9px] opacity-80">
                          {prog.unlockedCount}/{prog.totalCount} ({Math.round((prog.unlockedCount / prog.totalCount) * 100)}%)
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Collection Card */}
              {currentSelectedCollection && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#121c28] to-[#0a1017] border-2 border-yellow-500/40 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[9px] font-black font-mono-stat">
                          {currentSelectedCollection.season || 'Temporada Oficial'}
                        </span>
                        {collectionProgress.isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black font-mono-stat">
                            COLEÇÃO COMPLETA ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-1">
                        {currentSelectedCollection.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {currentSelectedCollection.description}
                      </p>
                    </div>

                    {/* Reward Preview */}
                    {currentSelectedCollection.rewardItemName && (
                      <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/40 text-right shrink-0">
                        <span className="text-[9px] text-purple-300 font-bold uppercase font-mono-stat block">
                          RECOMPENSA DE CONCLUSÃO
                        </span>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <span className="text-base">{currentSelectedCollection.rewardItemIcon || '🔮'}</span>
                          <span className="text-xs font-black text-white truncate font-display">
                            {currentSelectedCollection.rewardItemName}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5 font-mono-stat">
                      <span className="text-white">
                        Progresso: <strong className="text-yellow-400">{collectionProgress.unlockedCount} de {collectionProgress.totalCount} itens</strong>
                      </span>
                      <span className="text-yellow-400">
                        {Math.round((collectionProgress.unlockedCount / collectionProgress.totalCount) * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-[1px]">
                      <div
                        className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_#fce803] transition-all duration-500"
                        style={{
                          width: `${(collectionProgress.unlockedCount / collectionProgress.totalCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Stickers Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-stat mb-2 flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-yellow-400" />
                  <span>ÁLBUM DE FIGURINHAS DA COLEÇÃO</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {currentSelectedCollection?.stickers && currentSelectedCollection.stickers.length > 0 ? (
                    currentSelectedCollection.stickers.map((stk) => {
                      const rStyle = getRarityColor(stk.rarity);
                      return (
                        <div
                          key={stk.id}
                          className={`p-3.5 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center justify-between ${
                            stk.isUnlocked
                              ? `${rStyle.bg} ${rStyle.border} shadow-md`
                              : 'bg-[#090e15] border-white/5 opacity-70'
                          }`}
                        >
                          <div className="text-[10px] font-black font-mono-stat text-slate-400 self-start">
                            #{String(stk.number).padStart(2, '0')}
                          </div>

                          <div className="my-2">
                            <div className="text-3xl">
                              {stk.isUnlocked ? stk.icon : <Lock className="w-7 h-7 mx-auto text-slate-600" />}
                            </div>
                            <div className="text-xs font-black text-white font-display mt-2 line-clamp-1">
                              {stk.name}
                            </div>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[7px] font-black uppercase font-mono-stat mt-1 ${rStyle.badge}`}>
                              {rStyle.label}
                            </span>
                          </div>

                          <div className="text-[9px] font-mono-stat text-slate-400 mt-1 line-clamp-2">
                            {stk.isUnlocked ? (
                              <span className="text-yellow-400 font-bold">Obtida em {stk.unlockedAt || '2026'}</span>
                            ) : (
                              <span>{stk.unlockCondition || 'Bloqueada'}</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback to inventory items in that collection
                    inventory
                      .filter((i) => i.collectionId === currentSelectedCollection?.id || i.collectionName === currentSelectedCollection?.name)
                      .map((item) => {
                        const rStyle = getRarityColor(item.rarity);
                        const isUnlocked = item.status !== 'LOCKED';
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center justify-between ${
                              isUnlocked ? `${rStyle.bg} ${rStyle.border}` : 'bg-[#090e15] border-white/5 opacity-70'
                            }`}
                          >
                            <div className="text-2xl my-2">{isUnlocked ? item.icon : <Lock className="w-6 h-6 mx-auto text-slate-600" />}</div>
                            <div className="text-xs font-black text-white font-display truncate w-full">{item.name}</div>
                            <span className={`px-1.5 py-0.2 rounded text-[7px] font-black uppercase font-mono-stat mt-1 ${rStyle.badge}`}>
                              {rStyle.label}
                            </span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 4: EXTRATO DE XP & TRANSAÇÕES                        */}
          {/* ======================================================== */}
          {activeTab === 'historico_xp' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-stat flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-yellow-400" />
                  <span>EXTRATO DE XP RECENTE</span>
                </span>
                <span className="text-[10px] text-yellow-400 font-bold font-mono-stat">
                  TOTAL: {totalXP.toLocaleString()} XP
                </span>
              </div>

              {xpHistory.length > 0 ? (
                <div className="space-y-2">
                  {xpHistory.map((tx) => {
                    const badge = getSourceBadge(tx.source);
                    const formattedDate = new Date(tx.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-yellow-400/40 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black font-mono-stat text-xs shrink-0">
                            +{tx.amount}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white truncate">
                                {tx.description}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono-stat text-slate-400">
                              <span className={`px-1.5 py-0.2 rounded border text-[8px] font-black uppercase ${badge.color}`}>
                                {badge.label}
                              </span>
                              <span>•</span>
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono-stat">
                          <span className="text-xs font-black text-yellow-400">
                            +{tx.amount} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <p className="text-xs font-bold text-slate-300">Nenhum registro de XP ainda</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Conclua patinações, vença desafios ou domine zonas para acumular pontos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#000000] flex items-center justify-between shrink-0 font-mono-stat text-xs">
          <div className="text-slate-400 text-[11px]">
            Personalização & Cosméticos • Sem vantagens desleais de gameplay
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all cursor-pointer"
          >
            FECHAR
          </button>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-[#050505] border-2 border-yellow-400 shadow-2xl p-5 space-y-4 relative">
            <button
              type="button"
              onClick={() => setSelectedItemDetail(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-3xl bg-black/40 border border-yellow-400/50 flex items-center justify-center text-4xl mx-auto shadow-[0_0_20px_rgba(252,232,3,0.3)]">
                {selectedItemDetail.icon}
              </div>
              <h4 className="text-lg font-black text-white font-display uppercase tracking-tight mt-3">
                {selectedItemDetail.name}
              </h4>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat ${getRarityColor(selectedItemDetail.rarity).badge}`}>
                  {getRarityColor(selectedItemDetail.rarity).label}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[9px] font-mono-stat uppercase">
                  {selectedItemDetail.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              {selectedItemDetail.description}
            </p>

            {selectedItemDetail.metadata?.quote && (
              <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-center">
                <p className="text-xs text-yellow-400 italic font-mono-stat">
                  {selectedItemDetail.metadata.quote}
                </p>
              </div>
            )}

            <div className="space-y-1.5 text-[11px] font-mono-stat bg-black/30 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between text-slate-400">
                <span>Desbloqueio:</span>
                <span className="text-white font-bold">{selectedItemDetail.unlockCondition}</span>
              </div>
              {selectedItemDetail.unlockedAt && (
                <div className="flex justify-between text-slate-400">
                  <span>Adquirido em:</span>
                  <span className="text-yellow-400">{selectedItemDetail.unlockedAt}</span>
                </div>
              )}
              {selectedItemDetail.collectionName && (
                <div className="flex justify-between text-slate-400">
                  <span>Coleção:</span>
                  <span className="text-cyan-300">{selectedItemDetail.collectionName}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono-stat"
              >
                VOLTAR
              </button>
              {selectedItemDetail.status !== 'LOCKED' && onEquipItem && (
                <button
                  type="button"
                  onClick={() => {
                    onEquipItem(selectedItemDetail);
                    setSelectedItemDetail(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black font-mono-stat uppercase shadow-md ${
                    selectedItemDetail.status === 'EQUIPPED'
                      ? 'bg-rose-500 hover:bg-rose-400 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-300 text-black'
                  }`}
                >
                  {selectedItemDetail.status === 'EQUIPPED' ? 'DESEQUIPAR' : 'EQUIPAR AGORA'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

