import React from 'react';
import {
  Crosshair,
  Plus,
  Gauge,
  Flag,
  Navigation,
  X,
  Route as RouteIcon,
  Target,
  Zap,
  MapPin,
  Compass,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Square,
  Activity,
  TrendingUp,
  History,
  RotateCcw,
  Swords,
  ZapOff,
} from 'lucide-react';
import { ActivitySession, Challenge, SessionStatus, SkateRoute, UserProfile, Zone, ZoneConquestProgress, UserEnergy } from '../types';
import { EnergyService } from '../services/energyService';

interface SkaterHudProps {
  user: UserProfile;
  zones: Zone[];
  activeZones?: Zone[];
  conquestProgresses?: ZoneConquestProgress[];
  onSimulateTestStep?: (zoneId: string) => void;
  onCenterUser: () => void;
  onOpenCreateZone: () => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  selectedZone: Zone | null;
  selectedRoute?: SkateRoute | null;
  onClearRoute?: () => void;
  selectedChallenge?: Challenge | null;
  onClearChallenge?: () => void;
  onFocusChallenge?: () => void;
  sessionDistanceKm?: number;
  sessionDuration?: number;
  sessionCurrentSpeedKmH?: number;
  sessionMaxSpeedKmH?: number;
  isSessionActive?: boolean;
  isSessionPaused?: boolean;
  sessionStatus?: SessionStatus;
  onStartSession?: () => void;
  onPauseSession?: () => void;
  onResumeSession?: () => void;
  onEndSession?: () => void;
  isGpsActive?: boolean;
  viewedHistoricalSession?: ActivitySession | null;
  redoReferenceSession?: ActivitySession | null;
  onCloseViewedTrack?: () => void;
  isRedoMode?: boolean;
  onStartRedoRoute?: (session: ActivitySession) => void;
  onExitRedoMode?: () => void;
  onOpenRotas?: () => void;
  onOpenDesafios?: () => void;
  onOpenNearbyZones?: () => void;
  energy?: UserEnergy;
  onOpenEnergy?: () => void;
}

