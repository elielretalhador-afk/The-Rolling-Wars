import React from 'react';
import { Map, Navigation, Trophy, Swords, User, Activity, Users } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  onOpenFeed?: () => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, onOpenFeed }) => {
  const tabs = [
    { id: 'mapa' as TabType, label: 'MAPA', icon: Map },
    { id: 'feed' as any, label: 'SOCIAL', icon: Users },
    { id: 'ranking' as TabType, label: 'RANKING', icon: Trophy },
    { id: 'perfil' as TabType, label: 'HUB', icon: User },
  ];

  return (
    <nav className="relative z-40 bg-[#050505]/98 border-t border-[#000000]/40 px-2 py-1.5  shadow-[0_-8px_30px_rgba(0,0,0,0.9)]">
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#fce803]/30 to-transparent pointer-events-none" />

      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                onChangeTab(tab.id as TabType);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[58px] transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive ? 'text-[#fce803]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Neon Pill Indicator at top */}
              {isActive && (
                <div className="absolute -top-1.5 w-7 h-1 bg-[#fce803] rounded-full shadow-[0_0_10px_#fce803]" />
              )}

              {/* Icon Container with glowing game container */}
              <div
                className={`p-1.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-[#fce803]/15 border border-[#fce803]/40 shadow-[0_0_12px_rgba(252,232,3,0.25)]'
                    : 'bg-transparent border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.6] text-[#fce803]' : 'scale-100 stroke-[2] text-slate-400'
                  }`}
                />
              </div>

              {/* Tab label */}
              <span
                className={`text-[9px] font-black mt-0.5 uppercase tracking-wider font-mono-stat transition-colors leading-none ${
                  isActive ? 'text-[#fce803] font-black' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

