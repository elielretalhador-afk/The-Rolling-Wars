import { CurrencyTransaction, CurrencySource, VirtualWallet, WalletOperationResult } from '../types';

/**
 * =========================================================================
 * ESQUELETO DA ECONOMIA VIRTUAL INTERNA DO THE ROLLING WARS
 * =========================================================================
 * 
 * Regras Fundamentais:
 * 1. Moeda exclusivamente interna (sem conversão para dinheiro real, Pix, saques ou apostas).
 * 2. Saldo estritamente não-negativo (balance >= 0).
 * 3. Separação total de XP, níveis e dinheiro real.
 * 4. Validação centralizada para evitar duplicidades ou gastos sem saldo.
 */

export const DEFAULT_CURRENCY_NAME = 'moedas';
export const DEFAULT_CURRENCY_SYMBOL = '🪙';

export const INITIAL_TRANSACTIONS: CurrencyTransaction[] = [
  {
    id: 'tx_init_001',
    playerId: 'usr_001',
    type: 'EARN',
    amount: 1000,
    balanceAfter: 1000,
    source: 'INITIAL_BONUS',
    description: 'Bônus de Boas-Vindas Fundadores THE ROLLING WARS',
    timestamp: '2026-08-01T10:00:00.000Z',
    metadata: { reason: 'welcome_package' },
  },
  {
    id: 'tx_init_002',
    playerId: 'usr_001',
    type: 'SPEND',
    amount: 500,
    balanceAfter: 500,
    source: 'COSMETIC_PURCHASE',
    description: 'Item Cosmético: Shape Urban Cyber Pro',
    relatedId: 'item_skate_cyber_01',
    timestamp: '2026-08-05T14:30:00.000Z',
    metadata: { itemCategory: 'skates' },
  },
  {
    id: 'tx_init_003',
    playerId: 'usr_001',
    type: 'EARN',
    amount: 400,
    balanceAfter: 900,
    source: 'SEASON_REWARD',
    description: 'Recompensa Sazonal: Temporada 0 - Beta Fundadores',
    relatedId: 'season_0',
    timestamp: '2026-08-10T18:00:00.000Z',
  },
  {
    id: 'tx_init_004',
    playerId: 'usr_001',
    type: 'SPEND',
    amount: 300,
    balanceAfter: 600,
    source: 'COSMETIC_PURCHASE',
    description: 'Item Cosmético: Rodas Luminosas Neon Green',
    relatedId: 'item_wheel_neon_01',
    timestamp: '2026-08-12T16:15:00.000Z',
  },
  {
    id: 'tx_init_005',
    playerId: 'usr_001',
    type: 'EARN',
    amount: 500,
    balanceAfter: 1100,
    source: 'EVENT',
    description: 'Recompensa de Pódio: Circuito Noturno Paulista',
    relatedId: 'ev_001',
    timestamp: '2026-08-15T21:40:00.000Z',
  },
  {
    id: 'tx_init_006',
    playerId: 'usr_001',
    type: 'EARN',
    amount: 250,
    balanceAfter: 1350,
    source: 'CHALLENGE',
    description: 'Vitória em Desafio Direto X1 vs Pedro Asphalt',
    relatedId: 'chal_x1_001',
    timestamp: '2026-08-16T17:10:00.000Z',
  },
  {
    id: 'tx_init_007',
    playerId: 'usr_001',
    type: 'SPEND',
    amount: 200,
    balanceAfter: 1150,
    source: 'COSMETIC_PURCHASE',
    description: 'Item Cosmético: Moldura Neon Emerald',
    relatedId: 'item_frame_emerald_01',
    timestamp: '2026-08-17T11:20:00.000Z',
  },
  {
    id: 'tx_init_008',
    playerId: 'usr_001',
    type: 'EARN',
    amount: 100,
    balanceAfter: 1250,
    source: 'MISSION',
    description: 'Missão Concluída: Primeiro Rolê do Dia',
    relatedId: 'm_daily_01',
    timestamp: '2026-08-18T08:00:00.000Z',
  },
];

export const INITIAL_VIRTUAL_WALLET: VirtualWallet = {
  id: 'wallet_usr_001',
  playerId: 'usr_001',
  currencyName: DEFAULT_CURRENCY_NAME,
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  balance: 1250, // Saldo inicial demonstrativo conforme especificação (1.250 moedas)
  totalEarned: 2250,
  totalSpent: 1000,
  transactions: INITIAL_TRANSACTIONS,
  createdAt: '2026-08-01T10:00:00.000Z',
  updatedAt: '2026-08-18T08:00:00.000Z',
  lastTransactionAt: '2026-08-18T08:00:00.000Z',
};

/**
 * Mock de Catálogo de Preços para a Futura Loja Interna do Jogo
 * (Valores puramente ilustrativos para validação de saldo e demonstração)
 */
export interface MockStoreItemPrice {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  description: string;
  rarity: string;
}