export const SkaterHud: React.FC<SkaterHudProps> = ({
  user,
  zones,
  activeZones = [],
  conquestProgresses = [],
  onSimulateTestStep,
  onCenterUser,
  onOpenCreateZone,
  activeFilter,
  onSelectFilter,
  selectedZone,
  selectedRoute,
  onClearRoute,
  selectedChallenge,
  onClearChallenge,
  onFocusChallenge,
  sessionDistanceKm = 0.0,
  sessionDuration = 0,
  sessionCurrentSpeedKmH = 0.0,
  sessionMaxSpeedKmH = 0.0,
  isSessionActive = false,
  isSessionPaused = false,
  sessionStatus,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession,
  isGpsActive = true,
  viewedHistoricalSession = null,
  redoReferenceSession = null,
  onCloseViewedTrack,
  isRedoMode = false,
  onStartRedoRoute,
  onExitRedoMode,
  onOpenRotas,
  onOpenDesafios,
  onOpenNearbyZones,
  energy,
  onOpenEnergy,
}) => {
  const [isChallengeBannerMinimized, setIsChallengeBannerMinimized] = React.useState(false);

  // Format duration into 00:00:00 or 00:00
  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formattedDistance =
    sessionDistanceKm < 1.0
      ? `${Math.round(sessionDistanceKm * 1000)} m`
      : `${sessionDistanceKm.toFixed(2)} km`;

  // Reset minimized state when a new challenge is selected
  React.useEffect(() => {
    if (selectedChallenge) {
      setIsChallengeBannerMinimized(false);
    }
  }, [selectedChallenge?.id]);

  const handleFocusClick = () => {
    // Hide big explanation banner to clear the map view
    setIsChallengeBannerMinimized(true);
    if (onFocusChallenge) {
      onFocusChallenge();
    }
  };

  const userControlledCount = zones.filter(
    (z) =>
      (z.status !== 'free' &&
        z.controller &&
        (z.controller.nickname === user.nickname || z.controller.name === user.name)) ||
      (z.controllerNickname === user.nickname)
  ).length;

  const filters = ['Todas', 'Livres', 'Em Disputa', 'Dominadas', 'Alta Atividade', 'Próximas'];

  return (
    <>
      {/* Top Header Controls: GPS Status & Category Filters */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Top Status Strip */}
        <div className="flex items-center justify-between pointer-events-auto gap-2">
          {/* GPS Radar indicator & Active Session REC Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#000000]/95 border-2 border-yellow-500/50 rounded-xl shadow-lg  shrink-0">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isGpsActive ? 'bg-yellow-400' : 'bg-amber-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isGpsActive ? 'bg-yellow-400' : 'bg-amber-400'}`}></span>
              </span>
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider font-mono-stat">
                {isGpsActive ? 'GPS CONECTADO' : 'BUSCANDO GPS'}
              </span>
            </div>

            {/* Active or Paused Session REC / PAUSE badge */}
            {isSessionActive && (
              isSessionPaused || sessionStatus === 'PAUSED' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/90 border-2 border-amber-400 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.4)]  animate-pulse">
                  <Pause className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-[10px] font-black text-amber-300 tracking-wider font-mono-stat">
                    PAUSADO {formatDuration(sessionDuration)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/90 border-2 border-red-500 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)]  animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-red-400 tracking-wider font-mono-stat">
                    ● REC {formatDuration(sessionDuration)}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Active Challenge Status Badge / Reopen button */}
          {selectedChallenge && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/90 border-2 border-amber-400/80 rounded-xl shadow-lg  animate-in fade-in min-w-0">
              <button
                onClick={() => setIsChallengeBannerMinimized((prev) => !prev)}
                className="flex items-center gap-1.5 text-left truncate"
                title="Alternar detalhes do desafio"
              >
                <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold text-amber-300 truncate max-w-[130px] font-mono-stat uppercase">
                  {selectedChallenge.title}
                </span>
                {isChallengeBannerMinimized && (
                  <span className="px-1 py-0.2 text-[8px] bg-amber-400 text-black font-black rounded font-mono-stat shrink-0">
                    DETALHES
                  </span>
                )}
              </button>
              {onClearChallenge && (
                <button
                  onClick={onClearChallenge}
                  className="p-0.5 ml-1 text-slate-400 hover:text-white rounded bg-white/10 shrink-0"
                  title="Fechar visualização de desafio"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Active Route Status Badge */}
          {selectedRoute && !selectedChallenge && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/90 border-2 border-cyan-400/80 rounded-xl shadow-lg  animate-in fade-in min-w-0">
              <RouteIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] font-bold text-cyan-300 truncate max-w-[130px] font-mono-stat uppercase">
                {selectedRoute.name}
              </span>
              {onClearRoute && (
                <button
                  onClick={onClearRoute}
                  className="p-0.5 ml-1 text-slate-400 hover:text-white rounded bg-white/10 shrink-0"
                  title="Fechar visualização de rota"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Viewed Historical Session Status Badge */}
          {viewedHistoricalSession && !isSessionActive && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#090d12]/95 border-2 border-[#fce803] rounded-xl shadow-[0_0_15px_rgba(252,232,3,0.4)]  animate-in fade-in min-w-0">
              <History className="w-3.5 h-3.5 text-[#fce803] shrink-0" />
              <span className="text-[10px] font-bold text-[#fce803] truncate max-w-[130px] font-mono-stat uppercase">
                {viewedHistoricalSession.title || `PATINAÇÃO #${viewedHistoricalSession.sessionNumber || 1}`}
              </span>
              {onCloseViewedTrack && (
                <button
                  onClick={onCloseViewedTrack}
                  className="p-0.5 ml-1 text-slate-400 hover:text-white rounded bg-white/10 shrink-0"
                  title="Fechar rastro histórico"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          {filters.map((category) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                id={`filter-btn-${category.toLowerCase()}`}
                onClick={() => onSelectFilter(category)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all duration-200 shadow-md ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(252,232,3,0.4)] scale-105 border-2 border-yellow-400'
                    : 'bg-[#050505]/90 text-slate-300 border-2 border-white/10 hover:border-yellow-500/50 hover:text-white '
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Active Zone Presence Notification Indicator (ETAPA 3) */}
        {isSessionActive && activeZones.length > 0 && (
          <div className="flex flex-col gap-1.5 pointer-events-auto mt-0.5 animate-in fade-in slide-in-from-top-2 duration-300">
            {activeZones.map((az) => {
              const azColor = az.color || az.accentColor || '#00FF66';
              return (
                <div
                  key={az.id}
                  id={`active-zone-pill-${az.id}`}
                  className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-2xl bg-[#000000]/95 border-2 shadow-[0_4px_25px_rgba(0,0,0,0.8)] "
                  style={{ borderColor: azColor }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex h-3 w-3 shrink-0">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80"
                        style={{ backgroundColor: azColor }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-3 w-3"
                        style={{ backgroundColor: azColor }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider font-mono-stat flex items-center gap-1"
                          style={{ color: azColor }}
                        >
                          <Flag className="w-3 h-3" /> ZONA ATIVA
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono-stat">
                          • Você entrou nesta zona
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-white uppercase font-display leading-tight truncate">
                        {az.name}
                      </span>
                    </div>
                  </div>

                  <span
                    className="px-2 py-0.5 text-[9px] font-black uppercase rounded-md text-black font-mono-stat shrink-0"
                    style={{ backgroundColor: azColor }}
                  >
                    {az.type?.toUpperCase() || 'STREET'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Free Zone Conquest Progress Card (ETAPA 4) */}
        {isSessionActive && conquestProgresses.length > 0 && (
          <div className="flex flex-col gap-2 pointer-events-auto mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
            {conquestProgresses.map((cp) => {
              const percent = Math.min(100, Math.round((cp.accumulatedDistanceMeters / cp.minDistanceMeters) * 100));
              const isConquered = cp.isConquered || percent >= 100;
              const displayMeters = Math.min(Math.round(cp.accumulatedDistanceMeters), cp.minDistanceMeters);

              return (
                <div
                  key={cp.zoneId}
                  id={`conquest-card-${cp.zoneId}`}
                  className={`p-3 rounded-2xl bg-[#000000]/98 border-2 shadow-[0_10px_35px_rgba(0,0,0,0.9)]  transition-all duration-300 ${
                    isConquered
                      ? 'border-yellow-400 shadow-[0_0_30px_rgba(252,232,3,0.4)]'
                      : 'border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="relative flex h-2.5 w-2.5 shrink-0">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isConquered ? 'bg-yellow-400' : 'bg-amber-400'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            isConquered ? 'bg-yellow-400' : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider font-mono-stat flex items-center gap-1 truncate ${
                          isConquered ? 'text-yellow-400' : 'text-amber-400'
                        }`}
                      >
                        {isConquered ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-yellow-400" /> ZONA CONQUISTADA!
                          </>
                        ) : (
                          <>
                            <Swords className="w-3 h-3 text-white animate-pulse" /> EM DISPUTA
                          </>
                        )}
                      </span>
                    </div>

                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded font-mono-stat shrink-0 ${
                        isConquered
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      }`}
                    >
                      {isConquered ? 'CONTROLADA' : 'EM DISPUTA'}
                    </span>
                  </div>

                  {/* Zone Name */}
                  <div className="text-xs sm:text-sm font-black text-white uppercase font-display truncate mb-2">
                    {cp.zoneName}
                  </div>

                  {/* Metric & Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono-stat">
                      <span className="text-slate-300 font-bold">
                        {displayMeters} / {cp.minDistanceMeters} m
                      </span>
                      <span className={`font-black ${isConquered ? 'text-yellow-400' : 'text-amber-400'}`}>
                        {percent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden p-[1px] border border-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isConquered
                            ? 'bg-yellow-400 shadow-[0_0_12px_#fce803]'
                            : 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Test Mode Simulator Button */}
                  {onSimulateTestStep && !isConquered && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[9px] text-slate-400 font-mono-stat font-medium">
                        Modo de teste:
                      </span>
                      <button
                        type="button"
                        onClick={() => onSimulateTestStep(cp.zoneId)}
                        className="px-2.5 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 text-[9px] font-black uppercase font-mono-stat active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        title="Adicionar 25m dentro da zona no modo de teste"
                      >
                        <Zap className="w-2.5 h-2.5 text-yellow-400" />
                        +25m na Zona
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Viewed Historical Session Floating Info Card / Redo Route */}
        {viewedHistoricalSession && !isSessionActive && (
          <div className="pointer-events-auto mt-1">
            <div className="p-3.5 rounded-2xl bg-[#090d12]/95 border-2 border-[#fce803] shadow-[0_0_30px_rgba(252,232,3,0.35)]  flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-[#fce803]/20 text-[#fce803] border border-[#fce803]/40 shrink-0">
                    {isRedoMode ? <RotateCcw className="w-4 h-4" /> : <History className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-white uppercase font-display truncate">
                        {isRedoMode
                          ? `REFAZER: ${viewedHistoricalSession.title || `PATINAÇÃO #${viewedHistoricalSession.sessionNumber || 1}`}`
                          : (viewedHistoricalSession.title || `PATINAÇÃO #${viewedHistoricalSession.sessionNumber || 1}`)}
                      </span>
                      <span className="text-[8px] font-black text-[#fce803] font-mono-stat px-1.5 py-0.5 rounded bg-[#fce803]/10 border border-[#fce803]/30 shrink-0">
                        {isRedoMode ? 'MODO REPETIÇÃO' : 'HISTÓRICO'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono-stat font-medium mt-0.5 truncate">
                      {(viewedHistoricalSession.distance ?? viewedHistoricalSession.distanceKm ?? 0) < 1.0
                        ? `${Math.round((viewedHistoricalSession.distance ?? viewedHistoricalSession.distanceKm ?? 0) * 1000)} m`
                        : `${(viewedHistoricalSession.distance ?? viewedHistoricalSession.distanceKm ?? 0).toFixed(2)} km`} • {formatDuration(viewedHistoricalSession.duration ?? viewedHistoricalSession.durationSeconds ?? 0)} • Máx {(viewedHistoricalSession.maxSpeed ?? viewedHistoricalSession.maxSpeedKmH ?? 0).toFixed(1)} km/h
                    </p>
                  </div>
                </div>

                {onCloseViewedTrack && (
                  <button
                    type="button"
                    id="btn-close-viewed-track"
                    onClick={onCloseViewedTrack}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/20 active:scale-95 transition-all shrink-0 cursor-pointer"
                    title={isRedoMode ? 'Sair do modo refazer rota e voltar ao mapa' : 'Ocultar rastro e voltar ao mapa normal'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action area: "REFAZER ROTA" or Navigation state info */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                {!isRedoMode ? (
                  <>
                    <span className="text-[10px] text-slate-400 font-mono-stat flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#fce803]" />
                      {(viewedHistoricalSession.gpsPoints?.length ?? viewedHistoricalSession.track?.length ?? 0)} pts no percurso
                    </span>
                    {onStartRedoRoute && (
                      <button
                        type="button"
                        id="btn-start-redo-route"
                        onClick={() => onStartRedoRoute(viewedHistoricalSession)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#fce803] hover:bg-[#fce803]/90 text-black font-black text-xs font-mono-stat border border-[#fce803] shadow-[0_0_15px_rgba(252,232,3,0.4)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Entrar no modo de repetição deste percurso"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>REFAZER ROTA</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#fce803] font-mono-stat font-semibold flex items-center gap-1">
                      <Navigation className="w-3 h-3 animate-pulse" />
                      Visualizando percurso para repetição
                    </span>
                    <button
                      type="button"
                      id="btn-exit-redo-mode"
                      onClick={onCloseViewedTrack}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] font-mono-stat border border-white/20 active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>SAIR DO MODO</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Controls (Right Side) */}
      <div
        className={`absolute right-3.5 z-20 flex flex-col items-center gap-2.5 transition-all duration-300 ${
          selectedZone || (selectedChallenge && !isChallengeBannerMinimized) || selectedRoute
            ? 'bottom-80'
            : isSessionActive
            ? 'bottom-48'
            : 'bottom-36'
        }`}
      >
        {/* Explore / Nearby Zones List Button */}
        {onOpenNearbyZones && (
          <button
            id="btn-explore-zones"
            onClick={onOpenNearbyZones}
            title="Explorar e Ver Lista de Zonas"
            className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#000000]/95 border border-white/15 text-white shadow-[0_6px_20px_rgba(0,0,0,0.8)] transition-all duration-150 hover:border-yellow-400 hover:text-yellow-400 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-md text-[8px] font-black bg-neutral-900 text-yellow-300 border border-yellow-500/40 font-mono-stat">
              {zones.length}
            </span>
            <span className="sr-only">Explorar Zonas</span>
          </button>
        )}

        {/* Center on User Location Button */}
        <button
          id="btn-center-user"
          onClick={onCenterUser}
          title="Centralizar no Patinador"
          className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#000000]/95 border border-white/15 text-white shadow-[0_6px_20px_rgba(0,0,0,0.8)] transition-all duration-150 hover:border-yellow-400 hover:text-yellow-400 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Crosshair className="w-5 h-5 transition-transform group-hover:rotate-45" />
          <span className="sr-only">Centralizar no Usuário</span>
        </button>

                {/* Create Zone Floating Action Button ("+") - DESABILITADO NA FASE 1
        <button
          id="btn-create-zone"
          onClick={onOpenCreateZone}
          title="Reivindicar ou Criar Nova Zona"
          className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-b from-yellow-300 to-yellow-500 text-black shadow-[0_4px_16px_rgba(252,232,3,0.5)] font-black transition-all duration-150 hover:scale-105 active:scale-95 border border-yellow-200 cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[3] transition-transform group-hover:rotate-90 duration-200" />
          <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-md text-[7px] font-black bg-black text-yellow-400 border border-yellow-400 font-mono-stat leading-none">
            +ZONA
          </span>
          <span className="sr-only">Criar Zona</span>
        </button>
        */}
      </div>

      {/* ACTIVE CHALLENGE CARD OVERLAY (Triggered by "BORA!!") */}
      {selectedChallenge && !isChallengeBannerMinimized && (
        <div className="absolute bottom-4 inset-x-3 z-30 pointer-events-auto max-w-md mx-auto">
          <div
            id="active-challenge-hud-panel"
            className="p-4 rounded-2xl bg-[#000000]/98 border-2 border-amber-400/90 shadow-[0_15px_40px_rgba(251,191,36,0.35)]  animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black text-[9px] uppercase font-mono-stat tracking-wider">
                  MISSÃO ATIVA
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-400 font-bold text-[9px] uppercase font-mono-stat">
                  {selectedChallenge.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-stat">
                  <Clock className="w-3 h-3 text-slate-400" /> {selectedChallenge.expiresIn}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-400/40 font-mono-stat shrink-0 shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                +{selectedChallenge.rewardXp} XP
              </div>
            </div>

            <h3 className="text-base font-black text-white uppercase font-display leading-tight">
              {selectedChallenge.title}
            </h3>

            {/* Target Location */}
            {selectedChallenge.targetZoneName && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-yellow-400 font-mono-stat font-bold">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>LOCAL ALVO: <span className="underline">{selectedChallenge.targetZoneName}</span></span>
              </div>
            )}

            {/* Objective & Instructions Box */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase font-mono-stat block">
                  🎯 OBJETIVO:
                </span>
                <p className="text-slate-200 font-medium leading-snug">
                  {selectedChallenge.objective || selectedChallenge.description}
                </p>
              </div>

              {selectedChallenge.instructions && (
                <div className="pt-1.5 border-t border-white/10">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono-stat block">
                    📋 INSTRUÇÕES:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedChallenge.instructions}
                  </p>
                </div>
              )}

              {selectedChallenge.mainRequirement && (
                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between font-mono-stat text-[11px]">
                  <span className="text-slate-400 uppercase font-bold">REQUISITO PRINCIPAL:</span>
                  <span className="text-yellow-400 font-black">{selectedChallenge.mainRequirement}</span>
                </div>
              )}
            </div>

            {/* Action buttons: FOCAR NO ALVO & FECHAR */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                id="btn-focus-challenge-target"
                onClick={handleFocusClick}
                className="flex-1 py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase font-mono-stat tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(252,232,3,0.4)] active:scale-95 transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                FOCAR NO ALVO
              </button>

              {onClearChallenge && (
                <button
                  type="button"
                  onClick={onClearChallenge}
                  className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase font-mono-stat border border-white/10 active:scale-95 transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  FECHAR
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CHALLENGE MINIMIZED PILL (When user clicked "Focar no alvo") */}
      {selectedChallenge && isChallengeBannerMinimized && (
        <div className="absolute bottom-20 inset-x-3 z-30 pointer-events-auto max-w-sm mx-auto animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#000000]/95 border-2 border-yellow-400 shadow-[0_8px_30px_rgba(252,232,3,0.3)] ">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-yellow-400 text-black font-black">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-yellow-400 font-mono-stat uppercase flex items-center gap-1">
                  <span>ALVO ATIVO</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                </div>
                <div className="text-xs font-bold text-white uppercase font-display truncate">
                  {selectedChallenge.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsChallengeBannerMinimized(false)}
                className="px-2.5 py-1 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 font-black text-[10px] uppercase font-mono-stat border border-yellow-400/50 active:scale-95"
              >
                VER GUIA
              </button>
              {onClearChallenge && (
                <button
                  onClick={onClearChallenge}
                  className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 active:scale-95"
                  title="Fechar desafio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE ROUTE CARD OVERLAY (Triggered by "Ver no mapa") */}
      {selectedRoute && !selectedChallenge && (
        <div className="absolute bottom-4 inset-x-3 z-30 pointer-events-auto max-w-md mx-auto">
          <div
            id="active-route-hud-panel"
            className="p-4 rounded-2xl bg-[#000000]/98 border-2 border-yellow-400/90 shadow-[0_15px_40px_rgba(252,232,3,0.35)]  animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-black text-[9px] uppercase font-mono-stat tracking-wider">
                  {selectedRoute.isCircuit ? 'CIRCUITO FECHADO' : 'RASTRO GPS SELECIONADO'}
                </span>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/20 border border-cyan-400/40 px-2 py-0.5 rounded font-mono-stat uppercase">
                  {selectedRoute.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-400/40 font-mono-stat shrink-0">
                <Zap className="w-3.5 h-3.5" />
                +{selectedRoute.points} XP
              </div>
            </div>

            <h3 className="text-base font-black text-white uppercase font-display leading-tight">
              {selectedRoute.name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1 font-medium">
              <Compass className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">{selectedRoute.location}</span>
            </div>

            {/* Quick Metrics strip */}
            <div className="grid grid-cols-3 gap-2 mt-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center font-mono-stat">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">DISTÂNCIA</div>
                <div className="text-sm font-black text-yellow-400">{selectedRoute.distanceKm} KM</div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-[9px] text-slate-400 uppercase font-bold">TEMPO EST.</div>
                <div className="text-sm font-black text-amber-400">~{selectedRoute.estimatedTimeMin} MIN</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">ASFALTO</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{selectedRoute.asphaltQuality}</div>
              </div>
            </div>

            {/* Route itinerary endpoints */}
            <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between font-mono-stat">
              <span className="truncate text-slate-400">
                {selectedRoute.startPointName ? `🚩 ${selectedRoute.startPointName}` : 'Ponto Inicial'}
              </span>
              <span className="text-yellow-400 px-1 font-bold">➔</span>
              <span className="truncate text-slate-400">
                {selectedRoute.endPointName ? `🎯 ${selectedRoute.endPointName}` : 'Ponto Final'}
              </span>
            </div>

            {/* Close button */}
            <div className="mt-3 flex items-center justify-end">
              {onClearRoute && (
                <button
                  type="button"
                  onClick={onClearRoute}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase font-mono-stat border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  FECHAR ROTA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE SKATING ACTIVITY HUD (Item 8: VELOCIDADE, DISTÂNCIA, TEMPO, MÁXIMA) */}
      {/* ========================================================================= */}
      {isSessionActive && !selectedZone && (!selectedChallenge || isChallengeBannerMinimized) && !selectedRoute && (
        <div className="absolute bottom-4 inset-x-3 z-20 pointer-events-none">
          <div
            className={`pointer-events-auto max-w-md mx-auto flex flex-col gap-2 p-3 bg-[#000000]/98 border-2 rounded-2xl  animate-in slide-in-from-bottom duration-300 ${
              isSessionPaused || sessionStatus === 'PAUSED'
                ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.3)]'
                : 'border-[#fce803] shadow-[0_0_40px_rgba(252,232,3,0.35)]'
            }`}
          >
            {/* Live Status Bar + Pause / Resume / End Controls */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                {isSessionPaused || sessionStatus === 'PAUSED' ? (
                  <>
                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                    </span>
                    <span className="text-[10px] font-black text-amber-300 tracking-wider font-mono-stat uppercase truncate">
                      SESSÃO PAUSADA
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fce803] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fce803]"></span>
                    </span>
                    <span className="text-[10px] font-black text-[#fce803] tracking-wider font-mono-stat uppercase truncate">
                      {redoReferenceSession
                        ? `REFAZENDO: ${redoReferenceSession.title || `PATINAÇÃO #${redoReferenceSession.sessionNumber || 1}`}`
                        : 'SESSÃO ATIVA EM CURSO'}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons: Pause/Resume + End Session */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isSessionPaused || sessionStatus === 'PAUSED' ? (
                  onResumeSession && (
                    <button
                      type="button"
                      id="btn-resume-skate-session"
                      onClick={onResumeSession}
                      className="px-2.5 py-1.5 rounded-xl bg-[#fce803] hover:bg-[#00e55b] text-black font-mono-stat font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(252,232,3,0.4)] active:scale-95 transition-all cursor-pointer"
                      title="Retomar a contagem e gravação da sessão"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      RETOMAR
                    </button>
                  )
                ) : (
                  onPauseSession && (
                    <button
                      type="button"
                      id="btn-pause-skate-session"
                      onClick={onPauseSession}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/60 font-mono-stat font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(251,191,36,0.25)] active:scale-95 transition-all cursor-pointer"
                      title="Pausar cronômetro da sessão"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      PAUSAR
                    </button>
                  )
                )}

                {/* End Session Button */}
                {onEndSession && (
                  <button
                    type="button"
                    id="btn-end-skate-session"
                    onClick={onEndSession}
                    className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/60 font-mono-stat font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 transition-all cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    ENCERRAR
                  </button>
                )}
              </div>
            </div>

            {/* 4-Metric Grid: VELOCIDADE, DISTÂNCIA, TEMPO, MÁXIMA */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono-stat">
              {/* 1. Velocidade Atual */}
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">VELOCIDADE</div>
                <div className="text-base font-black text-white leading-none mt-1">
                  {sessionCurrentSpeedKmH.toFixed(1)}
                </div>
                <div className="text-[8px] text-[#fce803] font-bold mt-0.5">KM/H</div>
              </div>

              {/* 2. Distância */}
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">DISTÂNCIA</div>
                <div className="text-base font-black text-[#fce803] leading-none mt-1">
                  {formattedDistance}
                </div>
                <div className="text-[8px] text-slate-400 font-bold mt-0.5">TOTAL</div>
              </div>

              {/* 3. Tempo */}
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">TEMPO</div>
                <div className="text-base font-black text-amber-400 leading-none mt-1">
                  {formatDuration(sessionDuration)}
                </div>
                <div className="text-[8px] text-slate-400 font-bold mt-0.5">CRONÔM.</div>
              </div>

              {/* 4. Velocidade Máxima */}
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">MÁXIMA</div>
                <div className="text-base font-black text-cyan-300 leading-none mt-1">
                  {sessionMaxSpeedKmH.toFixed(1)}
                </div>
                <div className="text-[8px] text-slate-400 font-bold mt-0.5">KM/H</div>
              </div>
            </div>

            {/* Live Energy & Remaining Time Sub-strip */}
            {onOpenEnergy && (
              <button
                type="button"
                id="btn-hud-live-energy"
                onClick={onOpenEnergy}
                className="w-full mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-left cursor-pointer group select-none"
                title="Energia do Patinador (Toque para detalhes)"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${
                    (energy?.current ?? 100) <= 0
                      ? 'text-red-400'
                      : isSessionPaused
                      ? 'text-cyan-400'
                      : 'text-yellow-400 fill-yellow-400 animate-pulse'
                  }`} />
                  <span className="text-[10px] font-mono-stat font-black text-slate-300 group-hover:text-yellow-400 transition-colors">
                    ENERGIA: <strong className={(energy?.current ?? 100) <= 0 ? 'text-red-400' : 'text-white'}>{Math.round(Math.max(0, energy?.current ?? 100))}%</strong>
                  </span>
                  {(energy?.current ?? 100) <= 0 ? (
                    <span className="text-[9px] font-mono-stat font-bold px-1.5 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-500/40">
                      ESGOTADA
                    </span>
                  ) : isSessionPaused ? (
                    <span className="text-[9px] font-mono-stat font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      CONGELADA
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] font-mono-stat transition-colors ${
                  (energy?.current ?? 100) <= 0
                    ? 'text-red-400 font-bold'
                    : 'text-slate-400 group-hover:text-white'
                }`}>
                  {EnergyService.formatRemainingTime(energy?.current ?? 100)}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEFAULT HUD BAR & PRIMARY ACTION BUTTON (INICIAR) */}
      {/* ========================================================================= */}
      {!isSessionActive && !selectedZone && (!selectedChallenge || isChallengeBannerMinimized) && !selectedRoute && (
        <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-md mx-auto flex items-center justify-between gap-3 p-2.5 rounded-[32px] bg-[#000000]/95 border-2 border-[#fce803] shadow-[0_0_20px_rgba(252,232,3,0.3)] ">
            
            {/* LEFT: ROTA */}
            {onOpenRotas && (
              <button
                type="button"
                onClick={onOpenRotas}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#ea580c]/30 hover:bg-[#ea580c]/50 border border-[#ea580c]/60 hover:border-[#ea580c] transition-all active:scale-95 shrink-0 min-w-[70px] cursor-pointer"
              >
                <Navigation className="w-5 h-5 text-white mb-1" />
                <span className="text-[10px] font-black text-slate-100 uppercase font-mono-stat tracking-wider">Rota</span>
              </button>
            )}

            {/* CENTER: INICIAR / SEM ENERGIA */}
            {onStartSession && (
              energy && energy.current <= 0 ? (
                <button
                  type="button"
                  id="btn-start-skate-session-empty"
                  onClick={onOpenEnergy || onStartSession}
                  className="flex-1 py-3 px-4 rounded-2xl bg-red-950/60 border-2 border-red-500/80 text-red-300 font-black text-base uppercase font-display tracking-wider flex items-center justify-center cursor-pointer select-none active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                  title="Você está sem energia. Toque para recarregar."
                >
                  <div className="flex items-center gap-2">
                    <ZapOff className="w-5 h-5 text-red-400" />
                    <span className="mt-0.5">SEM ENERGIA</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-start-skate-session"
                  onClick={onStartSession}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#fce803] text-black font-black text-lg uppercase font-display tracking-widest flex items-center justify-center cursor-pointer select-none active:scale-95 shadow-[0_0_20px_rgba(252,232,3,0.4)] transition-all"
                  style={{ borderBottom: '4px solid #c4b502' }}
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current stroke-[3]" />
                    <span className="mt-0.5">INICIAR</span>
                  </div>
                </button>
              )
            )}

            {/* RIGHT: DESAFIO */}
            {onOpenDesafios && (
              <button
                type="button"
                onClick={onOpenDesafios}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#ea580c]/30 hover:bg-[#ea580c]/50 border border-[#ea580c]/60 hover:border-[#ea580c] transition-all active:scale-95 shrink-0 min-w-[70px] cursor-pointer"
              >
                <Swords className="w-5 h-5 text-white mb-1" />
                <span className="text-[10px] font-black text-slate-100 uppercase font-mono-stat tracking-wider">Desafio</span>
              </button>
            )}

          </div>
        </div>
      )}
    </>
  );
};
