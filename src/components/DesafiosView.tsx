import React, { useState } from 'react';
import { Target, Swords, Trophy } from 'lucide-react';
import { Challenge, DirectChallenge, Mission, UrbanozeiroEvent, UserProfile } from '../types';
import { DirectChallengesHub } from './DirectChallengesHub';
import { EventsHub } from './EventsHub';
import { MissionsHub } from './MissionsHub';

interface DesafiosViewProps {
  challenges?: Challenge[];
  missions?: Mission[];
  directChallenges?: DirectChallenge[];
  events?: UrbanozeiroEvent[];
  currentUser?: UserProfile;
  onStartChallenge?: (challenge: Challenge | Mission) => void;
  onClaimMissionReward?: (mission: Mission) => void;
  onSelectDirectChallenge?: (challenge: DirectChallenge) => void;
  onSelectEvent?: (event: UrbanozeiroEvent) => void;
  onRegisterEvent?: (event: UrbanozeiroEvent) => void;
  onOpenCreateChallenge?: () => void;
  onStartLiveChallenge?: (challengeId: string) => void;
  onSelectZoneOnMap?: (zoneId: string) => void;
  initialTab?: 'urbanos' | 'diretos' | 'eventos';
}

export const DesafiosView: React.FC<DesafiosViewProps> = ({
  challenges = [],
  missions = [],
  directChallenges = [],
  events = [],
  currentUser,
  onStartChallenge,
  onClaimMissionReward,
  onSelectDirectChallenge,
  onSelectEvent,
  onRegisterEvent,
  onOpenCreateChallenge,
  onStartLiveChallenge,
  onSelectZoneOnMap,
  initialTab = 'diretos',
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'urbanos' | 'diretos' | 'eventos'>(initialTab);

  const pendingReceivedCount = currentUser
    ? directChallenges.filter(
        (c) =>
          (c.challengedId === currentUser.id || c.challengedNickname === currentUser.nickname) &&
          (c.status === 'pendente' || c.status === 'negociando')
      ).length
    : 0;

  const openEventsCount = events.filter(
    (e) => e.status === 'REGISTRATION_OPEN' && e.currentParticipants < e.maxParticipants
  ).length;

  const completedMissionsCount = missions.filter((m) => m.status === 'COMPLETED').length;

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain px-4 py-4 pb-36 bg-[#080b0e]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider font-mono-stat">
          <Target className="w-4 h-4" />
          ARENA DE COMPETIÇÃO
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-0.5">
          MISSÕES & DESAFIOS
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-medium">
          Cumpra missões solo, dispute duelos X1 ou participe de eventos e torneios com chaveamento oficial.
        </p>
      </div>

      {/* Main Mode Toggle: MISSÕES URBANAS | DESAFIOS X1 | EVENTOS */}
      <div className="grid grid-cols-2 p-1 bg-[#0c1420] border border-white/10 rounded-2xl mb-4 gap-1">
        

        <button
          id="tab-toggle-desafios-diretos"
          type="button"
          onClick={() => setActiveMainTab('diretos')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 relative cursor-pointer ${
            activeMainTab === 'diretos'
              ? 'bg-yellow-400 text-black font-black shadow-[0_0_15px_rgba(0,255,102,0.4)]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span className="truncate">DUELOS X1</span>
          {pendingReceivedCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono-stat ${
                activeMainTab === 'diretos'
                  ? 'bg-black text-yellow-400'
                  : 'bg-yellow-400 text-black animate-pulse'
              }`}
            >
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          id="tab-toggle-desafios-eventos"
          type="button"
          onClick={() => setActiveMainTab('eventos')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all flex items-center justify-center gap-1.5 relative cursor-pointer ${
            activeMainTab === 'eventos'
              ? 'bg-amber-400 text-black font-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">EVENTOS</span>
          {openEventsCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono-stat ${
                activeMainTab === 'eventos'
                  ? 'bg-black text-amber-400'
                  : 'bg-amber-400 text-black animate-pulse'
              }`}
            >
              {openEventsCount}
            </span>
          )}
        </button>
      </div>

      {/* VIEW: EVENTOS & TORNEIOS */}
      {activeMainTab === 'eventos' && onSelectEvent && (
        <EventsHub
          events={events}
          currentUser={currentUser}
          onSelectEvent={onSelectEvent}
          onRegisterEvent={onRegisterEvent}
        />
      )}

      {/* VIEW: DIRECT CHALLENGES (X1) */}
      {activeMainTab === 'diretos' && (
        <div className="space-y-4">
          {currentUser && onSelectDirectChallenge ? (
            <DirectChallengesHub
              challenges={directChallenges}
              currentUser={currentUser}
              onSelectChallenge={onSelectDirectChallenge}
              onOpenCreateChallenge={onOpenCreateChallenge}
              onStartLiveChallenge={onStartLiveChallenge}
            />
          ) : (
            <div className="p-6 text-center text-neutral-400 font-mono-stat text-xs">
              Carregando desafios diretos...
            </div>
          )}
        </div>
      )}

      {/* VIEW: URBAN MISSIONS */}
      {activeMainTab === 'urbanos' && (
        <MissionsHub
          missions={missions}
          onClaimReward={(m) => onClaimMissionReward && onClaimMissionReward(m)}
          onStartMission={(m) => onStartChallenge && onStartChallenge(m as any)}
          onSelectZoneOnMap={onSelectZoneOnMap}
        />
      )}
    </div>
  );
};
