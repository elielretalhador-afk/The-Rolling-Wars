import React from 'react';
import { X, Shield, Users, Zap, Award, Swords, MapPin, Flag, Layers, BookOpen, User as UserIcon, Activity, Flame, Gauge, Clock } from 'lucide-react';
import { UserProfile, Zone } from '../types';
import { calculateGpsDistanceKm } from '../utils/gpsTracker';

interface ZoneDetailsModalProps {
  zone: Zone | null;
  currentUser: UserProfile;
  userLocation?: { latitude: number; longitude: number } | null;
  isSessionActive?: boolean;
  onClose: () => void;
  onChallengeZone: (zone: Zone) => void;
}

export const ZoneDetailsModal: React.FC<ZoneDetailsModalProps> = ({
  zone,
  currentUser,
  userLocation,
  isSessionActive = false,
  onClose,
  onChallengeZone,
}) => {
  if (!zone) return null;

  const zoneColor = zone.color || zone.accentColor || '#00FF66';
  const isFree = zone.status === 'free' || !zone.controller;
  const isContested = zone.status === 'contested' || zone.contested;
  const dominanceValue = zone.dominance !== undefined ? zone.dominance : (zone.dominancePercent ?? 0);
  const skatersCountValue = zone.skatersCount !== undefined ? zone.skatersCount : (zone.activeSkatersCount ?? 0);
  const xpValue = zone.xpPerHour !== undefined ? zone.xpPerHour : (zone.pointsPerHour ?? 150);

  // Real GPS Distance calculation to zone center
  const distanceToCenterMeters =
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
      ? Math.round(
          calculateGpsDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            zone.center[0],
            zone.center[1]
          ) * 1000
        )
      : null;
  const isPlayerInside = distanceToCenterMeters !== null ? distanceToCenterMeters <= (zone.radius || 300) : false;

  // Type formatted label
  const typeLabelMap: Record<string, string> = {
    street: 'STREET',
    speed: 'SPEED',
    free_skate: 'FREE SKATE',
    freeskate: 'FREE SKATE',
    slalom: 'SLALOM',
  };
  const typeLabel = typeLabelMap[zone.type?.toLowerCase()] || zone.category?.toUpperCase() || 'STREET';

  const creatorName = typeof zone.creator === 'object' && zone.creator ? zone.creator.name : (zone.creator || 'Patinador Urbano');
  const creatorNick = typeof zone.creator === 'object' && zone.creator ? zone.creator.nickname : undefined;
  const controllerData = zone.controller;
  const controllerNickname = controllerData?.nickname || controllerData?.name || zone.controllerNickname;
  const controllerAvatar = controllerData?.avatar || zone.controllerAvatar;
  const controllerLevel = controllerData?.level ?? zone.controllerLevel ?? 1;
  const controllerClan = controllerData?.clan || controllerData?.crew || zone.controllerCrew || 'Sem Clã';

  const isCurrentUserController = Boolean(
    !isFree && (controllerNickname === currentUser.nickname || controllerNickname === currentUser.name)
  );

  // Activity Level Label & Badge Styling
  const rawActivity = (zone.activityLevel || (skatersCountValue >= 15 ? 'HIGH' : skatersCountValue >= 6 ? 'MEDIUM' : 'LOW')).toUpperCase();
  const isHighActivity = rawActivity === 'HIGH' || rawActivity === 'ALTA';
  const isMediumActivity = rawActivity === 'MEDIUM' || rawActivity === 'MEDIA';

  return (
    <div className="absolute inset-x-0 bottom-16 sm:bottom-18 z-40 px-3 pb-2 sm:pb-3 pointer-events-none flex justify-center">
      <div
        className="pointer-events-auto w-full max-w-md bg-[#000000]/95 border-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl animate-in slide-in-from-bottom duration-300 max-h-[64vh] sm:max-h-[70vh] flex flex-col overflow-hidden"
        style={{ borderColor: `${zoneColor}70` }}
      >
        {/* Sticky Header - Fixed at the top of the card */}
        <div className="p-3.5 pb-2.5 bg-[#000000] border-b-2 border-white/10 flex items-start justify-between gap-2.5 shrink-0 z-10">
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {/* Type Badge */}
              <span
                className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md text-black font-mono-stat shrink-0"
                style={{ backgroundColor: zoneColor }}
              >
                {typeLabel}
              </span>

              {/* Status Badge */}
              {isFree ? (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-yellow-300 bg-neutral-900/80 px-2 py-0.5 rounded-md border border-yellow-500/40 font-mono-stat shrink-0">
                  <Flag className="w-3 h-3 text-yellow-400" /> ZONA LIVRE
                </span>
              ) : isContested ? (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 font-mono-stat shrink-0">
                  <Swords className="w-3 h-3" /> EM DISPUTA
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/40 font-mono-stat shrink-0">
                  <Shield className="w-3 h-3" /> CONTROLADA
                </span>
              )}

              {/* Activity Level Badge */}
              {isHighActivity ? (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded-md border border-orange-500/40 font-mono-stat shrink-0">
                  <Flame className="w-3 h-3 text-orange-400 animate-pulse" /> ALTA ATIVIDADE
                </span>
              ) : isMediumActivity ? (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-500/30 font-mono-stat shrink-0">
                  <Activity className="w-3 h-3 text-amber-400" /> MÉDIA ATIVIDADE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded-md border border-white/10 font-mono-stat shrink-0">
                  <Activity className="w-3 h-3 text-slate-400" /> BAIXA ATIVIDADE
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-tight leading-tight truncate">
              {zone.name}
            </h2>

            {/* Creator Reference */}
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono-stat truncate">
              <UserIcon className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">
                Criada por <strong className="text-slate-200">{creatorNick || creatorName}</strong>
              </span>
            </div>
          </div>

          {/* Dedicated Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel da zona"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-3.5 pt-2.5 overflow-y-auto space-y-2.5 no-scrollbar flex-1">
          {/* GPS Player Presence Status */}
          {distanceToCenterMeters !== null && (
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                isPlayerInside
                  ? 'bg-neutral-900/80 border-yellow-500/60 shadow-[0_0_15px_rgba(252,232,3,0.2)]'
                  : 'bg-[#0a0a0a]/90 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                  {isPlayerInside && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isPlayerInside ? 'bg-yellow-400' : 'bg-slate-500'
                    }`}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-black uppercase font-mono-stat truncate ${
                      isPlayerInside ? 'text-yellow-300' : 'text-slate-300'
                    }`}
                  >
                    {isPlayerInside ? 'Você está dentro desta zona.' : 'Você está fora desta zona.'}
                  </span>
                  {isSessionActive && isPlayerInside && (
                    <span className="text-[9px] text-yellow-400/90 font-bold font-mono-stat">
                      ● Presença sendo registrada na patinação
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold font-mono-stat shrink-0 ${
                  isPlayerInside ? 'text-yellow-400' : 'text-slate-400'
                }`}
              >
                {distanceToCenterMeters >= 1000
                  ? `${(distanceToCenterMeters / 1000).toFixed(1)} km do centro`
                  : `${distanceToCenterMeters}m do centro`}
              </span>
            </div>
          )}

          {/* Description */}
          {zone.description && (
            <p className="text-xs text-slate-300 font-medium leading-relaxed bg-[#0a0a0a]/60 p-2.5 rounded-xl border border-white/5">
              {zone.description}
            </p>
          )}

          {/* Surface & Reference Point Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {zone.surface && (
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-start gap-2">
                <Layers className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-black uppercase font-mono-stat">QUALIDADE DO PISO</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5 leading-snug break-words">{zone.surface}</div>
                </div>
              </div>
            )}

            {zone.referencePoint && (
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-black uppercase font-mono-stat">PONTO DE REFERÊNCIA</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5 leading-snug break-words">{zone.referencePoint}</div>
                </div>
              </div>
            )}
          </div>

          {/* Rules Card */}
          {zone.rules && (
            <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[9px] text-slate-400 font-black uppercase font-mono-stat">REQUISITOS / REGRAS</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5 leading-snug break-words">{zone.rules}</div>
              </div>
            </div>
          )}

          {/* Controller / Status Card */}
          <div className="p-3 rounded-2xl bg-[#0a0a0a] border-2 border-white/10">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between font-mono-stat">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-yellow-400" />
                {isFree ? 'STATUS DA ZONA' : isContested ? 'DISPUTA EM ANDAMENTO' : `CONTROLADA POR ${controllerNickname?.toUpperCase() || 'JOGADOR'}`}
              </span>
              <span className="text-[9px] font-bold text-slate-400 font-mono-stat">
                {isFree ? 'LIVRE (0% DOMÍNIO)' : isContested ? 'EM DISPUTA' : `${dominanceValue}% DOMÍNIO`}
              </span>
            </div>

            {isContested ? (
              <div className="py-2.5 px-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-left">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2 font-mono-stat">
                  <Swords className="w-4 h-4 text-white shrink-0 animate-pulse" />
                  <span>A ZONA <strong className="text-white">'{zone.name.toUpperCase()}'</strong> ESTÁ EM DISPUTA.</span>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2 p-2 rounded-lg bg-black/40 border border-amber-500/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shrink-0">
                      <Swords className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] text-amber-300 font-black uppercase font-mono-stat">
                        Jogador Desafiante
                      </div>
                      <div className="text-xs font-black text-white truncate font-display">
                        {zone.activeDispute?.playerNickname || zone.activeDispute?.playerName || currentUser.nickname}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase font-mono-stat shrink-0">
                    DESAFIO INDIVIDUAL
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-amber-500/20 text-[10px] text-slate-300 font-mono-stat space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Início da tentativa:</span>
                    <span className="text-amber-300 font-bold">
                      {zone.activeDispute?.startedAt
                        ? new Date(zone.activeDispute.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : 'Em andamento'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Meta de distância:</span>
                    <span className="text-yellow-400 font-bold">{zone.captureRequirements?.minDistance || 100}m dentro da zona</span>
                  </div>
                </div>
              </div>
            ) : isFree ? (
              <div className="py-2.5 px-3 rounded-xl bg-black/40 border border-yellow-500/20 text-center">
                <div className="text-xs font-bold text-yellow-300 flex items-center justify-center gap-1.5">
                  <Flag className="w-4 h-4 text-yellow-400 shrink-0" />
                  Esta zona está livre e disponível para conquista.
                </div>
                <div className="mt-2 p-2 rounded-lg bg-neutral-900/40 border border-yellow-500/30 text-[11px] text-yellow-200/90 font-mono-stat text-left flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Requisito de Conquista:</strong> Patinar no mínimo{' '}
                    <strong className="text-yellow-300 font-bold">{zone.captureRequirements?.minDistance || 100}m</strong> dentro do raio da zona durante a sua patinação para assumir o controle com 100% de domínio.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      {controllerAvatar ? (
                        <img
                          src={controllerAvatar}
                          alt={controllerNickname || 'Controlador'}
                          className="w-10 h-10 rounded-xl object-cover border-2"
                          style={{ borderColor: zoneColor }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl bg-slate-800 border-2 flex items-center justify-center text-white font-bold text-sm"
                          style={{ borderColor: zoneColor }}
                        >
                          {controllerNickname?.[0] || 'C'}
                        </div>
                      )}
                      <div
                        className="absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-black text-black font-mono-stat"
                        style={{ backgroundColor: zoneColor }}
                      >
                        L.{controllerLevel}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-black text-white leading-none uppercase font-display truncate">
                          {controllerNickname}
                        </h3>
                        {isCurrentUserController && (
                          <span className="text-[8px] font-black text-yellow-400 bg-yellow-500/20 px-1 py-0.2 rounded border border-yellow-400/40 uppercase font-mono-stat shrink-0">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-bold truncate">
                        {controllerClan}
                      </p>
                    </div>
                  </div>

                  {/* Dominance % */}
                  <div className="text-right shrink-0 pl-2">
                    <div className="text-[9px] text-slate-400 font-black uppercase font-mono-stat">DOMÍNIO</div>
                    <div className="text-lg font-black font-mono-stat" style={{ color: zoneColor }}>
                      {dominanceValue}%
                    </div>
                  </div>
                </div>

                {/* Dominion Time and History space */}
                {zone.dominionTimeDays !== undefined && zone.dominionTimeDays > 0 && (
                  <div className="flex items-center justify-between text-[10px] text-slate-300 bg-black/30 px-2 py-1 rounded-lg border border-white/5 font-mono-stat">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Tempo de Domínio:
                    </span>
                    <span className="text-cyan-300 font-bold">{zone.dominionTimeDays} dias consecutivos</span>
                  </div>
                )}
              </div>
            )}

            {/* Dominance Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor]"
                style={{
                  width: `${isContested ? 50 : dominanceValue}%`,
                  backgroundColor: isContested ? '#f59e0b' : zoneColor,
                }}
              />
            </div>
          </div>

          {/* Quick Stats Grid with Activity & Visitors */}
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="p-2 rounded-xl bg-[#0a0a0a] border border-white/10">
              <div className="text-[8px] text-slate-400 font-black uppercase font-mono-stat">RAIO</div>
              <div className="text-xs sm:text-sm font-black text-white mt-0.5 font-mono-stat">{zone.radius}M</div>
            </div>
            <div className="p-2 rounded-xl bg-[#0a0a0a] border border-white/10">
              <div className="text-[8px] text-slate-400 font-black uppercase font-mono-stat">AGORA</div>
              <div className="text-xs sm:text-sm font-black text-yellow-400 mt-0.5 flex items-center justify-center gap-1 font-mono-stat">
                <Users className="w-3 h-3" />
                {skatersCountValue}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#0a0a0a] border border-white/10">
              <div className="text-[8px] text-slate-400 font-black uppercase font-mono-stat">VISITAS</div>
              <div className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5 flex items-center justify-center gap-1 font-mono-stat">
                <Activity className="w-3 h-3" />
                {zone.totalVisitorsCount || (skatersCountValue * 12 + 18)}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#0a0a0a] border border-white/10">
              <div className="text-[8px] text-slate-400 font-black uppercase font-mono-stat">XP / HORA</div>
              <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1 font-mono-stat">
                <Zap className="w-3 h-3" />
                +{xpValue}
              </div>
            </div>
          </div>

          {/* Best Record Space (if available) */}
          {zone.bestRecord && (
            <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-amber-500/30 flex items-center justify-between text-xs font-mono-stat">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-amber-400 font-black uppercase">RECORDE DE VELOCIDADE</div>
                  <div className="text-xs font-bold text-white truncate">
                    {zone.bestRecord.playerNickname || zone.bestRecord.playerName}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-amber-300 font-black text-xs sm:text-sm">{zone.bestRecord.speedKmH} KM/H</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1">
            {isContested ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full py-2.5 px-4 bg-amber-500/10 border border-amber-500/20 text-amber-300/70 font-black text-xs uppercase tracking-wider rounded-xl cursor-not-allowed select-none flex items-center justify-center gap-2 font-mono-stat pointer-events-none"
              >
                <Swords className="w-4 h-4 text-white/70" />
                ⚔ ZONA EM DISPUTA ATIVA
              </button>
            ) : isFree ? (
              <button
                type="button"
                onClick={() => onChallengeZone(zone)}
                className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(252,232,3,0.4)] flex items-center justify-center gap-2 active:scale-98 font-mono-stat cursor-pointer"
              >
                <Swords className="w-4 h-4 stroke-[2.5]" />
                ⚔ DISPUTAR ZONA
              </button>
            ) : isCurrentUserController ? (
              <button
                type="button"
                onClick={() => onChallengeZone(zone)}
                className="w-full py-2.5 px-4 bg-[#11241a] border-2 border-yellow-500/60 hover:bg-[#183325] text-yellow-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono-stat cursor-pointer"
              >
                <Award className="w-4 h-4 text-yellow-400" />
                DEFENDER TERRITÓRIO (+{xpValue} XP)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onChallengeZone(zone)}
                className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(252,232,3,0.4)] flex items-center justify-center gap-2 active:scale-98 font-mono-stat cursor-pointer"
              >
                <Swords className="w-4 h-4 stroke-[3]" />
                DESAFIAR CONTROLE DA ZONA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

