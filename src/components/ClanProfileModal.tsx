import React from 'react';
import { Clan, RankPlayer } from '../types';

interface ClanProfileModalProps {
  clan: Clan | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onOpenLeaderboard?: () => void;
  onSelectMember?: (player: RankPlayer) => void;
  onLeaveClan?: (clanId: string) => void;
}

export const ClanProfileModal: React.FC<ClanProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#000000] p-6 rounded-2xl w-full max-w-md text-center border border-yellow-500/30">
        <h2 className="text-xl font-bold text-white mb-2">Perfil do Clã</h2>
        <p className="text-neutral-400 mb-6">Em breve.</p>
        <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Fechar</button>
      </div>
    </div>
  );
};
