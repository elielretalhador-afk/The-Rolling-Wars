import React, { useState, useEffect } from 'react';
import { SeasonService } from '../services/seasonService';
import {
  Trophy,
  Calendar,
  Clock,
  Award,
  Crown,
  Shield,
  Zap,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  Flame,
  ArrowUpRight,
  X,
  Target,
  Medal,
  Users,
} from 'lucide-react';
import { Season, SeasonRankingEntry, SeasonRewardTier, UserProfile } from '../types';
import {
  MOCK_SEASONS,
  getCurrentSeason,
  getSeasonStatusBadge,
} from '../data/seasonData';

interface SeasonHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  initialTab?: 'visao_geral' | 'ranking' | 'recompensas' | 'historico';
  onOpenEvents?: () => void;
  onOpenMissions?: () => void;
  onOpenProgressionHub?: (tab?: any) => void;
  onSelectPlayer?: (player: any) => void;
}

export const SeasonHubModal: React.FC<SeasonHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'visao_geral',
  onOpenEvents,
  onOpenMissions,
  onOpenProgressionHub,
  onSelectPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'ranking' | 'recompensas' | 'historico'>(
    initialTab
  );
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('season_01');
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [topPlayers, setTopPlayers] = useState<SeasonRankingEntry[]>([]);
  const [topClans, setTopClans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const season = await SeasonService.getActiveSeason();
        if (season) {
          setActiveSeason(season);
          const players = await SeasonService.getTopPlayers(season.id);
          const clans = await SeasonService.getTopClans(season.id);
          setTopPlayers(players);
          setTopClans(clans);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isOpen]);


  if (!isOpen) return null;

  const currentSeason = getCurrentSeason();
  const viewingSeason = MOCK_SEASONS.find((s) => s.id === selectedSeasonId) || currentSeason;
  const statusBadge = getSeasonStatusBadge(viewingSeason.status);
  const top3 = topPlayers.slice(0, 3);
  const userSeasonalEntry = topPlayers.find((p) => p.isCurrentUser);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
         <div className="text-yellow-400 font-bold font-mono-stat animate-pulse">Carregando Temporada...</div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        id="season-hub-modal-card"
        className="w-full max-w-2xl bg-[#000000] border-2 border-yellow-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-neutral-900/40 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0a0a0a] via-[#091018] to-[#0a0a0a] border-b border-white/10 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(252,232,3,0.3)]">
              {viewingSeason.icon || '🏆'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase font-mono-stat text-yellow-400 tracking-wider">
                  TEMPORADA #{viewingSeason.number}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono-stat uppercase border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display uppercase tracking-tight">
                {viewingSeason.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar Hub de Temporadas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pt-3 pb-2 bg-[#050505] border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-4 gap-1 min-w-[340px]">
            <button
              onClick={() => setActiveTab('visao_geral')}
              className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'visao_geral'
                  ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                  : 'text-slate-400 hover:text-white bg-black/30'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Geral
            </button>

            <button
              onClick={() => setActiveTab('ranking')}
              className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                  : 'text-slate-400 hover:text-white bg-black/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Ranking
            </button>

            <button
              onClick={() => setActiveTab('recompensas')}
              className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'recompensas'
                  ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                  : 'text-slate-400 hover:text-white bg-black/30'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Prêmios
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'historico'
                  ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                  : 'text-slate-400 hover:text-white bg-black/30'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Arquivo
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 space-y-4">
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'visao_geral' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Banner & Countdown Card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                <div className="h-32 sm:h-40 w-full relative">
                  <img
                    src={viewingSeason.banner}
                    alt={viewingSeason.name}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                </div>

                <div className="p-4 sm:p-5 relative -mt-16 sm:-mt-20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-yellow-400/40 text-yellow-400 text-xs font-black font-mono-stat flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      {viewingSeason.timeRemainingLabel || 'Em andamento'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-stat">
                      Tema: <strong className="text-slate-200">{viewingSeason.theme}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
                    {viewingSeason.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {viewingSeason.description}
                  </p>

                  {/* Player Current Placement Bar */}
                  {userSeasonalEntry && viewingSeason.status === 'ACTIVE' && (
                    <div className="mt-4 p-3 rounded-2xl bg-neutral-900/40 border border-yellow-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 flex items-center justify-center font-mono-stat font-black text-xs">
                          #{userSeasonalEntry.position}
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase font-mono-stat block">
                            SUA COLOCAÇÃO ATUAL
                          </span>
                          <span className="text-xs font-black text-white font-display uppercase">
                            {userSeasonalEntry.points.toLocaleString()} Pontos Sazonais
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('ranking')}
                        className="px-3 py-1.5 rounded-xl bg-yellow-400 text-black text-[10px] font-black font-mono-stat uppercase tracking-wider hover:bg-yellow-300 transition-all cursor-pointer"
                      >
                        Ver Ranking →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Regras e Preservação de Progresso */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a]/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono-stat">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Diretrizes & Preservação Permanente
                </div>
                <div className="space-y-1.5 pt-1">
                  {viewingSeason.rulesSummary?.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hub Shortcuts (Eventos, Missões, Coleções da Temporada) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {/* Eventos da Temporada */}
                <div
                  onClick={onOpenEvents}
                  className="p-3 rounded-2xl bg-[#050505] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-sm">
                      🏆
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                        EVENTOS
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        Destaques Sazonais
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Missões da Temporada */}
                <div
                  onClick={onOpenMissions}
                  className="p-3 rounded-2xl bg-[#050505] border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center text-sm">
                      🎯
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                        MISSÕES
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Objetivos Sazonais
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Coleções da Temporada */}
                <div
                  onClick={() => onOpenProgressionHub && onOpenProgressionHub('colecoes')}
                  className="p-3 rounded-2xl bg-[#050505] border border-white/10 hover:border-purple-400/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-400/20 text-purple-400 border border-purple-400/40 flex items-center justify-center text-sm">
                      🎴
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono-stat block">
                        COLEÇÃO S1
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Álbum da Temporada
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RANKING SAZONAL */}
          {activeTab === 'ranking' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10">
                <div>
                  <h4 className="text-xs font-black text-white uppercase font-display">
                    LEADERBOARD SAZONAL • {viewingSeason.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                    Pontuação obtida exclusivamente durante o período da Temporada #{viewingSeason.number}.
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-black font-mono-stat">
                  {viewingSeason.totalParticipants?.toLocaleString()} PATINADORES
                </div>
              </div>

              {/* Podium Top 3 */}
              <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-2">
                {/* 2nd Place */}
                {top3[1] && (
                  <div
                    onClick={() => onSelectPlayer && onSelectPlayer(top3[1])}
                    className="p-2.5 rounded-2xl bg-[#050505] border-2 border-slate-500 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-slate-300 transition-transform active:scale-95"
                  >
                    <div className="w-5 h-5 rounded bg-slate-300 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                      2
                    </div>
                    <img
                      src={top3[1].avatar}
                      alt={top3[1].nickname}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-slate-300 mt-1"
                    />
                    <div className="text-[11px] font-bold text-white mt-1.5 truncate max-w-full font-display uppercase">
                      {top3[1].nickname}
                    </div>
                    <div className="text-[10px] font-bold text-amber-400 mt-0.5 font-mono-stat">
                      {top3[1].points.toLocaleString()} PTS
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                  <div
                    onClick={() => onSelectPlayer && onSelectPlayer(top3[0])}
                    className="p-3 rounded-2xl bg-[#101b28] border-2 border-amber-400 text-center relative flex flex-col items-center shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105 cursor-pointer hover:border-amber-300 transition-transform active:scale-100"
                  >
                    <Crown className="w-5 h-5 text-amber-400 fill-amber-400/40 absolute -top-3.5" />
                    <img
                      src={top3[0].avatar}
                      alt={top3[0].nickname}
                      className="w-13 h-13 rounded-xl object-cover border-2 border-amber-400 mt-2"
                    />
                    <div className="text-xs font-black text-white mt-1.5 truncate max-w-full font-display uppercase">
                      {top3[0].nickname}
                    </div>
                    <div className="text-[11px] font-black text-yellow-400 font-mono-stat">
                      {top3[0].zones} ZONAS
                    </div>
                    <div className="text-xs font-black text-amber-400 mt-0.5 font-mono-stat">
                      {top3[0].points.toLocaleString()} PTS
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                  <div
                    onClick={() => onSelectPlayer && onSelectPlayer(top3[2])}
                    className="p-2.5 rounded-2xl bg-[#050505] border-2 border-amber-700 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-amber-600 transition-transform active:scale-95"
                  >
                    <div className="w-5 h-5 rounded bg-amber-600 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                      3
                    </div>
                    <img
                      src={top3[2].avatar}
                      alt={top3[2].nickname}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-amber-600 mt-1"
                    />
                    <div className="text-[11px] font-bold text-white mt-1.5 truncate max-w-full font-display uppercase">
                      {top3[2].nickname}
                    </div>
                    <div className="text-[10px] font-bold text-amber-400 mt-0.5 font-mono-stat">
                      {top3[2].points.toLocaleString()} PTS
                    </div>
                  </div>
                )}
              </div>

              {/* Leaderboard Table List */}
              <div className="space-y-2">
                {topPlayers.map((skater) => (
                  <div
                    key={skater.position}
                    id={`season-leaderboard-row-${skater.position}`}
                    onClick={() => onSelectPlayer && onSelectPlayer(skater)}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                      skater.isCurrentUser
                        ? 'bg-neutral-900/60 border-2 border-yellow-400 shadow-[0_0_15px_rgba(252,232,3,0.2)]'
                        : 'bg-[#050505] border border-white/10 hover:border-yellow-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 text-center font-black text-sm font-mono-stat shrink-0 ${
                          skater.position === 1
                            ? 'text-amber-400'
                            : skater.position === 2
                            ? 'text-slate-300'
                            : skater.position === 3
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        #{skater.position}
                      </span>

                      <img
                        src={skater.avatar}
                        alt={skater.nickname}
                        className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-white uppercase font-display truncate">
                            {skater.nickname}
                          </span>
                          {skater.isCurrentUser && (
                            <span className="text-[8px] font-black text-yellow-400 bg-yellow-500/20 px-1 rounded uppercase font-mono-stat border border-yellow-400/40">
                              VOCÊ
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono-stat truncate">
                          <span>{skater.crew}</span>
                          <span>•</span>
                          <span className="text-yellow-400">{skater.zones} Zonas</span>
                          <span>•</span>
                          <span className="text-cyan-400">{skater.wins} Vitórias</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div className="text-xs font-black text-amber-400 font-mono-stat">
                        {skater.points.toLocaleString()} PTS
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono-stat">
                        {skater.position <= 10 ? 'Top 10 Tier' : 'Tier Prata'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECOMPENSAS SAZONAIS */}
          {activeTab === 'recompensas' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase font-display">
                    RECOMPENSAS POR COLOCAÇÃO FINAL
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                    Entregues no encerramento da temporada conforme a sua classificação no ranking sazonal.
                  </p>
                </div>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-3">
                {viewingSeason.rewards.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      tier.tier === 'TOP_1'
                        ? 'bg-gradient-to-r from-amber-950/40 to-[#050505] border-amber-400/50 shadow-md'
                        : tier.tier === 'TOP_3'
                        ? 'bg-gradient-to-r from-slate-900 to-[#050505] border-slate-400/40'
                        : tier.tier === 'TOP_10'
                        ? 'bg-gradient-to-r from-neutral-900/30 to-[#050505] border-yellow-400/30'
                        : 'bg-[#050505] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono-stat text-[10px] font-black uppercase">
                          {tier.tierLabel}
                        </span>
                        {tier.xpBonus && (
                          <span className="text-[10px] font-bold text-amber-400 font-mono-stat">
                            +{tier.xpBonus} XP Bônus
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono-stat">
                        Posição #{tier.minRank} {tier.maxRank < 99999 ? `a #${tier.maxRank}` : '+'}
                      </span>
                    </div>

                    <h5 className="text-sm font-black text-white uppercase font-display">
                      {tier.title}
                    </h5>
                    <p className="text-xs text-slate-300 mt-0.5 mb-3 leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Rewards Items Badges */}
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                      {tier.rewards.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2"
                        >
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase font-mono-stat block">
                              {item.type}
                            </span>
                            <span className="text-[11px] font-bold text-white">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARQUIVO & HISTÓRICO */}
          {activeTab === 'historico' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                <h4 className="text-xs font-black text-white uppercase font-display">
                  CRONOGRAMA & ARQUIVO DE TEMPORADAS
                </h4>
                <p className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                  Consulte temporadas anteriores arquivadas e visualize prévias das próximas edições.
                </p>
              </div>

              <div className="space-y-3">
                {MOCK_SEASONS.map((season) => {
                  const badge = getSeasonStatusBadge(season.status);
                  const isCurrent = season.id === selectedSeasonId;

                  return (
                    <div
                      key={season.id}
                      onClick={() => setSelectedSeasonId(season.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#101b28] border-yellow-400 shadow-[0_0_15px_rgba(252,232,3,0.2)]'
                          : 'bg-[#050505] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{season.icon || '🏆'}</span>
                          <span className="text-xs font-black text-white uppercase font-display">
                            Temporada #{season.number}: {season.name}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono-stat uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                        {season.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono-stat pt-2 border-t border-white/10">
                        <span>Tema: <strong className="text-slate-200">{season.theme}</strong></span>
                        <span className="text-yellow-400 font-bold">
                          {season.timeRemainingLabel || 'Detalhes disponíveis'}
                        </span>
                      </div>

                      {/* Top Winner if Finished */}
                      {season.finalTopWinner && (
                        <div className="mt-3 p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] text-amber-300 font-mono-stat font-bold">
                              Campeão Oficial: <strong>{season.finalTopWinner.nickname}</strong> ({season.finalTopWinner.points.toLocaleString()} pts)
                            </span>
                          </div>
                          <span className="text-[9px] text-amber-400 font-mono-stat uppercase font-black">
                            {season.finalTopWinner.title}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#050505] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono-stat">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span>Temporadas Sazonais THE ROLLING WARS</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono-stat uppercase tracking-wider transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
