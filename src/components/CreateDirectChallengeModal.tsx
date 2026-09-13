import React, { useState, useEffect } from 'react';
import {
  X,
  Swords,
  MapPin,
  Clock,
  Calendar,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Activity,
  Compass,
  Flame,
  Target,
  Sparkles,
  UserPlus,
  Users,
  Search,
  Trash2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import {
  DirectChallenge,
  DirectChallengeType,
  DirectChallengeMode,
  DirectChallengeParticipant,
  MAX_DIRECT_CHALLENGE_OPPONENTS,
  RankPlayer,
  SkateRoute,
  UserProfile,
} from '../types';

interface CreateDirectChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlayer: RankPlayer | {
    id?: string;
    name?: string;
    nickname: string;
    tag?: string;
    avatar: string;
    level?: number;
    crew?: string;
  } | null;
  currentUser: UserProfile;
  routes: SkateRoute[];
  availablePlayers?: RankPlayer[];
  onCreateChallenge: (challenge: DirectChallenge) => void;
}

interface ChallengeTypeOption {
  type: DirectChallengeType;
  icon: string;
  title: string;
  description: string;
  badge: string;
}

const CHALLENGE_TYPES: ChallengeTypeOption[] = [
  {
    type: 'corrida',
    icon: '🏁',
    title: 'Corrida',
    description: 'Complete a rota no menor tempo possível.',
    badge: 'Tempo Total',
  },
  {
    type: 'velocidade',
    icon: '⚡',
    title: 'Velocidade',
    description: 'Alcance a maior velocidade máxima ou média durante a rota.',
    badge: 'Top Speed',
  },
  {
    type: 'precisao',
    icon: '🎯',
    title: 'Precisão',
    description: 'Complete o percurso seguindo fielmente o trajeto registrado.',
    badge: 'Fidelidade GPS',
  },
  {
    type: 'melhor_tempo',
    icon: '🛼',
    title: 'Melhor tempo',
    description: 'Supere a marca de tempo registrada pelos adversários.',
    badge: 'Recorde de Rota',
  },
];

