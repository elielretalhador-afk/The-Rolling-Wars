import React, { useState } from 'react';
import {
  X,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
  History,
  ShoppingBag,
  Package,
  Gift,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Filter, 
} from 'lucide-react';
import { EconomyService } from '../services/economyService';
import { Chest, ShopItem, InventoryItem, ProfileCosmetics } from '../types';
import { VirtualWallet, CurrencyTransaction, CurrencySource } from '../types';
import {
  MOCK_COSMETIC_STORE_PRICES,
  MockStoreItemPrice,
  getCurrencySourceLabel,
  getCurrencySourceIcon,
  formatCoinsCompact,
} from '../data/economyData';

interface VirtualWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: VirtualWallet;
  onEarnCoins?: (amount: number, source: CurrencySource, description: string, relatedId?: string) => void;
  onSpendCoins?: (amount: number, source: CurrencySource, description: string, relatedId?: string) => boolean;
  onSimulateAdReward?: () => void;
}

export const VirtualWalletModal: React.FC<VirtualWalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onEarnCoins,
  onSpendCoins,
  onSimulateAdReward,
}) => {
  const [activeTab, setActiveTab] = useState<'extrato' | 'loja' | 'inventario' | 'cofres'>('extrato');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'EARN' | 'SPEND'>('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [chests, setChests] = useState<Chest[]>([]);
  const [transactions, setTransactions] = useState<CurrencyTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (isOpen && wallet?.playerId) {
      const unsubShop = EconomyService.subscribeToShopItems(setShopItems);
      const unsubInv = EconomyService.subscribeToInventory(wallet.playerId, setInventory);
      const unsubChests = EconomyService.subscribeToChests(wallet.playerId, setChests);
      const unsubTx = EconomyService.subscribeToTransactions(wallet.playerId, setTransactions);
      return () => {
        unsubShop();
        unsubInv();
        unsubChests();
        unsubTx();
      };
    }
  }, [isOpen, wallet?.playerId]);

  const handlePurchase = async (itemId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await EconomyService.purchaseShopItem(itemId);
    setIsProcessing(false);
    if (res.success) {
      showFeedback('Item adquirido com sucesso!', 'success');
    } else {
      showFeedback(res.error || 'Erro ao comprar item.', 'error');
    }
  };

  const handleEquip = async (itemId: string, itemType: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await EconomyService.equipCosmetic(itemId, itemType as any);
    setIsProcessing(false);
    if (res.success) {
      showFeedback('Item equipado!', 'success');
    } else {
      showFeedback(res.error || 'Erro ao equipar item.', 'error');
    }
  };


  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };


  const filteredTransactions = wallet.transactions.filter((tx) => {
    if (historyFilter === 'EARN') return tx.type === 'EARN' || tx.type === 'BONUS';
    if (historyFilter === 'SPEND') return tx.type === 'SPEND';
    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="virtual-wallet-modal-container"
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#0b1017] border-2 border-amber-500/40 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0d141f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#000000] rounded-[14px] flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase text-white font-display tracking-tight">
                  CARTEIRA VIRTUAL
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md font-mono-stat">
                  INTERNA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Economia de Recompensas & Cosméticos do THE ROLLING WARS
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-wallet-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar carteira virtual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div
            className={`relative z-20 px-4 py-2.5 mx-4 mt-3 flex items-center gap-2 rounded-2xl text-xs font-bold font-mono-stat shadow-lg transition-all animate-in slide-in-from-top-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-neutral-900/90 border border-yellow-400 text-yellow-200'
                : 'bg-rose-950/90 border border-rose-400 text-rose-200'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="flex-1">{feedbackMessage.text}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {/* Main Balance Hero Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#131c27] via-[#0a0a0a] to-[#0a0f15] border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90 font-mono-stat">
                  SALDO DISPONÍVEL
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono-stat tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]">
                    {wallet.balance.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm font-bold text-amber-400 uppercase font-mono-stat">
                    {wallet.currencyName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Utilizada exclusivamente dentro do jogo para cosméticos e personalização.
                </p>
              </div>

              {/* Quick Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-400 font-mono-stat">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>GANHOS</span>
                  </div>
                  <span className="text-xs font-black text-white font-mono-stat">
                    +{wallet.totalEarned.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 font-mono-stat">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>GASTOS</span>
                  </div>
                  <span className="text-xs font-black text-white font-mono-stat">
                    -{wallet.totalSpent.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Non-financial disclaimer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>
                <strong>Moeda Virtual Fechada:</strong> Sem conversão em dinheiro real, depósitos, saques ou apostas.
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex rounded-2xl bg-[#0e1520] p-1 border border-white/10">
            <button
              type="button"
              id="tab-wallet-extrato"
              onClick={() => setActiveTab('extrato')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'extrato'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>EXTRATO</span>
            </button>

            <button
              type="button"
              id="tab-wallet-catalogo"
              onClick={() => setActiveTab('loja')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'loja'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>LOJA</span>
            </button>

            <button
              type="button"
              id="tab-wallet-inventario"
              onClick={() => setActiveTab('inventario')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'inventario'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>INVENTÁRIO</span>
            </button>

            <button
              type="button"
              id="tab-wallet-cofres"
              onClick={() => setActiveTab('cofres')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'cofres'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>COFRES</span>
            </button>



          </div>

          {/* TAB 1: EXTRATO / HISTÓRICO DE TRANSAÇÕES */}
          {activeTab === 'extrato' && (
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono-stat flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  FILTRAR TRANSAÇÕES ({filteredTransactions.length})
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono-stat transition-all cursor-pointer ${
                      historyFilter === 'ALL'
                        ? 'bg-white/20 text-white'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    TODAS
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('EARN')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono-stat transition-all cursor-pointer ${
                      historyFilter === 'EARN'
                        ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    GANHOS (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('SPEND')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono-stat transition-all cursor-pointer ${
                      historyFilter === 'SPEND'
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    GASTOS (-)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0e141c] border border-white/10 text-slate-400 text-xs font-mono-stat">
                    Nenhuma transação encontrada para este filtro.
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isEarn = tx.type === 'EARN' || tx.type === 'BONUS';
                    const sourceLabel = getCurrencySourceLabel(tx.source);
                    const sourceIcon = getCurrencySourceIcon(tx.source);

                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-2xl bg-[#0f1620] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                              isEarn
                                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <span>{sourceIcon}</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase font-mono-stat px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                {sourceLabel}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono-stat">
                                {formatDate(tx.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white truncate mt-0.5">
                              {tx.description}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono-stat">
                              Saldo após: <strong className="text-amber-400">{tx.balanceAfter.toLocaleString('pt-BR')}</strong> moedas
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-black font-mono-stat ${
                              isEarn ? 'text-yellow-400' : 'text-rose-400'
                            }`}
                          >
                            {isEarn ? `+${tx.amount.toLocaleString('pt-BR')}` : `-${tx.amount.toLocaleString('pt-BR')}`}
                          </span>
                          <span className="block text-[9px] font-bold text-slate-500 font-mono-stat uppercase">
                            🪙 {wallet.currencyName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CATÁLOGO DE DEMONSTRAÇÃO (FUTURA LOJA INTERNA) */}

          {activeTab === 'loja' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {shopItems.length > 0 ? shopItems.map((item) => {
                  const hasItem = inventory.some(i => i.itemId === item.id);
                  const canBuy = wallet.balance >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#0f1620] border border-white/10 flex flex-col justify-between gap-2.5 transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex flex-col items-center justify-center shrink-0">
                          {item.category === 'avatar_frame' && <Sparkles className="w-5 h-5 text-yellow-400" />}
                          {item.category === 'title' && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                          {item.category === 'profile_badge' && <Zap className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-black uppercase text-amber-300 font-mono-stat px-1.5 py-0.5 rounded bg-amber-400/10">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className={`text-sm font-black font-mono-stat ${canBuy ? 'text-white' : 'text-rose-400'}`}>
                            {item.price.toLocaleString()}
                          </span>
                        </div>
                        {hasItem ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-slate-700/50 text-slate-400 text-[10px] font-bold font-mono-stat cursor-not-allowed uppercase"
                            disabled
                          >
                            Adquirido
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePurchase(item.id)}
                            disabled={!canBuy || isProcessing}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black font-mono-stat uppercase cursor-pointer transition-all ${
                              canBuy && !isProcessing
                                ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {isProcessing ? 'Processando...' : 'Comprar'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-slate-400 text-center w-full py-4 text-xs">Nenhum item disponível no momento.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventario' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">

                {inventory.length > 0 ? inventory.map((inv) => {
                  const itemDetails = shopItems.find(s => s.id === inv.itemId);
                  const itemCategory = itemDetails?.category || 'unknown';
                  const itemName = itemDetails?.name || inv.itemId;

                  return (
                    <div
                      key={inv.itemId}
                      className="p-3.5 rounded-2xl bg-[#0f1620] border border-white/10 flex flex-col justify-between gap-2.5 transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex flex-col items-center justify-center shrink-0">
                          {itemCategory === 'avatar_frame' && <Sparkles className="w-5 h-5 text-yellow-400" />}
                          {itemCategory === 'title' && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                          {itemCategory === 'profile_badge' && <Zap className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-black uppercase text-purple-300 font-mono-stat px-1.5 py-0.5 rounded bg-purple-400/10">
                              {itemCategory}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-tight">{itemName}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Adquirido</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-end pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleEquip(inv.itemId, itemCategory)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-black font-mono-stat uppercase cursor-pointer transition-all"
                        >
                          Equipar
                        </button>
                      </div>
                    </div>
                  );
                }) : (

                  <p className="text-slate-400 text-center w-full py-4 text-xs">Seu inventário está vazio.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cofres' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {chests.length > 0 ? chests.map((chest) => {
                  const isOpen = chest.status === 'opened';
                  return (
                    <div
                      key={chest.id}
                      className="p-3.5 rounded-2xl bg-[#0f1620] border border-white/10 flex flex-col justify-between gap-2.5 transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex flex-col items-center justify-center shrink-0">
                          <Gift className={`w-6 h-6 ${isOpen ? 'text-slate-500' : 'text-amber-400 animate-pulse'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-black uppercase text-amber-300 font-mono-stat px-1.5 py-0.5 rounded bg-amber-400/10">
                              COFRE {chest.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-tight">Recompensa Pendente</h4>
                        </div>
                      </div>

                      <div className="flex items-end justify-end pt-2 border-t border-white/10">
                        {isOpen ? (
                          <button disabled className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-[10px] font-black font-mono-stat uppercase">Aberto</button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              if (isProcessing) return;
                              setIsProcessing(true);
                              const res = await EconomyService.openChest(chest.id);
                              setIsProcessing(false);
                              if (res.success) showFeedback('Cofre aberto!', 'success');
                              else showFeedback('Erro ao abrir.', 'error');
                            }}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer transition-all"
                          >
                            Abrir Cofre
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-slate-400 text-center w-full py-4 text-xs">Nenhum cofre disponível.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
