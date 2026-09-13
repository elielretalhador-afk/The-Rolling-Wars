import React, { useState } from 'react';
import {
  Trophy,
  Flag,
  MapPin,
  Clock,
  Users,
  Award,
  Sparkles,
  Swords,
  Timer,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
  Search,
} from 'lucide-react';
import { UrbanozeiroEvent, EventType, EventStatus, UserProfile } from '../types';

interface EventsHubProps {
  events: UrbanozeiroEvent[];
  currentUser?: UserProfile;
  onSelectEvent: (event: UrbanozeiroEvent) => void;
  onRegisterEvent?: (event: UrbanozeiroEvent) => void;
}

export const EventsHub: React.FC<EventsHubProps> = ({
  events,
  currentUser,
  onSelectEvent,
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pb-24 bg-[#000000] flex flex-col items-center justify-center">
      <div className="text-center p-8 bg-[#0b131e] border border-white/5 rounded-2xl w-full max-w-sm shadow-xl mt-12">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
          🚧
        </div>
        <h2 className="text-xl font-black text-white font-display uppercase tracking-tight mb-2">
          Eventos & Torneios
        </h2>
        <p className="text-sm font-medium text-slate-400">
          Em breve.
        </p>
      </div>
    </div>
  );
  
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('TODOS');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Event Type Helpers
  const getTypeBadge = (type: EventType) => {
    switch (type) {
      case 'RACE':
        return { label: 'CORRIDA', icon: Flag, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
      case 'TOURNAMENT':
        return { label: 'TORNEIO', icon: Trophy, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'ZONE_EVENT':
        return { label: 'EVENTO EM ZONA', icon: MapPin, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'TIME_TRIAL':
        return { label: 'CONTRA O RELÓGIO', icon: Timer, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'SPECIAL_CHALLENGE':
        return { label: 'DESAFIO ESPECIAL', icon: Swords, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'MISSION':
        return { label: 'MISSÃO', icon: Zap, color: 'text-blue-400 bg-blue-500/10 border-neutral-700/30' };
      default:
        return { label: 'EVENTO', icon: Sparkles, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
    }
  };

  const getStatusBadge = (status: EventStatus, current: number, max: number) => {
    if (status === 'ACTIVE') {
      return {
        label: 'AO VIVO AGORA',
        color: 'text-amber-400 bg-amber-500/20 border-amber-500/40 animate-pulse',
      };
    }
    if (status === 'FINISHED') {
      return {
        label: 'FINALIZADO',
        color: 'text-slate-400 bg-slate-800/80 border-slate-700/60',
      };
    }
    if (status === 'CANCELLED') {
      return {
        label: 'CANCELADO',
        color: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
      };
    }
    if (current >= max) {
      return {
        label: 'INSCRIÇÕES ENCERRADAS',
        color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40',
      };
    }
    if (status === 'REGISTRATION_OPEN') {
      return {
        label: 'INSCRIÇÕES ABERTAS',
        color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40 shadow-[0_0_10px_rgba(252,232,3,0.2)]',
      };
    }
    return {
      label: 'EM BREVE',
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
    };
  };

  // Filter Logic
  const filteredEvents = (events || []).filter((ev) => {
    // Type Filter
    if (selectedTypeFilter !== 'TODOS' && ev.type !== selectedTypeFilter) {
      return false;
    }

    // Status Filter
    if (selectedStatusFilter === 'ABERTOS' && (ev.status !== 'REGISTRATION_OPEN' || ev.currentParticipants >= ev.maxParticipants)) {
      return false;
    }
    if (selectedStatusFilter === 'ATIVOS' && ev.status !== 'ACTIVE') {
      return false;
    }
    if (selectedStatusFilter === 'FINALIZADOS' && ev.status !== 'FINISHED') {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ev.name.toLowerCase().includes(q);
      const matchLoc = (ev.locationName || '').toLowerCase().includes(q);
      const matchDesc = (ev.description || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  const totalActiveCount = (events || []).filter((e) => e.status === 'ACTIVE').length;
  const totalOpenCount = (events || []).filter((e) => e.status === 'REGISTRATION_OPEN' && e.currentParticipants < e.maxParticipants).length;

  return (
    <div className="space-y-4">
      {/* Banner de Destaque Competitivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1420] via-[#091815] to-[#0a101d] border border-yellow-500/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider font-mono-stat">
              <Trophy className="w-4 h-4 text-amber-400" />
              CIRCUITO COMPETITIVO OFICIAL
            </div>
            <h3 className="text-lg font-black text-white uppercase font-display tracking-tight mt-0.5">
              EVENTOS & TORNEIOS
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Participe de corridas de rua, time trials, disputas de zonas e torneios mata-mata com recompensas em XP, medalhas e títulos.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1 font-mono-stat">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span>{totalOpenCount} INSCRIÇÕES ABERTAS</span>
            </div>
            {totalActiveCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                <span>{totalActiveCount} AO VIVO</span>
              </div>
            )}
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar evento por nome, local ou circuito..."
            className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-stat">
        {[
          { id: 'TODOS', label: 'Todos os Eventos' },
          { id: 'RACE', label: '🏁 Corridas' },
          { id: 'TOURNAMENT', label: '🏆 Torneios' },
          { id: 'ZONE_EVENT', label: '📍 Eventos em Zona' },
          { id: 'TIME_TRIAL', label: '⏱️ Time Trial' },
          { id: 'SPECIAL_CHALLENGE', label: '⚔️ Especiais' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedTypeFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all cursor-pointer ${
              selectedTypeFilter === f.id
                ? 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(252,232,3,0.3)]'
                : 'bg-[#0a0a0a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Status Filter Sub-bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 font-mono-stat">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'EVENTO DISPONÍVEL' : 'EVENTOS DISPONÍVEIS'}
        </span>

        <div className="flex items-center gap-1">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'ABERTOS', label: 'Inscrições Abertas' },
            { id: 'ATIVOS', label: 'Ao Vivo' },
            { id: 'FINALIZADOS', label: 'Encerrados' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStatusFilter(s.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-stat transition-colors ${
                selectedStatusFilter === s.id
                  ? 'text-yellow-400 font-bold bg-yellow-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Card List */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => {
          const typeBadge = getTypeBadge(ev.type);
          const TypeIcon = typeBadge.icon;
          const statusBadge = getStatusBadge(ev.status, ev.currentParticipants, ev.maxParticipants);
          
          const isUserRegistered =
            ev.userRegistrationStatus === 'REGISTERED' ||
            ev.userRegistrationStatus === 'PARTICIPATING' ||
            (currentUser && ev.participants.some((p) => p.userId === currentUser.id));

          const fillPercent = Math.min(100, Math.round((ev.currentParticipants / ev.maxParticipants) * 100));

          return (
            <div
              key={ev.id}
              id={`event-card-${ev.id}`}
              onClick={() => onSelectEvent(ev)}
              className="group relative bg-[#0d141f] hover:bg-[#111c2a] border border-white/10 hover:border-yellow-500/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_4px_25px_rgba(252,232,3,0.15)]"
            >
              {/* Top Row: Type Badge + Status Pill */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black font-mono-stat border ${typeBadge.color}`}>
                    <TypeIcon className="w-3 h-3" />
                    {typeBadge.label}
                  </span>

                  {ev.categoryTag && (
                    <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono-stat px-2 py-0.5 bg-white/5 rounded-md">
                      {ev.categoryTag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isUserRegistered && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] font-black font-mono-stat">
                      <CheckCircle2 className="w-3 h-3" />
                      INSCRITO
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono-stat border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Event Name */}
              <h4 className="text-base font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight font-display">
                {ev.name}
              </h4>

              {/* Event Description (Truncated) */}
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {ev.description}
              </p>

              {/* Meta Grid: Date/Time + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-mono-stat">
                  <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="font-bold text-white">{ev.dateLabel}</span>
                </div>

                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate text-slate-300">{ev.locationName}</span>
                </div>
              </div>

              {/* Capacity Bar & Rewards Footer */}
              <div className="mt-3 pt-2.5 flex items-center justify-between gap-3">
                {/* Participants Gauge */}
                <div className="flex-1 max-w-[200px]">
                  <div className="flex items-center justify-between text-[10px] font-mono-stat text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>Participantes</span>
                    </span>
                    <span className={`font-bold ${fillPercent >= 100 ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {ev.currentParticipants}/{ev.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        fillPercent >= 100
                          ? 'bg-yellow-400'
                          : ev.status === 'ACTIVE'
                          ? 'bg-amber-400'
                          : 'bg-yellow-400 shadow-[0_0_8px_#fce803]'
                      }`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards preview pills */}
                <div className="flex items-center gap-1.5">
                  {ev.rewards.slice(0, 2).map((rew) => (
                    <span
                      key={rew.id}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono-stat font-bold flex items-center gap-1"
                    >
                      <span>{rew.icon || '🎁'}</span>
                      <span className="truncate max-w-[80px]">{rew.name}</span>
                    </span>
                  ))}

                  <div className="p-1 rounded-lg bg-white/5 group-hover:bg-yellow-400/20 group-hover:text-yellow-400 text-slate-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-10 px-4 bg-[#0d141f] border border-white/5 rounded-2xl">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">Nenhum evento encontrado</p>
            <p className="text-xs text-slate-500 mt-1">
              Tente selecionar outro filtro de modalidade ou termo de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
