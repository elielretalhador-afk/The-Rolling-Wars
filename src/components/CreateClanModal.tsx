import React, { useState } from 'react';
import { ClanCreationInput } from '../types';
import { X, Shield } from 'lucide-react';

interface CreateClanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClan: (clanData: ClanCreationInput) => void;
}

const CLAN_ICONS = ['⚡', '🐺', '🦅', '🔥', '💀', '🛡️', '⚔️', '👑'];

export const CreateClanModal: React.FC<CreateClanModalProps> = ({ isOpen, onClose, onCreateClan }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(CLAN_ICONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateClan({ name: name.trim(), tag: name.trim().substring(0, 3).toUpperCase(), symbol: icon, color: '#fce803' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="bg-[#000000] p-6 rounded-2xl w-full max-w-md border-2 border-yellow-400 shadow-[0_0_30px_rgba(252,232,3,0.15)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-yellow-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display uppercase tracking-wide">CRIAR CLÃ</h2>
            <p className="text-xs text-blue-200 font-mono-stat">Reúna sua equipe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Nome do Clã</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0e14] border border-blue-400/30 rounded-xl p-3 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-yellow-400"
              placeholder="Digite o nome..."
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Símbolo</label>
            <div className="flex flex-wrap gap-2">
              {CLAN_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === i 
                      ? 'bg-yellow-400 border border-yellow-400 text-black scale-110 shadow-lg' 
                      : 'bg-[#0a0e14] border border-blue-400/30 text-white hover:border-yellow-400/50'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 mt-4 bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            FUNDAR CLÃ
          </button>
        </form>
      </div>
    </div>
  );
};
