import React, { useState } from 'react';
import {
  X,
  Trophy,
  Flag,
  MapPin,
  Clock,
  Users,
  Award,
  Shield,
  Swords,
  Timer,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Flame,
  Info,
} from 'lucide-react';
import {
  UrbanozeiroEvent,
  UserProfile,
  EventType,
  EventStatus,
  EventRegistrationStatus,
  SkateRoute,
  Zone,
} from '../types';

interface EventDetailsModalProps {
  event: UrbanozeiroEvent | null;
  currentUser?: UserProfile;
  routes?: SkateRoute[];
  zones?: Zone[];
  onClose: () => void;
  onRegister: (eventId: string) => void;
  onCancelRegistration: (eventId: string) => void;
  onViewRouteOnMap?: (routeId: string) => void;
  onViewZoneOnMap?: (zoneId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  currentUser,
  routes = [],
  zones = [],
  onClose,
  onRegister,
  onCancelRegistration,
  onViewRouteOnMap,
  onViewZoneOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'regras' | 'participantes' | 'torneio' | 'classificacao' | 'recompensas'>('info');

  if (!event) return null;

  const isUserRegistered =
    event.userRegistrationStatus === 'REGISTERED' ||
    event.userRegistrationStatus === 'PARTICIPATING' ||
    (currentUser && event.participants.some((p) => p.userId === currentUser.id));

  const isFull = event.currentParticipants >= event.maxParticipants;
  const isWaitlist = event.userRegistrationStatus === 'WAITING_LIST';

  const associatedRoute = event.routeId ? routes.find((r) => r.id === event.routeId) : null;
  const associatedZone = event.zoneId ? zones.find((z) => z.id === event.zoneId) : null;

  // Format type info
  const getTypeInfo = (type: EventType) => {
    switch (type) {
      case 'RACE':
        return { label: 'CORRIDA DE RUA', icon: Flag, color: 'text-yellow-400', border: 'border-yellow-500/40 bg-yellow-500/10' };
      case 'TOURNAMENT':
        return { label: 'TORNEIO MATA-MATA', icon: Trophy, color: 'text-amber-400', border: 'border-amber-500/40 bg-amber-500/10' };
      case 'ZONE_EVENT':
        return { label: 'EVENTO EM ZONA', icon: MapPin, color: 'text-cyan-400', border: 'border-cyan-500/40 bg-cyan-500/10' };
      case 'TIME_TRIAL':
        return { label: 'CONTRA O RELÓGIO', icon: Timer, color: 'text-purple-400', border: 'border-purple-500/40 bg-purple-500/10' };
      case 'SPECIAL_CHALLENGE':
        return { label: 'DESAFIO ESPECIAL', icon: Swords, color: 'text-rose-400', border: 'border-rose-500/40 bg-rose-500/10' };
      default:
        return { label: 'EVENTO', icon: Sparkles, color: 'text-blue-400', border: 'border-blue-500/40 bg-blue-500/10' };
    }
  };

  const typeInfo = getTypeInfo(event.type);
  const TypeIcon = typeInfo.icon;

  const fillPercent = Math.min(100, Math.round((event.currentParticipants / event.maxParticipants) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80  animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b121c] border border-white/15 rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        
        {/* Header com Banner & Fechar */}
        <div className="relative p-5 pb-4 border-b border-white/10 bg-gradient-to-b from-[#111e2e] to-[#0b121c]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top metadata badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black font-mono-stat border ${typeInfo.border} ${typeInfo.color}`}>
              <TypeIcon className="w-3.5 h-3.5" />
              {typeInfo.label}
            </span>

            {event.status === 'ACTIVE' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black font-mono-stat animate-pulse">
                AO VIVO AGORA
              </span>
            )}
            {event.status === 'FINISHED' && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-neutral-300 border border-neutral-800 text-[10px] font-black font-mono-stat">
                FINALIZADO
              </span>
            )}
            {event.status === 'REGISTRATION_OPEN' && !isFull && (
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] font-black font-mono-stat">
                INSCRIÇÕES ABERTAS
              </span>
            )}
            {isFull && event.status !== 'FINISHED' && event.status !== 'ACTIVE' && (
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] font-black font-mono-stat">
                INSCRIÇÕES ENCERRADAS
              </span>
            )}
          </div>

          {/* Event Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight pr-8">
            {event.name}
          </h2>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 text-xs text-neutral-300">
            <div className="flex items-center gap-2 font-mono-stat">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="font-bold text-white">{event.dateLabel}</span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate text-neutral-300">{event.locationName}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 bg-[#080d14] border-b border-white/5 no-scrollbar text-xs font-mono-stat">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'bg-yellow-400 text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Visão Geral
          </button>

          <button
            onClick={() => setActiveTab('regras')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'regras'
                ? 'bg-yellow-400 text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Regras & Critérios
          </button>

          <button
            onClick={() => setActiveTab('participantes')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'participantes'
                ? 'bg-yellow-400 text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Participantes ({event.currentParticipants}/{event.maxParticipants})
          </button>

          {event.tournament && (
            <button
              onClick={() => setActiveTab('torneio')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'torneio'
                  ? 'bg-amber-400 text-black font-black'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Chaveamento
            </button>
          )}

          {((event.leaderboard && event.leaderboard.length > 0) || event.status === 'FINISHED' || event.status === 'ACTIVE') && (
            <button
              onClick={() => setActiveTab('classificacao')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'classificacao'
                  ? 'bg-yellow-400 text-black font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Classificação
            </button>
          )}

          <button
            onClick={() => setActiveTab('recompensas')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'recompensas'
                ? 'bg-yellow-400 text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Recompensas ({event.rewards.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-neutral-300">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Descrição */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-black uppercase text-neutral-400 font-mono-stat mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-yellow-400" />
                  Sobre o Evento
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Rota Vinculada */}
              {associatedRoute && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-400 font-mono-stat flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      Circuito Oficial Vinculado
                    </span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{associatedRoute.name}</h5>
                    <p className="text-xs text-neutral-400 font-mono-stat mt-0.5">
                      {associatedRoute.distanceKm} km • Dificuldade: {associatedRoute.difficulty}
                    </p>
                  </div>

                  {onViewRouteOnMap && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewRouteOnMap(associatedRoute.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono-stat flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver no Mapa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Zona Vinculada */}
              {associatedZone && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-yellow-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-yellow-400 font-mono-stat flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Zona de Domínio Vinculada
                    </span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{associatedZone.name}</h5>
                    <p className="text-xs text-neutral-400 font-mono-stat mt-0.5">
                      Raio: {associatedZone.radius}m • Domínio Atual: {associatedZone.dominance}%
                    </p>
                  </div>

                  {onViewZoneOnMap && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewZoneOnMap(associatedZone.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-emerald-300 border border-yellow-500/40 text-xs font-bold font-mono-stat flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver Zona no Mapa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Lotação & Estatísticas Rápidas */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-stat">
                  <span className="text-neutral-400 font-bold uppercase">Lotação da Bateria</span>
                  <span className="text-white font-bold">
                    {event.currentParticipants} de {event.maxParticipants} vagas preenchidas ({fillPercent}%)
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_#00ff66]"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGRAS & CRITÉRIOS */}
          {activeTab === 'regras' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <h4 className="font-bold text-white text-sm uppercase font-mono-stat">
                    {event.rules.title}
                  </h4>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {event.rules.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs font-mono-stat">
                  {event.rules.minLevel && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-neutral-400 text-[10px] uppercase block">Nível Mínimo</span>
                      <span className="text-white font-bold text-sm">Nível {event.rules.minLevel}+</span>
                    </div>
                  )}

                  {event.rules.timeLimitMinutes && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-neutral-400 text-[10px] uppercase block">Tempo Limite</span>
                      <span className="text-white font-bold text-sm">{event.rules.timeLimitMinutes} minutos</span>
                    </div>
                  )}

                  {event.rules.requiredDistanceKm && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-neutral-400 text-[10px] uppercase block">Distância Oficial</span>
                      <span className="text-white font-bold text-sm">{event.rules.requiredDistanceKm} km</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-neutral-400 text-[10px] uppercase block">Critério de Vitória</span>
                    <span className="text-yellow-400 font-bold text-xs uppercase">
                      {event.rules.criteria === 'first_to_finish' && 'Primeiro a Cruzar o Pórtico'}
                      {event.rules.criteria === 'lowest_time' && 'Menor Tempo Cronometrado'}
                      {event.rules.criteria === 'knockout' && 'Eliminatória Mata-Mata'}
                      {event.rules.criteria === 'zone_dominance' && 'Maior Distância na Zona'}
                      {event.rules.criteria === 'max_score' && 'Maior Pontuação Acumulada'}
                    </span>
                  </div>
                </div>

                {event.rules.scoringFormula && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-emerald-300 font-mono-stat">
                    <span className="font-bold block mb-0.5">Pontuação Oficial:</span>
                    <span>{event.rules.scoringFormula}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PARTICIPANTES */}
          {activeTab === 'participantes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-stat px-1">
                <span className="text-neutral-400 font-bold uppercase">
                  Patinadores Confirmados ({event.participants.length})
                </span>
                <span className="text-yellow-400 font-bold">
                  {event.maxParticipants - event.currentParticipants} vagas restantes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.participants.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={p.avatar}
                        alt={p.nickname}
                        className="w-8 h-8 rounded-full object-cover border border-yellow-500/40 shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs truncate">{p.nickname}</span>
                          {p.clanTag && (
                            <span className="px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-400 text-[9px] font-mono-stat font-bold">
                              [{p.clanTag}]
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono-stat">
                          Nv. {p.level} {p.crew ? `• ${p.crew}` : ''}
                        </span>
                      </div>
                    </div>

                    {p.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-black text-[9px] font-mono-stat shrink-0">
                        VOCÊ
                      </span>
                    )}
                  </div>
                ))}

                {event.participants.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-xs text-slate-500">
                    Seja o primeiro a se inscrever neste evento!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CHAVEAMENTO DE TORNEIO */}
          {activeTab === 'torneio' && event.tournament && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-400 text-xs uppercase font-mono-stat flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    Chaveamento Eliminatório Simples (Mata-Mata)
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    8 Competidores • Quartas de Final → Semifinal → Grande Final
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-black font-black text-xs font-mono-stat">
                  RODADA {event.tournament.currentRound} / {event.tournament.totalRounds}
                </span>
              </div>

              {/* Rounds List */}
              <div className="space-y-3">
                {event.tournament.rounds.map((round) => (
                  <div key={round.roundNumber} className="space-y-2">
                    <div className="text-xs font-black uppercase text-yellow-400 font-mono-stat px-1 flex items-center gap-2">
                      <Swords className="w-3.5 h-3.5" />
                      <span>{round.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {round.matches.map((match) => (
                        <div
                          key={match.id}
                          className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono-stat text-slate-500">
                            <span>Confronto #{match.matchIndex}</span>
                            <span className="text-amber-400 uppercase">{match.status === 'scheduled' ? 'Agendado' : match.status}</span>
                          </div>

                          {/* Player 1 */}
                          <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2 truncate">
                              {match.player1?.avatar && (
                                <img
                                  src={match.player1.avatar}
                                  alt={match.player1.nickname}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="font-bold text-white truncate">
                                {match.player1?.nickname || 'A definir'}
                              </span>
                            </div>
                            {match.player1?.isCurrentUser && (
                              <span className="text-[9px] font-black text-yellow-400 font-mono-stat">VOCÊ</span>
                            )}
                          </div>

                          {/* VS Divider */}
                          <div className="text-center text-[9px] font-black text-slate-500 font-mono-stat">
                            VS
                          </div>

                          {/* Player 2 */}
                          <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2 truncate">
                              {match.player2?.avatar && (
                                <img
                                  src={match.player2.avatar}
                                  alt={match.player2.nickname}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="font-bold text-white truncate">
                                {match.player2?.nickname || 'A definir'}
                              </span>
                            </div>
                            {match.player2?.isCurrentUser && (
                              <span className="text-[9px] font-black text-yellow-400 font-mono-stat">VOCÊ</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CLASSIFICAÇÃO / LEADERBOARD */}
          {activeTab === 'classificacao' && (
            <div className="space-y-3">
              <div className="text-xs font-mono-stat text-neutral-400 px-1 font-bold uppercase flex items-center justify-between">
                <span>Tabela Oficial do Evento</span>
                <span>Pontuação & Tempos</span>
              </div>

              <div className="space-y-1.5">
                {(event.leaderboard || []).map((entry) => {
                  const isTop1 = entry.position === 1;
                  const isTop2 = entry.position === 2;
                  const isTop3 = entry.position === 3;

                  return (
                    <div
                      key={entry.playerId}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        entry.isCurrentUser
                          ? 'bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                          : isTop1
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {/* Position badge */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono-stat font-black text-xs shrink-0 ${
                            isTop1
                              ? 'bg-amber-400 text-black'
                              : isTop2
                              ? 'bg-slate-300 text-black'
                              : isTop3
                              ? 'bg-amber-700 text-white'
                              : 'bg-white/10 text-neutral-400'
                          }`}
                        >
                          {entry.position}º
                        </div>

                        <img
                          src={entry.avatar}
                          alt={entry.nickname}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10"
                        />

                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs truncate">{entry.nickname}</span>
                            {entry.clanTag && (
                              <span className="px-1 py-0.2 rounded bg-white/10 text-neutral-300 text-[9px] font-mono-stat">
                                [{entry.clanTag}]
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono-stat">
                            {entry.crew || 'Patinador Urbano'}
                          </span>
                        </div>
                      </div>

                      {/* Score / Time / Status */}
                      <div className="flex flex-col items-end shrink-0 font-mono-stat">
                        <span className="text-yellow-400 font-bold text-xs">
                          {entry.points} pts
                        </span>
                        {entry.timeFormatted && (
                          <span className="text-[10px] text-neutral-400">
                            ⏱️ {entry.timeFormatted}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(!event.leaderboard || event.leaderboard.length === 0) && (
                  <div className="text-center py-8 text-xs text-slate-500">
                    A classificação será computada e exibida assim que as baterias iniciarem.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: RECOMPENSAS */}
          {activeTab === 'recompensas' && (
            <div className="space-y-3">
              <div className="text-xs font-mono-stat text-neutral-400 px-1 font-bold uppercase">
                Prêmios e Conquistas do Evento
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {event.rewards.map((rew) => (
                  <div
                    key={rew.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shrink-0">
                        {rew.icon || '🎁'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-xs">{rew.name}</h5>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono-stat font-bold uppercase ${
                            rew.rarity === 'lendario'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : rew.rarity === 'epico'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}>
                            {rew.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{rew.description}</p>
                      </div>
                    </div>

                    {rew.amount && (
                      <span className="text-xs font-black font-mono-stat text-yellow-400 shrink-0">
                        +{rew.amount} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer com Ações Dinâmicas */}
        <div className="p-4 bg-[#080d14] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono-stat text-neutral-400">
            {isUserRegistered ? (
              <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Você está confirmado neste evento!
              </span>
            ) : isFull ? (
              <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Vagas esgotadas • Inscrições na lista de espera
              </span>
            ) : (
              <span>Inscrição 100% gratuita no Urbanozeiro</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isUserRegistered ? (
              <button
                id="btn-cancel-event-registration"
                onClick={() => onCancelRegistration(event.id)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold font-mono-stat uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancelar Inscrição
              </button>
            ) : isFull ? (
              <button
                id="btn-join-event-waitlist"
                onClick={() => onRegister(event.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-colors cursor-pointer"
              >
                Entrar na Lista de Espera
              </button>
            ) : event.status === 'FINISHED' ? (
              <button
                disabled
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold font-mono-stat uppercase tracking-wider cursor-not-allowed"
              >
                Evento Encerrado
              </button>
            ) : (
              <button
                id="btn-register-event"
                onClick={() => onRegister(event.id)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>PARTICIPAR DO EVENTO</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
