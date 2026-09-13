import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trophy,
  Zap,
  Target,
  Swords,
  Crown,
  Info,
  MapPin,
  Flame,
  Shield,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AppNotification, AppNotificationType } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotificationAction?: (notification: AppNotification) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotificationAction,
}) => {
  const [filter, setFilter] = useState<'todas' | 'nao_lidas' | 'zonas' | 'conquistas'>('todas');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'nao_lidas') return !item.isRead;
    if (filter === 'zonas') return item.type === 'zona' || item.type === 'disputa';
    if (filter === 'conquistas') return item.type === 'conquista' || item.type === 'xp';
    return true;
  });

  const getNotificationIcon = (type: AppNotificationType) => {
    switch (type) {
      case 'zona':
        return <MapPin className="w-4 h-4 text-cyan-400" />;
      case 'conquista':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'disputa':
        return <Swords className="w-4 h-4 text-amber-400" />;
      case 'ranking':
        return <Crown className="w-4 h-4 text-amber-300" />;
      case 'desafio':
        return <Target className="w-4 h-4 text-orange-400" />;
      case 'xp':
        return <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400/30" />;
      case 'cla':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'evento':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'sistema':
      default:
        return <Info className="w-4 h-4 text-neutral-300" />;
    }
  };

  const getNotificationBadgeColor = (type: AppNotificationType) => {
    switch (type) {
      case 'zona':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
      case 'conquista':
        return 'bg-yellow-500/20 text-emerald-300 border-yellow-400/40';
      case 'disputa':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      case 'ranking':
        return 'bg-amber-400/20 text-amber-200 border-amber-300/40';
      case 'desafio':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/40';
      case 'xp':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40';
      case 'cla':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/40';
      case 'evento':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
      case 'sistema':
      default:
        return 'bg-slate-700/40 text-neutral-300 border-slate-600/40';
    }
  };

  const getTypeLabel = (type: AppNotificationType) => {
    switch (type) {
      case 'zona':
        return 'ZONA';
      case 'conquista':
        return 'CONQUISTA';
      case 'disputa':
        return 'DISPUTA';
      case 'ranking':
        return 'RANKING';
      case 'desafio':
        return 'DESAFIO';
      case 'xp':
        return 'XP';
      case 'cla':
        return 'CLÃ';
      case 'evento':
        return 'EVENTO';
      case 'sistema':
      default:
        return 'SISTEMA';
    }
  };

  const handleCardClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (onSelectNotificationAction) {
      onSelectNotificationAction(notification);
    }
  };

  return (
    <div
      id="modal-notifications"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md h-[90vh] max-h-[640px] rounded-3xl bg-[#0a0f15] border-2 border-yellow-500/40 shadow-[0_0_50px_rgba(0,255,102,0.25)] flex flex-col relative overflow-hidden">
        {/* Top Glow Decorator */}
        <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 pb-3 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 bg-[#0c121a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-sm relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border border-black" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-wide">
                  CENTRAL DE NOTIFICAÇÕES
                </h2>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-yellow-400 text-black font-mono-stat">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 font-mono-stat uppercase">
                Alertas de zonas, disputas e ranking
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-notifications"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Fechar notificações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filter Chips */}
        <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between gap-2 bg-[#090d13] shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('todas')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all ${
                filter === 'todas'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('nao_lidas')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all ${
                filter === 'nao_lidas'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('zonas')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all ${
                filter === 'zonas'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              Zonas
            </button>
            <button
              type="button"
              onClick={() => setFilter('conquistas')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat transition-all ${
                filter === 'conquistas'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              Conquistas
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              id="btn-mark-all-read"
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold text-neutral-300 hover:text-white font-mono-stat uppercase transition-all shrink-0 cursor-pointer"
              title="Marcar todas como lidas"
            >
              <CheckCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden xs:inline">Marcar lidas</span>
            </button>
          )}
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3 text-slate-500">
                🔔
              </div>
              <p className="text-xs font-bold text-neutral-300 font-mono-stat uppercase">
                Nenhuma notificação encontrada
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                {filter === 'nao_lidas'
                  ? 'Você está em dia com todos os alertas do Urbanozeiro!'
                  : 'Alertas de zonas, desafios e conquistas aparecerão aqui.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const badgeClass = getNotificationBadgeColor(notif.type);
              const label = getTypeLabel(notif.type);

              return (
                <div
                  key={notif.id}
                  id={`notification-item-${notif.id}`}
                  onClick={() => handleCardClick(notif)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    notif.isRead
                      ? 'bg-[#0a0e14]/70 border-white/5 hover:border-white/20 hover:bg-[#0e141c]'
                      : 'bg-[#0f1722] border-yellow-500/40 shadow-[0_0_15px_rgba(0,255,102,0.15)] hover:border-yellow-400'
                  }`}
                >
                  {/* Unread Accent Dot */}
                  {!notif.isRead && (
                    <span className="absolute top-3.5 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon Box */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.isRead
                          ? 'bg-white/5 border-white/10 text-neutral-400'
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-sm'
                      }`}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase font-mono-stat border ${badgeClass}`}
                        >
                          {label}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono-stat">
                          {notif.timeAgo}
                        </span>
                      </div>

                      <h3
                        className={`text-xs font-black uppercase tracking-tight leading-snug font-display ${
                          notif.isRead ? 'text-neutral-300' : 'text-white'
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <p className="text-[11px] text-neutral-300/90 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {/* Interactive Action Prompt if available */}
                      {notif.actionType && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-yellow-400 font-mono-stat uppercase group-hover:text-emerald-300">
                          <span>
                            {notif.actionType === 'open_zone' && 'Visualizar Zona'}
                            {notif.actionType === 'open_ranking' && 'Abrir Ranking'}
                            {notif.actionType === 'open_challenge' && 'Ver Desafio'}
                            {notif.actionType === 'open_direct_challenge' && 'Ver Desafio Direto X1'}
                            {notif.actionType === 'open_profile' && 'Ver Meu Progresso'}
                            {notif.actionType === 'open_routes' && 'Ver Rotas'}
                          </span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="p-3 bg-[#080c10] border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400 font-mono-stat shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span>Sistema Urbanozeiro Realtime</span>
          </div>
          <span className="text-[9px] text-slate-500">v1.2</span>
        </div>
      </div>
    </div>
  );
};
