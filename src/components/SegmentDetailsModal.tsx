import React, { useEffect, useState } from 'react';
import { X, Gauge, Route, Swords, Trophy, Clock } from 'lucide-react';
import { DatabaseService } from '../services/db';
import { AuthService } from '../services/auth';

export const SegmentDetailsModal: React.FC<{
  segmentId: string;
  segmentData?: any; // initial data
  onClose: () => void;
  onChallenge: () => void;
}> = ({ segmentId, segmentData, onClose, onChallenge }) => {
  const [data, setData] = useState<any>(segmentData || null);
  const [top10, setTop10] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!data) {
        const seg = null; //(segmentId);
        setData(seg);
      }
      const attempts: any[] = []; //(segmentId, 10);
      setTop10(attempts);
      
      const user = await AuthService.getCurrentUser();
      if (user) {
         const pos = attempts.findIndex(a => a.playerId === user.uid);
         if (pos !== -1) {
            setUserPos(pos + 1);
         }
      }
      setLoading(false);
    }
    load();
  }, [segmentId]);

  if (!data && !loading) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div className="w-full sm:w-full sm:max-w-md bg-[#090d14] rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 flex flex-col relative pointer-events-auto max-h-[85vh] sm:max-h-[90vh]">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-neutral-400 hover:text-white transition-colors z-10 border border-white/5">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-4 border-b border-white/5 shrink-0 overflow-y-auto custom-scrollbar">
           {loading && !data ? (
              <div className="py-12 text-center text-neutral-400 font-mono-stat text-xs uppercase">Carregando segmento...</div>
           ) : (
              <>
                 <div className="flex items-center gap-2 mb-2 mt-4 sm:mt-0">
                   <div className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-black rounded uppercase font-mono-stat tracking-wider">
                     Sprint
                   </div>
                   <div className="text-[10px] text-neutral-400 font-mono-stat flex items-center gap-1">
                     <Route className="w-3 h-3" /> {(data.length || 0).toFixed(0)}m
                   </div>
                 </div>
                 
                 <h2 className="text-xl font-black text-white uppercase leading-tight font-display pr-10 mb-4">
                   {data.name}
                 </h2>

                 {/* Current Record */}
                 <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <Trophy className="w-5 h-5 text-amber-400" />
                       <div>
                         <div className="text-[10px] text-amber-400/80 font-black uppercase font-mono-stat">RECORDE ATUAL</div>
                         <div className="text-sm font-bold text-white">{data.bestRecord ? data.bestRecord.playerName : 'Nenhum recorde'}</div>
                       </div>
                     </div>
                     {data.bestRecord && (
                       <div className="text-right">
                         <div className="text-2xl font-black text-amber-400 font-mono-stat leading-none">{data.bestRecord.averageSpeedKmH || 0}</div>
                         <div className="text-[10px] text-amber-400/80 font-black uppercase font-mono-stat mt-0.5">KM/H</div>
                       </div>
                     )}
                   </div>
                 </div>

                 <div className="flex items-center justify-between mb-3">
                   <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">Hall da Fama (Top 10)</h3>
                   {userPos !== null ? (
                     <div className="text-[10px] text-yellow-400 font-mono-stat border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded">Sua posição: #{userPos}</div>
                   ) : (
                     <div className="text-[9px] text-slate-500 font-mono-stat">Posição individual ainda depende de consulta específica.</div>
                   )}
                 </div>
                 
                 {loading ? (
                    <div className="text-center text-slate-500 text-[10px] py-4 uppercase font-mono-stat">Carregando tempos...</div>
                 ) : top10.length === 0 ? (
                    <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-white/5 border-dashed">
                      <div className="text-yellow-400 font-black uppercase text-xs mb-1">Ninguém dominou este segmento</div>
                      <div className="text-[10px] text-neutral-400 font-mono-stat">Seja o primeiro a registrar um tempo.</div>
                    </div>
                 ) : (
                    <div className="space-y-2">
                       {top10.map((attempt, idx) => (
                          <div key={attempt.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black font-mono-stat ${idx === 0 ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-orange-400 text-black' : 'bg-white/10 text-neutral-400'}`}>
                                  {idx + 1}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white uppercase truncate max-w-[120px]">{attempt.playerName || 'Anônimo'}</div>
                                  <div className="text-[9px] text-neutral-400 font-mono-stat flex items-center gap-1 mt-0.5">
                                    <Clock className="w-2.5 h-2.5" /> {(attempt.timeSeconds || 0).toFixed(2)}s
                                  </div>
                                </div>
                             </div>
                             <div className="text-right">
                               <div className="text-xs font-black text-white font-mono-stat">{attempt.averageSpeedKmH || 0} km/h</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}

                 <div className="mt-6 mb-2">
                   <button 
                     onClick={onChallenge}
                     className="w-full py-3.5 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 active:scale-98 font-mono-stat cursor-pointer"
                   >
                     <Swords className="w-4 h-4 stroke-[2.5]" />
                     DESAFIAR SEGMENTO
                   </button>
                 </div>
              </>
           )}
        </div>
      </div>
    </div>
  );
};