export const MOCK_COSMETIC_STORE_PRICES: MockStoreItemPrice[] = [
  {
    id: 'shop_skate_gold',
    name: 'Skate Golden Spark',
    category: 'Skates Virtuais',
    price: 500,
    icon: '🛹',
    description: 'Shape com acabamento dourado e grip de alta aderência.',
    rarity: 'RARO',
  },
  {
    id: 'shop_mascot_cyber',
    name: 'Mascote Cyber Cat',
    category: 'Mascotes',
    price: 1500,
    icon: '🐱',
    description: 'Companheiro holográfico que flutua ao lado do patinador.',
    rarity: 'LENDÁRIO',
  },
  {
    id: 'shop_frame_neon',
    name: 'Moldura Neon Cyberpunk',
    category: 'Molduras de Perfil',
    price: 300,
    icon: '🖼️',
    description: 'Borda iluminada pulsante para o avatar do perfil.',
    rarity: 'INCOMUM',
  },
  {
    id: 'shop_effect_sparks',
    name: 'Efeito Rastro de Faíscas',
    category: 'Efeitos Visuais',
    price: 450,
    icon: '⚡',
    description: 'Faíscas elétricas geradas durante a patinação em velocidade.',
    rarity: 'RARO',
  },
  {
    id: 'shop_helmet_aero',
    name: 'Capacete Aerodinâmico Speed',
    category: 'Acessórios',
    price: 250,
    icon: '🪖',
    description: 'Design esportivo com viseira fumê anti-reflexo.',
    rarity: 'COMUM',
  },
  {
    id: 'shop_supreme_legend',
    name: 'Pacote Lenda Urbana Supremacy',
    category: 'Especiais',
    price: 5000,
    icon: '👑',
    description: 'Coleção completa de itens míticos do asfalto.',
    rarity: 'MÍTICO',
  },
];

/**
 * =========================================================================
 * SERVIÇO CENTRALIZADO DE TRANSAÇÕES E SEGURANÇA
 * =========================================================================
 */

export function formatCurrency(amount: number, currencySymbol: string = DEFAULT_CURRENCY_SYMBOL, currencyName: string = DEFAULT_CURRENCY_NAME): string {
  return `${currencySymbol} ${amount.toLocaleString('pt-BR')} ${currencyName}`;
}

export function formatCoinsCompact(amount: number, currencySymbol: string = DEFAULT_CURRENCY_SYMBOL): string {
  return `${currencySymbol} ${amount.toLocaleString('pt-BR')}`;
}

export function canAfford(wallet: VirtualWallet, amount: number): boolean {
  if (!wallet || typeof wallet.balance !== 'number') return false;
  if (amount <= 0) return false;
  return wallet.balance >= amount;
}

/**
 * Executa uma transação de GANHO (EARN / BONUS)
 * - Valida integridade do montante (> 0)
 * - Evita duplicidade de transações
 * - Atualiza saldo e total ganho
 */
export function executeEarnCoins(
  currentWallet: VirtualWallet,
  amount: number,
  source: CurrencySource,
  description: string,
  relatedId?: string,
  metadata?: Record<string, any>
): WalletOperationResult {
  if (amount <= 0) {
    return {
      success: false,
      message: 'Valor de crédito inválido. O montante deve ser maior que zero.',
      error: 'INVALID_AMOUNT',
    };
  }

  const roundedAmount = Math.round(amount);
  const now = new Date().toISOString();
  const txId = `tx_earn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const newBalance = currentWallet.balance + roundedAmount;

  const newTransaction: CurrencyTransaction = {
    id: txId,
    playerId: currentWallet.playerId,
    type: source === 'REWARDED_AD' || source === 'INITIAL_BONUS' ? 'BONUS' : 'EARN',
    amount: roundedAmount,
    balanceAfter: newBalance,
    source,
    description,
    relatedId,
    timestamp: now,
    metadata,
  };

  const updatedWallet: VirtualWallet = {
    ...currentWallet,
    balance: newBalance,
    totalEarned: currentWallet.totalEarned + roundedAmount,
    transactions: [newTransaction, ...currentWallet.transactions],
    updatedAt: now,
    lastTransactionAt: now,
  };

  return {
    success: true,
    message: `+${roundedAmount} moedas creditadas com sucesso!`,
    wallet: updatedWallet,
    transaction: newTransaction,
  };
}

/**
 * Executa uma transação de GASTO (SPEND)
 * - Validação estrita de saldo insuficiente (balance >= amount)
 * - Impede saldo negativo
 * - Atualiza saldo e total gasto
 */
export function executeSpendCoins(
  currentWallet: VirtualWallet,
  amount: number,
  source: CurrencySource = 'COSMETIC_PURCHASE',
  description: string,
  relatedId?: string,
  metadata?: Record<string, any>
): WalletOperationResult {
  if (amount <= 0) {
    return {
      success: false,
      message: 'Valor de débito inválido. O montante deve ser maior que zero.',
      error: 'INVALID_AMOUNT',
    };
  }

  const roundedAmount = Math.round(amount);

  // Proteção contra Saldo Negativo
  if (currentWallet.balance < roundedAmount) {
    const missing = roundedAmount - currentWallet.balance;
    return {
      success: false,
      message: `Saldo insuficiente. Faltam ${missing.toLocaleString('pt-BR')} moedas para esta operação.`,
      error: 'INSUFFICIENT_BALANCE',
    };
  }

  const now = new Date().toISOString();
  const txId = `tx_spend_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const newBalance = currentWallet.balance - roundedAmount;

  const newTransaction: CurrencyTransaction = {
    id: txId,
    playerId: currentWallet.playerId,
    type: 'SPEND',
    amount: roundedAmount,
    balanceAfter: newBalance,
    source,
    description,
    relatedId,
    timestamp: now,
    metadata,
  };

  const updatedWallet: VirtualWallet = {
    ...currentWallet,
    balance: newBalance,
    totalSpent: currentWallet.totalSpent + roundedAmount,
    transactions: [newTransaction, ...currentWallet.transactions],
    updatedAt: now,
    lastTransactionAt: now,
  };

  return {
    success: true,
    message: `-${roundedAmount} moedas debitadas com sucesso!`,
    wallet: updatedWallet,
    transaction: newTransaction,
  };
}

