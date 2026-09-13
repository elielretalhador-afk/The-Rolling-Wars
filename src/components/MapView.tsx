import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ActivitySession, ActivityTrackPoint, Challenge, LiveChallenge, SkateRoute, UserProfile, Zone } from '../types';

// Robust helper to parse and validate latitude and longitude numbers
export const toValidLatLngTuple = (coords: any): [number, number] | null => {
  if (!coords) return null;
  if (Array.isArray(coords)) {
    if (coords.length < 2) return null;
    const lat = typeof coords[0] === 'number' ? coords[0] : parseFloat(coords[0]);
    const lng = typeof coords[1] === 'number' ? coords[1] : parseFloat(coords[1]);
    if (
      typeof lat === 'number' &&
      !isNaN(lat) &&
      isFinite(lat) &&
      lat >= -90 &&
      lat <= 90 &&
      typeof lng === 'number' &&
      !isNaN(lng) &&
      isFinite(lng) &&
      lng >= -180 &&
      lng <= 180
    ) {
      return [lat, lng];
    }
    return null;
  }
  if (typeof coords === 'object' && coords !== null) {
    const rawLat = coords.lat ?? coords.latitude ?? coords.Lat ?? coords.Latitude;
    const rawLng = coords.lng ?? coords.longitude ?? coords.lon ?? coords.Lng ?? coords.Longitude;
    if (rawLat !== undefined && rawLng !== undefined) {
      const lat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat);
      const lng = typeof rawLng === 'number' ? rawLng : parseFloat(rawLng);
      if (
        typeof lat === 'number' &&
        !isNaN(lat) &&
        isFinite(lat) &&
        lat >= -90 &&
        lat <= 90 &&
        typeof lng === 'number' &&
        !isNaN(lng) &&
        isFinite(lng) &&
        lng >= -180 &&
        lng <= 180
      ) {
        return [lat, lng];
      }
    }
  }
  return null;
};

export const isValidLatLng = (coords: any): coords is [number, number] => {
  return toValidLatLngTuple(coords) !== null;
};

export const DEFAULT_CENTER: [number, number] = [-23.5558, -46.6608];

// Defensive global patch to prevent Leaflet from ever throwing "Invalid LatLng object: (NaN, NaN)"
try {
  if (typeof window !== 'undefined' && (L as any) && (L as any).latLng) {
    const originalLatLng = (L as any).latLng;
    const patchedLatLng = function (a: any, b?: any, c?: any) {
      try {
        if (a instanceof (L as any).LatLng) {
          if (isNaN(a.lat) || isNaN(a.lng)) {
            return new (L as any).LatLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
          }
          return a;
        }
        if (Array.isArray(a)) {
          const lat = parseFloat(a[0]);
          const lng = parseFloat(a[1]);
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            return new (L as any).LatLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
          }
          return new (L as any).LatLng(lat, lng, a[2]);
        }
        if (typeof a === 'object' && a !== null) {
          const rawLat = a.lat ?? a.latitude;
          const rawLng = a.lng ?? a.longitude ?? a.lon;
          const lat = parseFloat(rawLat);
          const lng = parseFloat(rawLng);
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            return new (L as any).LatLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
          }
          return new (L as any).LatLng(lat, lng, a.alt);
        }
        const lat = parseFloat(a);
        const lng = parseFloat(b);
        if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
          return new (L as any).LatLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
        return originalLatLng.call(L, lat, lng, c);
      } catch (err) {
        return new (L as any).LatLng(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
      }
    };
    (L as any).latLng = patchedLatLng;
  }
} catch (e) {
  // Silent fallback
}

interface MapViewProps {
  user: UserProfile;
  userCoords?: [number, number] | null;
  playerLocation?: { latitude: number; longitude: number } | null;
  activityTrack?: ActivityTrackPoint[];
  viewedHistoricalSession?: ActivitySession | null;
  redoReferenceSession?: ActivitySession | null;
  isRedoMode?: boolean;
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
  selectedRoute?: SkateRoute | null;
  selectedChallenge?: Challenge | null;
  liveChallenge?: LiveChallenge | null;
  isCreatingZone?: boolean;
  drawnPath?: [number, number][];
  onPickCoordinateForNewZone?: (coords: [number, number]) => void;
  centerTrigger: number;
  focusChallengeTrigger?: number;
}

