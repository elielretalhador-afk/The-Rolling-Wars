import React from 'react';
import { Activity as ActivityItem, ActivitySession, Clan, PersonalAchievement, PlayerProgression, UserProfile, VirtualWallet, Zone } from '../types';
import { Shield, Flame, Disc, History, MapPin, Zap, Clock, Gauge, ArrowRight, Activity, Calendar, Trophy, Award, Sparkles, Users, Plus, LogIn, Crown, Package, Layers, Coins, Eye, Radio, Gift, Settings } from 'lucide-react';
import { getEquippedFrameStyle, getNextLevelDefinition, getRarityColor } from '../data/progressionData';
import { getActivityIcon, getActivityStyle, formatActivityTimeAgo } from '../data/activityData';
import { RewardsHubSection } from './RewardsHubSection';

interface PerfilViewProps {
  user: UserProfile;
  controlledZones: Zone[];
  onSelectZoneOnMap: (zone: Zone) => void;
  sessionHistory?: ActivitySession[];
  onSelectHistoricalSession?: (session: ActivitySession) => void;
  onOpenSessionHistory?: (session?: ActivitySession) => void;
  onOpenStatistics?: () => void;
  achievements?: PersonalAchievement[];
  onOpenAchievements?: () => void;
  onOpenAchievementsWithTab?: (tab: 'conquistas' | 'medalhas' | 'titulos') => void;
  progression?: PlayerProgression;
  onOpenProgressionHub?: (tab?: 'visao_geral' | 'inventario' | 'colecoes' | 'historico_xp') => void;
  wallet?: VirtualWallet;
  onOpenWallet?: () => void;
  onOpenSecurity?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  recentActivities?: ActivityItem[];
  onOpenActivityFeed?: () => void;
  medalsCount?: number;
  titlesCount?: number;
  userClan?: Clan | null;
  onOpenClanProfile?: (clan: Clan) => void;
  onOpenCreateClan?: () => void;
  onOpenJoinClan?: () => void;
  onOpenClanLeaderboard?: () => void;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  nearbyPlayersCount?: number;
  onOpenSocialHub?: (tab?: any) => void;
  onOpenSeasonHub?: (tab?: 'visao_geral' | 'ranking' | 'recompensas' | 'historico') => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  user,
  controlledZones,
  onSelectZoneOnMap,
  sessionHistory = [],
  onSelectHistoricalSession,
  onOpenSessionHistory,
  onOpenStatistics,
  achievements = [],
  onOpenAchievements,
  onOpenAchievementsWithTab,
  progression,
  onOpenProgressionHub,
  wallet,
  onOpenWallet,
  onOpenSecurity,
  onOpenSettings,
  onLogout,
  recentActivities = [],
  onOpenActivityFeed,
  medalsCount = 4,
  titlesCount = 3,
  userClan,
  onOpenClanProfile,
  onOpenCreateClan,
  onOpenJoinClan,
  onOpenClanLeaderboard,
  friendsCount = 2,
  followersCount = 128,
  followingCount = 74,
  nearbyPlayersCount = 4,
  onOpenSocialHub,
  onOpenSeasonHub,
}) => {
  const currentXP = user.xp;
  const nextLevelXP = user.nextLevelXp || 5000;
  const xpProgress = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));
  const xpRemaining = Math.max(0, nextLevelXP - currentXP);
  const nextLevelDef = getNextLevelDefinition(user.level);
  const equipped = progression?.equippedItems || user.equippedCosmetics || {};
  const frameStyle = getEquippedFrameStyle(equipped.frameId || user.equippedCosmetics?.frameId);
  const unlockedAchievementsCount = achievements.filter((a) => a.isUnlocked).length;
  const totalAchievementsCount = achievements.length;
  const achievementProgressPct = totalAchievementsCount > 0
    ? Math.round((unlockedAchievementsCount / totalAchievementsCount) * 100)
    : 0;

  const handleOpenTab = (tab: 'conquistas' | 'medalhas' | 'titulos') => {
    if (onOpenAchievementsWithTab) {
      onOpenAchievementsWithTab(tab);
    } else if (onOpenAchievements) {
      onOpenAchievements();
    }
  };

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain px-4 py-4 pb-36 bg-[#080b0e]">
      {/* Skater Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#111923] to-[#0a0f15] border-2 border-yellow-500/40 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.nickname}
              className={`w-16 h-16 rounded-2xl object-cover ${frameStyle.borderClass} ${frameStyle.glowClass}`}
            />
            <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400 text-black font-mono-stat">
              LVL.{user.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight truncate">
                {user.nickname}
              </h2>
              <span className="text-xs font-bold text-neutral-400 font-mono-stat shrink-0 ml-1">
                {user.tag}
              </span>
            </div>

            {/* Active Title Banner */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <button
                type="button"
                onClick={() => handleOpenTab('titulos')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-[10px] font-black text-amber-300 font-mono-stat uppercase tracking-wider hover:bg-amber-400/25 transition-all cursor-pointer"
                title="Clique para trocar título"
              >
                <Crown className="w-3 h-3 text-amber-400" />
                <span>{user.activeTitle || 'Conquistador'}</span>
              </button>
            </div>

            <p className="text-xs font-bold text-yellow-400 uppercase font-mono-stat mt-1">
              {user.crew}
            </p>
            <p className="text-[11px] text-neutral-300 mt-0.5 font-medium">
              {user.name} • SÃO PAULO, BR
            </p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-bold mb-1 font-mono-stat">
            <span className="text-neutral-400 uppercase text-[11px]">PROGRESSO NÍVEL {user.level}</span>
            <span className="text-yellow-400 font-black">
              {user.xp} / {user.nextLevelXp} XP ({xpProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_#00ff66] transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono-stat text-neutral-400">
            <span>
              Restam <strong className="text-white">{xpRemaining.toLocaleString()} XP</strong> para o Nível {user.level + 1}
            </span>
            {onOpenProgressionHub && (
              <button
                type="button"
                onClick={() => onOpenProgressionHub('visao_geral')}
                className="text-yellow-400 hover:text-emerald-300 font-bold underline cursor-pointer"
              >
                Ver Trilha →
              </button>
            )}
          </div>
        </div>
      </div>

      

        {/* Social Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/10">
          <div
            onClick={() => onOpenSocialHub && onOpenSocialHub('amigos')}
            className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-yellow-400/40 text-center transition-all cursor-pointer"
          >
            <span className="text-[8px] font-bold text-neutral-400 uppercase font-mono-stat block">
              AMIGOS
            </span>
            <div className="text-base font-black text-yellow-400 font-mono-stat my-0.5">
              {friendsCount}
            </div>
            <div className="text-[9px] text-neutral-400">Conectados</div>
          </div>

          <div
            onClick={() => onOpenSocialHub && onOpenSocialHub('proximos')}
            className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/40 text-center transition-all cursor-pointer"
          >
            <span className="text-[8px] font-bold text-neutral-400 uppercase font-mono-stat block">
              PRÓXIMOS
            </span>
            <div className="text-base font-black text-cyan-300 font-mono-stat my-0.5">
              {nearbyPlayersCount}
            </div>
            <div className="text-[9px] text-neutral-400">No radar</div>
          </div>

          <div
            onClick={() => onOpenSocialHub && onOpenSocialHub('sugestoes')}
            className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 text-center transition-all cursor-pointer"
          >
            <span className="text-[8px] font-bold text-neutral-400 uppercase font-mono-stat block">
              SEGUIDORES
            </span>
            <div className="text-base font-black text-amber-300 font-mono-stat my-0.5">
              {followersCount}
            </div>
            <div className="text-[9px] text-neutral-400">{followingCount} seguindo</div>
          </div>
        </div>

      {/* Setup de Patins / Gear Card */}
      <div className="mt-4 p-4 rounded-2xl bg-[#0d141d] border-2 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono-stat">
            <Disc className="w-4 h-4 text-yellow-400" />
            SETUP DE EQUIPAMENTO
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-equipment-modal'))} className="text-[10px] uppercase font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md hover:bg-yellow-500/20">
            Editar
          </button>
        </div>

        <div className="space-y-2 text-xs font-medium">
          <div className="flex items-center justify-between py-1.5 border-b border-white/10">
            <span className="text-neutral-400 uppercase font-mono-stat text-[11px]">BOTA / MODELO</span>
            <span className="font-bold text-white">{user.skateSetup?.model || 'Não informado'}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-white/10">
            <span className="text-neutral-400 uppercase font-mono-stat text-[11px]">RODAS</span>
            <span className="font-bold text-yellow-400 font-mono-stat text-right max-w-[60%]">
              {typeof user.skateSetup?.wheels === 'string' ? user.skateSetup.wheels : (user.skateSetup?.wheels ? `${user.skateSetup.wheels.brand} ${user.skateSetup.wheels.model} ${user.skateSetup.wheels.size}mm ${user.skateSetup.wheels.hardness}` : 'Não informado')}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-neutral-400 uppercase font-mono-stat text-[11px]">ROLAMENTOS</span>
            <span className="font-bold text-cyan-300 font-mono-stat text-right max-w-[60%]">
              {typeof user.skateSetup?.bearings === 'string' ? user.skateSetup.bearings : (user.skateSetup?.bearings ? `${user.skateSetup.bearings.brand} ${user.skateSetup.bearings.model} ${user.skateSetup.bearings.type}` : 'Não informado')}
            </span>
          </div>
        </div>
      </div>

      {/* ÁREA DE CLÃ (SISTEMA DE CLÃS) */}
      <div id="perfil-clan-section" className="mt-4 p-4 rounded-3xl bg-gradient-to-b from-[#111a26] to-[#0a1017] border-2 border-yellow-500/40 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: userClan?.color || '#00ff66' }}
        />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
                CLÃ URBANO
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono-stat uppercase">
                {userClan ? 'Organização coletiva de patinadores' : 'Pelotão e disputa territorial'}
              </p>
            </div>
          </div>

          {userClan && onOpenClanLeaderboard && (
            <button
              type="button"
              id="btn-clan-ranking-shortcut"
              onClick={onOpenClanLeaderboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-bold text-[10px] font-mono-stat border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Ranking</span>
            </button>
          )}
        </div>

        {userClan ? (
          /* Jogador possui um Clã */
          <div className="space-y-3">
            <div
              onClick={() => onOpenClanProfile && onOpenClanProfile(userClan)}
              className="p-3.5 rounded-2xl bg-[#0d141e] border border-white/10 hover:border-yellow-400/60 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                {/* Clan Crest */}
                <div
                  className="w-13 h-13 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform"
                  style={{
                    borderColor: userClan.color,
                    backgroundColor: `${userClan.color}20`,
                    boxShadow: `0 0 15px ${userClan.color}30`,
                  }}
                >
                  {userClan.symbol}
                </div>

                {/* Clan Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <h4 className="text-sm font-black text-white font-display uppercase tracking-tight truncate">
                        {userClan.name}
                      </h4>
                      <span
                        className="px-1.5 py-0.2 rounded text-[9px] font-black font-mono-stat uppercase"
                        style={{
                          backgroundColor: `${userClan.color}20`,
                          color: userClan.color,
                        }}
                      >
                        [{userClan.tag}]
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-black font-mono-stat shrink-0 flex items-center gap-0.5">
                      <Trophy className="w-2.5 h-2.5 text-amber-400" />
                      <span>#{userClan.rankPosition}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                    {userClan.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[9px] text-neutral-400 font-mono-stat">
                    <span className="text-yellow-400 font-bold">
                      NÍVEL {userClan.level}
                    </span>
                    <span>•</span>
                    <span className="text-neutral-300">
                      {userClan.membersCount} / {userClan.maxMembers} membros
                    </span>
                    <span>•</span>
                    <span className="text-cyan-300">
                      {userClan.controlledZonesCount} zonas dominadas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-view-clan-profile"
                onClick={() => onOpenClanProfile && onOpenClanProfile(userClan)}
                className="py-2.5 px-3 rounded-2xl bg-yellow-400 hover:bg-emerald-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,102,0.3)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>VER PERFIL DO CLÃ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                id="btn-view-clan-leaderboard"
                onClick={onOpenClanLeaderboard}
                className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs font-mono-stat uppercase tracking-wider border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>RANKING DE CLÃS</span>
              </button>
            </div>
          </div>
        ) : (
          /* Jogador NÃO possui Clã */
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto text-neutral-400">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 font-mono-stat uppercase">
                Você ainda não faz parte de um clã.
              </p>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Junte-se a outros patinadores para somar quilometragem, dominar zonas e disputar o ranking coletivo da metrópole.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                id="btn-create-clan-from-profile"
                onClick={onOpenCreateClan}
                className="py-2.5 px-3 rounded-2xl bg-yellow-400 hover:bg-emerald-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,102,0.3)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>CRIAR CLÃ</span>
              </button>

              <button
                type="button"
                id="btn-join-clan-from-profile"
                onClick={onOpenJoinClan}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs font-mono-stat uppercase tracking-wider border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>ENTRAR EM UM CLÃ</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ÁREA DE CONQUISTAS, MEDALHAS & TÍTULOS */}
      <div id="perfil-conquistas-section" className="mt-4 p-4 rounded-3xl bg-gradient-to-b from-[#101824] to-[#0a1017] border-2 border-yellow-500/40 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
                CONQUISTAS & HONRARIAS
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono-stat uppercase">
                Feitos • Medalhas • Títulos
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-view-all-achievements"
            onClick={() => handleOpenTab('conquistas')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 text-emerald-300 hover:text-black font-black text-xs font-mono-stat border border-yellow-400/40 active:scale-95 transition-all shadow-sm cursor-pointer group"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Header Progress Counter */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5 font-mono-stat">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>🏆 {unlockedAchievementsCount} / {totalAchievementsCount} desbloqueadas</span>
            </span>
            <span className="text-yellow-400">
              {achievementProgressPct}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_#00ff66]"
              style={{ width: `${achievementProgressPct}%` }}
            />
          </div>
        </div>

        {/* Featured Achievements Preview (Desbloqueadas & Em Progresso) */}
        {achievements.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {achievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                onClick={() => handleOpenTab('conquistas')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer hover:border-yellow-400/80 active:scale-95 ${
                  ach.isUnlocked
                    ? 'bg-[#0f1a26] border-yellow-500/40 shadow-sm'
                    : 'bg-[#090d13] border-white/10 opacity-90'
                }`}
              >
                <div className="text-xl mb-1">{ach.iconEmoji || '🏆'}</div>
                <div className="text-[10px] font-black text-white uppercase font-display truncate">
                  {ach.name}
                </div>
                <div className="text-[8px] text-neutral-400 font-mono-stat mt-0.5 truncate">
                  {ach.isUnlocked ? '✓ DESBLOQUEADA' : `${ach.currentProgress}/${ach.targetProgress} ${ach.unit}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Tabs Footer */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/5 text-[10px] font-mono-stat font-bold">
          <button
            type="button"
            onClick={() => handleOpenTab('conquistas')}
            className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-center transition-all cursor-pointer"
          >
            🏆 Conquistas
          </button>
          <button
            type="button"
            onClick={() => handleOpenTab('medalhas')}
            className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white text-center transition-all cursor-pointer"
          >
            🏅 Medalhas
          </button>
          <button
            type="button"
            onClick={() => handleOpenTab('titulos')}
            className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-white text-center transition-all cursor-pointer"
          >
            👑 Títulos
          </button>
        </div>
      </div>

      {/* MINHAS ATIVIDADES RECENTES (INTEGRAÇÃO COM CENTRAL DE ATIVIDADES) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono-stat">
            <Zap className="w-4 h-4 text-cyan-400" />
            ATIVIDADES RECENTES ({(recentActivities || []).filter((a) => a.isOwnActivity || a.playerId === user.id).length})
          </h3>
          {onOpenActivityFeed && (
            <button
              type="button"
              id="btn-view-all-activities-perfil"
              onClick={onOpenActivityFeed}
              className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase font-mono-stat flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>VER FEED COMPLETO</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {(recentActivities || []).filter((a) => a.isOwnActivity || a.playerId === user.id).length > 0 ? (
          <div className="space-y-2">
            {recentActivities
              .filter((a) => a.isOwnActivity || a.playerId === user.id)
              .slice(0, 3)
              .map((act) => {
                const style = getActivityStyle(act.type);
                const icon = getActivityIcon(act.type);
                return (
                  <div
                    key={act.id}
                    className={`p-3 rounded-2xl bg-[#0d141e] border ${style.borderColor} flex items-center justify-between gap-3 shadow-md`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-black uppercase font-display truncate ${style.accentColor}`}>
                            {act.title}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono-stat">
                            • {formatActivityTimeAgo(act.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 truncate font-sans">
                          {act.description}
                        </p>
                      </div>
                    </div>

                    {onOpenActivityFeed && (
                      <button
                        type="button"
                        onClick={onOpenActivityFeed}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white shrink-0 cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#0d141e] border border-white/10 text-center text-xs text-neutral-400">
            Nenhuma atividade própria recente registrada no feed ainda.
          </div>
        )}
      </div>

      {/* ESTATÍSTICAS DO JOGADOR */}
      <div className="mt-4 p-4 rounded-3xl bg-[#080c13] border-2 border-white/5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-display flex items-center gap-2">
                <span>ESTATÍSTICAS</span>
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono-stat">
                Resumo geral de desempenho
              </p>
            </div>
          </div>
        </div>

        {(() => {
          const stats_distance = sessionHistory.reduce((acc, sess) => acc + (sess.distance ?? sess.distanceKm ?? 0), 0);
          const final_distance = Math.max(stats_distance, user.totalKm || 0);

          const stats_duration = sessionHistory.reduce((acc, sess) => acc + (sess.duration ?? sess.durationSeconds ?? 0), 0);
          const stats_sessions = sessionHistory.length;
          const stats_maxSpeed = sessionHistory.reduce((acc, sess) => Math.max(acc, sess.maxSpeed ?? sess.maxSpeedKmH ?? 0), 0);
          const final_maxSpeed = Math.max(stats_maxSpeed, user.currentSpeedKmH || 0);

          const validSpeedSessions = (sessionHistory || []).filter(s => (s.averageSpeed ?? s.avgSpeedKmH ?? 0) > 0);
          const stats_avgSpeed = validSpeedSessions.length > 0
            ? validSpeedSessions.reduce((acc, sess) => acc + (sess.averageSpeed ?? sess.avgSpeedKmH ?? 0), 0) / validSpeedSessions.length
            : 0;

          const stats_zones = sessionHistory.reduce((acc, sess) => acc + (sess.zonesConquered?.length ?? 0), 0);
          const final_zones = Math.max(stats_zones, user.controlledZonesCount || 0);

          // As there's no explicit "Personal Records" array yet, we use a placeholder of 0.
          const stats_records = 0; 

          const hrs = Math.floor(stats_duration / 3600);
          const mins = Math.floor((stats_duration % 3600) / 60);
          const timeFormatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;

          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Distância Total</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight">
                  {final_distance > 0 ? final_distance.toFixed(1) : '0'}<span className="text-xs text-slate-500 ml-1">km</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tempo Total</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight">
                  {stats_duration > 0 ? timeFormatted : '0 min'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Patinações</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight">
                  {stats_sessions > 0 ? stats_sessions : '0'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vel. Máxima</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight">
                  {final_maxSpeed > 0 ? final_maxSpeed.toFixed(1) : '0'}<span className="text-xs text-slate-500 ml-1">km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Vel. Média</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight">
                  {stats_avgSpeed > 0 ? stats_avgSpeed.toFixed(1) : '0'}<span className="text-xs text-slate-500 ml-1">km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Conquistas</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight flex items-baseline gap-1.5">
                  {final_zones > 0 ? final_zones : '0'}
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">zonas</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d141e] border border-white/10 flex flex-col justify-center sm:col-span-3">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recordes</span>
                </div>
                <div className="text-xl font-black text-white font-mono-stat tracking-tight flex items-baseline gap-1.5">
                  {stats_records > 0 ? stats_records : '0'}
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">pessoais</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* HISTÓRICO DE PATINAÇÕES */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono-stat">
            <History className="w-4 h-4 text-[#00ff66]" />
            HISTÓRICO DE PATINAÇÕES ({sessionHistory.length})
          </h3>
          {sessionHistory.length > 0 && onOpenSessionHistory && (
            <button
              type="button"
              id="btn-open-full-history-modal"
              onClick={() => onOpenSessionHistory()}
              className="px-2.5 py-1 rounded-lg bg-[#00ff66]/15 hover:bg-[#00ff66]/25 text-[#00ff66] text-[10px] font-black font-mono-stat border border-[#00ff66]/40 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>VER COMPLETO</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {sessionHistory.length > 0 ? (
          <div className="space-y-3.5">
            {sessionHistory.map((session, index) => {
              const sessionNum = session.sessionNumber || (sessionHistory.length - index);
              const title = session.title || `PATINAÇÃO #${sessionNum}`;
              const distanceVal = session.distance ?? session.distanceKm ?? 0;
              const formattedDist =
                distanceVal < 1.0
                  ? `${Math.round(distanceVal * 1000)} m`
                  : `${distanceVal.toFixed(2)} km`;
              const pointsTotal = session.gpsPoints?.length || session.track?.length || session.pointsCount || 0;
              const durationVal = session.duration ?? session.durationSeconds ?? 0;
              const maxSpeedVal = session.maxSpeed ?? session.maxSpeedKmH ?? 0;
              const avgSpeedVal = session.averageSpeed ?? session.avgSpeedKmH ?? 0;
              const conqueredCount = session.zonesConquered?.length ?? 0;
              const visitedCount = session.zonesVisited?.length ?? session.zoneActivities?.length ?? 0;
              const xpVal = session.xpEarned ?? 0;

              return (
                <div
                  key={session.id || `hist-${index}`}
                  id={`session-card-${session.id}`}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111a26] to-[#0a1017] border-2 border-white/10 hover:border-[#00ff66]/60 transition-all duration-200 shadow-xl"
                >
                  {/* Subtle top accent line for latest session */}
                  {index === 0 && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff66] to-transparent" />
                  )}

                  <div className="p-4">
                    {/* Header: Title, Badges & Date */}
                    <div 
                      className="flex items-start justify-between gap-2 pb-3 border-b border-white/10 cursor-pointer"
                      onClick={() => onOpenSessionHistory ? onOpenSessionHistory(session) : onSelectHistoricalSession?.(session)}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="p-1.5 rounded-lg bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-black text-white uppercase font-display tracking-tight hover:text-[#00ff66] transition-colors">
                            {title}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 font-mono-stat shadow-[0_0_8px_rgba(0,255,102,0.25)]">
                              MAIS RECENTE
                            </span>
                          )}
                          {session.repeatedFromActivityId && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono-stat">
                              TENTATIVA DE ROTA
                            </span>
                          )}
                          {xpVal > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono-stat">
                              +{xpVal} XP
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-400 font-mono-stat flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {session.dateFormatted || 'Sessão concluída'}
                          </span>
                          {pointsTotal > 0 && (
                            <span className="text-slate-500">
                              • {pointsTotal} pontos GPS
                            </span>
                          )}
                          {conqueredCount > 0 && (
                            <span className="text-yellow-400 font-bold">
                              • {conqueredCount} {conqueredCount === 1 ? 'zona conquistada' : 'zonas conquistadas'}
                            </span>
                          )}
                          {conqueredCount === 0 && visitedCount > 0 && (
                            <span className="text-cyan-300">
                              • {visitedCount} {visitedCount === 1 ? 'zona visitada' : 'zonas visitadas'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid: High Contrast & Modern 4-metric or 3-metric Layout */}
                    <div 
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 font-mono-stat cursor-pointer"
                      onClick={() => onOpenSessionHistory ? onOpenSessionHistory(session) : onSelectHistoricalSession?.(session)}
                    >
                      {/* Distance */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                          <MapPin className="w-3 h-3 text-[#00ff66]" />
                          <span>Distância</span>
                        </div>
                        <div className="text-base font-black text-[#00ff66] mt-1.5 tracking-tight">
                          {formattedDist}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                          <Clock className="w-3 h-3 text-neutral-300" />
                          <span>Duração</span>
                        </div>
                        <div className="text-base font-bold text-white mt-1.5 tracking-tight">
                          {formatDuration(durationVal)}
                        </div>
                      </div>

                      {/* Max Speed */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>Vel. Máx</span>
                        </div>
                        <div className="text-base font-bold text-cyan-300 mt-1.5 tracking-tight">
                          {maxSpeedVal.toFixed(1)} <span className="text-[10px] font-normal text-neutral-400">km/h</span>
                        </div>
                      </div>

                      {/* Avg Speed */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                          <Gauge className="w-3 h-3 text-yellow-400" />
                          <span>Vel. Média</span>
                        </div>
                        <div className="text-base font-bold text-emerald-300 mt-1.5 tracking-tight">
                          {avgSpeedVal.toFixed(1)} <span className="text-[10px] font-normal text-neutral-400">km/h</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: View Track on Map & View Full Details */}
                    <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] text-neutral-400 font-mono-stat">
                        {pointsTotal > 1 ? `${pointsTotal} coordenadas registradas` : 'Coordenadas salvas'}
                      </span>

                      <div className="flex items-center gap-2">
                        {onOpenSessionHistory && (
                          <button
                            type="button"
                            onClick={() => onOpenSessionHistory(session)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white font-bold text-xs font-mono-stat border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>DETALHES</span>
                          </button>
                        )}

                        {onSelectHistoricalSession && (
                          <button
                            type="button"
                            id={`btn-view-track-${session.id}`}
                            onClick={() => onSelectHistoricalSession(session)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#00ff66]/15 hover:bg-[#00ff66] text-[#00ff66] hover:text-black font-bold text-xs font-mono-stat border border-[#00ff66]/50 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer group"
                            title="Visualizar o rastro desta patinação no mapa"
                          >
                            <MapPin className="w-3.5 h-3.5 fill-current shrink-0" />
                            <span>VER NO MAPA</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#0d141d] border-2 border-white/10 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-2.5">
              <History className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">
              Nenhuma patinação concluída ainda
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[260px] mx-auto">
              Inicie uma sessão de patinação no mapa para registrar seu rastro GPS e acompanhar suas métricas!
            </p>
          </div>
        )}
      </div>

      {/* Territórios Sob Seu Controle */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-mono-stat">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            ZONAS SOB SEU CONTROLE ({controlledZones.length})
          </h3>
        </div>

        {controlledZones.length > 0 ? (
          <div className="space-y-2">
            {controlledZones.map((zone) => (
              <div
                key={zone.id}
                id={`user-zone-${zone.id}`}
                onClick={() => onSelectZoneOnMap(zone)}
                className="p-3 rounded-2xl bg-[#0d141d] border-2 border-yellow-500/40 flex items-center justify-between cursor-pointer hover:border-yellow-400 transition-all shadow-md active:scale-[0.99]"
              >
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">{zone.name}</h4>
                  <p className="text-xs text-yellow-400 font-bold font-mono-stat">
                    DOMÍNIO {zone.dominance !== undefined ? zone.dominance : zone.dominancePercent}% • +{zone.xpPerHour !== undefined ? zone.xpPerHour : zone.pointsPerHour} XP/H
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-yellow-400 bg-yellow-500/15 px-2.5 py-1 rounded-xl border border-yellow-500/30 font-mono-stat shrink-0 ml-2">
                  VER NO MAPA
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 p-3 rounded-xl bg-[#0d141d] text-center font-medium">
            Nenhuma zona controlada ainda. Patine e conquiste seu primeiro território!
          </p>
        )}
      </div>
    </div>
  );
};
