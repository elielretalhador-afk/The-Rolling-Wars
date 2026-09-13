import React from 'react';
import { Clan, UserProfile } from '../types';

interface JoinClanModalProps {
  isOpen: boolean;
  onClose: () => void;
  clans: Clan[];
  currentUser: UserProfile;
  onJoinClan: (clan: Clan) => void;
  onSelectClan?: (clan: Clan) => void;
  onCreateClanClick?: () => void;
}

export const JoinClanModal: React.FC<JoinClanModalProps> = ({ isOpen, onClose, clans, onJoinClan, onSelectClan }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="bg-[#050505] p-6 rounded-3xl w-full max-w-md border-2 border-yellow-500/40 shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-xl font-black uppercase tracking-tight text-white font-display">Entrar em um Clã</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {clans.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Nenhum clã disponível no momento.</p>
          ) : (
            clans.map(clan => (
              <div key={clan.id} className="p-3 bg-[#121A24] rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-yellow-500/50 transition-colors">
                <div 
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => onSelectClan && onSelectClan(clan)}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${clan.color}20`, border: `1px solid ${clan.color}50` }}>
                    {clan.symbol}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{clan.name} <span className="text-xs text-slate-400">[{clan.tag}]</span></h4>
                    <p className="text-xs text-slate-400 font-mono-stat">{clan.membersCount} / {clan.maxMembers} membros</p>
                  </div>
                </div>
                <button 
                  onClick={() => onJoinClan(clan)}
                  disabled={(clan.membersCount || 0) >= (clan.maxMembers || 0)}
                  className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-[10px] font-black uppercase font-mono-stat rounded-xl shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Entrar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
