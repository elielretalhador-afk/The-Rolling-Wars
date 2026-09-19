import React from 'react';
import { Clock, Zap, MapPin, Compass, ChevronRight, RotateCcw, Map, Navigation, ArrowLeft, Activity } from 'lucide-react';
import { ActivitySession, SkateRoute } from '../types';

interface RotasViewProps {
  sessions?: ActivitySession[];
  routes?: SkateRoute[];
  onSelectSessionOnMap?: (session: ActivitySession) => void;
  onSelectRouteOnMap?: (route: SkateRoute) => void;
  onRedoSession?: (session: ActivitySession) => void;
  onStartNewSession?: () => void;
  onBackToMap?: () => void;
}

export const RotasView: React.FC<RotasViewProps> = ({
  sessions = [],
  routes = [],
  onSelectSessionOnMap,
  onSelectRouteOnMap,
  onRedoSession,
  onStartNewSession,
  onBackToMap,
}) => {
  // Filtrar apenas sessões reais do usuário com ActivityTrack (sem dados mock)
  const realSessions = sessions.filter((s) => {
    if (!s || !s.id) return false;
    if (s.id.startsWith('session_mock_') || s.id.startsWith('mock_')) return false;
    const hasTrack = (s.track && s.track.length > 0) || (s.gpsPoints && s.gpsPoints.length > 0);
    return hasTrack;
  });

  const formatDuration = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = Math.floor(totalSecs % 60);
    if (h > 0) {
      return `${h}h ${String(m).padStart(2, '0')}m`;
    }
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  const formatDate = (isoOrMs: string | number) => {
    try {
      const d = new Date(isoOrMs);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data indisponível';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain px-4 py-4 pb-36 bg-[#050505]">
      {/* Header com Voltar */}
      <div className="flex items-center justify-between mb-4">
        {onBackToMap && (
          <button
            type="button"
            id="btn-back-to-map-rotas"
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono-stat uppercase tracking-wider active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MAPA</span>
          </button>
        )}
        <div className="text-[10px] text-yellow-400 font-mono-stat font-black uppercase tracking-wider flex items-center gap-1 ml-auto">
          <Navigation className="w-3 h-3 text-yellow-400" />
          {realSessions.length} {realSessions.length === 1 ? 'ROTA REGISTRADA' : 'ROTAS REGISTRADAS'}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider font-mono-stat">
          <Compass className="w-4 h-4" />
          ROTAS REAIS DO JOGADOR
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-0.5">
          SUAS LINHAS & PERCURSOS
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Histórico de rastros GPS reais gerados nas suas sessões de patinação urbana.
        </p>
      </div>

      {/* ESTADO VAZIO REAL (sem fallback fictício) */}
      {realSessions.length === 0 ? (
        <div className="text-center py-14 px-6 bg-[#0a0a0a] rounded-3xl border border-white/10 mt-4 max-w-md mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto mb-4 text-yellow-400 shadow-[0_0_25px_rgba(252,232,3,0.15)]">
            <Navigation className="w-8 h-8 stroke-[2]" />
          </div>
          <h3 className="text-base font-black text-white uppercase font-display tracking-tight">
            Você ainda não possui rotas registradas.
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium max-w-xs mx-auto leading-relaxed">
            Comece uma patinação para criar sua primeira rota e registrar seu rastro GPS no mapa.
          </p>
          {onStartNewSession && (
            <button
              type="button"
              id="btn-start-first-route"
              onClick={onStartNewSession}
              className="mt-6 px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono-stat uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_20px_rgba(252,232,3,0.3)] inline-flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" />
              COMEÇAR PATINAÇÃO
            </button>
          )}
        </div>
      ) : (
        /* LISTAGEM DE ROTAS REAIS */
        <div className="space-y-3.5">
          {realSessions.map((session, index) => {
            const distance = session.distanceKm ?? session.distance ?? 0;
            const duration = session.durationSeconds ?? session.duration ?? 0;
            const avgSpeed = session.avgSpeedKmH ?? session.averageSpeed ?? 0;
            const maxSpeed = session.maxSpeedKmH ?? session.maxSpeed ?? 0;
            const dateStr = formatDate(session.startedAt || (session as any).startTime || Date.now());
            const trackPoints = session.track?.length || session.gpsPoints?.length || 0;
            const sessionTitle = session.title || `Patinação #${session.sessionNumber || realSessions.length - index}`;

            return (
              <div
                key={session.id}
                id={`route-card-${session.id}`}
                className="p-4 rounded-2xl bg-[#0a0f18] border-2 border-white/10 hover:border-yellow-400/50 transition-all shadow-lg group"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-md font-mono-stat bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                        ROTA REAL
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 font-mono-stat flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {dateStr}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white uppercase font-display group-hover:text-yellow-400 transition-colors">
                      {sessionTitle}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/60 border border-cyan-400/30 px-2 py-0.5 rounded font-mono-stat flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {trackPoints} PTS GPS
                    </span>
                  </div>
                </div>

                {/* Métricas Reais da Rota */}
                <div className="grid grid-cols-4 gap-2 py-2 px-2.5 rounded-xl bg-black/40 border border-white/5 my-3 text-center font-mono-stat">
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase font-bold">DISTÂNCIA</div>
                    <div className="text-sm font-black text-yellow-400 mt-0.5">
                      {distance.toFixed(2)}
                    </div>
                    <div className="text-[8px] text-slate-500">KM</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase font-bold">DURAÇÃO</div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {formatDuration(duration)}
                    </div>
                    <div className="text-[8px] text-slate-500">TEMPO</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase font-bold">VEL. MÉD.</div>
                    <div className="text-sm font-black text-slate-200 mt-0.5">
                      {avgSpeed.toFixed(1)}
                    </div>
                    <div className="text-[8px] text-slate-500">KM/H</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase font-bold">VEL. MÁX.</div>
                    <div className="text-sm font-black text-cyan-300 mt-0.5">
                      {maxSpeed.toFixed(1)}
                    </div>
                    <div className="text-[8px] text-slate-500">KM/H</div>
                  </div>
                </div>

                {/* Botões de Ação: VISUALIZAR RASTRO NO MAPA & REFAZER ROTA */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  {onSelectSessionOnMap && (
                    <button
                      type="button"
                      id={`btn-view-route-${session.id}`}
                      onClick={() => onSelectSessionOnMap(session)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-yellow-400/40 text-yellow-400 font-black text-xs uppercase font-mono-stat tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <Map className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>VER NO MAPA</span>
                    </button>
                  )}

                  {onRedoSession && (
                    <button
                      type="button"
                      id={`btn-redo-route-${session.id}`}
                      onClick={() => onRedoSession(session)}
                      className="flex-1 py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase font-mono-stat tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(252,232,3,0.25)] active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>REFAZER ROTA</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