export const CreateDirectChallengeModal: React.FC<CreateDirectChallengeModalProps> = ({
  isOpen,
  onClose,
  targetPlayer,
  currentUser,
  routes,
  availablePlayers = [],
  onCreateChallenge,
}) => {
  const [step, setStep] = useState<'configure' | 'summary' | 'success'>('configure');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'route_01');
  const [selectedType, setSelectedType] = useState<DirectChallengeType>('corrida');

  // List of opponents (starts with the targetPlayer initially selected)
  const [opponents, setOpponents] = useState<any[]>([]);
  
  // State for Add Player Drawer/Modal
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState<boolean>(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState<string>('');

  // Date & Time state with friendly defaults
  const [proposedDate, setProposedDate] = useState<string>(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  });

  const [proposedTime, setProposedTime] = useState<string>('19:30');
  const [customNote, setCustomNote] = useState<string>('');

  // Sync initial target player
  useEffect(() => {
    if (targetPlayer) {
      const initialOpponent = {
        id: (targetPlayer as any).id || (targetPlayer as any).userId || `usr_${targetPlayer.nickname}`,
        name: targetPlayer.name || targetPlayer.nickname,
        nickname: targetPlayer.nickname,
        avatar: targetPlayer.avatar,
        tag: targetPlayer.tag || '#000',
        level: targetPlayer.level || 1,
        crew: targetPlayer.crew || 'Sem Clã',
      };
      setOpponents([initialOpponent]);
    }
  }, [targetPlayer]);

  if (!isOpen || !targetPlayer) return null;

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const selectedChallengeTypeObj = CHALLENGE_TYPES.find((t) => t.type === selectedType) || CHALLENGE_TYPES[0];

  const opponentsCount = opponents.length;
  const isLimitReached = opponentsCount >= MAX_DIRECT_CHALLENGE_OPPONENTS;
  const challengeMode: DirectChallengeMode = opponentsCount > 1 ? 'x2' : 'x1';

  // Handle adding an opponent from the picker
  const handleAddOpponent = (player: RankPlayer) => {
    const playerId = player.id || `usr_${player.nickname}`;
    // Validation: prevent self-addition
    if (playerId === currentUser.id || player.nickname.toLowerCase() === currentUser.nickname.toLowerCase()) {
      return;
    }
    // Validation: prevent duplicate
    if (opponents.some((op) => op.id === playerId || op.nickname.toLowerCase() === player.nickname.toLowerCase())) {
      return;
    }
    // Validation: max limit check
    if (opponents.length >= MAX_DIRECT_CHALLENGE_OPPONENTS) {
      return;
    }

    const newOpponent = {
      id: playerId,
      name: player.name || player.nickname,
      nickname: player.nickname,
      avatar: player.avatar,
      tag: player.tag || '#000',
      level: player.level || 1,
      crew: player.crew || 'Sem Clã',
    };

    setOpponents((prev) => [...prev, newOpponent]);
    setIsAddPlayerOpen(false);
    setPlayerSearchQuery('');
  };

  // Handle removing an opponent
  const handleRemoveOpponent = (indexToRemove: number) => {
    // Keep at least 1 opponent
    if (opponents.length <= 1) return;
    setOpponents((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Filter available players for picker (exclude currentUser and already selected opponents)
  const filteredAvailablePlayers = availablePlayers.filter((p) => {
    const pId = p.id || `usr_${p.nickname}`;
    if (pId === currentUser.id || p.nickname.toLowerCase() === currentUser.nickname.toLowerCase()) {
      return false;
    }
    if (opponents.some((op) => op.id === pId || op.nickname.toLowerCase() === p.nickname.toLowerCase())) {
      return false;
    }
    if (!playerSearchQuery.trim()) return true;

    const query = playerSearchQuery.toLowerCase().trim();
    const matchName = (p.name || '').toLowerCase().includes(query);
    const matchNick = (p.nickname || '').toLowerCase().includes(query);
    const matchTag = (p.tag || '').toLowerCase().includes(query);
    const matchCrew = (p.crew || '').toLowerCase().includes(query);

    return matchName || matchNick || matchTag || matchCrew;
  });

  const handleSendChallenge = () => {
    const nowIso = new Date().toISOString();

    // Build participants array: Challenger (Creator) + All Opponents
    const participantsList: DirectChallengeParticipant[] = [
      {
        playerId: currentUser.id,
        name: currentUser.name,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
        tag: currentUser.tag,
        level: currentUser.level,
        crew: currentUser.crew,
        role: 'challenger',
        invitationStatus: 'aceito',
        joinedAt: nowIso,
        proposedDate,
        proposedTime,
      },
      ...opponents.map((opp) => ({
        playerId: opp.id,
        name: opp.name,
        nickname: opp.nickname,
        avatar: opp.avatar,
        tag: opp.tag,
        level: opp.level,
        crew: opp.crew,
        role: 'opponent' as const,
        invitationStatus: 'pendente' as const,
        joinedAt: nowIso,
      })),
    ];

    const firstOpponent = opponents[0] || targetPlayer;

    const newChallenge: DirectChallenge = {
      id: `dc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      mode: challengeMode,
      creatorId: currentUser.id,
      creatorNickname: currentUser.nickname,
      participants: participantsList,

      // Challenger (Creator) fields
      challengerId: currentUser.id,
      challengerName: currentUser.name,
      challengerNickname: currentUser.nickname,
      challengerAvatar: currentUser.avatar,
      challengerTag: currentUser.tag,
      challengerLevel: currentUser.level,
      challengerCrew: currentUser.crew,

      // First opponent (for backwards-compat/quick preview)
      challengedId: firstOpponent.id || `usr_${firstOpponent.nickname}`,
      challengedName: firstOpponent.name || firstOpponent.nickname,
      challengedNickname: firstOpponent.nickname,
      challengedAvatar: firstOpponent.avatar,
      challengedTag: firstOpponent.tag,
      challengedLevel: firstOpponent.level || 1,
      challengedCrew: firstOpponent.crew || 'Sem Clã',

      routeId: selectedRoute.id,
      routeName: selectedRoute.name,
      routeDistanceKm: selectedRoute.distanceKm,
      routeDifficulty: selectedRoute.difficulty,
      routeLocation: selectedRoute.location,
      routeXp: selectedRoute.points || 300,
      routeIsCircuit: selectedRoute.isCircuit,
      routeDescription: selectedRoute.tags?.join(', ') || 'Percurso urbano homologado',

      challengeType: selectedChallengeTypeObj.type,
      challengeTypeLabel: selectedChallengeTypeObj.title,
      challengeTypeDescription: selectedChallengeTypeObj.description,
      challengeTypeIcon: selectedChallengeTypeObj.icon,

      proposedDate,
      proposedTime,
      status: 'pendente',

      lastActionBy: currentUser.id,
      createdAt: nowIso,
      updatedAt: nowIso,
      negotiationHistory: [
        {
          id: `neg_${Date.now()}`,
          playerId: currentUser.id,
          playerName: currentUser.name,
          playerNickname: currentUser.nickname,
          playerAvatar: currentUser.avatar,
          proposedDate,
          proposedTime,
          timestamp: nowIso,
          action: 'create',
          note: customNote.trim() || `Desafio ${challengeMode.toUpperCase()} enviado com ${opponents.length} adversário(s).`,
        },
      ],
    };

    onCreateChallenge(newChallenge);
    setStep('success');
  };

  const handleClose = () => {
    setStep('configure');
    setIsAddPlayerOpen(false);
    onClose();
  };

  // Quick preset helper
  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    setProposedDate(`${day}/${month}/${year}`);
  };

  return (
    <div
      id="modal-create-direct-challenge"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#090e15] border-2 border-yellow-500/60 shadow-[0_0_50px_rgba(0,255,102,0.3)] flex flex-col max-h-[92vh] overflow-hidden text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accents */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-white/10 bg-gradient-to-b from-emerald-950/40 via-[#0a121c] to-[#090e15] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase font-mono-stat tracking-wider ${
                    challengeMode === 'x2'
                      ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                      : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
                  }`}
                >
                  🎯 DESAFIO {challengeMode.toUpperCase()} ({opponentsCount} ADVERSÁRIO{opponentsCount > 1 ? 'S' : ''})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-tight flex items-center gap-1.5 mt-0.5">
                CRIAR DESAFIO DIRETO
              </h2>
            </div>
          </div>

          <button
            id="btn-close-create-challenge"
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(92vh-140px)] space-y-5">
          {/* PARTICIPANTS SECTION */}
          <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono-stat">
                <Users className="w-3.5 h-3.5 text-yellow-400" />
                <span>PARTICIPANTES DO DESAFIO</span>
              </div>
              <span className="text-[10px] font-mono-stat text-neutral-400">
                {opponentsCount + 1} Jogadores (Máx {MAX_DIRECT_CHALLENGE_OPPONENTS} adversários)
              </span>
            </div>

            {/* Challenger Card (You) */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.nickname}
                    className="w-9 h-9 rounded-lg object-cover border-2 border-yellow-400"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black border border-yellow-400 text-[7px] font-black text-yellow-400 font-mono-stat">
                    NV {currentUser.level || 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-display">
                      {currentUser.nickname}
                    </span>
                    <span className="text-yellow-400 text-[10px] font-mono-stat">
                      {currentUser.tag || '#000'}
                    </span>
                  </div>
                  <span className="text-[10px] text-yellow-400/80 font-mono-stat block">
                    👑 Desafiante (Você)
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-emerald-300 text-[9px] font-bold font-mono-stat uppercase">
                Criador
              </span>
            </div>

            {/* Opponents List */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-neutral-400 uppercase font-mono-stat flex items-center justify-between">
                <span>Adversários ({opponentsCount}/{MAX_DIRECT_CHALLENGE_OPPONENTS}):</span>
                {opponentsCount > 1 && (
                  <span className="text-purple-300 font-normal">Modo X2 Ativo</span>
                )}
              </div>

              {opponents.map((opp, idx) => (
                <div
                  key={opp.id || idx}
                  className="p-2.5 rounded-xl bg-[#0e1724] border border-cyan-500/30 flex items-center justify-between gap-2 animate-in fade-in"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={opp.avatar}
                        alt={opp.nickname}
                        className="w-9 h-9 rounded-lg object-cover border-2 border-cyan-400"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black border border-cyan-400 text-[7px] font-black text-cyan-400 font-mono-stat">
                        NV {opp.level || 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-display truncate">
                          {opp.nickname}
                        </span>
                        <span className="text-cyan-400 text-[10px] font-mono-stat">
                          {opp.tag || '#000'}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono-stat truncate block">
                        {opp.crew || 'Patinador Urbano'} • Adversário #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {opponents.length > 1 && (
                      <button
                        type="button"
                        id={`btn-remove-opponent-${idx}`}
                        onClick={() => handleRemoveOpponent(idx)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                        title="Remover adversário"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ADD PLAYER BUTTON / LIMIT REACHED BANNER */}
            {!isLimitReached ? (
              <button
                id="btn-add-player-challenge"
                type="button"
                onClick={() => {
                  setIsAddPlayerOpen(true);
                  setPlayerSearchQuery('');
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold font-mono-stat uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>+ ADICIONAR JOGADOR (CRIAR DESAFIO X2)</span>
              </button>
            ) : (
              <div
                id="banner-limit-opponents-reached"
                className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono-stat flex items-center justify-center gap-2 text-center"
              >
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-bold">LIMITE DE 2 ADVERSÁRIOS ATINGIDO (MODO X2)</span>
              </div>
            )}
          </div>

          {/* PLAYER SELECTION DRAWER/PICKER (When + ADICIONAR JOGADOR is tapped) */}
          {isAddPlayerOpen && (
            <div className="p-4 rounded-2xl bg-[#0c1624] border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono-stat flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  SELECIONAR 2º ADVERSÁRIO (MODO X2)
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddPlayerOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  id="input-search-opponent-player"
                  value={playerSearchQuery}
                  onChange={(e) => setPlayerSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, apelido, tag (#042) ou clã..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono-stat text-xs focus:border-cyan-400 focus:outline-none"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              {/* List of candidates */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredAvailablePlayers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-400 font-mono-stat">
                    Nenhum jogador encontrado com "{playerSearchQuery}".
                  </div>
                ) : (
                  filteredAvailablePlayers.map((player) => (
                    <div
                      key={player.id || player.nickname}
                      id={`pick-player-${player.nickname}`}
                      onClick={() => handleAddOpponent(player)}
                      className="p-2.5 rounded-xl bg-[#090e15] hover:bg-[#111c2a] border border-white/10 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={player.avatar}
                          alt={player.nickname}
                          className="w-8 h-8 rounded-lg object-cover border border-cyan-400 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white uppercase font-display truncate">
                              {player.name || player.nickname}
                            </span>
                            <span className="text-cyan-400 text-[10px] font-mono-stat">
                              {player.tag || '#000'}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono-stat truncate block">
                            {player.crew || 'Sem Clã'} • Nv {player.level || 1} • {player.points || 0} pts
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-[10px] font-black font-mono-stat uppercase tracking-wider shrink-0 transition-all"
                      >
                        Selecionar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 1: CONFIGURE FIELDS */}
          {step === 'configure' && (
            <>
              {/* 1. SELEÇÃO DE ROTA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider font-mono-stat flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    1. ESCOLHER ROTA ({routes.length} DISPONÍVEIS)
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono-stat">Obrigatório</span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {routes.map((route) => {
                    const isSelected = selectedRouteId === route.id;
                    return (
                      <div
                        key={route.id}
                        id={`select-route-${route.id}`}
                        onClick={() => setSelectedRouteId(route.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-950/40 border-yellow-400 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                            : 'bg-[#0c1420] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white uppercase font-display truncate">
                              {route.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono-stat ${
                                route.difficulty === 'Iniciante'
                                  ? 'bg-yellow-500/20 text-emerald-300 border border-yellow-400/40'
                                  : route.difficulty === 'Intermediário'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                                  : route.difficulty === 'Avançado'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-red-500/20 text-red-300 border border-red-400/40'
                              }`}
                            >
                              {route.difficulty}
                            </span>
                            {route.isCircuit && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[9px] font-mono-stat uppercase">
                                Circuito
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono-stat">
                            <span className="text-yellow-400 font-bold">{route.distanceKm.toFixed(1)} km</span>
                            <span>•</span>
                            <span className="truncate">{route.location}</span>
                            <span>•</span>
                            <span className="text-amber-400">+{route.points || 250} XP</span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-400 text-black'
                              : 'border-slate-600 bg-black/40'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. TIPO DE DESAFIO */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono-stat mb-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                  2. TIPO DE DESAFIO
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHALLENGE_TYPES.map((typeOption) => {
                    const isSelected = selectedType === typeOption.type;
                    return (
                      <div
                        key={typeOption.type}
                        id={`select-type-${typeOption.type}`}
                        onClick={() => setSelectedType(typeOption.type)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'bg-[#0c1420] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{typeOption.icon}</span>
                            <span className="text-xs font-bold text-white uppercase font-display">
                              {typeOption.title}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono-stat text-neutral-300 uppercase">
                            {typeOption.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {typeOption.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. HORÁRIO PRETENDIDO */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono-stat mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  3. HORÁRIO PRETENDIDO
                </label>

                <div className="p-3.5 rounded-2xl bg-[#0c1420] border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Date input */}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono-stat block mb-1">
                        Data Proposta (DD/MM/AAAA)
                      </span>
                      <div className="relative">
                        <input
                          type="text"
                          id="input-challenge-date"
                          value={proposedDate}
                          onChange={(e) => setProposedDate(e.target.value)}
                          placeholder="Ex: 15/08/2026"
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono-stat text-xs focus:border-yellow-400 focus:outline-none"
                        />
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>

                      {/* Quick date chips */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickDate(0)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-neutral-300 font-mono-stat cursor-pointer"
                        >
                          Hoje
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDate(1)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-neutral-300 font-mono-stat cursor-pointer"
                        >
                          Amanhã
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDate(2)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-neutral-300 font-mono-stat cursor-pointer"
                        >
                          +2 dias
                        </button>
                      </div>
                    </div>

                    {/* Time input */}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono-stat block mb-1">
                        Horário (HH:MM)
                      </span>
                      <div className="relative">
                        <input
                          type="text"
                          id="input-challenge-time"
                          value={proposedTime}
                          onChange={(e) => setProposedTime(e.target.value)}
                          placeholder="Ex: 19:30"
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono-stat text-xs focus:border-yellow-400 focus:outline-none"
                        />
                        <Clock className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>

                      {/* Quick time chips */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {['18:00', '19:30', '20:00', '21:00'].map((timeStr) => (
                          <button
                            key={timeStr}
                            type="button"
                            onClick={() => setProposedTime(timeStr)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-stat transition-all cursor-pointer ${
                              proposedTime === timeStr
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                                : 'bg-white/5 hover:bg-white/15 text-neutral-300'
                            }`}
                          >
                            {timeStr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recapitulation of schedule */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono-stat">
                    <span className="text-neutral-400">Horário Definido:</span>
                    <span className="text-amber-400 font-bold">
                      📅 {proposedDate} às ⏰ {proposedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-advance-summary"
                  type="button"
                  onClick={() => setStep('summary')}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00ff66] text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_15px_rgba(0,255,102,0.4)] flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Revisar Desafio {challengeMode.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: SUMMARY BEFORE SENDING (RESUMO DO DESAFIO) */}
          {step === 'summary' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center p-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 text-yellow-400 mb-2">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white uppercase font-display">
                  CONFIRMAÇÃO DO DESAFIO {challengeMode.toUpperCase()}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Revise todos os participantes e detalhes antes de disparar o convite.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#0c1420] border-2 border-yellow-500/40 shadow-lg space-y-3 font-mono-stat">
                {/* Criador */}
                <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
                  <span className="text-neutral-400 uppercase font-bold">CRIADOR:</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.nickname}
                      className="w-5 h-5 rounded-full object-cover border border-yellow-400"
                    />
                    <span className="font-bold text-white uppercase">{currentUser.nickname}</span>
                    <span className="text-yellow-400 text-[10px]">{currentUser.tag || '#000'}</span>
                  </div>
                </div>

                {/* Participantes */}
                <div className="py-2 border-b border-white/10 text-xs space-y-1.5">
                  <span className="text-neutral-400 uppercase font-bold block">
                    PARTICIPANTES ({opponentsCount + 1}):
                  </span>
                  <div className="space-y-1 pl-1">
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <span className="text-yellow-400">👑</span>
                        <span>{currentUser.nickname}</span>
                      </span>
                      <span className="text-[10px] text-yellow-400 font-bold">DESAFIANTE</span>
                    </div>
                    {opponents.map((opp, idx) => (
                      <div key={opp.id || idx} className="flex items-center justify-between text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <span className="text-cyan-400">⚔️</span>
                          <span>{opp.nickname}</span>
                          <span className="text-[10px] text-neutral-400">{opp.tag}</span>
                        </span>
                        <span className="text-[10px] text-cyan-300 font-bold">ADVERSÁRIO #{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rota */}
                <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
                  <span className="text-neutral-400 uppercase font-bold">ROTA:</span>
                  <div className="text-right">
                    <span className="font-bold text-cyan-300 block">{selectedRoute.name}</span>
                    <span className="text-[10px] text-neutral-400">
                      {selectedRoute.distanceKm.toFixed(1)} km • {selectedRoute.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tipo de Desafio */}
                <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
                  <span className="text-neutral-400 uppercase font-bold">TIPO:</span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <span>{selectedChallengeTypeObj.icon}</span>
                    <span>{selectedChallengeTypeObj.title}</span>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-neutral-400 uppercase font-bold">HORÁRIO:</span>
                  <div className="font-bold text-yellow-400">
                    {proposedDate} às {proposedTime}
                  </div>
                </div>
              </div>

              {/* Explanatory note */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono-stat flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  {challengeMode === 'x2'
                    ? 'Cada um dos 2 adversários receberá sua notificação individual. O desafio será confirmado assim que todos aceitarem.'
                    : 'O adversário receberá uma notificação e poderá aceitar ou sugerir outro horário na negociação.'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  VOLTAR
                </button>

                <button
                  id="btn-submit-direct-challenge"
                  type="button"
                  onClick={handleSendChallenge}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00ff66] hover:from-emerald-300 hover:to-yellow-400 text-black font-black text-sm uppercase font-mono-stat tracking-wider shadow-[0_0_20px_rgba(0,255,102,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  ENVIAR DESAFIO
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS FEEDBACK */}
          {step === 'success' && (
            <div className="text-center py-6 px-2 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 mx-auto shadow-[0_0_25px_rgba(0,255,102,0.5)] animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase font-display tracking-tight">
                  DESAFIO {challengeMode.toUpperCase()} ENVIADO!
                </h3>
                <p className="text-xs text-neutral-300 mt-1 font-mono-stat">
                  Notificações enviadas para{' '}
                  <b>{opponents.map((o) => o.nickname).join(' e ')}</b> para disputar na rota{' '}
                  <b>{selectedRoute.name}</b> em <b>{proposedDate} às {proposedTime}</b>.
                </p>
                <p className="text-[11px] text-yellow-400/80 mt-2 font-mono-stat">
                  Acompanhe as respostas e a negociação na aba Meus Desafios.
                </p>
              </div>

              <div className="pt-4">
                <button
                  id="btn-finish-challenge-success"
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-5 rounded-xl bg-yellow-400 text-black font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_15px_rgba(0,255,102,0.4)] active:scale-95 transition-all cursor-pointer"
                >
                  CONCLUÍDO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
