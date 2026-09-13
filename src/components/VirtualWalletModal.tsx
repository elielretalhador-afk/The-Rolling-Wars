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
  Tv,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Filter,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'extrato' | 'catalogo' | 'testes' | 'regras'>('extrato');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'EARN' | 'SPEND'>('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const handleTestEarn = (amount: number, source: CurrencySource, desc: string) => {
    if (onEarnCoins) {
      onEarnCoins(amount, source, desc);
      showFeedback(`+${amount} moedas creditadas com sucesso!`, 'success');
    }
  };

  const handleTestSpend = (item: MockStoreItemPrice) => {
    if (wallet.balance < item.price) {
      showFeedback(`Saldo insuficiente! Você possui ${wallet.balance} moedas e o item custa ${item.price} moedas.`, 'error');
      return;
    }

    if (onSpendCoins) {
      const success = onSpendCoins(item.price, 'COSMETIC_PURCHASE', `Item Cosmético: ${item.name}`, item.id);
      if (success) {
        showFeedback(`Compra simulada de "${item.name}" realizada! -${item.price} moedas.`, 'success');
      } else {
        showFeedback('Saldo insuficiente para completar a transação.', 'error');
      }
    }
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
              <div className="w-full h-full bg-[#0a0f15] rounded-[14px] flex items-center justify-center text-amber-400">
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
              <p className="text-[11px] text-neutral-400 font-medium">
                Economia de Recompensas & Cosméticos do Urbanozeiro
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-wallet-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
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
                ? 'bg-emerald-950/90 border border-yellow-400 text-emerald-200'
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
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#131c27] via-[#0f1722] to-[#0a0f15] border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
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
                <p className="text-[11px] text-neutral-400 mt-1">
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
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] text-neutral-400">
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
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>EXTRATO</span>
            </button>

            <button
              type="button"
              id="tab-wallet-catalogo"
              onClick={() => setActiveTab('catalogo')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'catalogo'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>CATÁLOGO</span>
            </button>

            <button
              type="button"
              id="tab-wallet-testes"
              onClick={() => setActiveTab('testes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'testes'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SIMULAR</span>
            </button>

            <button
              type="button"
              id="tab-wallet-regras"
              onClick={() => setActiveTab('regras')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'regras'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>REGRAS</span>
            </button>
          </div>

          {/* TAB 1: EXTRATO / HISTÓRICO DE TRANSAÇÕES */}
          {activeTab === 'extrato' && (
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 font-mono-stat flex items-center gap-1.5">
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
                        : 'text-neutral-400 hover:text-white bg-white/5'
                    }`}
                  >
                    TODAS
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('EARN')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono-stat transition-all cursor-pointer ${
                      historyFilter === 'EARN'
                        ? 'bg-yellow-500/30 text-emerald-300 border border-yellow-500/50'
                        : 'text-neutral-400 hover:text-white bg-white/5'
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
                        : 'text-neutral-400 hover:text-white bg-white/5'
                    }`}
                  >
                    GASTOS (-)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0e141c] border border-white/10 text-neutral-400 text-xs font-mono-stat">
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
                              <span className="text-[10px] font-black uppercase font-mono-stat px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                                {sourceLabel}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono-stat">
                                {formatDate(tx.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white truncate mt-0.5">
                              {tx.description}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-mono-stat">
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
          {activeTab === 'catalogo' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Simulação da Futura Loja Interna
                </p>
                <p className="text-[11px] text-neutral-300 mt-1">
                  Estes itens e preços são dados mock para demonstrar o fluxo de verificação de saldo e débito com segurança contra saldo negativo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {MOCK_COSMETIC_STORE_PRICES.map((item) => {
                  const canBuy = wallet.balance >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#0f1620] border border-white/10 hover:border-amber-400/40 flex flex-col justify-between gap-2.5 transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-black uppercase text-amber-400 font-mono-stat">
                              {item.category}
                            </span>
                            <span className="text-[8px] font-bold text-neutral-400 px-1 rounded bg-white/5">
                              {item.rarity}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black text-amber-400 font-mono-stat">
                            {item.price.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat">
                            moedas
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTestSpend(item)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black font-mono-stat uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                            canBuy
                              ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-md'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {canBuy ? 'TESTAR COMPRA' : 'INSUFICIENTE'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SIMULAR TRANSAÇÕES & TESTES DE SEGURANÇA */}
          {activeTab === 'testes' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 text-xs text-neutral-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Simulador de Eventos Econômicos
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Teste o crédito imediato de moedas por missões, zonas, eventos e anúncios recompensados.
                </p>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {/* Simulated Mission Earn */}
                <div className="p-3 rounded-2xl bg-[#0f1620] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🎯</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Missão Concluída</h4>
                      <p className="text-[10px] text-neutral-400">Recompensa padrão de missão diária</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestEarn(100, 'MISSION', 'Missão Concluída: Rolê Noturno')}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    +100 🪙
                  </button>
                </div>

                {/* Simulated Zone Conquest Earn */}
                <div className="p-3 rounded-2xl bg-[#0f1620] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📍</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Conquista de Zona</h4>
                      <p className="text-[10px] text-neutral-400">Bônus por conquistar uma zona no mapa</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestEarn(150, 'ZONE_CONQUEST', 'Bônus de Conquista: Praça Roosevelt')}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    +150 🪙
                  </button>
                </div>

                {/* Simulated Challenge Victory Earn */}
                <div className="p-3 rounded-2xl bg-[#0f1620] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">⚔️</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Vitória em Desafio Direto</h4>
                      <p className="text-[10px] text-neutral-400">Prêmio por vencer disputa X1 no asfalto</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestEarn(250, 'CHALLENGE', 'Vitória em Desafio X1')}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    +250 🪙
                  </button>
                </div>

                {/* Simulated Rewarded Ad */}
                <div className="p-3 rounded-2xl bg-[#0f1620] border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📺</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-amber-300">Anúncio Recompensado</h4>
                        <span className="text-[8px] font-black uppercase px-1 py-0.2 bg-amber-400/20 text-amber-300 rounded">
                          ESTRUTURAL
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Simulação do tipo REWARDED_AD</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSimulateAdReward) {
                        onSimulateAdReward();
                      } else {
                        handleTestEarn(50, 'REWARDED_AD', 'Recompensa de Anúncio Recompensado');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    +50 🪙
                  </button>
                </div>

                {/* Simulated Insufficient Balance Test */}
                <div className="p-3 rounded-2xl bg-[#140e14] border border-rose-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">Teste de Saldo Insuficiente</h4>
                      <p className="text-[10px] text-neutral-400">Tentar gastar 10.000 moedas sem saldo</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showFeedback(`Saldo insuficiente! A operação foi rejeitada para proteger o saldo de ficar negativo.`, 'error');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    TESTAR BLOQUEIO
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGRAS E ARQUITETURA DE SEGURANÇA */}
          {activeTab === 'regras' && (
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 text-xs">
              <div className="p-4 rounded-2xl bg-[#0e1622] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-bold font-mono-stat">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DIRETRIZES DA ECONOMIA VIRTUAL</span>
                </div>

                <div className="space-y-2 text-neutral-300 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">1. Separação Rígida de XP e Moeda</strong>
                    <span>
                      XP define o nível e habilidades de patinação do jogador. Moedas são utilizadas exclusivamente para itens e cosméticos no jogo.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">2. Proteção contra Saldo Negativo</strong>
                    <span>
                      Todas as transações de débito (SPEND) passam pela validação central <code>balance &gt;= amount</code>. Operações acima do saldo são imediatamente rejeitadas.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">3. Ausência de Dinheiro Real</strong>
                    <span>
                      Não há integração com Pix, gateways de pagamento, depósitos ou saques. A moeda não pode ser convertida em dinheiro nem negociada fora do jogo.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">4. Suporte Futuro a Anúncios e Loja</strong>
                    <span>
                      A tipagem <code>REWARDED_AD</code> e o catálogo de itens já estão mapeados na arquitetura para receber conexões futuras sem quebras estruturais.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 p-3 sm:p-4 bg-[#0a0f15] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono-stat">
            <span>Saldo:</span>
            <strong className="text-amber-400 font-bold">
              {formatCoinsCompact(wallet.balance)}
            </strong>
          </div>

          <button
            type="button"
            id="btn-dismiss-wallet-modal"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono-stat uppercase transition-all cursor-pointer"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};
