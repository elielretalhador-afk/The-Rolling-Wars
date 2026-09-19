import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  History,
  X,
  Calendar,
  Clock,
  Zap,
  Gauge,
  MapPin,
  Flag,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Filter,
  Trophy,
  Shield,
  Activity,
  Play,
  Pause,
  FastForward,
  Share2,
  Maximize2,
  Cloud,
  CloudOff,
  AlertCircle
} from 'lucide-react';
import { ActivitySession, ActivityTrackPoint } from '../types';
import { toValidLatLngTuple } from './MapView';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionHistory: ActivitySession[];
  onSelectHistoricalSession: (session: ActivitySession) => void;
  onRedoSession?: (session: ActivitySession) => void;
  initialSelectedSession?: ActivitySession | null;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  sessionHistory,
  onSelectHistoricalSession,
  onRedoSession,
  initialSelectedSession = null,
}) => {
  const [selectedSession, setSelectedSession] = useState<ActivitySession | null>(initialSelectedSession);
  const [filterMode, setFilterMode] = useState<'ALL' | 'ZONES' | 'LONGEST' | 'FASTEST'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map reference for the detail view embedded map
  const detailMapContainerRef = useRef<HTMLDivElement>(null);
  const detailMapInstanceRef = useRef<L.Map | null>(null);
  const detailMapLayersRef = useRef<{
    polyline?: L.Polyline;
    glowPolyline?: L.Polyline;
    startMarker?: L.CircleMarker | L.Marker;
    endMarker?: L.CircleMarker | L.Marker;
    pointMarkers?: L.CircleMarker[];
    skaterMarker?: L.Marker;
  }>({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(30); // Multiplicador de velocidade (30x default)
  const animationRef = useRef<number | null>(null);
  const currentPlaybackTimeRef = useRef<number>(0);

  // Sync initial selected session when modal opens or prop changes
  useEffect(() => {
    if (initialSelectedSession) {
      setSelectedSession(initialSelectedSession);
    }
  }, [initialSelectedSession, isOpen]);

  // Clean up detail map on unmount or session deselect
  useEffect(() => {
    if (!selectedSession && detailMapInstanceRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
      currentPlaybackTimeRef.current = 0;
      detailMapInstanceRef.current.remove();
      detailMapInstanceRef.current = null;
    }
  }, [selectedSession]);

  // Initialize and update embedded detail map when selectedSession changes
  useEffect(() => {
    if (!isOpen || !selectedSession || !detailMapContainerRef.current) return;

    const track = selectedSession.gpsPoints || selectedSession.track || [];
    const validCoords: [number, number][] = track
      .map((pt) => toValidLatLngTuple([pt.latitude, pt.longitude]))
      .filter((pt): pt is [number, number] => pt !== null);

    if (validCoords.length === 0) return;

    // Destroy existing instance if container already initialized
    if (detailMapInstanceRef.current) {
      detailMapInstanceRef.current.remove();
      detailMapInstanceRef.current = null;
    }

    const startCoord = validCoords[0];
    const map = L.map(detailMapContainerRef.current, {
      center: startCoord,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      /* className removed to fix GPU artifact */
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    // Glow polyline
    const glowPolyline = L.polyline(validCoords, {
      color: '#fce803',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Solid polyline
    const polyline = L.polyline(validCoords, {
      color: '#fce803',
      weight: 4,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: undefined,
    }).addTo(map);

    // Start marker (Green pulsing dot)
    const startMarker = L.circleMarker(startCoord, {
      radius: 7,
      fillColor: '#fce803',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(map);
    startMarker.bindTooltip('Início da Patinação', { permanent: false, direction: 'top' });

    // End marker (Checkered/Cyan finish dot)
    const endCoord = validCoords[validCoords.length - 1];
    const endMarker = L.circleMarker(endCoord, {
      radius: 8,
      fillColor: '#00e5ff',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(map);
    endMarker.bindTooltip('Fim da Sessão', { permanent: false, direction: 'top' });

    // Custom Icon for Playback
    const skaterIconHtml = `
      <div style="
        width: 24px; 
        height: 24px; 
        background: #fce803; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 10px rgba(252,232,3,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18c1.5 0 3-1 4-3s1-5 4-5 5 1 5 3-1 3-3 3-3-1-3-3"/></svg>
      </div>
    `;
    const skaterIcon = L.divIcon({
      html: skaterIconHtml,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const skaterMarker = L.marker(startCoord, {
      icon: skaterIcon,
      zIndexOffset: 1000,
    });
    
    // initially hidden until we play
    skaterMarker.setOpacity(0);
    skaterMarker.addTo(map);

    detailMapLayersRef.current = {
      polyline,
      glowPolyline,
      startMarker,
      endMarker,
      skaterMarker,
    };

    detailMapInstanceRef.current = map;

    // Fit bounds smoothly
    try {
      const bounds = L.latLngBounds(validCoords as L.LatLngTuple[]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    } catch (e) {
      console.warn('Could not fit bounds on detail map', e);
    }

    return () => {
      if (detailMapInstanceRef.current) {
        detailMapInstanceRef.current.remove();
        detailMapInstanceRef.current = null;
      }
    };
  }, [isOpen, selectedSession?.id]);

  if (!isOpen) return null;

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleTogglePlayback = () => {
    if (!selectedSession || !detailMapInstanceRef.current || !detailMapLayersRef.current.skaterMarker) return;
    const track = selectedSession.gpsPoints || selectedSession.track || [];
    const validTrack = track.filter(pt => pt.latitude != null && pt.longitude != null && pt.timestamp != null);
    
    if (validTrack.length < 2) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    setIsPlaying(true);
    const skaterMarker = detailMapLayersRef.current.skaterMarker;
    const map = detailMapInstanceRef.current;
    skaterMarker.setOpacity(1);

    let startAnimTime: number | null = null;
    const firstPt = validTrack[0];
    const lastPt = validTrack[validTrack.length - 1];
    
    // total real duration of the track in ms
    const realDurationMs = lastPt.timestamp - firstPt.timestamp;
    
    // Reset if we are at the end
    if (currentPlaybackTimeRef.current >= realDurationMs) {
      currentPlaybackTimeRef.current = 0;
    }

    const initialPlaybackTime = currentPlaybackTimeRef.current;

    const animate = (timestamp: number) => {
      if (!startAnimTime) startAnimTime = timestamp;
      const elapsedVirtualTime = (timestamp - startAnimTime) * playbackSpeed;
      
      currentPlaybackTimeRef.current = initialPlaybackTime + elapsedVirtualTime;

      // Target timestamp in the track
      const targetTrackTime = firstPt.timestamp + currentPlaybackTimeRef.current;

      // Find the segment we are in
      let p1 = validTrack[0];
      let p2 = validTrack[1];
      let found = false;

      for (let i = 0; i < validTrack.length - 1; i++) {
        if (targetTrackTime >= validTrack[i].timestamp && targetTrackTime <= validTrack[i+1].timestamp) {
          p1 = validTrack[i];
          p2 = validTrack[i+1];
          found = true;
          break;
        }
      }

      if (!found && targetTrackTime >= lastPt.timestamp) {
        // Finished
        skaterMarker.setLatLng(toValidLatLngTuple([lastPt.latitude, lastPt.longitude]) as L.LatLngTuple);
        setIsPlaying(false);
        currentPlaybackTimeRef.current = realDurationMs; // cap at end
        setTimeout(() => {
          skaterMarker.setOpacity(0);
          currentPlaybackTimeRef.current = 0; // reset for next play
        }, 1500);
        return;
      }

      if (found) {
        const segDuration = p2.timestamp - p1.timestamp;
        const progress = segDuration === 0 ? 0 : (targetTrackTime - p1.timestamp) / segDuration;
        
        const lat = p1.latitude + (p2.latitude - p1.latitude) * progress;
        const lng = p1.longitude + (p2.longitude - p1.longitude) * progress;
        
        skaterMarker.setLatLng([lat, lng]);
        
        // update map center if running off-screen optionally, but for now just move marker
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleChangeSpeed = () => {
    setPlaybackSpeed(prev => {
      if (prev === 30) return 60;
      if (prev === 60) return 120;
      if (prev === 120) return 300;
      return 30;
    });
  };

  // Formatters
  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    }
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  const formatTimeClock = (timestamp?: number | null) => {
    if (!timestamp) return '--:--';
    const d = new Date(timestamp);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateFull = (timestamp?: number | null, fallbackFormatted?: string) => {
    if (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase();
    }
    return fallbackFormatted || 'SESSÃO REGISTRADA';
  };

  // Aggregated Stats
  const totalSessionsCount = sessionHistory.length;
  const totalDistanceKm = sessionHistory.reduce(
    (acc, s) => acc + (s.distance ?? s.distanceKm ?? 0),
    0
  );
  const totalDurationSeconds = sessionHistory.reduce(
    (acc, s) => acc + (s.duration ?? s.durationSeconds ?? 0),
    0
  );
  const topMaxSpeed = sessionHistory.reduce(
    (max, s) => Math.max(max, s.maxSpeed ?? s.maxSpeedKmH ?? 0),
    0
  );
  const totalZonesConquered = sessionHistory.reduce(
    (acc, s) => acc + (s.zonesConquered?.length ?? 0),
    0
  );

  // Filtered Sessions
  const filteredSessions = sessionHistory
    .filter((s) => {
      if (filterMode === 'ZONES') {
        const hasConquered = (s.zonesConquered?.length ?? 0) > 0;
        const hasVisited = (s.zonesVisited?.length ?? 0) > 0;
        if (!hasConquered && !hasVisited) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (s.title || '').toLowerCase().includes(q);
        const routeMatch = (s.routeName || '').toLowerCase().includes(q);
        const zoneMatch = (s.zonesConquered || []).some((z) => z.toLowerCase().includes(q));
        if (!titleMatch && !routeMatch && !zoneMatch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filterMode === 'LONGEST') {
        return (b.distance ?? b.distanceKm ?? 0) - (a.distance ?? a.distanceKm ?? 0);
      }
      if (filterMode === 'FASTEST') {
        return (b.maxSpeed ?? b.maxSpeedKmH ?? 0) - (a.maxSpeed ?? a.maxSpeedKmH ?? 0);
      }
      // Default: Most recent first
      const timeA = a.startedAt || 0;
      const timeB = b.startedAt || 0;
      return timeB - timeA;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85  animate-in fade-in duration-200">
      <div
        id="session-history-modal-container"
        className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-gradient-to-b from-[#050505] via-[#090d14] to-[#06090e] border-2 border-[#fce803]/50 shadow-[0_0_50px_rgba(252,232,3,0.25)] flex flex-col overflow-hidden text-white"
      >
        {/* Neon Ambient Header Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#fce803]/15 rounded-full blur-3xl pointer-events-none" />

        {/* TOP BAR */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {selectedSession ? (
              <button
                type="button"
                id="btn-back-to-history-list"
                onClick={() => setSelectedSession(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all flex items-center gap-1 text-xs font-mono-stat cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-2xl bg-[#fce803]/20 border border-[#fce803]/50 text-[#fce803] shadow-[0_0_15px_rgba(252,232,3,0.3)]">
                <History className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-wide truncate">
                  {selectedSession ? selectedSession.title || 'DETALHES DA PATINAÇÃO' : 'HISTÓRICO DE PATINAÇÕES'}
                </h2>
                {!selectedSession && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#fce803]/20 text-[#fce803] border border-[#fce803]/40 font-mono-stat shrink-0">
                    {totalSessionsCount} {totalSessionsCount === 1 ? 'ROLÊ' : 'ROLÊS'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono-stat">
                {selectedSession
                  ? `${formatDateFull(selectedSession.startedAt, selectedSession.dateFormatted)} • ${formatDuration(selectedSession.duration ?? selectedSession.durationSeconds ?? 0)}`
                  : 'Consulte seu histórico de percursos, velocidades e zonas conquistadas'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-history-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
            title="Fechar histórico"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ========================================================= */}
          {/* VIEW A: DETALHE DE UMA SESSÃO SELECIONADA */}
          {/* ========================================================= */}
          {selectedSession ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#101b2a] via-[#0a0a0a] to-[#0b111a] border border-[#fce803]/30 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-[#fce803] uppercase tracking-widest font-mono-stat block">
                      RESUMO DA SESSÃO
                    </span>
                    <h3 className="text-xl font-black text-white uppercase font-display mt-0.5">
                      {selectedSession.title || 'PATINAÇÃO CONCLUÍDA'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono-stat flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                        {formatDateFull(selectedSession.startedAt, selectedSession.dateFormatted)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {formatTimeClock(selectedSession.startedAt)} → {formatTimeClock(selectedSession.endedAt)}
                      </span>
                    </div>
                  </div>

                  {selectedSession.xpEarned > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-center shrink-0 font-mono-stat">
                      <div className="text-[9px] font-bold uppercase text-amber-400">XP GANHO</div>
                      <div className="text-base font-black flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{selectedSession.xpEarned}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sync Status Banner */}
                {selectedSession.syncStatus === 'synced' ? (
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-green-500/10 border border-green-500/30 mt-4">
                    <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wide">
                      <Cloud className="w-4 h-4" />
                      Atividade enviada e aguardando validação
                    </div>
                    <div className="text-[11px] text-green-300/80 leading-snug">
                      Seu rolê foi sincronizado com sucesso. O servidor está verificando a atividade antes de registrar permanentemente o resultado competitivo.
                    </div>
                  </div>
                ) : selectedSession.syncStatus === 'error' ? (
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-red-500/10 border border-red-500/30 mt-4">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide">
                      <AlertCircle className="w-4 h-4" />
                      Sincronização falhou
                    </div>
                    <div className="text-[11px] text-red-300/80 leading-snug">
                      Não foi possível enviar sua atividade. Seus dados estão seguros e serão reenviados automaticamente quando houver conexão.
                    </div>
                  </div>
                ) : selectedSession.syncStatus === 'pending' ? (
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 mt-4 animate-pulse">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wide">
                      <CloudOff className="w-4 h-4 animate-bounce" />
                      Sincronizando...
                    </div>
                    <div className="text-[11px] text-blue-300/80 leading-snug">
                      Aguarde enquanto enviamos sua atividade para os servidores.
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Interactive Detail Map Container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/15 bg-[#000000] shadow-inner">
                <div
                  ref={detailMapContainerRef}
                  id="historical-detail-leaflet-map"
                  className="w-full h-56 sm:h-64 z-0"
                />

                {/* Map Floating Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
                  <div className="px-2.5 py-1 rounded-lg bg-black/80  border border-[#fce803]/50 text-[10px] font-mono-stat font-bold text-[#fce803] flex items-center gap-1 shadow-md">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {(selectedSession.gpsPoints?.length || selectedSession.track?.length || 0)} PONTOS GPS
                    </span>
                  </div>
                  {selectedSession.routeName && (
                    <div className="px-2.5 py-1 rounded-lg bg-black/80  border border-cyan-400/50 text-[10px] font-mono-stat font-bold text-cyan-300 flex items-center gap-1 shadow-md">
                      <Activity className="w-3 h-3" />
                      <span>{selectedSession.routeName}</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlayback}
                    className={`px-3 py-1.5 rounded-xl border ${isPlaying ? 'bg-[#fce803] text-black border-[#fce803]' : 'bg-black/80 text-white border-white/20 hover:border-[#fce803] hover:text-[#fce803]'} text-[11px] font-mono-stat font-bold active:scale-95 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleChangeSpeed}
                    className="px-2 py-1.5 rounded-xl bg-black/80 border border-white/20 hover:border-amber-400 text-amber-400 text-[10px] font-mono-stat font-bold active:scale-95 transition-all flex items-center gap-1 shadow-lg cursor-pointer"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>{playbackSpeed}x</span>
                  </button>
                </div>

                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectHistoricalSession(selectedSession);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/80  border border-white/20 hover:border-[#fce803] text-white hover:text-[#fce803] text-[11px] font-mono-stat font-bold active:scale-95 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Expandir no Mapa</span>
                  </button>
                </div>
              </div>

              {/* Detailed Performance Statistics Grid (4 Key Pillars) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-stat">
                {/* 1. Distância */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#fce803]" />
                    Distância
                  </span>
                  <div className="text-xl font-black text-[#fce803] mt-2">
                    {(selectedSession.distance ?? selectedSession.distanceKm ?? 0).toFixed(2)}{' '}
                    <span className="text-xs font-normal text-slate-400">km</span>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">
                    {Math.round((selectedSession.distance ?? selectedSession.distanceKm ?? 0) * 1000)} metros
                  </span>
                </div>

                {/* 2. Duração */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Duração
                  </span>
                  <div className="text-xl font-bold text-white mt-2">
                    {formatDuration(selectedSession.duration ?? selectedSession.durationSeconds ?? 0)}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">
                    Tempo total em movimento
                  </span>
                </div>

                {/* 3. Vel. Máxima */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Vel. Máxima
                  </span>
                  <div className="text-xl font-black text-cyan-300 mt-2">
                    {(selectedSession.maxSpeed ?? selectedSession.maxSpeedKmH ?? 0).toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">km/h</span>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">
                    Pico de velocidade
                  </span>
                </div>

                {/* 4. Vel. Média */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                    Vel. Média
                  </span>
                  <div className="text-xl font-bold text-yellow-300 mt-2">
                    {(selectedSession.averageSpeed ?? selectedSession.avgSpeedKmH ?? 0).toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">km/h</span>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">
                    Ritmo mantido
                  </span>
                </div>
              </div>

              {/* ZONAS REGISTRADAS NA SESSÃO */}
              <div className="p-4 rounded-2xl bg-[#0b121c] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono-stat">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    ZONAS E TERRITÓRIOS NA SESSÃO ({selectedSession.zonesVisited?.length || selectedSession.zonesConquered?.length || 0})
                  </h4>
                </div>

                {(selectedSession.zonesVisited && selectedSession.zonesVisited.length > 0) ? (
                  <div className="space-y-2">
                    {selectedSession.zonesVisited.map((zone, idx) => (
                      <div
                        key={`${zone.zoneId}-${idx}`}
                        className="p-3 rounded-xl bg-black/40 border border-yellow-500/30 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center font-bold text-sm">
                            📍
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white uppercase font-display">
                              {zone.zoneName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono-stat">
                              {zone.durationSeconds ? `${Math.round(zone.durationSeconds / 60)} min dentro da zona` : 'Presença confirmada'}
                              {zone.distanceMeters ? ` • ${zone.distanceMeters}m percorridos` : ''}
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono-stat bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                          {zone.status === 'conquered' ? 'CONQUISTADA' : 'VISITADA'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : selectedSession.zonesConquered && selectedSession.zonesConquered.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSession.zonesConquered.map((zName, idx) => (
                      <div
                        key={`conq-${idx}`}
                        className="p-3 rounded-xl bg-black/40 border border-yellow-500/30 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-bold text-white uppercase font-display">{zName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono-stat bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                          CONQUISTADA
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Nenhuma zona conquistada especificamente durante esta sessão.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  id="btn-view-historical-session-on-main-map"
                  onClick={() => {
                    onSelectHistoricalSession(selectedSession);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#fce803] hover:bg-[#00e55b] text-black font-black text-xs uppercase font-mono-stat tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(252,232,3,0.4)] active:scale-95 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 stroke-[3]" />
                  <span>VER RASTRO NO MAPA PRINCIPAL</span>
                </button>

                {onRedoSession && (
                  <button
                    type="button"
                    id="btn-redo-historical-session"
                    onClick={() => {
                      onRedoSession(selectedSession);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase font-mono-stat border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    title="Tentar bater o tempo desta sessão no mesmo trajeto"
                  >
                    <Play className="w-3.5 h-3.5 text-[#fce803]" />
                    <span>REPETIR ROTA</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW B: LISTAGEM DE TODAS AS SESSÕES ANTERIORES */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Overall Summary Stats Header */}
              {totalSessionsCount > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#101b2a] via-[#0a0a0a] to-[#0a1018] border border-white/10 shadow-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-stat">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">TOTAL DE ROLÊS</span>
                      <span className="text-lg font-black text-white mt-1 block">{totalSessionsCount}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">KM ACUMULADOS</span>
                      <span className="text-lg font-black text-[#fce803] mt-1 block">{totalDistanceKm.toFixed(1)} km</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">TEMPO NO ASFALTO</span>
                      <span className="text-lg font-bold text-amber-300 mt-1 block">{formatDuration(totalDurationSeconds)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">RECORDE VELOCIDADE</span>
                      <span className="text-lg font-black text-cyan-300 mt-1 block">{topMaxSpeed.toFixed(1)} km/h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters Bar */}
              {totalSessionsCount > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono-stat text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterMode('ALL')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      filterMode === 'ALL'
                        ? 'bg-[#fce803]/20 text-[#fce803] border-[#fce803]/60 font-black'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Todos ({totalSessionsCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('ZONES')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      filterMode === 'ZONES'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60 font-black'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Com Zonas
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('LONGEST')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      filterMode === 'LONGEST'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-black'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Maior Distância
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('FASTEST')}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      filterMode === 'FASTEST'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-black'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Maior Velocidade
                  </button>
                </div>
              )}

              {/* Sessions List */}
              {filteredSessions.length > 0 ? (
                <div className="space-y-3">
                  {filteredSessions.map((session, idx) => {
                    const sessionNum = session.sessionNumber || (sessionHistory.length - idx);
                    const title = session.title || `PATINAÇÃO #${sessionNum}`;
                    const distVal = session.distance ?? session.distanceKm ?? 0;
                    const formattedDist = distVal < 1.0 ? `${Math.round(distVal * 1000)} m` : `${distVal.toFixed(2)} km`;
                    const durationVal = session.duration ?? session.durationSeconds ?? 0;
                    const maxSpeedVal = session.maxSpeed ?? session.maxSpeedKmH ?? 0;
                    const avgSpeedVal = session.averageSpeed ?? session.avgSpeedKmH ?? 0;
                    const pointsCount = session.gpsPoints?.length || session.track?.length || 0;
                    const conqueredCount = session.zonesConquered?.length ?? 0;
                    const visitedCount = session.zonesVisited?.length ?? 0;
                    const xpVal = session.xpEarned ?? 0;

                    return (
                      <div
                        key={session.id || `session-${idx}`}
                        id={`history-item-${session.id}`}
                        onClick={() => setSelectedSession(session)}
                        className="p-4 rounded-2xl bg-gradient-to-b from-[#111a26] to-[#090f17] border-2 border-white/10 hover:border-[#fce803]/60 transition-all duration-200 shadow-xl cursor-pointer group active:scale-[0.99]"
                      >
                        {/* Header: Title + Date + Badges */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="p-1.5 rounded-lg bg-[#fce803]/15 text-[#fce803] border border-[#fce803]/30">
                                <Activity className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-sm font-black text-white uppercase font-display tracking-tight group-hover:text-[#fce803] transition-colors">
                                {title}
                              </span>
                              {idx === 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#fce803]/20 text-[#fce803] border border-[#fce803]/40 font-mono-stat">
                                  MAIS RECENTE
                                </span>
                              )}
                              {session.syncStatus === 'pending' && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/40 font-mono-stat animate-pulse" title="Aguardando sincronização">
                                  <CloudOff className="w-3 h-3" /> PENDENTE
                                </span>
                              )}
                              {session.syncStatus === 'synced' && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-green-500/20 text-green-400 border border-green-500/40 font-mono-stat" title="Sincronizado e aguardando validação">
                                  <Cloud className="w-3 h-3" /> VALIDAÇÃO PENDENTE
                                </span>
                              )}
                              {session.syncStatus === 'error' && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/40 font-mono-stat" title="Erro de sincronização">
                                  <AlertCircle className="w-3 h-3" /> ERRO SYNC
                                </span>
                              )}
                              {xpVal > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono-stat">
                                  +{xpVal} XP
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono-stat flex-wrap">
                              <span className="flex items-center gap-1 text-slate-300">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                {formatDateFull(session.startedAt, session.dateFormatted)}
                              </span>
                              {pointsCount > 0 && (
                                <span className="text-slate-500">
                                  • {pointsCount} pontos GPS
                                </span>
                              )}
                              {conqueredCount > 0 && (
                                <span className="text-yellow-400 font-bold">
                                  • {conqueredCount} {conqueredCount === 1 ? 'zona conquistada' : 'zonas conquistadas'}
                                </span>
                              )}
                              {conqueredCount === 0 && visitedCount > 0 && (
                                <span className="text-cyan-300">
                                  • {visitedCount} {visitedCount === 1 ? 'zona visitada' : 'zonas visitadas'}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-mono-stat font-bold text-slate-400 group-hover:text-[#fce803] transition-colors shrink-0">
                            <span className="hidden sm:inline">Detalhes</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Stats Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono-stat">
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="text-[9px] text-slate-400 uppercase font-bold">Distância</div>
                            <div className="text-base font-black text-[#fce803] mt-1">{formattedDist}</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="text-[9px] text-slate-400 uppercase font-bold">Duração</div>
                            <div className="text-base font-bold text-white mt-1">{formatDuration(durationVal)}</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="text-[9px] text-slate-400 uppercase font-bold">Vel. Máx</div>
                            <div className="text-base font-bold text-cyan-300 mt-1">{maxSpeedVal.toFixed(1)} km/h</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="text-[9px] text-slate-400 uppercase font-bold">Vel. Média</div>
                            <div className="text-base font-bold text-yellow-300 mt-1">{avgSpeedVal.toFixed(1)} km/h</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="p-8 rounded-3xl bg-[#050505] border-2 border-white/10 text-center space-y-3 my-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fce803]/10 border border-[#fce803]/30 flex items-center justify-center text-[#fce803] shadow-[0_0_20px_rgba(252,232,3,0.15)]">
                    <History className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black text-white uppercase font-display">
                    NENHUMA PATINAÇÃO ENCONTRADA
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Você ainda não possui sessões de patinação registradas com os filtros atuais. Inicie uma patinação no mapa para gravar sua rota e conquistar zonas!
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      id="btn-empty-start-skate"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-[#fce803] hover:bg-[#00e55b] text-black font-black text-xs uppercase font-mono-stat tracking-wider active:scale-95 transition-all shadow-[0_0_15px_rgba(252,232,3,0.35)] cursor-pointer"
                    >
                      IR PARA O MAPA E PATINAR
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
