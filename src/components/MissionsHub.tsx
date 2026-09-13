import React, { useState } from 'react';
import {
  Target,
  Zap,
  Clock,
  MapPin,
  Lock,
  CheckCircle2,
  Gift,
  Award,
  Sparkles,
  Flame,
  AlertCircle,
  ChevronRight,
  Shield,
  Hourglass,
} from 'lucide-react';
import { Mission, MissionCategory, MissionDifficulty, MissionStatus, MissionType } from '../types';

interface MissionsHubProps {
  missions: Mission[];
  onClaimReward: (mission: Mission) => void;
  onStartMission?: (mission: Mission) => void;
  onSelectZoneOnMap?: (zoneId: string) => void;
}

type FilterCategory = 'ALL' | 'DAILY' | 'WEEKLY' | 'LONG_TERM' | 'TIMED' | 'COMPLETED';

export const MissionsHub: React.FC<MissionsHubProps> = ({
  missions,
  onClaimReward,
  onStartMission,
  onSelectZoneOnMap,
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pb-24 bg-[#000000] flex flex-col items-center justify-center">
      <div className="text-center p-8 bg-[#0b131e] border border-white/5 rounded-2xl w-full max-w-sm shadow-xl mt-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
          🚧
        </div>
        <h2 className="text-xl font-black text-white font-display uppercase tracking-tight mb-2">
          Missões
        </h2>
        <p className="text-sm font-medium text-slate-400">
          Em breve.
        </p>
      </div>
    </div>
  );

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');

  // Contadores para filtros
  const completedUnclaimedCount = (missions || []).filter((m) => m.status === 'COMPLETED').length;
  const dailyCount = (missions || []).filter((m) => m.category === 'DAILY').length;
  const weeklyCount = (missions || []).filter((m) => m.category === 'WEEKLY').length;
  const longTermCount = (missions || []).filter((m) => m.category === 'LONG_TERM').length;
  const timedCount = (missions || []).filter((m) => m.category === 'TIMED' || m.category === 'SPECIAL').length;

  const filteredMissions = (missions || []).filter((mission) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DAILY') return mission.category === 'DAILY';
    if (activeFilter === 'WEEKLY') return mission.category === 'WEEKLY';
    if (activeFilter === 'LONG_TERM') return mission.category === 'LONG_TERM';
    if (activeFilter === 'TIMED') return mission.category === 'TIMED' || mission.category === 'SPECIAL';
    if (activeFilter === 'COMPLETED') return mission.status === 'COMPLETED' || mission.status === 'CLAIMED';
    return true;
  });

  const getDifficultyBadge = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case 'EASY':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-neutral-900/80 text-yellow-400 border border-yellow-500/40">
            Fácil
          </span>
        );
      case 'NORMAL':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            Normal
          </span>
        );
      case 'HARD':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-amber-950/80 text-amber-400 border border-amber-500/40">
            Difícil
          </span>
        );
      case 'EPIC':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-purple-950/80 text-purple-300 border border-purple-500/40 animate-pulse">
            ★ Épica
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: MissionCategory, duration?: string) => {
    switch (category) {
      case 'DAILY':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono-stat bg-cyan-500/10 text-cyan-400 border border-cyan-400/30">
            Diária
          </span>
        );
      case 'WEEKLY':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono-stat bg-amber-500/10 text-amber-400 border border-amber-400/30">
            Semanal
          </span>
        );
      case 'LONG_TERM':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-orange-500/15 text-orange-400 border border-orange-400/40 flex items-center gap-1">
            <Hourglass className="w-2.5 h-2.5" />
            {duration || 'Longa Duração'}
          </span>
        );
      case 'TIMED':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono-stat bg-blue-500/10 text-blue-400 border border-blue-400/30">
            Temporária
          </span>
        );
      case 'SPECIAL':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat bg-purple-500/15 text-purple-400 border border-purple-400/40 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Especial
          </span>
        );
      case 'COMMUNITY':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono-stat bg-yellow-500/10 text-yellow-400 border border-yellow-400/30">
            Comunitária
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeText = (type: MissionType) => {
    switch (type) {
      case 'DISTANCE': return 'Distância';
      case 'TIME': return 'Tempo';
      case 'SPEED': return 'Velocidade';
      case 'ZONE': return 'Zona';
      case 'CHALLENGE': return 'Desafio';
      case 'EVENT': return 'Evento';
      case 'ROUTE': return 'Rota';
      case 'EXPLORATION': return 'Exploração';
      case 'VICTORY': return 'Vitória';
      case 'SESSION': return 'Sessão';
      case 'COLLECTION': return 'Coleção';
      case 'SPECIAL': return 'Especial';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner de Recompensas Pendentes se houver */}
      {completedUnclaimedCount > 0 && (
        <div
          id="banner-unclaimed-missions"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900/80 via-blue-900/40 to-[#0c1420] border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(252,232,3,0.2)] flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black shrink-0 animate-bounce">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-yellow-400 font-mono-stat uppercase tracking-wider">
                {completedUnclaimedCount} {completedUnclaimedCount === 1 ? 'RECOMPENSA DISPONÍVEL' : 'RECOMPENSAS DISPONÍVEIS'}
              </div>
              <p className="text-xs text-white font-medium">
                Você concluiu missões! Clique no botão verde do cartão para resgatar seu XP e itens.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter('COMPLETED')}
            className="px-3 py-1.5 rounded-xl bg-yellow-400 text-black text-xs font-black uppercase font-mono-stat hover:bg-yellow-300 transition-colors shrink-0 cursor-pointer"
          >
            Ver
          </button>
        </div>
      )}

      {/* Barra de Filtros de Missões */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          id="filter-mission-all"
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Todas ({missions.length})
        </button>

        <button
          id="filter-mission-daily"
          type="button"
          onClick={() => setActiveFilter('DAILY')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'DAILY'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Diárias ({dailyCount})
        </button>

        <button
          id="filter-mission-weekly"
          type="button"
          onClick={() => setActiveFilter('WEEKLY')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'WEEKLY'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Semanais ({weeklyCount})
        </button>

        <button
          id="filter-mission-long-term"
          type="button"
          onClick={() => setActiveFilter('LONG_TERM')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'LONG_TERM'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Longa Duração ({longTermCount})
        </button>

        <button
          id="filter-mission-timed"
          type="button"
          onClick={() => setActiveFilter('TIMED')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'TIMED'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Temporárias ({timedCount})
        </button>

        <button
          id="filter-mission-completed"
          type="button"
          onClick={() => setActiveFilter('COMPLETED')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono-stat uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'COMPLETED'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
              : 'bg-[#000000] text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Concluídas {completedUnclaimedCount > 0 && `(${completedUnclaimedCount})`}
        </button>
      </div>

      {/* Lista de Missões */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#000000] border border-white/10 text-center text-slate-400 font-mono-stat text-xs">
            Nenhuma missão encontrada nesta categoria.
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const percent = Math.min(100, Math.round((mission.currentProgress / mission.target) * 100));
            const isLocked = mission.status === 'LOCKED';
            const isCompleted = mission.status === 'COMPLETED';
            const isClaimed = mission.status === 'CLAIMED';
            const isExpired = mission.status === 'EXPIRED';
            const isTimedWindow = mission.timeWindow !== undefined;
            const isWindowActive = mission.timeWindow?.isCurrentlyActive ?? true;

            return (
              <div
                key={mission.id}
                id={`mission-card-${mission.id}`}
                className={`p-4 rounded-2xl bg-[#000000] border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isCompleted
                    ? 'border-yellow-400/70 shadow-[0_0_20px_rgba(252,232,3,0.15)] bg-gradient-to-br from-[#000000] to-blue-950/20'
                    : isClaimed
                    ? 'border-white/5 opacity-70 bg-[#000000]'
                    : isLocked
                    ? 'border-white/5 opacity-75 bg-[#090e14]'
                    : isExpired
                    ? 'border-red-500/20 opacity-70 bg-[#120a0d]'
                    : 'border-white/10 hover:border-yellow-500/40'
                }`}
              >
                {/* Faixa decorativa superior para missões concluídas */}
                {isCompleted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400" />
                )}

                <div>
                  {/* Top Badges Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Categoria */}
                      {getCategoryBadge(mission.category, mission.duration)}

                      {/* Dificuldade */}
                      {getDifficultyBadge(mission.difficulty)}

                      {/* Tipo */}
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 text-[9px] font-mono-stat uppercase">
                        {getTypeText(mission.type)}
                      </span>

                      {/* Janela de Horário */}
                      {isTimedWindow && (
                        isWindowActive && !isExpired ? (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900/80 border border-yellow-400/40 text-[9px] font-black text-yellow-400 font-mono-stat uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                            Janela Ativa ({mission.timeWindow?.label})
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[9px] font-black text-red-400 font-mono-stat uppercase">
                            <Lock className="w-2.5 h-2.5" />
                            Fora de Horário ({mission.timeWindow?.label})
                          </span>
                        )
                      )}

                      {/* Prazo de Expiração */}
                      {mission.expiresInLabel && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase font-mono-stat">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          {mission.expiresInLabel}
                        </span>
                      )}
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-400/30 font-mono-stat shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                      +{mission.reward.xpReward} XP
                    </div>
                  </div>

                  {/* Título & Descrição */}
                  <h3 className="text-base font-bold text-white leading-snug uppercase font-display flex items-center gap-2">
                    {isLocked && <Lock className="w-4 h-4 text-slate-400 shrink-0" />}
                    {mission.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-normal leading-relaxed">
                    {mission.description}
                  </p>

                  {/* Informações de Cadeia / Sequência */}
                  {mission.chain && (
                    <div className="mt-2 text-[10px] font-mono-stat text-purple-300/90 flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 px-2 py-1 rounded-lg">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>
                        Sequência: <b>{mission.chain.chainTitle}</b> (Etapa {mission.chain.sequenceIndex}/{mission.chain.totalInChain})
                      </span>
                    </div>
                  )}

                  {/* Requisitos de Bloqueio */}
                  {isLocked && mission.requirements && (
                    <div className="mt-2.5 p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-[11px] font-mono-stat flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>
                        <b>Requisito:</b> {mission.requirements.description || `Nível ${mission.requirements.minLevel} necessário`}
                      </span>
                    </div>
                  )}

                  {/* Contexto de Zona / Rota se houver */}
                  {mission.targetZoneName && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-yellow-400/90 font-mono-stat font-medium">
                      <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      <span>
                        Local: <b>{mission.targetZoneName}</b>
                      </span>
                    </div>
                  )}

                  {/* Recompensas Adicionais (Título / Cosmético / Medalha) */}
                  {(mission.reward.titleReward || mission.reward.cosmeticName || mission.reward.medalReward || mission.reward.badgeReward) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono-stat uppercase">Recompensa:</span>
                      {mission.reward.titleReward && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold font-mono-stat flex items-center gap-1">
                          <Award className="w-2.5 h-2.5" /> Título: "{mission.reward.titleReward}"
                        </span>
                      )}
                      {mission.reward.cosmeticName && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/30 text-purple-300 text-[10px] font-bold font-mono-stat flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> {mission.reward.cosmeticName}
                        </span>
                      )}
                      {mission.reward.medalReward && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold font-mono-stat flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" /> {mission.reward.medalReward}
                        </span>
                      )}
                      {mission.reward.badgeReward && (
                        <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold font-mono-stat flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Emblema: {mission.reward.badgeReward}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Barra de Progresso */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono-stat mb-1">
                      <span className="text-slate-400">Progresso</span>
                      <span
                        className={`font-black ${
                          isCompleted || isClaimed
                            ? 'text-yellow-400'
                            : isExpired
                            ? 'text-red-400'
                            : 'text-white'
                        }`}
                      >
                        {mission.currentProgress} / {mission.target} {mission.unit} ({percent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted || isClaimed
                            ? 'bg-yellow-400 shadow-[0_0_10px_rgba(252,232,3,0.8)]'
                            : isExpired
                            ? 'bg-red-500'
                            : 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {isCompleted ? (
                    <button
                      id={`btn-claim-mission-${mission.id}`}
                      type="button"
                      onClick={() => onClaimReward(mission)}
                      className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 text-black text-xs font-black uppercase font-mono-stat hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(252,232,3,0.4)] flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Gift className="w-4 h-4" />
                      RESGATAR RECOMPENSA (+{mission.reward.xpReward} XP)
                    </button>
                  ) : isClaimed ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-yellow-400 text-xs font-bold font-mono-stat flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Recompensa Resgatada</span>
                    </div>
                  ) : isLocked ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 text-xs font-medium font-mono-stat flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bloqueada</span>
                    </div>
                  ) : isExpired ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-medium font-mono-stat flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Missão Expirada</span>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      {mission.targetZoneId && onSelectZoneOnMap ? (
                        <button
                          type="button"
                          onClick={() => onSelectZoneOnMap(mission.targetZoneId!)}
                          className="py-2 px-3 rounded-xl bg-[#0c1420] border border-white/10 hover:border-yellow-500/50 text-slate-300 hover:text-white text-xs font-bold font-mono-stat flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Ver no Mapa</span>
                        </button>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-mono-stat flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                          <span>Em andamento</span>
                        </div>
                      )}

                      {onStartMission && (
                        <button
                          type="button"
                          onClick={() => onStartMission(mission)}
                          className="py-2 px-4 rounded-xl bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xs font-black uppercase font-mono-stat transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Focar Missão</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
