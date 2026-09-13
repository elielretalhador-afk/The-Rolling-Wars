import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Users,
  Shield,
  Navigation,
  Flame,
  Zap,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Swords,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import {
  PlayerSearchResult,
  RankPlayer,
  RouteSearchResult,
  SearchFilterType,
  SkateRoute,
  SocialPlayer,
  UserProfile,
  Zone,
  ZoneSearchResult,
} from '../types';
import { performSearch } from '../utils/searchEngine';

interface SearchDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  socialPlayers?: SocialPlayer[];
  rankPlayers?: RankPlayer[];
  zones?: Zone[];
  routes?: SkateRoute[];
  blockedPlayerIds?: string[];
  userCoords?: [number, number];
  onSelectPlayer: (player: SocialPlayer | RankPlayer | any) => void;
  onSelectZone: (zone: Zone) => void;
  onSelectRoute: (route: SkateRoute) => void;
}

export const SearchDiscoveryModal: React.FC<SearchDiscoveryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  socialPlayers = [],
  rankPlayers = [],
  zones = [],
  routes = [],
  blockedPlayerIds = [],
  userCoords,
  onSelectPlayer,
  onSelectZone,
  onSelectRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('TODOS');
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático no campo de busca ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setActiveFilter('TODOS');
    }
  }, [isOpen]);

  // Execução da busca consolidada
  const searchResults = useMemo(() => {
    return performSearch({
      query: searchQuery,
      filter: activeFilter,
      currentUser,
      socialPlayers,
      rankPlayers,
      zones,
      routes,
      blockedPlayerIds,
      userCoords,
      limitPerCategory: 30,
    });
  }, [
    searchQuery,
    activeFilter,
    currentUser,
    socialPlayers,
    rankPlayers,
    zones,
    routes,
    blockedPlayerIds,
    userCoords,
  ]);

  if (!isOpen) return null;

  const isQueryEmpty = searchQuery.trim().length === 0;
  const hasResults =
    searchResults.players.length > 0 ||
    searchResults.zones.length > 0 ||
    searchResults.routes.length > 0;

  const showPlayersSection =
    (activeFilter === 'TODOS' || activeFilter === 'JOGADORES') &&
    (isQueryEmpty ? searchResults.suggestions.recentPlayers.length > 0 : searchResults.players.length > 0);

  const showZonesSection =
    (activeFilter === 'TODOS' || activeFilter === 'ZONAS') &&
    (isQueryEmpty ? searchResults.suggestions.nearbyZones.length > 0 : searchResults.zones.length > 0);

  const showRoutesSection =
    (activeFilter === 'TODOS' || activeFilter === 'ROTAS') &&
    (isQueryEmpty ? searchResults.suggestions.popularRoutes.length > 0 : searchResults.routes.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85  animate-in fade-in duration-200">
      <div
        id="search-discovery-modal"
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#000000] border-2 border-yellow-500/40 shadow-[0_15px_60px_rgba(252,232,3,0.25)] overflow-hidden text-white font-sans relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Superior */}
        <div className="absolute -top-12 inset-x-0 h-24 bg-gradient-to-b from-yellow-500/20 to-transparent blur-xl pointer-events-none" />

        {/* HEADER & CAMPO DE BUSCA PRINCIPAL */}
        <div className="p-4 bg-gradient-to-b from-[#101824] to-[#0a0f16] border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-yellow-400">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight font-display text-white flex items-center gap-1.5">
                  BUSCA & DESCOBERTA
                  <span className="px-1.5 py-0.2 rounded-md bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[9px] font-mono-stat font-black">
                    GLOBAL
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 font-mono-stat">
                  Encontre patinadores, territórios e rotas de SP
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-search-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar Busca"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campo Grande de Pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-yellow-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              id="input-global-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, @nickname, zona, bairro ou rota..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/60 border-2 border-yellow-500/30 focus:border-yellow-400 text-white placeholder:text-slate-500 text-xs sm:text-sm font-medium outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(252,232,3,0.25)] font-mono-stat"
            />
            {searchQuery && (
              <button
                type="button"
                id="btn-clear-search-query"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* FILTROS SIMPLES: TODOS | JOGADORES | ZONAS | ROTAS */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-0.5 scrollbar-none font-mono-stat text-[10px]">
            <button
              type="button"
              id="filter-search-todos"
              onClick={() => setActiveFilter('TODOS')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                activeFilter === 'TODOS'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.4)]'
                  : 'bg-[#121a24] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>TODOS</span>
            </button>

            <button
              type="button"
              id="filter-search-jogadores"
              onClick={() => setActiveFilter('JOGADORES')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                activeFilter === 'JOGADORES'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.4)]'
                  : 'bg-[#121a24] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>JOGADORES</span>
              {!isQueryEmpty && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[8px]">
                  {searchResults.players.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="filter-search-zonas"
              onClick={() => setActiveFilter('ZONAS')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                activeFilter === 'ZONAS'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.4)]'
                  : 'bg-[#121a24] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>ZONAS</span>
              {!isQueryEmpty && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[8px]">
                  {searchResults.zones.length}
                </span>
              )}
            </button>

            <button
              type="button"
              id="filter-search-rotas"
              onClick={() => setActiveFilter('ROTAS')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                activeFilter === 'ROTAS'
                  ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(252,232,3,0.4)]'
                  : 'bg-[#121a24] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>ROTAS</span>
              {!isQueryEmpty && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[8px]">
                  {searchResults.routes.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CORPO DE RESULTADOS / DESCOBERTA */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* Status da Pesquisa */}
          <div className="flex items-center justify-between text-[10px] font-mono-stat px-1 text-slate-400">
            {isQueryEmpty ? (
              <span className="flex items-center gap-1 text-yellow-400 font-bold uppercase">
                <Sparkles className="w-3 h-3" />
                SUGESTÕES & DESTAQUES EM SÃO PAULO
              </span>
            ) : (
              <span>
                Mostrando <strong className="text-white">{searchResults.totalResultsCount}</strong>{' '}
                resultado(s) para "<span className="text-yellow-400">{searchQuery}</span>"
              </span>
            )}
          </div>

          {/* ESTADO VAZIO: NENHUM RESULTADO */}
          {!isQueryEmpty && !hasResults && (
            <div className="p-8 rounded-3xl bg-[#0e1520] border border-white/10 text-center my-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-black text-white uppercase font-display">
                Nenhum resultado encontrado.
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Não encontramos correspondências para "<span className="text-white">{searchQuery}</span>". Tente
                pesquisar por outro nome, bairro, avenida ou altere o filtro de categoria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('TODOS');
                }}
                className="px-4 py-2 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold font-mono-stat uppercase tracking-wider hover:bg-yellow-400/30 transition-all cursor-pointer"
              >
                Limpar Busca & Ver Destaques
              </button>
            </div>
          )}

          {/* 1. SEÇÃO DE JOGADORES */}
          {showPlayersSection && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-display">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  JOGADORES ({isQueryEmpty ? searchResults.suggestions.recentPlayers.length : searchResults.players.length})
                </span>
                {isQueryEmpty && (
                  <span className="text-[9px] text-slate-400 font-mono-stat uppercase">
                    Recentes & Populares
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {(isQueryEmpty
                  ? searchResults.suggestions.recentPlayers
                  : searchResults.players
                ).map((player) => (
                  <div
                    key={player.id}
                    id={`search-player-${player.id}`}
                    onClick={() => {
                      onSelectPlayer(player.rawPlayer);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#0a0a0a] hover:bg-[#121c2a] border border-white/10 hover:border-cyan-400/50 shadow-md flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={player.avatar}
                          alt={player.nickname}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-cyan-400 text-black text-[8px] font-black font-mono-stat">
                          L{player.level}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors truncate font-display">
                            {player.nickname}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono-stat shrink-0">
                            {player.tag}
                          </span>
                          {player.activeTitle && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[8px] font-bold font-mono-stat truncate shrink-0">
                              👑 {player.activeTitle}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-stat mt-0.5 truncate">
                          <span>{player.crew || 'Sem Clã'}</span>
                          <span>•</span>
                          <span>{player.totalKm} km</span>
                          {player.approximateDistanceLabel && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-400">
                                📍 {player.approximateDistanceLabel}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-black font-mono-stat text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden sm:inline uppercase">VER PERFIL</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SEÇÃO DE ZONAS */}
          {showZonesSection && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-display">
                  <Shield className="w-3.5 h-3.5 text-yellow-400" />
                  ZONAS & TERRITÓRIOS ({isQueryEmpty ? searchResults.suggestions.nearbyZones.length : searchResults.zones.length})
                </span>
                {isQueryEmpty && (
                  <span className="text-[9px] text-slate-400 font-mono-stat uppercase">
                    Próximas de você
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {(isQueryEmpty
                  ? searchResults.suggestions.nearbyZones
                  : searchResults.zones
                ).map((zone) => (
                  <div
                    key={zone.id}
                    id={`search-zone-${zone.id}`}
                    onClick={() => {
                      onSelectZone(zone.rawZone);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#0a0a0a] hover:bg-[#121c2a] border border-white/10 hover:border-yellow-400/50 shadow-md transition-all active:scale-[0.99] cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <h4 className="text-xs font-black text-white group-hover:text-yellow-300 transition-colors truncate font-display">
                            {zone.name}
                          </h4>
                          <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-300 text-[8px] font-bold font-mono-stat uppercase shrink-0">
                            {zone.category}
                          </span>
                          {zone.status === 'controlled' ? (
                            <span className="px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 text-[8px] font-black font-mono-stat uppercase">
                              DOMINADA ({zone.dominancePercent}%)
                            </span>
                          ) : zone.status === 'contested' ? (
                            <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-400/30 text-[8px] font-black font-mono-stat uppercase animate-pulse">
                              CONTESTADA
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[8px] font-black font-mono-stat uppercase">
                              ZONA LIVRE
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono-stat mt-1 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{zone.referencePoint}</span>
                        </p>

                        {/* Controlador & Estatísticas */}
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono-stat mt-1.5">
                          {zone.controllerNickname ? (
                            <span className="text-yellow-300 font-bold">
                              👑 {zone.controllerNickname} ({zone.controllerCrew || 'Solo'})
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold">
                              ⚡ Sem dono atual
                            </span>
                          )}
                          <span>•</span>
                          <span>{zone.skatersCount} patinadores</span>
                          {zone.distanceFromUserFormatted && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400 font-bold">
                                📍 {zone.distanceFromUserFormatted}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-black font-mono-stat text-yellow-400 shrink-0 group-hover:translate-x-0.5 transition-transform mt-1">
                        <span className="hidden sm:inline uppercase">MAPA</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SEÇÃO DE ROTAS */}
          {showRoutesSection && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-display">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  ROTAS PATINÁVEIS ({isQueryEmpty ? searchResults.suggestions.popularRoutes.length : searchResults.routes.length})
                </span>
                {isQueryEmpty && (
                  <span className="text-[9px] text-slate-400 font-mono-stat uppercase">
                    Mais Populares
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {(isQueryEmpty
                  ? searchResults.suggestions.popularRoutes
                  : searchResults.routes
                ).map((route) => (
                  <div
                    key={route.id}
                    id={`search-route-${route.id}`}
                    onClick={() => {
                      onSelectRoute(route.rawRoute);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#0a0a0a] hover:bg-[#121c2a] border border-white/10 hover:border-amber-400/50 shadow-md transition-all active:scale-[0.99] cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors truncate font-display">
                            {route.name}
                          </h4>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-black font-mono-stat uppercase shrink-0 ${
                              route.difficulty === 'Insano'
                                ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                                : route.difficulty === 'Avançado'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                : route.difficulty === 'Intermediário'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                            }`}
                          >
                            {route.difficulty}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[8px] font-black font-mono-stat shrink-0">
                            {route.distanceKm} KM
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono-stat mt-1 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{route.location}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>~{route.estimatedTimeMin} min</span>
                        </p>

                        {/* Tags da Rota */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {route.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded-md bg-black/40 text-slate-300 text-[8px] font-mono-stat"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[9px] font-bold text-amber-400 font-mono-stat ml-auto">
                            +{route.points} PTS
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-black font-mono-stat text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform mt-1">
                        <span className="hidden sm:inline uppercase">DETALHES</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER & DICA */}
        <div className="p-3 bg-[#000000] border-t border-white/10 flex items-center justify-between text-[10px] font-mono-stat text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-yellow-400" />
            Índice Urbano de São Paulo Ativo
          </span>
          <button
            type="button"
            id="btn-close-search-footer"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