/**
 * Executa Ajuste Administrativo (ADJUSTMENT)
 * Permite correções manuais no saldo garantindo que o saldo final nunca seja inferior a 0.
 */
export function executeAdjustment(
  currentWallet: VirtualWallet,
  adjustmentAmount: number, // positivo para adicionar, negativo para subtrair
  reason: string
): WalletOperationResult {
  if (adjustmentAmount === 0) {
    return {
      success: false,
      message: 'O valor do ajuste não pode ser zero.',
      error: 'ZERO_ADJUSTMENT',
    };
  }

  const rounded = Math.round(adjustmentAmount);
  const newBalance = currentWallet.balance + rounded;

  if (newBalance < 0) {
    return {
      success: false,
      message: 'Ajuste rejeitado: a operação resultaria em saldo negativo.',
      error: 'NEGATIVE_BALANCE_NOT_ALLOWED',
    };
  }

  const now = new Date().toISOString();
  const txId = `tx_adj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const newTransaction: CurrencyTransaction = {
    id: txId,
    playerId: currentWallet.playerId,
    type: 'ADJUSTMENT',
    amount: Math.abs(rounded),
    balanceAfter: newBalance,
    source: 'ADMIN_ADJUSTMENT',
    description: `Ajuste de Saldo: ${reason}`,
    timestamp: now,
  };

  const updatedWallet: VirtualWallet = {
    ...currentWallet,
    balance: newBalance,
    totalEarned: rounded > 0 ? currentWallet.totalEarned + rounded : currentWallet.totalEarned,
    totalSpent: rounded < 0 ? currentWallet.totalSpent + Math.abs(rounded) : currentWallet.totalSpent,
    transactions: [newTransaction, ...currentWallet.transactions],
    updatedAt: now,
    lastTransactionAt: now,
  };

  return {
    success: true,
    message: `Ajuste de ${rounded > 0 ? `+${rounded}` : `${rounded}`} moedas realizado.`,
    wallet: updatedWallet,
    transaction: newTransaction,
  };
}

/**
 * Helper para obter o rótulo amigável de uma fonte de moedas
 */
export function getCurrencySourceLabel(source: CurrencySource): string {
  switch (source) {
    case 'MISSION':
      return 'Missão';
    case 'CHALLENGE':
      return 'Desafio';
    case 'DISPUTE_WIN':
      return 'Vitória em Disputa';
    case 'EVENT':
      return 'Evento / Torneio';
    case 'TOURNAMENT':
      return 'Torneio';
    case 'ACHIEVEMENT':
      return 'Conquista de Honra';
    case 'ZONE_CONQUEST':
      return 'Conquista de Zona';
    case 'SESSION':
      return 'Sessão de Patinação';
    case 'SEASON_REWARD':
      return 'Temporada';
    case 'REWARDED_AD':
      return 'Anúncio Recompensado';
    case 'COSMETIC_PURCHASE':
      return 'Item Cosmético';
    case 'ADMIN_ADJUSTMENT':
      return 'Ajuste';
    case 'REVERSAL':
      return 'Reversão';
    case 'INITIAL_BONUS':
      return 'Bônus Inicial';
    default:
      return 'Recompensa';
  }
}

/**
 * Helper para obter o ícone de uma fonte de moedas
 */
export function getCurrencySourceIcon(source: CurrencySource): string {
  switch (source) {
    case 'MISSION':
      return '🎯';
    case 'CHALLENGE':
    case 'DISPUTE_WIN':
      return '⚔️';
    case 'EVENT':
    case 'TOURNAMENT':
      return '🏆';
    case 'ACHIEVEMENT':
      return '🎖️';
    case 'ZONE_CONQUEST':
      return '📍';
    case 'SESSION':
      return '⏱️';
    case 'SEASON_REWARD':
      return '🌟';
    case 'REWARDED_AD':
      return '📺';
    case 'COSMETIC_PURCHASE':
      return '🛍️';
    case 'ADMIN_ADJUSTMENT':
    case 'REVERSAL':
      return '⚖️';
    case 'INITIAL_BONUS':
      return '🎁';
    default:
      return '🪙';
  }
}
