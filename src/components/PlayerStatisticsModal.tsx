import React, { useState, useMemo } from 'react';
import {
  X,
  Trophy,
  Flame,
  Zap,
  Clock,
  Gauge,
  MapPin,
  Swords,
  Award,
  Crown,
  Compass,
  Layers,
  Sparkles,
  Calendar,
  Activity,
  Shield,
  Lock,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import {
  ActivitySession,
  PersonalAchievement,
  PlayerProgression,
  StatPeriod,
  UserProfile,
  Zone,
} from '../types';
import {
  calculatePlayerStatistics,
  formatStatDuration,
} from '../utils/statisticsCalculator';

interface PlayerStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  sessionHistory?: ActivitySession[];
  controlledZones?: Zone[];
  achievements?: PersonalAchievement[];
  progression?: PlayerProgression;
  isOtherPlayer?: boolean;
  targetPlayerName?: string;
  isPrivateProfile?: boolean;
}

export const PlayerStatisticsModal: React.FC<PlayerStatisticsModalProps> = ({
  isOpen,
  onClose,
  user,
  sessionHistory = [],
  controlledZones = [],
  achievements = [],
  progression,
  isOtherPlayer = false,
  targetPlayerName,
  isPrivateProfile = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatPeriod>('TOTAL');

  // Cálculos eficientes e memorizados a partir dos dados existentes
  const stats = useMemo(() => {
    return calculatePlayerStatistics(
      user,
      sessionHistory,
      controlledZones,
      achievements,
      progression,
      selectedPeriod
    );
  }, [user, sessionHistory, controlledZones, achievements, progression, selectedPeriod]);

  if (!isOpen) return null;

  const periods: { id: StatPeriod; label: string; subLabel: string }[] = [
    { id: 'TOTAL', label: 'TOTAL', subLabel: 'Histórico' },
    { id: 'HOJE', label: 'HOJE', subLabel: '24 horas' },
    { id: 'SEMANA', label: 'ESTA SEMANA', subLabel: '7 dias' },
    { id: 'MES', label: 'ESTE MÊS', subLabel: '30 dias' },
    { id: 'TEMPORADA', label: 'TEMPORADA', subLabel: 'Atual' },
  ];

  return (
    <div
      id="player-statistics-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="player-statistics-modal-container"
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090d14] border-2 border-yellow-500/40 shadow-[0_0_50px_rgba(0,255,102,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gamer */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#0c141f] via-[#090e16] to-[#0c141f] flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-24 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 flex items-center justify-center text-lg shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-display">
                  {isOtherPlayer
                    ? `ESTATÍSTICAS • ${targetPlayerName || user.nickname}`
                    : 'ESTATÍSTICAS DO JOGADOR'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono-stat bg-yellow-400/20 text-emerald-300 border border-yellow-400/40">
                  LVL.{stats.progression.level}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono-stat">
                {isOtherPlayer
                  ? 'Estatísticas públicas de desempenho e histórico'
                  : 'Histórico consolidado de performance, recordes e conquistas'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-statistics-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Period Selector (TOTAL como padrão) */}
        <div className="px-4 py-2.5 bg-[#0b1018] border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] font-bold text-neutral-400 font-mono-stat uppercase mr-1">
              PERÍODO:
            </span>
            {periods.map((p) => {
              const isSelected = selectedPeriod === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black font-mono-stat uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-yellow-400 text-black border border-emerald-300 shadow-[0_0_12px_rgba(0,255,102,0.35)]'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {p.label}
                  {p.id === 'TOTAL' && (
                    <span className="ml-1 opacity-75 text-[9px]">★</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {/* Privacy Guard Check */}
          {isPrivateProfile ? (
            <div className="p-6 rounded-2xl bg-[#111622] border border-amber-500/30 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xl mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">
                Perfil com Estatísticas Privadas
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Este jogador optou por manter suas estatísticas detalhadas visíveis apenas para amigos próximos.
              </p>
            </div>
          ) : (
            <>
              {/* ==========================================
                  1. MEUS RECORDES (Dourado/Âmbar #ffcc00)
                 ========================================== */}
              <div
                id="stat-section-records"
                className="p-4 rounded-3xl bg-gradient-to-b from-[#18150c] via-[#10141a] to-[#090d14] border-2 border-amber-400/40 shadow-xl relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-xs">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider font-mono-stat">
                        MEUS RECORDES
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-mono-stat">
                        Melhores marcas e marcas históricas registradas
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono-stat bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    OURO
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {/* Recorde: Maior Distância */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-center gap-1">
                      <Compass className="w-3 h-3 text-amber-400" />
                      MAIOR DISTÂNCIA
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono-stat mt-1">
                      {stats.records.maxDistanceKm > 0
                        ? `${stats.records.maxDistanceKm.toFixed(1)} km`
                        : 'Sem dados'}
                    </div>
                    <span className="text-[9px] text-neutral-400 block truncate">
                      Em uma única sessão
                    </span>
                  </div>

                  {/* Recorde: Maior Velocidade */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      MAIOR VELOCIDADE
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono-stat mt-1">
                      {stats.records.maxSpeedKmH > 0
                        ? `${stats.records.maxSpeedKmH.toFixed(1)} km/h`
                        : 'Sem dados'}
                    </div>
                    <span className="text-[9px] text-neutral-400 block truncate">
                      Pico de satélite aferido
                    </span>
                  </div>

                  {/* Recorde: Melhor Tempo em Rota */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      MELHOR TEMPO ROTA
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono-stat mt-1">
                      {stats.records.bestRouteTimeFormatted || 'Sem dados ainda'}
                    </div>
                    <span className="text-[9px] text-neutral-400 block truncate">
                      Circuito Paulista Aberta
                    </span>
                  </div>

                  {/* Recorde: Melhor Tempo de Conquista */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      TEMPO CONQUISTA
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono-stat mt-1">
                      {stats.records.bestCaptureTimeFormatted || 'Sem dados ainda'}
                    </div>
                    <span className="text-[9px] text-neutral-400 block truncate">
                      Pátio Berrini Street
                    </span>
                  </div>

                  {/* Recorde: Maior Streak de Dias */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 text-center col-span-2 sm:col-span-2">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      MAIOR STREAK (DIAS CONSECUTIVOS)
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono-stat mt-1 flex items-center justify-center gap-1.5">
                      <span>{stats.records.maxStreakDays} Dias</span>
                      <span className="text-xs text-yellow-400 font-bold">🔥 Ativo</span>
                    </div>
                    <span className="text-[9px] text-neutral-400 block truncate">
                      Sequência diária de presença no asfalto
                    </span>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  2. ESTATÍSTICAS GERAIS DE CARREIRA
                 ========================================== */}
              <div
                id="stat-section-general"
                className="p-4 rounded-3xl bg-[#0d141d] border-2 border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono-stat">
                        ESTATÍSTICAS GERAIS
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-mono-stat">
                        Resumo numérico de todas as atividades
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono-stat uppercase font-bold">
                    {selectedPeriod}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DISTÂNCIA TOTAL
                    </span>
                    <span className="text-base font-black text-yellow-400 font-mono-stat block mt-0.5">
                      {stats.general.totalDistanceKm > 0
                        ? `${stats.general.totalDistanceKm.toLocaleString('pt-BR')} km`
                        : '0.0 km'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      TEMPO PATINANDO
                    </span>
                    <span className="text-base font-black text-cyan-400 font-mono-stat block mt-0.5">
                      {formatStatDuration(stats.general.totalDurationSeconds)}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      SESSÕES
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {stats.general.totalSessionsCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      VEL. MÉDIA GERAL
                    </span>
                    <span className="text-base font-black text-cyan-300 font-mono-stat block mt-0.5">
                      {stats.general.avgSpeedKmH !== null
                        ? `${stats.general.avgSpeedKmH.toFixed(1)} km/h`
                        : 'Sem dados ainda'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      ROTAS REALIZADAS
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {stats.general.routesCompletedCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      ZONAS CONQUISTADAS
                    </span>
                    <span className="text-base font-black text-purple-400 font-mono-stat block mt-0.5">
                      {stats.general.zonesConqueredCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DISPUTAS & VITÓRIAS
                    </span>
                    <span className="text-base font-black text-amber-400 font-mono-stat block mt-0.5">
                      {stats.general.victoriesCount} / {stats.general.disputesCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      EVENTOS & PROVAS
                    </span>
                    <span className="text-base font-black text-emerald-300 font-mono-stat block mt-0.5">
                      {stats.general.eventsCompletedCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  3. ESTATÍSTICAS DE PATINAÇÃO (Verde & Ciano)
                 ========================================== */}
              <div
                id="stat-section-skating"
                className="p-4 rounded-3xl bg-gradient-to-b from-[#0e1924] to-[#090f16] border-2 border-cyan-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider font-mono-stat">
                      ESTATÍSTICAS DE PATINAÇÃO
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono-stat">
                      Métricas de rodagem, tempo e picos de sessão
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DISTÂNCIA TOTAL
                    </span>
                    <span className="text-base font-black text-yellow-400 font-mono-stat block mt-0.5">
                      {stats.skating.totalDistanceKm.toFixed(1)} km
                    </span>
                    <span className="text-[9px] text-neutral-400">Rodagem acumulada</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      TEMPO EM MOVIMENTO
                    </span>
                    <span className="text-base font-black text-cyan-400 font-mono-stat block mt-0.5">
                      {formatStatDuration(stats.skating.totalDurationSeconds)}
                    </span>
                    <span className="text-[9px] text-neutral-400">Tempo ativo no asfalto</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      MAIOR DISTÂNCIA (SESSÃO)
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {stats.skating.maxSessionDistanceKm.toFixed(1)} km
                    </span>
                    <span className="text-[9px] text-neutral-400">Melhor sessão única</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      VELOCIDADE MÁXIMA
                    </span>
                    <span className="text-base font-black text-amber-300 font-mono-stat block mt-0.5">
                      {stats.skating.maxSessionSpeedKmH.toFixed(1)} km/h
                    </span>
                    <span className="text-[9px] text-neutral-400">Pico instantâneo</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      MAIOR DURAÇÃO (SESSÃO)
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {formatStatDuration(stats.skating.maxSessionDurationSeconds)}
                    </span>
                    <span className="text-[9px] text-neutral-400">Maior tempo contínuo</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      TOTAL DE SESSÕES
                    </span>
                    <span className="text-base font-black text-emerald-300 font-mono-stat block mt-0.5">
                      {stats.skating.sessionsCount} sessões
                    </span>
                    <span className="text-[9px] text-neutral-400">Rolês concluídos</span>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  4. ESTATÍSTICAS DE ZONAS & TERRITÓRIOS (Roxo & Verde)
                 ========================================== */}
              <div
                id="stat-section-zones"
                className="p-4 rounded-3xl bg-gradient-to-b from-[#161022] to-[#0a0d15] border-2 border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider font-mono-stat">
                      ESTATÍSTICAS DE ZONAS
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono-stat">
                      Territórios urbanos, disputas e tempos de captura
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      ZONAS CONQUISTADAS
                    </span>
                    <span className="text-base font-black text-purple-300 font-mono-stat block mt-0.5">
                      {stats.zones.zonesConquered}
                    </span>
                    <span className="text-[9px] text-neutral-400">Territórios dominados</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      ZONAS PERDIDAS
                    </span>
                    <span className="text-base font-black text-neutral-300 font-mono-stat block mt-0.5">
                      {stats.zones.zonesLost === 0 ? '0' : stats.zones.zonesLost}
                    </span>
                    <span className="text-[9px] text-neutral-400">Retomadas por rivais</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DISPUTAS VENCIDAS
                    </span>
                    <span className="text-base font-black text-yellow-400 font-mono-stat block mt-0.5">
                      {stats.zones.disputesWon}
                    </span>
                    <span className="text-[9px] text-neutral-400">Defesas e ataques</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      MELHOR TEMPO CONQUISTA
                    </span>
                    <span className="text-base font-black text-amber-300 font-mono-stat block mt-0.5">
                      {stats.zones.bestCaptureTimeFormatted || 'Sem dados ainda'}
                    </span>
                    <span className="text-[9px] text-neutral-400">Menor tempo para 100%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20 col-span-2 sm:col-span-2">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      CONQUISTAS CONSECUTIVAS
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {stats.zones.consecutiveConquests !== null
                        ? `${stats.zones.consecutiveConquests} Zonas seguidas`
                        : 'Sem dados ainda'}
                    </span>
                    <span className="text-[9px] text-neutral-400">
                      Sequência contínua sem perder territórios
                    </span>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  5. ESTATÍSTICAS DE DESAFIOS (Laranja & Ciano)
                 ========================================== */}
              <div
                id="stat-section-challenges"
                className="p-4 rounded-3xl bg-gradient-to-b from-[#18130a] to-[#0a0f16] border-2 border-amber-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs">
                      <Swords className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider font-mono-stat">
                        ESTATÍSTICAS DE DESAFIOS
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-mono-stat">
                        Duelos diretos, X1, X2 e disputas comunitárias
                      </p>
                    </div>
                  </div>

                  {stats.challenges.winRatePct !== null && (
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-neutral-400 font-mono-stat uppercase block">
                        TAXA DE VITÓRIA
                      </span>
                      <span className="text-sm font-black text-yellow-400 font-mono-stat">
                        {stats.challenges.winRatePct}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra de Win Rate */}
                {stats.challenges.winRatePct !== null && (
                  <div className="mb-3">
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${stats.challenges.winRatePct}%` }}
                      />
                      <div
                        className="h-full bg-rose-500/80 transition-all duration-500"
                        style={{ width: `${100 - stats.challenges.winRatePct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono-stat mt-1">
                      <span className="text-yellow-400 font-bold">
                        {stats.challenges.wins} Vitórias ({stats.challenges.winRatePct}%)
                      </span>
                      <span className="text-rose-400 font-bold">
                        {stats.challenges.losses} Derrotas ({100 - stats.challenges.winRatePct}%)
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DESAFIOS TOTAIS
                    </span>
                    <span className="text-base font-black text-white font-mono-stat block mt-0.5">
                      {stats.challenges.challengesTotal}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      VITÓRIAS
                    </span>
                    <span className="text-base font-black text-yellow-400 font-mono-stat block mt-0.5">
                      {stats.challenges.wins}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      DERROTAS
                    </span>
                    <span className="text-base font-black text-rose-400 font-mono-stat block mt-0.5">
                      {stats.challenges.losses}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat block">
                      EMPATES
                    </span>
                    <span className="text-base font-black text-neutral-400 font-mono-stat block mt-0.5">
                      {stats.challenges.draws}
                    </span>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  6. PROGRESSÃO & HONRA (Esmeralda & Dourado)
                 ========================================== */}
              <div
                id="stat-section-progression"
                className="p-4 rounded-3xl bg-gradient-to-b from-[#0c1815] to-[#0a1017] border-2 border-yellow-500/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-yellow-400 uppercase tracking-wider font-mono-stat">
                        PROGRESSÃO & HONRA
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-mono-stat">
                        Nível, acúmulo de XP e desbloqueios
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono-stat bg-yellow-400/20 text-emerald-300 border border-yellow-400/30">
                    NÍVEL {stats.progression.level}
                  </span>
                </div>

                {/* Barra de XP */}
                <div className="p-3 rounded-2xl bg-black/40 border border-yellow-500/20 mb-3">
                  <div className="flex justify-between items-center text-[10px] font-mono-stat mb-1.5">
                    <span className="text-neutral-300 font-bold">
                      Progresso para Nível {stats.progression.level + 1}
                    </span>
                    <span className="text-yellow-400 font-bold">
                      {stats.progression.currentXp.toLocaleString()} / {stats.progression.nextLevelXp.toLocaleString()} XP ({stats.progression.progressPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progression.progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-neutral-400 font-mono-stat mt-1">
                    <span>Faltam {stats.progression.xpRemaining.toLocaleString()} XP</span>
                    <span>Total acumulado: {stats.progression.totalXpAccumulated.toLocaleString()} XP</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat">
                      CONQUISTAS
                    </div>
                    <div className="text-base font-black text-yellow-400 font-mono-stat mt-0.5">
                      {stats.progression.unlockedAchievementsCount} / {stats.progression.totalAchievementsCount}
                    </div>
                    <span className="text-[8px] text-neutral-400">Desbloqueadas</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat">
                      TÍTULOS
                    </div>
                    <div className="text-base font-black text-amber-400 font-mono-stat mt-0.5">
                      {stats.progression.unlockedTitlesCount}
                    </div>
                    <span className="text-[8px] text-neutral-400">Títulos de honra</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono-stat">
                      RECOMPENSAS
                    </div>
                    <div className="text-base font-black text-purple-400 font-mono-stat mt-0.5">
                      {stats.progression.unlockedRewardsCount}
                    </div>
                    <span className="text-[8px] text-neutral-400">Itens liberados</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#070a0f] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono-stat">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>Dados sincronizados em tempo real</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-xs font-black font-mono-stat uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] active:scale-95 cursor-pointer"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};
