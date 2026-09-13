import React, { useState, useMemo } from 'react';
import {
  Compass,
  X,
  Search,
  Flag,
  Swords,
  Shield,
  Flame,
  Activity,
  Navigation,
  ChevronRight,
  Users,
  Layers,
  MapPin,
} from 'lucide-react';
import { Zone, UserProfile } from '../types';
import { calculateGpsDistanceKm } from '../utils/gpsTracker';

interface NearbyZonesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  userLocation?: { latitude: number; longitude: number } | null;
  currentUser: UserProfile;
  onSelectZone: (zone: Zone) => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const NearbyZonesDrawer: React.FC<NearbyZonesDrawerProps> = ({
  isOpen,
  onClose,
  zones,
  userLocation,
  currentUser,
  onSelectZone,
  activeFilter,
  onSelectFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate distance for all zones relative to user
  const zonesWithDistance = useMemo(() => {
    return zones.map((zone) => {
      let distanceMeters = 999999;
      if (
        userLocation &&
        typeof userLocation.latitude === 'number' &&
        !isNaN(userLocation.latitude) &&
        typeof userLocation.longitude === 'number' &&
        !isNaN(userLocation.longitude) &&
        Array.isArray(zone.center) &&
        typeof zone.center[0] === 'number' &&
        !isNaN(zone.center[0]) &&
        typeof zone.center[1] === 'number' &&
        !isNaN(zone.center[1])
      ) {
        distanceMeters = Math.round(
          calculateGpsDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            zone.center[0],
            zone.center[1]
          ) * 1000
        );
      }
      return {
        ...zone,
        distanceFromUserMeters: distanceMeters,
      };
    });
  }, [zones, userLocation]);

  // Exploration Filter categories
  const filterOptions = [
    { id: 'Todas', label: 'Todas' },
    { id: 'Livres', label: 'Livres' },
    { id: 'Em Disputa', label: 'Em Disputa' },
    { id: 'Dominadas', label: 'Dominadas' },
    { id: 'Alta Atividade', label: 'Alta Atividade' },
    { id: 'Próximas', label: 'Mais Próximas' },
  ];

  // Filtered and Sorted list
  const filteredZones = useMemo(() => {
    let result = [...zonesWithDistance];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (z) =>
          z.name.toLowerCase().includes(q) ||
          (z.description && z.description.toLowerCase().includes(q)) ||
          (z.controllerNickname && z.controllerNickname.toLowerCase().includes(q)) ||
          (z.controller?.nickname && z.controller.nickname.toLowerCase().includes(q)) ||
          (z.creator && typeof z.creator === 'object' && z.creator.name.toLowerCase().includes(q)) ||
          (z.type && z.type.toLowerCase().includes(q))
      );
    }

    // Category filter
    const filterLower = activeFilter.toLowerCase();
    if (filterLower === 'livres') {
      result = result.filter((z) => z.status === 'free' || !z.controller);
    } else if (filterLower === 'em disputa' || filterLower === 'disputa') {
      result = result.filter((z) => z.status === 'contested' || z.contested);
    } else if (filterLower === 'dominadas' || filterLower === 'controladas') {
      result = result.filter((z) => z.status === 'controlled' && z.controller);
    } else if (filterLower === 'alta atividade') {
      result = result.filter((z) => {
        const act = String(z.activityLevel || '').toUpperCase();
        return (
          act === 'HIGH' ||
          act === 'ALTA' ||
          (z.skatersCount && z.skatersCount >= 12) ||
          (z.activeSkatersCount && z.activeSkatersCount >= 12)
        );
      });
    } else if (filterLower === 'próximas' || filterLower === 'proximas') {
      // Sort purely by closest distance
      result.sort((a, b) => (a.distanceFromUserMeters ?? 999999) - (b.distanceFromUserMeters ?? 999999));
    }

    // Default sorting: if not already sorted by proximity, sort by active activity or distance
    if (filterLower !== 'próximas' && filterLower !== 'proximas') {
      result.sort((a, b) => (a.distanceFromUserMeters ?? 999999) - (b.distanceFromUserMeters ?? 999999));
    }

    return result;
  }, [zonesWithDistance, searchQuery, activeFilter]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-3 pointer-events-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-md bg-[#080d14]/98 border-2 border-yellow-500/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)]  animate-in slide-in-from-bottom duration-300 max-h-[78vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3.5 pb-2.5 bg-[#0a1017] border-b-2 border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center text-yellow-400 shrink-0">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-yellow-400 font-mono-stat tracking-wider">
                  EXPLORAÇÃO URBANA
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-950 text-emerald-300 border border-yellow-500/40 font-mono-stat">
                  {filteredZones.length} {filteredZones.length === 1 ? 'ZONA' : 'ZONAS'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-tight leading-none truncate">
                Zonas no Mapa
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar lista de zonas"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-neutral-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-3.5 pt-2.5 pb-1 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar zona por nome, tipo ou jogador..."
              className="w-full pl-9 pr-8 py-2 bg-[#05080c] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors font-mono-stat"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-3.5 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-white/5">
          {filterOptions.map((f) => {
            const isActive = activeFilter.toLowerCase() === f.id.toLowerCase();
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono-stat tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-black border border-yellow-400 shadow-[0_0_12px_rgba(0,255,102,0.3)] scale-102'
                    : 'bg-[#0f1722] text-neutral-300 border border-white/10 hover:border-yellow-500/40 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Zones Scrollable List */}
        <div className="p-3.5 pt-2 overflow-y-auto space-y-2 no-scrollbar flex-1">
          {filteredZones.length === 0 ? (
            <div className="py-10 text-center text-neutral-400 font-mono-stat">
              <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold">Nenhuma zona encontrada com estes filtros.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSelectFilter('Todas');
                }}
                className="mt-2 text-[10px] text-yellow-400 underline font-black"
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : (
            filteredZones.map((zone) => {
              const zoneColor = zone.color || zone.accentColor || '#00FF66';
              const isFree = zone.status === 'free' || !zone.controller;
              const isContested = zone.status === 'contested' || zone.contested;
              const skatersCountValue = zone.skatersCount !== undefined ? zone.skatersCount : (zone.activeSkatersCount ?? 0);
              const dominanceValue = zone.dominance !== undefined ? zone.dominance : (zone.dominancePercent ?? 0);
              const controllerNick = zone.controller?.nickname || zone.controller?.name || zone.controllerNickname;

              const rawActivity = (zone.activityLevel || (skatersCountValue >= 15 ? 'HIGH' : skatersCountValue >= 6 ? 'MEDIUM' : 'LOW')).toUpperCase();
              const isHigh = rawActivity === 'HIGH' || rawActivity === 'ALTA';
              const isMedium = rawActivity === 'MEDIUM' || rawActivity === 'MEDIA';

              const distanceStr =
                zone.distanceFromUserMeters !== undefined && zone.distanceFromUserMeters < 900000
                  ? zone.distanceFromUserMeters >= 1000
                    ? `${(zone.distanceFromUserMeters / 1000).toFixed(1)} km`
                    : `${zone.distanceFromUserMeters} m`
                  : null;

              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    onSelectZone(zone);
                    onClose();
                  }}
                  className="group p-3 rounded-2xl bg-[#0d141d]/90 hover:bg-[#121c28] border-2 border-white/10 hover:border-yellow-500/60 transition-all cursor-pointer shadow-md flex items-center justify-between gap-2.5 active:scale-99"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Status Color Badge / Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl bg-[#090d14] border-2 flex items-center justify-center shrink-0 shadow-sm relative"
                      style={{ borderColor: isContested ? '#f59e0b' : zoneColor }}
                    >
                      {isContested ? (
                        <Swords className="w-5 h-5 text-amber-400 animate-pulse" />
                      ) : isFree ? (
                        <Flag className="w-5 h-5 text-yellow-400" />
                      ) : zone.controller?.avatar || zone.controllerAvatar ? (
                        <img
                          src={zone.controller?.avatar || zone.controllerAvatar}
                          alt={controllerNick}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Shield className="w-5 h-5" style={{ color: zoneColor }} />
                      )}

                      {/* Status indicator dot */}
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black"
                        style={{ backgroundColor: isContested ? '#f59e0b' : zoneColor }}
                      />
                    </div>

                    {/* Zone Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status Label */}
                        {isFree ? (
                          <span className="text-[8px] font-black uppercase text-emerald-300 bg-emerald-950/90 px-1.5 py-0.2 rounded border border-yellow-500/40 font-mono-stat">
                            LIVRE
                          </span>
                        ) : isContested ? (
                          <span className="text-[8px] font-black uppercase text-amber-300 bg-amber-950/90 px-1.5 py-0.2 rounded border border-amber-500/40 font-mono-stat">
                            EM DISPUTA
                          </span>
                        ) : (
                          <span className="text-[8px] font-black uppercase text-cyan-300 bg-cyan-950/90 px-1.5 py-0.2 rounded border border-cyan-500/40 font-mono-stat truncate max-w-[110px]">
                            {controllerNick} ({dominanceValue}%)
                          </span>
                        )}

                        {/* Activity Level */}
                        {isHigh ? (
                          <span className="text-[8px] font-black uppercase text-orange-400 flex items-center gap-0.5 font-mono-stat">
                            <Flame className="w-2.5 h-2.5" /> ALTA ATIVIDADE
                          </span>
                        ) : isMedium ? (
                          <span className="text-[8px] font-black uppercase text-amber-300 flex items-center gap-0.5 font-mono-stat">
                            <Activity className="w-2.5 h-2.5" /> MÉDIA
                          </span>
                        ) : (
                          <span className="text-[8px] font-black uppercase text-neutral-400 flex items-center gap-0.5 font-mono-stat">
                            <Activity className="w-2.5 h-2.5" /> BAIXA
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-white uppercase font-display truncate mt-0.5 group-hover:text-emerald-300 transition-colors">
                        {zone.name}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono-stat mt-0.5">
                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                          <Users className="w-3 h-3" /> {skatersCountValue} no local
                        </span>
                        <span>•</span>
                        <span className="truncate">{zone.type?.toUpperCase() || 'STREET'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Distance & Action */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    {distanceStr && (
                      <span className="text-[11px] font-black text-yellow-400 font-mono-stat bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-yellow-500/30 flex items-center gap-1">
                        <Navigation className="w-2.5 h-2.5" />
                        {distanceStr}
                      </span>
                    )}
                    <div className="mt-1 flex items-center gap-0.5 text-[9px] text-neutral-400 group-hover:text-white font-mono-stat uppercase">
                      <span>Ver Zona</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
