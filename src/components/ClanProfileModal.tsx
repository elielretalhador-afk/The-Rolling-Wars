import React, { useState } from 'react';
import { Clan, RankPlayer } from '../types';
import { X, Shield, Users, Crown, LogOut } from 'lucide-react';
import { SeasonService } from '../services/seasonService';
import { ClanService } from '../services/clan';
import { SocialService } from '../services/social';

interface ClanProfileModalProps {
  clan: Clan | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onOpenLeaderboard?: () => void;
  onSelectMember?: (player: RankPlayer) => void;
  onLeaveClan?: (clanId: string) => void;
}

export const ClanProfileModal: React.FC<ClanProfileModalProps> = ({ 
  clan, isOpen, onClose, currentUserId, onLeaveClan 
}) => {
  const [inviteUserId, setInviteUserId] = useState('');
  const [myInvites, setMyInvites] = React.useState<any[]>([]);
  const [seasonScore, setSeasonScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (clan && isOpen) {
      SeasonService.getActiveSeason().then(season => {
         if (season) {
            SeasonService.getTopClans(season.id).then(clans => {
               const myClan = clans.find(c => c.clanId === clan.id);
               if (myClan) setSeasonScore(myClan.score);
               else setSeasonScore(0);
            });
         }
      });
    }
  }, [clan, isOpen]);

  
  React.useEffect(() => {
    if (currentUserId && isOpen) {
      ClanService.getMyInvites(currentUserId).then(setMyInvites);
    }
  }, [currentUserId, isOpen]);

  if (!isOpen || !clan) return null;

  const isMember = clan.memberIds?.includes(currentUserId || '');
  const isLeader = clan.leaderId === currentUserId;

  const handleInvite = async () => {
    if (!inviteUserId.trim() || !currentUserId) return;
    try {
      await ClanService.invitePlayer(clan.id, clan.name, currentUserId, inviteUserId.trim());
      alert('Convite enviado com sucesso!');
      setInviteUserId('');
    } catch (e: any) {
      alert(e.message || 'Erro ao convidar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="bg-[#050505] p-1 rounded-3xl w-full max-w-md border border-blue-600/30 shadow-[0_0_40px_rgba(29,78,216,0.15)] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#000000] to-[#0a1226] p-6 pb-8 relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center mt-4">
            <div className="w-20 h-20 rounded-2xl bg-[#0a0e14] border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(252,232,3,0.3)] mb-4">
              {clan.icon || clan.symbol || '🛡️'}
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display text-center leading-tight">
              {clan.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase rounded-lg border border-yellow-400/30 flex items-center gap-1">
                <Users className="w-3 h-3" /> {clan.memberCount} MEMBROS
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          
          {isLeader && (
            <div className="mb-6 bg-blue-900/20 border border-neutral-700/30 p-4 rounded-2xl">
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Convidar Jogador (ID)</h3>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={inviteUserId}
                  onChange={(e) => setInviteUserId(e.target.value)}
                  placeholder="ID do usuário..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-400 outline-none"
                />
                <button onClick={handleInvite} className="px-4 bg-yellow-400 text-black font-bold uppercase rounded-xl hover:bg-yellow-300 text-xs">
                  Convidar
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 bg-[#0a0e14] border border-yellow-400/20 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> STATUS TERRITORIAL
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono-stat">{clan.territoryScore || 0}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Pontuação<br/>Territorial</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono-stat">{clan.zonesControlledCount || 0}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Zonas<br/>Controladas</span>
              </div>
            </div>
            
            {/* Missões Section */}
            {clan.missions && clan.missions.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    MISSÕES DO CLÃ
                 </h3>
                 <div className="space-y-3">
                   {clan.missions.map((m: any, idx: number) => {
                      const isCompleted = m.status === 'completed';
                      const isExpired = m.status === 'expired';
                      const percent = Math.min(100, Math.max(0, (m.progress / m.target) * 100));
                      
                      return (
                        <div key={idx} className={`p-3 rounded-xl border ${isCompleted ? 'border-yellow-400/50 bg-yellow-400/10' : isExpired ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                           <div className="flex justify-between items-start mb-1">
                             <div className="font-bold text-white text-sm flex items-center gap-1.5 uppercase">
                                {isCompleted ? '🏆 ' : ''}{m.title}
                             </div>
                             {isCompleted ? (
                               <span className="text-[10px] text-yellow-400 font-black uppercase bg-yellow-400/20 px-2 py-0.5 rounded-full">CONCLUÍDA</span>
                             ) : isExpired ? (
                               <span className="text-[10px] text-red-400 font-black uppercase bg-red-500/20 px-2 py-0.5 rounded-full">EXPIRADA</span>
                             ) : (
                               <span className="text-[10px] text-blue-400 font-black uppercase bg-blue-500/20 px-2 py-0.5 rounded-full">{m.type}</span>
                             )}
                           </div>
                           <div className="text-xs text-slate-400 mb-2">{m.description}</div>
                           
                           {/* Progress Bar */}
                           <div className="flex items-center gap-3">
                             <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                               <div className={`h-full ${isCompleted ? 'bg-yellow-400' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} />
                             </div>
                             <div className="text-[10px] font-mono-stat text-white whitespace-nowrap">
                               {m.progress} / {m.target}
                             </div>
                           </div>
                           
                           <div className="mt-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                             <span className="text-yellow-400">Recompensa: +{m.rewardXp} XP</span>
                             {!isCompleted && !isExpired && (
                               <span className="text-slate-500 font-mono-stat">{Math.max(0, Math.floor((m.expiresAt - Date.now()) / 3600000))}h restantes</span>
                             )}
                           </div>
                        </div>
                      )
                   })}
                 </div>
              </div>
            )}
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Membros ({clan.members?.length || 0})</h3>
          <div className="space-y-2 mb-6">
            {(clan.members || []).map((m: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex flex-shrink-0 items-center justify-center text-lg">
                  {m.name?.[0] || '?'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-white text-sm truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono-stat">{m.role}</div>
                </div>
                {m.userId === clan.leaderId && (
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 shrink-0 flex flex-col gap-2">
          {isMember && (
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja sair deste clã?')) {
                  if (onLeaveClan) onLeaveClan(clan.id);
                  onClose();
                }
              }}
              className="w-full py-3 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 font-bold uppercase tracking-wider rounded-xl border border-red-500/20 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" /> Sair do Clã
            </button>
          )}
          
          {!isMember && myInvites.some(inv => inv.clanId === clan.id) && (
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  const inv = myInvites.find(i => i.clanId === clan.id);
                  if (inv) {
                    try {
                      const userStr = localStorage.getItem('urbanozeiro_user');
                      const user = userStr ? JSON.parse(userStr) : { name: 'Player' };
                      await ClanService.acceptInvite(inv.id, clan.id, currentUserId || '', user.name || user.username);
                      alert('Bem vindo ao clã!');
                      onClose();
                      window.location.reload(); // Simple refresh for now
                    } catch(e:any) { alert(e.message); }
                  }
                }}
                className="flex-1 py-3 bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl hover:bg-yellow-300"
              >
                ENTRAR
              </button>
              <button 
                onClick={async () => {
                  const inv = myInvites.find(i => i.clanId === clan.id);
                  if (inv) {
                    try {
                      await ClanService.rejectInvite(inv.id);
                      alert('Convite recusado.');
                      onClose();
                    } catch(e:any) { alert(e.message); }
                  }
                }}
                className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-wider rounded-xl hover:bg-slate-700 hover:text-white"
              >
                RECUSAR
              </button>
            </div>
          )}
          
          {!isMember && !myInvites.some(inv => inv.clanId === clan.id) && (
            <div className="text-center text-xs text-slate-500 font-bold uppercase">
              Somente convidados podem entrar
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
