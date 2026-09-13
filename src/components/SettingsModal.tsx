import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  Shield,
  Bell,
  Gamepad2,
  MapPin,
  Palette,
  Volume2,
  Lock,
  Info,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Vibrate,
  Sliders,
  LogOut,
  Flame,
  Radio,
} from 'lucide-react';
import {
  AppThemeSetting,
  ChallengePermission,
  MapThemeSetting,
  PlayerSettings,
  SettingsCategory,
  UserProfile,
} from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: UserProfile;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: PlayerSettings) => void;
  blockedPlayersCount?: number;
  onOpenReportModal?: () => void;
  onOpenSocialHubBlocked?: () => void;
  onOpenHelpSupport?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  user,
  settings,
  onUpdateSettings,
  blockedPlayersCount = 0,
  onOpenReportModal,
  onOpenSocialHubBlocked,
  onOpenHelpSupport,
}) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('CONTA');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerFeedback = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Helper de atualização imutável
  const updateSetting = <K extends keyof PlayerSettings>(
    category: K,
    key: keyof PlayerSettings[K],
    value: any,
    feedbackText?: string
  ) => {
    const updated: PlayerSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    onUpdateSettings(updated);
    if (feedbackText) {
      triggerFeedback(feedbackText);
    }
  };

  const categoriesConfig: {
    id: SettingsCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'CONTA', label: 'Conta', icon: User },
    { id: 'PRIVACIDADE', label: 'Privacidade', icon: Eye },
    { id: 'NOTIFICACOES', label: 'Notificações', icon: Bell },
    { id: 'JOGO', label: 'Jogo', icon: Gamepad2 },
    { id: 'MAPA', label: 'Mapa', icon: MapPin },
    { id: 'APARENCIA', label: 'Aparência', icon: Palette },
    { id: 'SOM_E_VIBRACAO', label: 'Som & Vibração', icon: Volume2 },
    { id: 'SEGURANCA', label: 'Segurança', icon: Lock },
    { id: 'SOBRE', label: 'Sobre', icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="settings-modal"
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#000000] border-2 border-yellow-500/40 shadow-[0_15px_60px_rgba(252,232,3,0.25)] overflow-hidden text-white font-sans relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Superior */}
        <div className="absolute -top-12 inset-x-0 h-24 bg-gradient-to-b from-yellow-500/20 to-transparent blur-xl pointer-events-none" />

        {/* HEADER */}
        <div className="p-4 bg-gradient-to-b from-[#101824] to-[#0a0f16] border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-yellow-400">
                <Settings className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-tight font-display text-white flex items-center gap-1.5">
                  CONFIGURAÇÕES
                  <span className="px-1.5 py-0.2 rounded-md bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[9px] font-mono-stat font-black">
                    PREFERÊNCIAS
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 font-mono-stat">
                  Controle sua experiência, privacidade e mapa
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-settings-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar Configurações"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BARRA DE CATEGORIAS (Scroll Horizontal) */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none font-mono-stat text-[10px]">
            {categoriesConfig.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`tab-settings-${cat.id.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.4)]'
                      : 'bg-[#121a24] text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOAST DE FEEDBACK DE SALVAMENTO */}
        {saveToast && (
          <div className="px-4 py-1.5 bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-300 text-[10px] font-bold font-mono-stat flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-yellow-400" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* CORPO DE OPÇÕES DA CATEGORIA ATIVA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* ==========================================
              1. CONTA
             ========================================== */}
          {activeCategory === 'CONTA' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Card de Identidade do Skater */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121c2a] to-[#0c1420] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-yellow-400 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white truncate font-display">
                        {user.nickname}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black text-[9px] font-black font-mono-stat">
                        L{user.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono-stat">{user.name}</p>
                    <p className="text-[10px] text-yellow-400 font-mono-stat mt-0.5">
                      Clã: {user.crew || 'Sem Clã'} • {user.tag || '#042'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações Básicas da Conta */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                  DADOS DO CADASTRO
                </h4>

                <div className="space-y-2 text-xs font-mono-stat">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">E-mail</span>
                    <span className="text-white font-bold">{settings.account.email}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">Telefone</span>
                    <span className="text-white font-bold">{settings.account.phone}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">Membro desde</span>
                    <span className="text-yellow-400 font-bold">
                      {settings.account.registeredSince}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    triggerFeedback('A alteração de dados de cadastro estará disponível na próxima atualização.')
                  }
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 font-mono-stat uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Editar Dados Cadastrais
                </button>
              </div>

              {/* Gerenciamento de Sessão */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat">
                  SESSÃO & ACESSO
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Você está conectado como <strong className="text-white">{user.nickname}</strong>.
                </p>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold font-mono-stat uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Encerrar Sessão no Dispositivo
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              2. PRIVACIDADE
             ========================================== */}
          {activeCategory === 'PRIVACIDADE' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  VISIBILIDADE SOCIAL
                </h4>

                <div className="space-y-2.5">
                  {/* Perfil Público */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Perfil Público
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Outros patinadores podem ver seu avatar, nível e títulos
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.isProfilePublic}
                      onChange={(e) =>
                        updateSetting('privacy', 'isProfilePublic', e.target.checked, 'Preferência de perfil público atualizada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Atividades no Feed */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Publicar Atividades no Feed
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Conquistas de zonas e recordes aparecem no Feed Urbano
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivityInFeed}
                      onChange={(e) =>
                        updateSetting('privacy', 'showActivityInFeed', e.target.checked, 'Visibilidade de feed atualizada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Estatísticas no Perfil */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Exibir Estatísticas
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Mostrar quilometragem total e zonas no seu perfil
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showStatsOnProfile}
                      onChange={(e) =>
                        updateSetting('privacy', 'showStatsOnProfile', e.target.checked, 'Exibição de estatísticas atualizada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Radar de Proximidade */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Aparecer no Radar
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Aparecer para outros skaters na busca de próximos
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.appearInNearbyRadar}
                      onChange={(e) =>
                        updateSetting('privacy', 'appearInNearbyRadar', e.target.checked, 'Preferência de radar atualizada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Pedidos de Amizade */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Permitir Pedidos de Amizade
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Receber solicitações de amizade de novos skaters
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowFriendRequests}
                      onChange={(e) =>
                        updateSetting('privacy', 'allowFriendRequests', e.target.checked, 'Pedidos de amizade atualizados')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Permissão de Desafios Diretos */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat">
                  QUEM PODE ENVIAR DESAFIOS X1/X2?
                </h4>
                <div className="grid grid-cols-3 gap-1.5 font-mono-stat text-[10px]">
                  {(['EVERYONE', 'FRIENDS_ONLY', 'NOBODY'] as ChallengePermission[]).map((perm) => (
                    <button
                      key={perm}
                      type="button"
                      onClick={() =>
                        updateSetting('privacy', 'challengePermission', perm, 'Permissão de desafios salva')
                      }
                      className={`p-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                        settings.privacy.challengePermission === perm
                          ? 'bg-yellow-400 text-black shadow-md'
                          : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {perm === 'EVERYONE'
                        ? 'Todos'
                        : perm === 'FRIENDS_ONLY'
                        ? 'Amigos'
                        : 'Ninguém'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              3. NOTIFICAÇÕES
             ========================================== */}
          {activeCategory === 'NOTIFICACOES' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wider font-display flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      NOTIFICAÇÕES PUSH
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono-stat">
                      Alertas no dispositivo e na Central de Notificações
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.enablePushNotifications}
                    onChange={(e) =>
                      updateSetting('notifications', 'enablePushNotifications', e.target.checked, 'Notificações push atualizadas')
                    }
                    className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                  />
                </div>

                {/* Subcategorias de Notificações */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      ⚔️ Desafios & Duelos X1
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifyDirectChallenges}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifyDirectChallenges', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🚩 Domínio & Ataques a Zonas
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifyZoneConquest}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifyZoneConquest', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🏆 Conquistas, Medalhas & Nível
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifyAchievements}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifyAchievements', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🏁 Eventos & Torneios Urbanos
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifyEvents}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifyEvents', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      📜 Novas Missões & Objetivos
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifyMissions}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifyMissions', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      👥 Atividades Sociais & Amigos
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.notifications.enablePushNotifications}
                      checked={settings.notifications.notifySocialActivities}
                      onChange={(e) =>
                        updateSetting('notifications', 'notifySocialActivities', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              4. JOGO
             ========================================== */}
          {activeCategory === 'JOGO' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-yellow-400" />
                  PREFERÊNCIAS DE PATINAÇÃO & HUD
                </h4>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Confirmar Antes de Conquistar
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Exibir prompt de confirmação ao entrar no raio de uma zona livre
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.gameplay.confirmBeforeZoneCapture}
                      onChange={(e) =>
                        updateSetting('gameplay', 'confirmBeforeZoneCapture', e.target.checked, 'Preferência de confirmação salva')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Alertas Visuais de Proximidade
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Banners luminosos quando estiver a 100m de um ponto de interesse
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.gameplay.showProximityAlerts}
                      onChange={(e) =>
                        updateSetting('gameplay', 'showProximityAlerts', e.target.checked)
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Dicas & Tutoriais Rápidos
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Exibir lembretes estratégicos durante sessões ativas
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.gameplay.showInGameTutorialTips}
                      onChange={(e) =>
                        updateSetting('gameplay', 'showInGameTutorialTips', e.target.checked)
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Efeitos de Interface & Animações
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Glows neon e partículas visuais durante conquistas
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.gameplay.enableInterfaceEffects}
                      onChange={(e) =>
                        updateSetting('gameplay', 'enableInterfaceEffects', e.target.checked)
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Auto-Recentralizar Mapa
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Acompanhar a posição do patinador em tempo real
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.gameplay.autoRecenterMap}
                      onChange={(e) =>
                        updateSetting('gameplay', 'autoRecenterMap', e.target.checked)
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              5. MAPA
             ========================================== */}
          {activeCategory === 'MAPA' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Estilo do Mapa */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  TEMA DO MAPA GPS
                </h4>

                <div className="grid grid-cols-3 gap-2 font-mono-stat text-[11px]">
                  <button
                    type="button"
                    onClick={() => updateSetting('map', 'mapTheme', 'DARK', 'Mapa definido para Modo Escuro')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.map.mapTheme === 'DARK'
                        ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-cyan-400" />
                    <span className="font-black">Escuro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('map', 'mapTheme', 'LIGHT', 'Mapa definido para Modo Claro')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.map.mapTheme === 'LIGHT'
                        ? 'bg-slate-800 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="font-black">Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('map', 'mapTheme', 'AUTO', 'Mapa definido para Modo Automático')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.map.mapTheme === 'AUTO'
                        ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="font-black">Auto</span>
                  </button>
                </div>
              </div>

              {/* Elementos Visíveis no Mapa */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat">
                  CAMADAS & ELEMENTOS VISÍVEIS
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🚩 Zonas Territoriais & Polígonos
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.map.showZonesOnMap}
                      onChange={(e) => updateSetting('map', 'showZonesOnMap', e.target.checked)}
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🧭 Rotas & Circuitos Patináveis
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.map.showRoutesOnMap}
                      onChange={(e) => updateSetting('map', 'showRoutesOnMap', e.target.checked)}
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      👥 Outros Skaters no Radar
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.map.showOtherSkatersOnMap}
                      onChange={(e) =>
                        updateSetting('map', 'showOtherSkatersOnMap', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🔥 Trilhas de Calor (Heatmap)
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.map.showHeatmapTrails}
                      onChange={(e) => updateSetting('map', 'showHeatmapTrails', e.target.checked)}
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              6. APARÊNCIA
             ========================================== */}
          {activeCategory === 'APARENCIA' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  TEMA DO APLICATIVO
                </h4>

                <div className="grid grid-cols-3 gap-2 font-mono-stat text-[11px]">
                  <button
                    type="button"
                    onClick={() => updateSetting('appearance', 'appTheme', 'DARK', 'Tema Escuro selecionado')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.appearance.appTheme === 'DARK'
                        ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-yellow-400" />
                    <span className="font-black">Escuro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('appearance', 'appTheme', 'LIGHT', 'Tema Claro selecionado')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.appearance.appTheme === 'LIGHT'
                        ? 'bg-slate-800 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="font-black">Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('appearance', 'appTheme', 'SYSTEM', 'Tema do Sistema selecionado')}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      settings.appearance.appTheme === 'SYSTEM'
                        ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="font-black">Sistema</span>
                  </button>
                </div>
              </div>

              {/* Modo Compacto */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white font-display">
                      Modo Compacto de Interface
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-stat">
                      Reduz espaçamentos para exibir mais informações na tela
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                    className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ==========================================
              7. SOM E VIBRAÇÃO
             ========================================== */}
          {activeCategory === 'SOM_E_VIBRACAO' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
                  EFEITOS SONOROS
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Sons de Ação & Interface
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Sons ao iniciar sessões, conquistar e subir de nível
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.audioHaptics.soundEffectsEnabled}
                      onChange={(e) =>
                        updateSetting('audioHaptics', 'soundEffectsEnabled', e.target.checked, 'Configuração de som alterada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Volume Slider */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono-stat">
                      <span className="text-slate-400">Volume dos Efeitos</span>
                      <span className="text-yellow-400 font-bold">
                        {settings.audioHaptics.soundVolume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      disabled={!settings.audioHaptics.soundEffectsEnabled}
                      value={settings.audioHaptics.soundVolume}
                      onChange={(e) =>
                        updateSetting('audioHaptics', 'soundVolume', parseInt(e.target.value, 10))
                      }
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Tátil / Vibração */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat flex items-center gap-1.5">
                  <Vibrate className="w-3.5 h-3.5 text-cyan-400" />
                  FEEDBACK TÁTIL (VIBRAÇÃO)
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        Ativar Vibração Geral
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat">
                        Feedback tátil em eventos importantes do aplicativo
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.audioHaptics.vibrationEnabled}
                      onChange={(e) =>
                        updateSetting('audioHaptics', 'vibrationEnabled', e.target.checked, 'Vibração tátil atualizada')
                      }
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🚩 Vibrar ao Entrar em Zona Conquistável
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.audioHaptics.vibrationEnabled}
                      checked={settings.audioHaptics.vibrateOnZoneEntry}
                      onChange={(e) =>
                        updateSetting('audioHaptics', 'vibrateOnZoneEntry', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                    <span className="text-xs text-slate-300 font-mono-stat">
                      🏆 Vibrar ao Desbloquear Conquistas
                    </span>
                    <input
                      type="checkbox"
                      disabled={!settings.audioHaptics.vibrationEnabled}
                      checked={settings.audioHaptics.vibrateOnAchievement}
                      onChange={(e) =>
                        updateSetting('audioHaptics', 'vibrateOnAchievement', e.target.checked)
                      }
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              8. SEGURANÇA
             ========================================== */}
          {activeCategory === 'SEGURANCA' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Status de Integridade */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0b1b42] to-[#081330] border border-yellow-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-yellow-400 tracking-wider font-mono-stat flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    INTEGRIDADE DA CONTA
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 text-[9px] font-black font-mono-stat">
                    PROTEGIDA
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Sua conta está operando em conformidade total com o protocolo Fair Play do THE ROLLING WARS.
                </p>
              </div>

              {/* Gerenciamento de Jogadores Bloqueados */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat">
                    JOGADORES BLOQUEADOS
                  </h4>
                  <span className="text-xs font-bold text-slate-400 font-mono-stat">
                    {blockedPlayersCount} bloqueado(s)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono-stat">
                  Jogadores bloqueados não podem interagir, desafiar ou enviar mensagens a você.
                </p>
                {onOpenSocialHubBlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSocialHubBlocked();
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 font-mono-stat uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Gerenciar Bloqueios no Hub Social
                  </button>
                )}
              </div>

              {/* Atalho para Moderação e Denúncias */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat">
                  MODERAÇÃO & DENÚNCIAS
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono-stat">
                  Presenciou conduta antidesportiva ou spoofing de GPS? Reporte para a equipe de moderação.
                </p>
                {onOpenReportModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReportModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono-stat uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Abrir Central de Denúncias
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              9. SOBRE
             ========================================== */}
          {activeCategory === 'SOBRE' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121c2a] to-[#0c1420] border border-yellow-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center mx-auto text-yellow-400 shadow-[0_0_15px_rgba(252,232,3,0.3)]">
                  <Flame className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-black text-white font-display uppercase tracking-tight">
                  THE ROLLING WARS
                </h3>
                <p className="text-xs text-yellow-400 font-mono-stat font-bold">
                  Versão {settings.about.appVersion}
                </p>
                <p className="text-[10px] text-slate-400 font-mono-stat">
                  Build {settings.about.buildNumber} • {settings.about.engineVersion}
                </p>
              </div>

              {/* Links e Políticas */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider font-mono-stat mb-2">
                  INFORMAÇÕES LEGAIS & SUPORTE
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHelpSupport && onOpenHelpSupport();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-black uppercase tracking-wider text-indigo-400 font-display transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Central de Ajuda & Suporte
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <a
                  href="#termos"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerFeedback('Termos de Uso exibidos com sucesso.');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 text-xs text-slate-300 font-mono-stat transition-colors cursor-pointer"
                >
                  <span>Termos de Uso do Serviço</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="#privacidade"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerFeedback('Política de Privacidade exibida com sucesso.');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 text-xs text-slate-300 font-mono-stat transition-colors cursor-pointer"
                >
                  <span>Política de Privacidade e Dados</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono-stat">
                  <span className="text-slate-400">Canal de Suporte</span>
                  <span className="text-yellow-400 font-bold">{settings.about.supportEmail}</span>
                </div>
              </div>

              {/* Créditos */}
              <div className="p-3 text-center text-[10px] font-mono-stat text-slate-500">
                Desenvolvido com paixão para a comunidade de Patins Street e Freeskate de São Paulo.
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#000000] border-t border-white/10 flex items-center justify-between text-[10px] font-mono-stat text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-yellow-400" />
            Preferências Salvas Automaticamente
          </span>
          <button
            type="button"
            id="btn-close-settings-footer"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_10px_rgba(252,232,3,0.4)]"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
