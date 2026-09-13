import React from 'react';
import { Bell, Flame, Activity, Users, Shield, Zap, Search, Settings } from 'lucide-react';
import { UserProfile, VirtualWallet } from '../types';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
  unreadNotificationsCount?: number;
  wallet?: VirtualWallet;
  onOpenNotifications?: () => void;
  onOpenSocial?: () => void;
  onOpenWallet?: () => void;
  onOpenActivityFeed?: () => void;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadNotificationsCount = 0,
  wallet,
  onOpenNotifications,
  onOpenSocial,
  onOpenWallet,
  onOpenActivityFeed,
  onOpenProfile,
  onOpenSearch,
  onOpenSettings,
}) => {
  const currentXP = user.xp || 0;
  const nextLevelXP = user.nextLevelXp || 5000;
  const xpPercent = Math.min(100, Math.max(0, Math.round((currentXP / nextLevelXP) * 100)));

  return (
    <header className="relative z-30 flex items-center justify-between px-3 py-2 bg-[#000000]/95  border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
      {/* Top Subtle Neon Edge Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent pointer-events-none" />

      {/* LEFT: Interactive Player Avatar Profile Card (Tapping opens Profile directly) */}
      <button
        type="button"
        id="btn-header-player-profile"
        onClick={onOpenProfile}
        className="group relative flex items-center gap-2.5 px-2 py-1.5 rounded-2xl bg-gradient-to-r from-[#121a24] to-[#000000] border border-white/10 hover:border-yellow-400/50 shadow-[0_4px_12px_rgba(0,0,0,0.6)] active:scale-95 transition-all text-left cursor-pointer"
        title="Abrir Perfil do Jogador"
        aria-label="Ver Perfil"
      >
        {/* Avatar with level badge */}
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-10 h-10 rounded-xl object-cover border-2 border-yellow-400 shadow-[0_0_12px_rgba(252,232,3,0.35)]"
          />
          {/* Neon Level Badge Overlay */}
          <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-[9px] font-mono-stat rounded-md shadow-md border border-black leading-none">
            L{user.level}
          </div>
        </div>

        {/* Player Identity & Compact XP Bar */}
        <div className="flex flex-col justify-center min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors truncate max-w-[90px] sm:max-w-[110px] leading-tight font-display tracking-tight">
              {user.nickname}
            </span>
            <span className="text-[9px] text-yellow-400 font-mono-stat font-bold">
              {user.tag || '#ZEIRO'}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-1 flex items-center gap-1.5 w-24 sm:w-28">
            <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-[0.5px]">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_6px_#fce803]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[8px] font-mono-stat font-black text-slate-400 shrink-0 leading-none">
              {xpPercent}%
            </span>
          </div>
        </div>
      </button>

      {/* RIGHT: Resources & Quick Game Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Busca & Descoberta Global */}
        {onOpenSearch && (
          <button
            type="button"
            id="btn-open-search-header"
            onClick={onOpenSearch}
            className="relative p-2 rounded-xl bg-[#050505] hover:bg-[#182330] border border-white/10 hover:border-yellow-400/50 text-slate-300 hover:text-yellow-400 shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95 transition-all cursor-pointer"
            title="Busca e Descoberta Global"
            aria-label="Buscar Jogadores, Zonas e Rotas"
          >
            <Search className="w-4 h-4 text-slate-300 group-hover:text-yellow-400" />
          </button>
        )}

        {/* Virtual Currency Pill (Moedas do Jogo) */}
        

        {/* Social / Amigos */}
        {onOpenSocial && (
          <button
            type="button"
            id="btn-open-social-header"
            onClick={onOpenSocial}
            className="relative p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-yellow-400 text-white shadow-[0_0_10px_rgba(29,78,216,0.6)] active:scale-95 transition-all cursor-pointer"
            title="Amigos e Perfil Social"
            aria-label="Abrir Amigos"
          >
            <Users className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Central de Atividades / Feed Urbano */}
        {onOpenActivityFeed && (
          <button
            type="button"
            id="btn-open-activity-feed-header"
            onClick={onOpenActivityFeed}
            className="relative p-2 rounded-xl bg-[#050505] hover:bg-[#182330] border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95 transition-all cursor-pointer"
            title="Feed & Central de Atividades"
            aria-label="Abrir Feed de Atividades"
          >
            <Activity className="w-4 h-4 text-slate-300 group-hover:text-cyan-400" />
          </button>
        )}

        {/* Central de Notificações com Badge */}
        <button
          type="button"
          id="btn-open-notifications"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#050505] hover:bg-[#182330] border border-white/10 hover:border-yellow-400/50 text-slate-300 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95 transition-all cursor-pointer"
          title="Central de Notificações"
          aria-label="Abrir Notificações"
        >
          <Bell className="w-4 h-4 text-slate-300 hover:text-white" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-yellow-400 text-black text-[9px] font-black font-mono-stat border border-black shadow-[0_0_10px_#fce803] animate-pulse">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Central de Configurações */}
        {onOpenSettings && (
          <button
            type="button"
            id="btn-open-settings-header"
            onClick={onOpenSettings}
            className="relative p-2 rounded-xl bg-[#050505] hover:bg-[#182330] border border-white/10 hover:border-yellow-400/50 text-slate-300 hover:text-yellow-400 shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95 transition-all cursor-pointer"
            title="Configurações & Preferências"
            aria-label="Abrir Configurações"
          >
            <Settings className="w-4 h-4 text-slate-300 group-hover:text-yellow-400" />
          </button>
        )}
      </div>
    </header>
  );
};


