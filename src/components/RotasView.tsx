import React from 'react';
import { Clock, Zap, MapPin, Compass, ChevronRight } from 'lucide-react';
import { SkateRoute } from '../types';

interface RotasViewProps {
  routes: SkateRoute[];
  onSelectRouteOnMap: (route: SkateRoute) => void;
}

export const RotasView: React.FC<RotasViewProps> = ({ routes, onSelectRouteOnMap }) => {
  const getDifficultyBadge = (diff: SkateRoute['difficulty']) => {
    switch (diff) {
      case 'Iniciante':
        return 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50';
      case 'Intermediário':
        return 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50';
      case 'Avançado':
        return 'bg-amber-400/20 text-amber-400 border border-amber-400/50';
      case 'Insano':
        return 'bg-rose-400/20 text-rose-400 border border-rose-400/50';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain px-4 py-4 pb-36 bg-[#050505]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider font-mono-stat">
          <Compass className="w-4 h-4" />
          ROTAS E CIRCUITOS URBANOS
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-0.5">
          EXPLORAR PISTAS & LINHAS
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Linhas mapeadas pela comunidade com percursos detalhados e avaliação de asfalto.
        </p>
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {routes.map((route) => (
          <div
            key={route.id}
            id={`route-card-${route.id}`}
            className="p-4 rounded-2xl bg-[#000000] border-2 border-white/10 hover:border-yellow-500/50 transition-all shadow-md group cursor-pointer active:scale-[0.99]"
            onClick={() => onSelectRouteOnMap(route)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded font-mono-stat ${getDifficultyBadge(route.difficulty)}`}>
                    {route.difficulty}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded font-mono-stat uppercase">
                    ASFALTO {route.asphaltQuality}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white uppercase font-display group-hover:text-yellow-400 transition-colors">
                  {route.name}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-amber-400 flex items-center justify-end gap-1 font-mono-stat">
                  <Zap className="w-3.5 h-3.5" />
                  +{route.points} XP
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-2">
              <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">{route.location}</span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span className="font-bold text-yellow-400 font-mono-stat">
                  {route.distanceKm} KM
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-medium font-mono-stat">
                  <Clock className="w-3.5 h-3.5" /> ~{route.estimatedTimeMin} MIN
                </span>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-bold uppercase text-yellow-400 group-hover:translate-x-1 transition-transform font-mono-stat"
              >
                VER NO MAPA <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
