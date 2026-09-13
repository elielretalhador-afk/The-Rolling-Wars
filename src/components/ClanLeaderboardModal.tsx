import React from 'react';
import { Clan } from '../types';
import { X, Shield, Users, Trophy } from 'lucide-react';

interface ClanLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  clans: Clan[];
  onSelectClan: (clan: Clan) => void;
  onCreateClanClick?: () => void;
}

export const ClanLeaderboardModal: React.FC<ClanLeaderboardModalProps> = ({ 
  isOpen, onClose, clans, onSelectClan, onCreateClanClick 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="bg-[#050505] p-1 rounded-3xl w-full max-w-md border border-yellow-500/30 shadow-[0_0_40px_rgba(252,232,3,0.1)] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0a0e14] to-[#1a1405] p-6 pb-6 relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display uppercase tracking-wide">CLÃS</h2>
              <p className="text-xs text-yellow-500/70 font-mono-stat">Explore as facções da cidade</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {clans.map((clan, idx) => (
            <div 
              key={clan.id || idx}
              onClick={() => onSelectClan(clan)}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-400/50 cursor-pointer flex items-center gap-3 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 rounded-lg bg-black/50 border border-yellow-400/30 flex items-center justify-center text-2xl flex-shrink-0">
                {clan.icon || clan.symbol || '🛡️'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm truncate">{clan.name}</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-black tracking-wider uppercase">
                    {clan.tag || clan.name.substring(0,3).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono-stat uppercase">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {clan.memberCount}</span>
                  {clan.leaderName && <span>Líder: {clan.leaderName}</span>}
                </div>
              </div>
            </div>
          ))}
          {clans.length === 0 && (
            <div className="text-center p-6 text-slate-400 text-sm">
              Nenhum clã encontrado. Seja o primeiro a criar um!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button 
            onClick={() => {
              onClose();
              if (onCreateClanClick) onCreateClanClick();
            }}
            className="w-full py-3 bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl hover:bg-yellow-300 shadow-[0_0_15px_rgba(252,232,3,0.3)]"
          >
            CRIAR MEU CLÃ
          </button>
        </div>
      </div>
    </div>
  );
};