export const MapView: React.FC<MapViewProps> = ({
  user,
  userCoords,
  playerLocation,
  activityTrack = [],
  viewedHistoricalSession = null,
  redoReferenceSession = null,
  isRedoMode = false,
  zones,
  selectedZone,
  onSelectZone,
  selectedRoute,
  selectedChallenge,
  liveChallenge = null,
  isCreatingZone,
  drawnPath = [],
  onPickCoordinateForNewZone,
  centerTrigger,
  focusChallengeTrigger = 0,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const hasInitiallyCenteredRef = useRef<boolean>(false);
  const zoneLayersRef = useRef<{ [id: string]: { layer: L.Layer; marker: L.Marker } }>({});
  const drawingLayerRef = useRef<L.Layer | null>(null);
  const routeLayersRef = useRef<{
    polyline?: L.Polyline;
    glowPolyline?: L.Polyline;
    startMarker?: L.Marker;
    endMarker?: L.Marker;
    waypointMarkers?: L.CircleMarker[];
  }>({});
  const challengeLayersRef = useRef<{
    circle?: L.Circle;
    beaconMarker?: L.Marker;
    glowPolyline?: L.Polyline;
    polyline?: L.Polyline;
    startMarker?: L.Marker;
    endMarker?: L.Marker;
    waypointMarkers?: L.CircleMarker[];
  }>({});
  const liveChallengeLayersRef = useRef<{
    polyline?: L.Polyline;
    glowPolyline?: L.Polyline;
    startMarker?: L.Marker;
    endMarker?: L.Marker;
  }>({});
  const liveChallengeParticipantMarkersRef = useRef<{ [playerId: string]: L.Marker }>({});
  const activityLayersRef = useRef<{
    polyline?: L.Polyline;
    glowPolyline?: L.Polyline;
    startMarker?: L.CircleMarker;
    endMarker?: L.CircleMarker;
  }>({});
  const redoReferenceLayersRef = useRef<{
    polyline?: L.Polyline;
    glowPolyline?: L.Polyline;
    startMarker?: L.CircleMarker;
    endMarker?: L.CircleMarker;
  }>({});

  // Resolve current active player coordinates with strict numeric verification
  const getActivePlayerCoords = (): [number, number] | null => {
    if (playerLocation) {
      const coords = toValidLatLngTuple(playerLocation);
      if (coords) return coords;
    }
    if (userCoords) {
      const coords = toValidLatLngTuple(userCoords);
      if (coords) return coords;
    }
    return null;
  };

  const userCoordsRef = useRef<[number, number]>(
    getActivePlayerCoords() || DEFAULT_CENTER
  );
  const currentCoords = getActivePlayerCoords();
  if (currentCoords) {
    userCoordsRef.current = currentCoords;
  }

  // Create custom visual player marker icon with 3-tier fallback
  const createPlayerIcon = () => {
    return L.divIcon({
      className: 'player-custom-marker',
      html: `
        <div class="relative flex items-center justify-center w-14 h-14 pointer-events-none select-none">
          <!-- Level 3 Fallback Base & Pulsing Radar Wave (Always active) -->
          <div class="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#00ff66]/25 animate-neon-ping pointer-events-none"></div>
          <div class="absolute inset-0 m-auto w-10 h-10 rounded-full border-2 border-[#00ff66]/80 skater-radar-pulse pointer-events-none"></div>
          <div class="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#00ff66] shadow-[0_0_12px_#00ff66] pointer-events-none"></div>

          <!-- Circular Player Avatar with Cyberpunk Neon Border -->
          <div class="relative z-10 w-9 h-9 rounded-full overflow-hidden border-2 border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.95)] bg-[#090d12] flex items-center justify-center">
            <!-- Level 2 Fallback: Skater Emoji / Icon -->
            <div class="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#00ff66] bg-[#090d12]">
              🛼
            </div>
            <!-- Level 1: Player Avatar Image (Hides on error to reveal Level 2) -->
            ${
              user.avatar
                ? `<img src="${user.avatar}" alt="${user.nickname || 'Jogador'}" class="relative z-10 w-full h-full object-cover" onerror="this.style.display='none';" />`
                : ''
            }
          </div>

          <!-- "VOCÊ" Pill Badge -->
          <div class="absolute -bottom-1 z-20 px-2 py-0.5 rounded-full bg-[#090d12] border border-[#00ff66] text-[8px] font-black text-[#00ff66] tracking-widest font-mono-stat shadow-lg uppercase whitespace-nowrap">
            VOCÊ
          </div>
        </div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
      popupAnchor: [0, -28],
    });
  };

  const getPlayerPopupContent = () => `
    <div class="p-2 text-left min-w-[140px]">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="inline-block w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
        <span class="text-[10px] font-bold text-[#00ff66] uppercase tracking-widest font-mono-stat">SUA POSIÇÃO GPS</span>
      </div>
      <p class="text-sm font-bold text-white uppercase font-display">${user.nickname}</p>
      <div class="flex items-center justify-between text-[11px] text-neutral-300 mt-1 pt-1.5 border-t border-white/10 gap-3 font-mono-stat font-bold">
        <span>VEL: <b class="text-[#00ff66] font-bold">${user.currentSpeedKmH} KM/H</b></span>
        <span>STREAK: <b class="text-amber-400 font-bold">${user.streakDays}D</b></span>
      </div>
    </div>
  `;

  // Helper to render or update the player marker on the map
  const updatePlayerMarker = (map: L.Map) => {
    if (!map) return;
    const coords = getActivePlayerCoords();
    if (!coords) return;

    try {
      const icon = createPlayerIcon();
      const popupContent = getPlayerPopupContent();

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(coords);
        userMarkerRef.current.setIcon(icon);
        userMarkerRef.current.setPopupContent(popupContent);
      } else {
        const marker = L.marker(coords, { icon, zIndexOffset: 3000 }).addTo(map);
        marker.bindPopup(popupContent, { closeButton: false, autoPan: false });
        userMarkerRef.current = marker;
      }
    } catch (err) {
      console.warn('Error updating player marker:', err);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCoords = getActivePlayerCoords();
    if (initialCoords) {
      hasInitiallyCenteredRef.current = true;
    }
    const initialCenter: [number, number] = initialCoords || DEFAULT_CENTER;

    try {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
        maxZoom: 19,
        minZoom: 10,
      });

      // CartoDB Dark Matter tiles for ultra-slick dark urban aesthetic
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        /* className removed to fix GPU artifact */
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control on top right with custom styling
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;

      // Immediately render player marker when map mounts if coordinates are ready
      updatePlayerMarker(map);

      // Handle map clicks for zone creation
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (
          onPickCoordinateForNewZone &&
          e &&
          e.latlng &&
          typeof e.latlng.lat === 'number' &&
          !isNaN(e.latlng.lat) &&
          isFinite(e.latlng.lat) &&
          typeof e.latlng.lng === 'number' &&
          !isNaN(e.latlng.lng) &&
          isFinite(e.latlng.lng)
        ) {
          onPickCoordinateForNewZone([e.latlng.lat, e.latlng.lng]);
        }
      });

      // Invalidate size to guarantee sharp tiles
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    } catch (err) {
      console.warn('Error initializing map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      userMarkerRef.current = null;
    };
  }, []);

  // One-time Initial Centering on Player's Real GPS Coordinates when acquired
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords = getActivePlayerCoords();
    if (coords && !hasInitiallyCenteredRef.current) {
      hasInitiallyCenteredRef.current = true;
      try {
        map.setView(coords, 16);
      } catch (e) {
        console.warn('SetView error:', e);
      }
      updatePlayerMarker(map);
    }
  }, [playerLocation, userCoords]);

  // Update User Location Marker when GPS / playerLocation or user profile updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    updatePlayerMarker(map);
  }, [
    playerLocation,
    userCoords,
    user.avatar,
    user.nickname,
    user.currentSpeedKmH,
    user.streakDays,
  ]);

  // Render & Update Circular Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old layers no longer in zones list
    Object.keys(zoneLayersRef.current).forEach((id) => {
      if (!zones.find((z) => z.id === id)) {
        const { layer, marker } = zoneLayersRef.current[id];
        if (layer) map.removeLayer(layer);
        if (marker) map.removeLayer(marker);
        delete zoneLayersRef.current[id];
      }
    });

    // Add or update zones
    zones.forEach((zone) => {
      if (!zone) return;
      const centerTuple = toValidLatLngTuple(zone.center);
      if (!centerTuple) return;

      const isSelected = selectedZone?.id === zone.id;
      const zoneColor = zone.color || zone.accentColor || '#00FF66';
      const isContested = zone.status === 'contested' || zone.contested;
      const isFree = zone.status === 'free' || !zone.controller;
      const dominanceValue = zone.dominance !== undefined ? zone.dominance : (zone.dominancePercent ?? 0);
      const controllerData = zone.controller;
      const controllerAvatar = controllerData?.avatar || zone.controllerAvatar;
      const controllerNick = controllerData?.nickname || controllerData?.name || zone.controllerNickname || '';

      // Center Zone Pin Marker Icon
      const effectiveBorderColor = isContested ? '#f59e0b' : isFree ? '#00FF66' : zoneColor;
      const rawActivity = (zone.activityLevel || (zone.skatersCount && zone.skatersCount >= 15 ? 'HIGH' : zone.skatersCount && zone.skatersCount >= 6 ? 'MEDIUM' : 'LOW')).toUpperCase();
      const isHighActivity = rawActivity === 'HIGH' || rawActivity === 'ALTA';
      const isMediumActivity = rawActivity === 'MEDIUM' || rawActivity === 'MEDIA';

      const zoneIcon = L.divIcon({
        className: 'custom-zone-marker',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transform transition-transform hover:scale-110 select-none">
            <!-- Zone Name & Status Tag Pill -->
            <div class="px-2 py-0.5 mb-1 rounded-md bg-[#090d14]/95 border shadow-lg flex items-center gap-1.5"
                 style="border-color: ${effectiveBorderColor}90;">
              <!-- Activity Indicator Pulse / Glow -->
              <span class="relative flex h-2 w-2">
                ${isHighActivity ? `
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80" style="background-color: ${effectiveBorderColor};"></span>
                ` : ''}
                <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: ${effectiveBorderColor};"></span>
              </span>
              
              <span class="text-[10px] font-black text-white whitespace-nowrap font-display uppercase tracking-tight">${zone.name.split(' ')[0]}</span>
              
              ${isFree ? `
                <span class="px-1 py-0.2 text-[8px] font-black bg-yellow-500/20 text-emerald-300 border border-yellow-400/30 rounded font-mono-stat uppercase">LIVRE</span>
              ` : isContested ? `
                <span class="px-1 py-0.2 text-[8px] font-black bg-amber-500/30 text-amber-300 border border-amber-400/50 rounded font-mono-stat uppercase animate-pulse">DISPUTA</span>
              ` : `
                <span class="px-1 py-0.2 text-[8px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded font-mono-stat uppercase">DOMÍNIO</span>
              `}

              ${isHighActivity ? `
                <span class="text-[8px] font-black text-orange-400 font-mono-stat" title="Alta Atividade">🔥</span>
              ` : ''}
            </div>

            <!-- Emblem / Controller Avatar Pin -->
            <div class="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#0a0f16] border-2 shadow-xl"
                 style="border-color: ${effectiveBorderColor}; box-shadow: 0 0 14px ${effectiveBorderColor}66;">
              ${isContested ? `
                <div class="w-6 h-6 rounded-lg bg-amber-950/80 flex items-center justify-center text-xs">
                  ⚔️
                </div>
                <div class="absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-black bg-amber-500 text-black font-mono-stat">
                  DISP
                </div>
              ` : !isFree && controllerAvatar ? `
                <img src="${controllerAvatar}" alt="${controllerNick}" class="w-6 h-6 rounded-lg object-cover" />
                <div class="absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-black text-black font-mono-stat" style="background-color: ${zoneColor};">
                  ${dominanceValue}%
                </div>
              ` : `
                <div class="w-6 h-6 rounded-lg bg-emerald-950/80 flex items-center justify-center text-xs">
                  🏳️
                </div>
                <div class="absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-black bg-emerald-950 text-emerald-300 border border-yellow-500/30 font-mono-stat">
                  LIVRE
                </div>
              `}
            </div>
          </div>
        `,
        iconSize: [110, 62],
        iconAnchor: [55, 54],
      });

      const zoneRadius = typeof zone.radius === 'number' && !isNaN(zone.radius) && zone.radius > 0 ? zone.radius : 300;

      try {
        if (!zoneLayersRef.current[zone.id]) {
          let layer: L.Layer;
             
          if (zone.shape === 'segment' && zone.path && zone.path.length > 1) {
            layer = L.polyline(zone.path as L.LatLngExpression[], {
              color: effectiveBorderColor,
              weight: isSelected ? 4 : 3,
              opacity: 0.9,
              dashArray: isContested ? '8, 8' : isFree ? '6, 6' : undefined,
              className: 'transition-all duration-300',
            }).addTo(map);
          } else if (zone.shape === 'zone' && zone.path && zone.path.length > 2) {
            layer = L.polygon(zone.path as L.LatLngExpression[], {
              color: effectiveBorderColor,
              weight: isSelected ? 3.5 : isContested ? 2.5 : 2,
              opacity: 0.85,
              fillColor: effectiveBorderColor,
              fillOpacity: isSelected ? 0.26 : isContested ? 0.22 : 0.16,
              dashArray: isContested ? '6, 6' : isFree ? '4, 4' : undefined,
              className: 'transition-all duration-300',
            }).addTo(map);
          } else {
            layer = L.circle(centerTuple, {
              radius: zoneRadius,
              color: effectiveBorderColor,
              weight: isSelected ? 3.5 : isContested ? 2.5 : 2,
              opacity: 0.85,
              fillColor: effectiveBorderColor,
              fillOpacity: isSelected ? 0.26 : isContested ? 0.22 : 0.16,
              dashArray: isContested ? '6, 6' : isFree ? '4, 4' : undefined,
              className: 'transition-all duration-300',
            }).addTo(map);
          }

          layer.on('click', () => {
            onSelectZone(zone);
          });

          const marker = L.marker(centerTuple, { icon: zoneIcon }).addTo(map);

          marker.on('click', () => {
            onSelectZone(zone);
          });

          zoneLayersRef.current[zone.id] = { layer, marker };
        } else {
          // Update existing layer styling and icon
          const { layer, marker } = zoneLayersRef.current[zone.id];
          if (layer) {
            if (layer instanceof L.Circle || layer instanceof L.Polygon || layer instanceof L.Polyline) {
              (layer as L.Path).setStyle({
                color: effectiveBorderColor,
                weight: isSelected ? 3.5 : isContested ? 2.5 : 2,
                opacity: 0.85,
                fillOpacity: isSelected ? 0.26 : isContested ? 0.22 : 0.16,
                fillColor: effectiveBorderColor,
                dashArray: isContested ? '6, 6' : isFree ? '4, 4' : undefined,
              });
            }
            if (layer instanceof L.Circle) {
              layer.setRadius(zoneRadius);
              layer.setLatLng(centerTuple);
            } else if ((layer as any).setLatLngs && zone.path) {
              (layer as any).setLatLngs(zone.path);
            }
          }
          if (marker) {
            marker.setIcon(zoneIcon);
            marker.setLatLng(centerTuple);
          }
        }
      } catch (err) {
        console.warn('Error updating zone layer:', err);
      }
    });
  }, [zones, selectedZone, user.nickname, onSelectZone]);

  // Render & Highlight Selected Route on Map based on full GPS Track sequence
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up previous route layers
    if (routeLayersRef.current.glowPolyline) {
      map.removeLayer(routeLayersRef.current.glowPolyline);
      routeLayersRef.current.glowPolyline = undefined;
    }
    if (routeLayersRef.current.polyline) {
      map.removeLayer(routeLayersRef.current.polyline);
      routeLayersRef.current.polyline = undefined;
    }
    if (routeLayersRef.current.startMarker) {
      map.removeLayer(routeLayersRef.current.startMarker);
      routeLayersRef.current.startMarker = undefined;
    }
    if (routeLayersRef.current.endMarker) {
      map.removeLayer(routeLayersRef.current.endMarker);
      routeLayersRef.current.endMarker = undefined;
    }
    if (routeLayersRef.current.waypointMarkers) {
      routeLayersRef.current.waypointMarkers.forEach((m) => map.removeLayer(m));
      routeLayersRef.current.waypointMarkers = undefined;
    }

    if (!selectedRoute) return;

    const rawPath = selectedRoute.path || [];
    let pathCoords: [number, number][] = rawPath
      .map(toValidLatLngTuple)
      .filter((pt): pt is [number, number] => pt !== null);

    if (pathCoords.length === 0) {
      const centerTuple = toValidLatLngTuple(selectedRoute.center);
      if (centerTuple) {
        pathCoords = [
          [centerTuple[0] - 0.005, centerTuple[1] - 0.005],
          centerTuple,
          [centerTuple[0] + 0.005, centerTuple[1] + 0.005],
        ];
      } else {
        return;
      }
    }

    if (pathCoords.length === 0) return;

    const isCircuitRoute =
      selectedRoute.isCircuit ||
      (pathCoords.length > 2 &&
        Math.abs(pathCoords[0][0] - pathCoords[pathCoords.length - 1][0]) < 0.001 &&
        Math.abs(pathCoords[0][1] - pathCoords[pathCoords.length - 1][1]) < 0.001);

    try {
      const leafletCoords = pathCoords as L.LatLngTuple[];

      // Background glowing polyline (translucent neon aura)
      const glowPolyline = L.polyline(leafletCoords, {
        color: '#00FF66',
        weight: 8,
        opacity: 0.20,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Foreground neon polyline (semi-translucent to see street names and details beneath)
      const polyline = L.polyline(leafletCoords, {
        color: '#00FF66',
        weight: 4,
        opacity: 0.65,
        dashArray: '8, 5',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Waypoint dots along the GPS track to emphasize discrete GPS sequence
      const waypointMarkers: L.CircleMarker[] = [];
      pathCoords.forEach((pt, idx) => {
        if (idx > 0 && idx < pathCoords.length - 1) {
          const dot = L.circleMarker(pt, {
            radius: 3,
            color: '#00FF66',
            fillColor: '#080b0e',
            fillOpacity: 0.8,
            opacity: 0.65,
            weight: 1.5,
          }).addTo(map);
          waypointMarkers.push(dot);
        }
      });

      let startMarker: L.Marker | undefined;
      let endMarker: L.Marker | undefined;

      if (isCircuitRoute) {
        // Circuit start / finish single pin
        const circuitIcon = L.divIcon({
          className: 'route-circuit-pin',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0f15] border-2 border-yellow-400 shadow-[0_0_15px_#00ff66] text-white font-black text-xs font-mono-stat">
                🏁
              </div>
              <div class="mt-1 px-2 py-0.5 rounded-md bg-[#0a0f15]/90 border border-yellow-400 text-[8px] font-black text-yellow-400 font-mono-stat uppercase shadow-md whitespace-nowrap">
                LARGADA & CHEGADA (CIRCUITO)
              </div>
            </div>
          `,
          iconSize: [120, 50],
          iconAnchor: [60, 16],
        });
        if (pathCoords.length > 0 && toValidLatLngTuple(pathCoords[0])) {
          startMarker = L.marker(pathCoords[0], { icon: circuitIcon }).addTo(map);
        }
      } else {
        // Start marker (A)
        const startIcon = L.divIcon({
          className: 'route-start-pin',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0f15] border-2 border-yellow-400 shadow-[0_0_14px_#00ff66] text-yellow-400 font-black text-xs font-mono-stat">
                A
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f15]/90 border border-yellow-400 text-[8px] font-black text-yellow-400 font-mono-stat uppercase whitespace-nowrap">
                LARGADA
              </div>
            </div>
          `,
          iconSize: [60, 44],
          iconAnchor: [30, 14],
        });
        if (pathCoords.length > 0 && toValidLatLngTuple(pathCoords[0])) {
          startMarker = L.marker(pathCoords[0], { icon: startIcon }).addTo(map);
        }

        // End marker (B)
        const endIcon = L.divIcon({
          className: 'route-end-pin',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0f15] border-2 border-cyan-400 shadow-[0_0_14px_#00e5ff] text-cyan-300 font-black text-xs font-mono-stat">
                B
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f15]/90 border border-cyan-400 text-[8px] font-black text-cyan-300 font-mono-stat uppercase whitespace-nowrap">
                CHEGADA
              </div>
            </div>
          `,
          iconSize: [60, 44],
          iconAnchor: [30, 14],
        });
        if (pathCoords.length > 1 && toValidLatLngTuple(pathCoords[pathCoords.length - 1])) {
          endMarker = L.marker(pathCoords[pathCoords.length - 1], { icon: endIcon }).addTo(map);
        }
      }

      routeLayersRef.current = {
        glowPolyline,
        polyline,
        startMarker,
        endMarker,
        waypointMarkers,
      };

      // Fly / Fit bounds to the selected route path
      if (pathCoords.length >= 2) {
        const bounds = L.latLngBounds(leafletCoords);
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [60, 60],
            duration: 1.2,
            maxZoom: 15,
          });
        }
      }
    } catch (err) {
      console.warn('Error displaying route on map:', err);
    }
  }, [selectedRoute]);

  
  // Render drawn path for drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isCreatingZone || drawnPath.length === 0) {
      if (drawingLayerRef.current) {
        map.removeLayer(drawingLayerRef.current);
        drawingLayerRef.current = null;
      }
      return;
    }

    if (drawingLayerRef.current) {
      map.removeLayer(drawingLayerRef.current);
    }
    
    // Check if it should be shown as polygon (closed) or polyline
    const isClosed = drawnPath.length >= 3 && (() => {
      const first = drawnPath[0];
      const last = drawnPath[drawnPath.length - 1];
      const R = 6371e3;
      const φ1 = first[0] * Math.PI/180;
      const φ2 = last[0] * Math.PI/180;
      const Δφ = (last[0]-first[0]) * Math.PI/180;
      const Δλ = (last[1]-first[1]) * Math.PI/180;
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c < 60;
    })();

    if (isClosed) {
      drawingLayerRef.current = L.polygon(drawnPath as L.LatLngExpression[], {
        color: '#00ff66',
        weight: 3,
        opacity: 0.9,
        fillColor: '#00ff66',
        fillOpacity: 0.3,
        dashArray: '10, 10'
      }).addTo(map);
    } else {
      drawingLayerRef.current = L.polyline(drawnPath as L.LatLngExpression[], {
        color: '#00ff66',
        weight: 4,
        opacity: 0.9,
        dashArray: '10, 10'
      }).addTo(map);
    }
  }, [drawnPath, isCreatingZone]);

  // Render & Live Update Active Skating Activity GPS Track (Neon green breadcrumb polyline)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const rawCoords: [number, number][] = activityTrack
      .map((pt) => toValidLatLngTuple([pt.latitude, pt.longitude]))
      .filter((pt): pt is [number, number] => pt !== null);

    if (rawCoords.length < 1) {
      if (activityLayersRef.current.glowPolyline) {
        map.removeLayer(activityLayersRef.current.glowPolyline);
        activityLayersRef.current.glowPolyline = undefined;
      }
      if (activityLayersRef.current.polyline) {
        map.removeLayer(activityLayersRef.current.polyline);
        activityLayersRef.current.polyline = undefined;
      }
      if (activityLayersRef.current.startMarker) {
        map.removeLayer(activityLayersRef.current.startMarker);
        activityLayersRef.current.startMarker = undefined;
      }
      if (activityLayersRef.current.endMarker) {
        map.removeLayer(activityLayersRef.current.endMarker);
        activityLayersRef.current.endMarker = undefined;
      }
      return;
    }

    try {
      // 1. Start point marker (where activity was started)
      if (!activityLayersRef.current.startMarker && rawCoords.length >= 1 && toValidLatLngTuple(rawCoords[0])) {
        const startMarker = L.circleMarker(rawCoords[0], {
          radius: 6,
          color: '#00FF66',
          weight: 2,
          fillColor: '#090d12',
          fillOpacity: 1,
          className: 'skater-start-ping',
        }).addTo(map);
        activityLayersRef.current.startMarker = startMarker;
      } else if (activityLayersRef.current.startMarker && rawCoords.length >= 1 && toValidLatLngTuple(rawCoords[0])) {
        activityLayersRef.current.startMarker.setLatLng(rawCoords[0]);
      }

      // 2. Sequential polyline trace (Neon glow + core line using ALL GPS points)
      if (rawCoords.length >= 2) {
        const leafletCoords = rawCoords as L.LatLngTuple[];

        if (activityLayersRef.current.polyline && activityLayersRef.current.glowPolyline) {
          activityLayersRef.current.glowPolyline.setLatLngs(leafletCoords);
          activityLayersRef.current.polyline.setLatLngs(leafletCoords);
        } else {
          const glowPolyline = L.polyline(leafletCoords, {
            color: '#00FF66',
            weight: 8,
            opacity: 0.35,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map);

          const polyline = L.polyline(leafletCoords, {
            color: '#00FF66',
            weight: 4,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map);

          activityLayersRef.current.glowPolyline = glowPolyline;
          activityLayersRef.current.polyline = polyline;
        }

        // 3. End point marker (when viewing historical session)
        if (viewedHistoricalSession && !redoReferenceSession && rawCoords.length > 0) {
          const endCoord = rawCoords[rawCoords.length - 1];
          if (toValidLatLngTuple(endCoord)) {
            if (!activityLayersRef.current.endMarker) {
              const endMarker = L.circleMarker(endCoord, {
                radius: 6,
                color: '#00E5FF',
                weight: 2,
                fillColor: '#090d12',
                fillOpacity: 1,
              }).addTo(map);
              activityLayersRef.current.endMarker = endMarker;
            } else {
              activityLayersRef.current.endMarker.setLatLng(endCoord);
            }
          }
        } else if (activityLayersRef.current.endMarker) {
          map.removeLayer(activityLayersRef.current.endMarker);
          activityLayersRef.current.endMarker = undefined;
        }
      } else if (activityLayersRef.current.endMarker) {
        map.removeLayer(activityLayersRef.current.endMarker);
        activityLayersRef.current.endMarker = undefined;
      }
    } catch (err) {
      console.warn('Error rendering activity track:', err);
    }
  }, [activityTrack, viewedHistoricalSession, redoReferenceSession]);

  // Render & Highlight Redo Route Original Reference Trace (Discreet translucent line + Start & End markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!redoReferenceSession || !redoReferenceSession.track || redoReferenceSession.track.length < 1) {
      if (redoReferenceLayersRef.current.glowPolyline) {
        map.removeLayer(redoReferenceLayersRef.current.glowPolyline);
        redoReferenceLayersRef.current.glowPolyline = undefined;
      }
      if (redoReferenceLayersRef.current.polyline) {
        map.removeLayer(redoReferenceLayersRef.current.polyline);
        redoReferenceLayersRef.current.polyline = undefined;
      }
      if (redoReferenceLayersRef.current.startMarker) {
        map.removeLayer(redoReferenceLayersRef.current.startMarker);
        redoReferenceLayersRef.current.startMarker = undefined;
      }
      if (redoReferenceLayersRef.current.endMarker) {
        map.removeLayer(redoReferenceLayersRef.current.endMarker);
        redoReferenceLayersRef.current.endMarker = undefined;
      }
      return;
    }

    const refCoords: [number, number][] = redoReferenceSession.track
      .map((pt) => toValidLatLngTuple([pt.latitude, pt.longitude]))
      .filter((pt): pt is [number, number] => pt !== null);

    try {
      if (refCoords.length >= 1 && toValidLatLngTuple(refCoords[0])) {
        // 1. Reference Start Marker (Point A)
        if (!redoReferenceLayersRef.current.startMarker) {
          const startMarker = L.circleMarker(refCoords[0], {
            radius: 7,
            color: '#38bdf8',
            weight: 2.5,
            fillColor: '#090d12',
            fillOpacity: 0.95,
          }).addTo(map);
          redoReferenceLayersRef.current.startMarker = startMarker;
        } else {
          redoReferenceLayersRef.current.startMarker.setLatLng(refCoords[0]);
        }

        // 2. Reference Polyline (Discreet / translucent guide line)
        if (refCoords.length >= 2) {
          const leafletCoords = refCoords as L.LatLngTuple[];

          if (redoReferenceLayersRef.current.polyline && redoReferenceLayersRef.current.glowPolyline) {
            redoReferenceLayersRef.current.glowPolyline.setLatLngs(leafletCoords);
            redoReferenceLayersRef.current.polyline.setLatLngs(leafletCoords);
          } else {
            const glowPolyline = L.polyline(leafletCoords, {
              color: '#38bdf8',
              weight: 6,
              opacity: 0.2,
              lineCap: 'round',
              lineJoin: 'round',
            }).addTo(map);

            const polyline = L.polyline(leafletCoords, {
              color: '#38bdf8',
              weight: 3.5,
              opacity: 0.6,
              dashArray: '6, 6',
              lineCap: 'round',
              lineJoin: 'round',
            }).addTo(map);

            redoReferenceLayersRef.current.glowPolyline = glowPolyline;
            redoReferenceLayersRef.current.polyline = polyline;
          }

          // 3. Reference End Marker (Point B)
          const endCoord = refCoords[refCoords.length - 1];
          if (toValidLatLngTuple(endCoord)) {
            if (!redoReferenceLayersRef.current.endMarker) {
              const endMarker = L.circleMarker(endCoord, {
                radius: 7,
                color: '#f59e0b',
                weight: 2.5,
                fillColor: '#090d12',
                fillOpacity: 0.95,
              }).addTo(map);
              redoReferenceLayersRef.current.endMarker = endMarker;
            } else {
              redoReferenceLayersRef.current.endMarker.setLatLng(endCoord);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error rendering redo reference track:', err);
    }
  }, [redoReferenceSession]);

  // Fit bounds when entering Redo Route attempt (one-time smooth frame of the original route)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !redoReferenceSession || !redoReferenceSession.track || redoReferenceSession.track.length < 2) return;

    const coords: [number, number][] = redoReferenceSession.track
      .map((pt: ActivityTrackPoint) => toValidLatLngTuple([pt.latitude, pt.longitude]))
      .filter((pt): pt is [number, number] => pt !== null);

    if (coords.length >= 2) {
      try {
        const bounds = L.latLngBounds(coords as L.LatLngTuple[]);
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [70, 70],
            duration: 1.0,
            maxZoom: 16,
          });
        }
      } catch (err) {
        console.warn('Error flying to redo bounds:', err);
      }
    }
  }, [redoReferenceSession?.id]);

  // Fit bounds when a historical session is selected for viewing (one-time smooth frame)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !viewedHistoricalSession || !viewedHistoricalSession.track || viewedHistoricalSession.track.length < 2) return;

    const coords: [number, number][] = viewedHistoricalSession.track
      .map((pt: ActivityTrackPoint) => toValidLatLngTuple([pt.latitude, pt.longitude]))
      .filter((pt): pt is [number, number] => pt !== null);

    if (coords.length >= 2) {
      try {
        const bounds = L.latLngBounds(coords as L.LatLngTuple[]);
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [70, 70],
            duration: 1.0,
            maxZoom: 16,
          });
        }
      } catch (err) {
        console.warn('Error flying to historical bounds:', err);
      }
    }
  }, [viewedHistoricalSession?.id]);

  // Render & Highlight Selected Challenge Target & Challenge Route on Map ("BORA!!")
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up previous challenge layers
    if (challengeLayersRef.current.circle) {
      map.removeLayer(challengeLayersRef.current.circle);
      challengeLayersRef.current.circle = undefined;
    }
    if (challengeLayersRef.current.beaconMarker) {
      map.removeLayer(challengeLayersRef.current.beaconMarker);
      challengeLayersRef.current.beaconMarker = undefined;
    }
    if (challengeLayersRef.current.glowPolyline) {
      map.removeLayer(challengeLayersRef.current.glowPolyline);
      challengeLayersRef.current.glowPolyline = undefined;
    }
    if (challengeLayersRef.current.polyline) {
      map.removeLayer(challengeLayersRef.current.polyline);
      challengeLayersRef.current.polyline = undefined;
    }
    if (challengeLayersRef.current.startMarker) {
      map.removeLayer(challengeLayersRef.current.startMarker);
      challengeLayersRef.current.startMarker = undefined;
    }
    if (challengeLayersRef.current.endMarker) {
      map.removeLayer(challengeLayersRef.current.endMarker);
      challengeLayersRef.current.endMarker = undefined;
    }
    if (challengeLayersRef.current.waypointMarkers) {
      challengeLayersRef.current.waypointMarkers.forEach((m) => map.removeLayer(m));
      challengeLayersRef.current.waypointMarkers = undefined;
    }

    if (!selectedChallenge) return;

    // Determine FIXED challenge target coordinates (distinct from user GPS)
    let targetCoords: [number, number] | null = toValidLatLngTuple(selectedChallenge.targetCoords);
    if (!targetCoords && selectedChallenge.targetZoneId) {
      const match = zones.find((z) => z.id === selectedChallenge.targetZoneId);
      if (match) {
        targetCoords = toValidLatLngTuple(match.center);
      }
    }
    if (!targetCoords) {
      targetCoords = DEFAULT_CENTER;
    }

    try {
      // 1. Glowing target territory circle (semi-translucent neon overlay)
      const circle = L.circle(targetCoords, {
        radius: 260,
        color: '#00FF66',
        weight: 2.5,
        opacity: 0.75,
        dashArray: '6, 6',
        fillColor: '#00FF66',
        fillOpacity: 0.16,
      }).addTo(map);

      // 2. Fixed Target Beacon Marker (Mathematically centered icon, no shaking)
      const beaconIcon = L.divIcon({
        className: 'challenge-target-beacon',
        html: `
          <div class="relative flex items-center justify-center w-16 h-16 pointer-events-none select-none">
            <!-- Non-shifting centered pulse ring -->
            <div class="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-yellow-400/80 animate-ping pointer-events-none" style="animation-duration: 2.5s;"></div>
            <div class="absolute inset-0 m-auto w-14 h-14 rounded-full bg-yellow-400/20 pointer-events-none"></div>
            <!-- Objective Beacon Core Icon -->
            <div class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#090d12] border-2 border-[#00ff66] shadow-[0_0_22px_#00ff66]">
              <span class="text-base select-none">🎯</span>
            </div>
            <!-- Objective Pill Label -->
            <div class="absolute -bottom-2.5 z-20 px-2 py-0.5 rounded-full bg-[#090d12] border border-[#00ff66] text-[8px] font-black text-[#00ff66] font-mono-stat whitespace-nowrap shadow-xl uppercase tracking-wider">
              OBJETIVO: ${selectedChallenge.title}
            </div>
          </div>
        `,
        iconSize: [64, 64],
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
      });

      const beaconMarker = L.marker(targetCoords, { icon: beaconIcon, zIndexOffset: 2000 }).addTo(map);
      beaconMarker.bindPopup(`
        <div class="p-2 text-left min-w-[150px]">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
            <span class="text-[10px] font-bold text-yellow-400 uppercase tracking-widest font-mono-stat">ALVO DO DESAFIO</span>
          </div>
          <p class="text-sm font-bold text-white uppercase font-display">${selectedChallenge.title}</p>
          <p class="text-xs text-neutral-300 mt-1 font-medium">${selectedChallenge.objective || selectedChallenge.description}</p>
          ${selectedChallenge.mainRequirement ? `<div class="mt-1.5 pt-1.5 border-t border-white/10 text-[10px] text-yellow-400 font-mono-stat font-bold">REQUISITO: ${selectedChallenge.mainRequirement}</div>` : ''}
        </div>
      `, { closeButton: false, autoPan: false });

      // 3. Render Challenge Route (if defined)
      let glowPolyline: L.Polyline | undefined;
      let polyline: L.Polyline | undefined;
      let startMarker: L.Marker | undefined;
      let endMarker: L.Marker | undefined;
      const waypointMarkers: L.CircleMarker[] = [];

      const rawRoute = selectedChallenge.challengeRoute || [];
      const routeCoords: [number, number][] = rawRoute
        .map(toValidLatLngTuple)
        .filter((pt): pt is [number, number] => pt !== null);

      if (routeCoords.length > 1) {
        const leafletCoords = routeCoords as L.LatLngTuple[];

        // Glow layer
        glowPolyline = L.polyline(leafletCoords, {
          color: '#00FF66',
          weight: 8,
          opacity: 0.22,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Semi-translucent foreground line
        polyline = L.polyline(leafletCoords, {
          color: '#00FF66',
          weight: 4.5,
          opacity: 0.70,
          dashArray: '8, 5',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Waypoints
        routeCoords.forEach((pt, idx) => {
          if (idx > 0 && idx < routeCoords.length - 1) {
            const dot = L.circleMarker(pt, {
              radius: 3,
              color: '#00FF66',
              fillColor: '#080b0e',
              fillOpacity: 0.8,
              opacity: 0.65,
              weight: 1.5,
            }).addTo(map);
            waypointMarkers.push(dot);
          }
        });

        // Start pin
        const startIcon = L.divIcon({
          className: 'challenge-start-pin',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0f15] border-2 border-yellow-400 shadow-[0_0_14px_#00ff66] text-yellow-400 font-black text-xs font-mono-stat">
                🚩
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f15]/95 border border-yellow-400 text-[8px] font-black text-yellow-400 font-mono-stat uppercase whitespace-nowrap shadow-md">
                ${selectedChallenge.startPointName ? selectedChallenge.startPointName.split(' - ')[0] : 'INÍCIO'}
              </div>
            </div>
          `,
          iconSize: [80, 44],
          iconAnchor: [40, 14],
        });
        if (routeCoords.length > 0 && toValidLatLngTuple(routeCoords[0])) {
          startMarker = L.marker(routeCoords[0], { icon: startIcon, zIndexOffset: 1500 }).addTo(map);
        }

        // End pin if applicable
        if (selectedChallenge.endPointName && routeCoords.length > 1 && toValidLatLngTuple(routeCoords[routeCoords.length - 1])) {
          const endIcon = L.divIcon({
            className: 'challenge-end-pin',
            html: `
              <div class="relative flex flex-col items-center">
                <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0f15] border-2 border-cyan-400 shadow-[0_0_14px_#00e5ff] text-cyan-300 font-black text-xs font-mono-stat">
                  🏁
                </div>
                <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f15]/95 border border-cyan-400 text-[8px] font-black text-cyan-300 font-mono-stat uppercase whitespace-nowrap shadow-md">
                  ${selectedChallenge.endPointName.split(' - ')[0]}
                </div>
              </div>
            `,
            iconSize: [80, 44],
            iconAnchor: [40, 14],
          });
          endMarker = L.marker(routeCoords[routeCoords.length - 1], { icon: endIcon, zIndexOffset: 1500 }).addTo(map);
        }

        // Fly to route bounds on initial challenge activation
        const bounds = L.latLngBounds(leafletCoords);
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [60, 60],
            duration: 1.0,
            maxZoom: 15,
          });
        }
      } else if (targetCoords) {
        // Fly camera to the fixed target coordinate once
        map.flyTo(targetCoords, 15, {
          animate: true,
          duration: 1.0,
        });
      }

      challengeLayersRef.current = {
        circle,
        beaconMarker,
        glowPolyline,
        polyline,
        startMarker,
        endMarker,
        waypointMarkers,
      };
    } catch (err) {
      console.warn('Error rendering challenge on map:', err);
    }
  }, [selectedChallenge?.id]);

  // Dedicated One-Time Focus on Challenge Target Trigger
  useEffect(() => {
    if (focusChallengeTrigger > 0 && selectedChallenge && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      let targetCoords: [number, number] | null = toValidLatLngTuple(selectedChallenge.targetCoords);
      if (!targetCoords && selectedChallenge.targetZoneId) {
        const match = zones.find((z) => z.id === selectedChallenge.targetZoneId);
        if (match) {
          targetCoords = toValidLatLngTuple(match.center);
        }
      }
      if (!targetCoords) {
        targetCoords = DEFAULT_CENTER;
      }

      const rawRoute = selectedChallenge.challengeRoute || [];
      const routeCoords: [number, number][] = rawRoute
        .map(toValidLatLngTuple)
        .filter((pt): pt is [number, number] => pt !== null);

      try {
        if (routeCoords.length > 1) {
          const bounds = L.latLngBounds(routeCoords as L.LatLngTuple[]);
          if (bounds.isValid()) {
            map.flyToBounds(bounds, {
              padding: [60, 60],
              duration: 1.0,
              maxZoom: 16,
            });
          }
        } else if (targetCoords) {
          map.flyTo(targetCoords, 15, {
            animate: true,
            duration: 1.0,
          });
        }

        if (challengeLayersRef.current.beaconMarker) {
          challengeLayersRef.current.beaconMarker.openPopup();
        }
      } catch (err) {
        console.warn('Error focusing on challenge:', err);
      }
    }
  }, [focusChallengeTrigger]);

  // Center Map on User Position Trigger Effect
  useEffect(() => {
    if (centerTrigger > 0 && mapInstanceRef.current) {
      const activeCoords = getActivePlayerCoords();
      const safeTarget: [number, number] =
        activeCoords || toValidLatLngTuple(userCoordsRef.current) || DEFAULT_CENTER;

      if (toValidLatLngTuple(safeTarget)) {
        try {
          mapInstanceRef.current.flyTo(safeTarget, 16, {
            animate: true,
            duration: 0.8,
          });
        } catch (e) {
          console.warn('Error centering map on user:', e);
        }
      }
    }
  }, [centerTrigger]);

  // Pan to selected circular zone if it changes
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      const centerTuple = toValidLatLngTuple(selectedZone.center);
      if (centerTuple) {
        try {
          mapInstanceRef.current.flyTo(centerTuple, 15, {
            animate: true,
            duration: 0.8,
          });
        } catch (e) {
          console.warn('Error flying to zone:', e);
        }
      }
    }
  }, [selectedZone?.id]);

  // =========================================================================
  // RENDER LIVE CHALLENGE ROUTE (Percurso discreto e transparente)
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clean up previous live challenge layers
    if (liveChallengeLayersRef.current.polyline) {
      map.removeLayer(liveChallengeLayersRef.current.polyline);
    }
    if (liveChallengeLayersRef.current.glowPolyline) {
      map.removeLayer(liveChallengeLayersRef.current.glowPolyline);
    }
    if (liveChallengeLayersRef.current.startMarker) {
      map.removeLayer(liveChallengeLayersRef.current.startMarker);
    }
    if (liveChallengeLayersRef.current.endMarker) {
      map.removeLayer(liveChallengeLayersRef.current.endMarker);
    }
    liveChallengeLayersRef.current = {};

    if (!liveChallenge || !liveChallenge.routePath || liveChallenge.routePath.length === 0) {
      return;
    }

    try {
      const rawRoute = liveChallenge.routePath;
      const routeCoords: [number, number][] = rawRoute
        .map(toValidLatLngTuple)
        .filter((pt): pt is [number, number] => pt !== null);

      if (routeCoords.length > 1) {
        const leafletCoords = routeCoords as L.LatLngTuple[];

        // 1. Linha glow sutil e transparente
        const glowPolyline = L.polyline(leafletCoords, {
          color: '#00E5FF',
          weight: 6,
          opacity: 0.15,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // 2. Linha principal discreta e transparente sem tampar as ruas
        const polyline = L.polyline(leafletCoords, {
          color: '#00E5FF',
          weight: 3.5,
          opacity: 0.45,
          dashArray: '6, 5',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // 3. Marcador de Início da Disputa
        const startIcon = L.divIcon({
          className: 'live-challenge-start-pin',
          html: `
            <div class="relative flex flex-col items-center select-none pointer-events-none">
              <div class="w-6 h-6 rounded-full bg-[#0a0f16] border-2 border-yellow-400 flex items-center justify-center text-yellow-400 text-[10px] shadow-[0_0_10px_rgba(0,255,102,0.6)]">
                🚩
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f16]/90 border border-yellow-400 text-[7px] font-black text-yellow-400 font-mono-stat uppercase whitespace-nowrap">
                LARGADA
              </div>
            </div>
          `,
          iconSize: [60, 36],
          iconAnchor: [30, 12],
        });
        const startMarker = L.marker(routeCoords[0], { icon: startIcon, zIndexOffset: 1200 }).addTo(map);

        // 4. Marcador de Chegada da Disputa
        const endIcon = L.divIcon({
          className: 'live-challenge-end-pin',
          html: `
            <div class="relative flex flex-col items-center select-none pointer-events-none">
              <div class="w-6 h-6 rounded-full bg-[#0a0f16] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-[10px] shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                🏁
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-[#0a0f16]/90 border border-cyan-400 text-[7px] font-black text-cyan-300 font-mono-stat uppercase whitespace-nowrap">
                CHEGADA
              </div>
            </div>
          `,
          iconSize: [60, 36],
          iconAnchor: [30, 12],
        });
        const endMarker = L.marker(routeCoords[routeCoords.length - 1], { icon: endIcon, zIndexOffset: 1200 }).addTo(map);

        liveChallengeLayersRef.current = {
          glowPolyline,
          polyline,
          startMarker,
          endMarker,
        };
      }
    } catch (err) {
      console.warn('Error rendering live challenge route:', err);
    }
  }, [liveChallenge?.id, liveChallenge?.routeId]);

  // =========================================================================
  // RENDER LIVE CHALLENGE PARTICIPANTS (Avatares dos jogadores em tempo real)
  // Suporta 2 participantes agora, expansível iterativamente para N participantes
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (!liveChallenge || !liveChallenge.participants || liveChallenge.participants.length === 0) {
      // Clean up all participant markers if no active challenge
      Object.values(liveChallengeParticipantMarkersRef.current).forEach((marker) => {
        map.removeLayer(marker);
      });
      liveChallengeParticipantMarkersRef.current = {};
      return;
    }

    const currentParticipantIds = new Set(liveChallenge.participants.map((p) => p.playerId));

    // Remove markers of participants no longer present
    Object.keys(liveChallengeParticipantMarkersRef.current).forEach((playerId) => {
      if (!currentParticipantIds.has(playerId)) {
        map.removeLayer(liveChallengeParticipantMarkersRef.current[playerId]);
        delete liveChallengeParticipantMarkersRef.current[playerId];
      }
    });

    // Update or create marker for each participant
    liveChallenge.participants.forEach((p, idx) => {
      const coords = toValidLatLngTuple(p.position);
      if (!coords) return;

      const accentColor = p.color || (idx === 0 ? '#00FF66' : '#F59E0B');
      const rankEmoji = p.rankPosition === 1 ? '🥇' : p.rankPosition === 2 ? '🥈' : `${idx + 1}º`;

      const createParticipantIcon = () => {
        return L.divIcon({
          className: `live-participant-marker-${p.playerId}`,
          html: `
            <div class="relative flex flex-col items-center justify-center select-none cursor-pointer">
              <!-- Radar Pulse sutil com a cor do jogador -->
              <div class="absolute -top-1 w-10 h-10 rounded-full animate-ping pointer-events-none opacity-40" style="background-color: ${accentColor}25;"></div>
              
              <!-- Avatar Circular Compacto -->
              <div class="relative z-10 w-8 h-8 rounded-full overflow-hidden border-2 bg-[#090d14] flex items-center justify-center shadow-lg" style="border-color: ${accentColor}; box-shadow: 0 0 14px ${accentColor}80;">
                <img
                  src="${p.avatar}"
                  alt="${p.nickname}"
                  class="w-full h-full object-cover"
                  onerror="this.style.display='none';"
                />
              </div>

              <!-- Badge Flutuante Compacto: Nickname + % -->
              <div class="relative z-20 -mt-1 px-1.5 py-0.2 rounded-full bg-[#080c14]/95 border text-[8px] font-black font-mono-stat shadow-md uppercase whitespace-nowrap flex items-center gap-0.5" style="border-color: ${accentColor}; color: ${accentColor};">
                <span>${rankEmoji}</span>
                <span>${p.nickname}</span>
                <span class="text-white font-bold ml-0.5">${Math.round(p.progress)}%</span>
              </div>
            </div>
          `,
          iconSize: [64, 46],
          iconAnchor: [32, 20],
          popupAnchor: [0, -20],
        });
      };

      const popupContent = `
        <div class="p-2 text-left min-w-[140px] font-mono-stat select-none">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${accentColor};"></span>
            <span class="text-[9px] font-black uppercase tracking-widest" style="color: ${accentColor};">DISPUTA AO VIVO</span>
          </div>
          <p class="text-xs font-black text-white uppercase font-display">${p.nickname} ${p.isCurrentUser ? '(VOCÊ)' : ''}</p>
          <div class="mt-1 pt-1.5 border-t border-white/10 text-[10px] space-y-0.5 text-neutral-300">
            <div class="flex justify-between">
              <span>Progresso:</span>
              <b style="color: ${accentColor};">${Math.round(p.progress)}%</b>
            </div>
            <div class="flex justify-between">
              <span>Distância:</span>
              <b class="text-white">${p.distance >= 1000 ? `${(p.distance / 1000).toFixed(2)} km` : `${Math.round(p.distance)} m`}</b>
            </div>
            <div class="flex justify-between">
              <span>Velocidade:</span>
              <b class="text-white">${p.averageSpeed.toFixed(1)} km/h</b>
            </div>
          </div>
        </div>
      `;

      try {
        const icon = createParticipantIcon();

        if (liveChallengeParticipantMarkersRef.current[p.playerId]) {
          const marker = liveChallengeParticipantMarkersRef.current[p.playerId];
          marker.setLatLng(coords);
          marker.setIcon(icon);
          marker.setPopupContent(popupContent);
        } else {
          const marker = L.marker(coords, { icon, zIndexOffset: 2500 - idx * 10 }).addTo(map);
          marker.bindPopup(popupContent, { closeButton: false, autoPan: false });
          liveChallengeParticipantMarkersRef.current[p.playerId] = marker;
        }
      } catch (err) {
        console.warn('Error updating participant marker:', err);
      }
    });
  }, [liveChallenge?.participants]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Zone creation map overlay hint */}
      {isCreatingZone && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-[#0d141d]/95 border border-yellow-400 rounded-full shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center gap-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <p className="text-xs font-bold text-emerald-300">
            Toque no mapa para posicionar a nova zona
          </p>
        </div>
      )}
    </div>
  );
};
