import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/db';
import { Activity, Gauge, Swords, Users, Route } from 'lucide-react';
import { SegmentDetailsModal } from './SegmentDetailsModal';

export const SegmentsHub: React.FC<{
  onSelectSegmentOnMap: (segmentId: string) => void;
}> = ({ onSelectSegmentOnMap }) => {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  useEffect(() => {
    async function fetch() {
      const segs = await DatabaseService.getAllSegmentsWithRecords();
      setSegments(segs);
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white font-display tracking-wide uppercase">Sprints de Velocidade</h3>
      </div>
      
      {loading ? (
         <div className="text-center text-slate-400 py-8 font-mono-stat text-xs">Buscando segmentos...</div>
      ) : segments.length === 0 ? (
         <div className="text-center text-slate-400 py-8 font-mono-stat text-xs uppercase">Nenhum segmento encontrado.</div>
      ) : (
         <div className="space-y-3">
           {segments.map(seg => (
              <div key={seg.id} className="p-3 bg-[#0c1420] border border-white/5 rounded-xl cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={() => setSelectedSegment(seg)}>
                 <div className="flex justify-between items-start">
                   <div>
                     <h4 className="text-sm font-black text-white uppercase">{seg.name}</h4>
                     <p className="text-[10px] text-slate-400 font-mono-stat flex items-center gap-1 mt-1">
                       <Route className="w-3 h-3" /> {(seg.length || 0).toFixed(0)}m • ↔ Bidirecional
                     </p>
                   </div>
                   {seg.bestRecord ? (
                     <div className="text-right">
                       <div className="text-[10px] text-amber-400 font-black uppercase flex items-center justify-end gap-1"><Gauge className="w-3 h-3" /> Recorde</div>
                       <div className="text-xs font-bold text-white mt-0.5 truncate max-w-[100px]">{seg.bestRecord.playerName}</div>
                       <div className="text-lg font-black text-amber-300 font-mono-stat leading-none mt-1">{seg.bestRecord.averageSpeedKmH || 0} <span className="text-[10px]">KM/H</span></div>
                     </div>
                   ) : (
                     <div className="text-right flex flex-col justify-center items-end">
                       <div className="text-[10px] text-yellow-400 font-black uppercase mb-1">⚡ Seja o primeiro</div>
                       <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-[9px] font-black uppercase font-mono-stat rounded border border-yellow-500/30">Desafiar</button>
                     </div>
                   )}
                 </div>
              </div>
           ))}
         </div>
      )}

      {selectedSegment && (
        <SegmentDetailsModal
          segmentId={selectedSegment.id}
          segmentData={selectedSegment}
          onClose={() => setSelectedSegment(null)}
          onChallenge={() => {
             setSelectedSegment(null);
             onSelectSegmentOnMap(selectedSegment.id);
          }}
        />
      )}
    </div>
  );
};
