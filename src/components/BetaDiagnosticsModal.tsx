import React, { useState, useEffect } from 'react';
import { Bug, X, RefreshCw, HardDrive, Wifi, ShieldCheck, MapPin } from 'lucide-react';
import { loadIdb, KEYS } from '../services/db';

interface BetaDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords: any;
}

export const BetaDiagnosticsModal: React.FC<BetaDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  userCoords
}) => {
  const [stats, setStats] = useState({
    sessions: 0,
    activities: 0,
    zonesOutbox: 0,
    segmentsOutbox: 0
  });

  const loadStats = async () => {
    try {
      const s = await loadIdb<any[]>(KEYS.SESSIONS, []);
      const a = await loadIdb<any[]>(KEYS.ACTIVITIES, []);
      const z = await loadIdb<any[]>(KEYS.ZONE_OUTBOX, []);
      const seg = await loadIdb<any[]>(KEYS.SEGMENT_OUTBOX, []);
      setStats({
        sessions: s.filter((x: any) => x.syncStatus === 'pending' || x.syncStatus === 'error').length,
        activities: a.filter((x: any) => x.syncStatus === 'pending' || x.syncStatus === 'error').length,
        zonesOutbox: z.length,
        segmentsOutbox: seg.length
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#090d12] border-2 border-slate-700 shadow-2xl p-5 text-slate-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-black text-white uppercase font-display">
              Diagnóstico Beta
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 font-mono-stat text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> GPS Status</span>
              <span className={userCoords ? 'text-green-400 font-black' : 'text-amber-400 font-black'}>
                {userCoords ? 'Recebendo Coords' : 'Aguardando GPS'}
              </span>
            </div>
            {userCoords && (
              <div className="text-[10px] text-slate-500">
                Lat: {userCoords.latitude.toFixed(6)} | Lng: {userCoords.longitude.toFixed(6)}<br/>
                Acurácia: {userCoords.accuracy?.toFixed(1) ?? 'N/A'}m
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1"><HardDrive className="w-3.5 h-3.5"/> Fila de Sincronização (Local)</span>
              <button onClick={loadStats} className="p-1 rounded bg-slate-800 hover:bg-slate-700"><RefreshCw className="w-3 h-3 text-slate-400"/></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Sessões Pend.</div>
                <div className="text-lg font-black text-amber-400">{stats.sessions}</div>
              </div>
              <div className="p-2 rounded bg-slate-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Zonas Outbox</div>
                <div className="text-lg font-black text-amber-400">{stats.zonesOutbox}</div>
              </div>
              <div className="p-2 rounded bg-slate-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Segmentos Outbox</div>
                <div className="text-lg font-black text-amber-400">{stats.segmentsOutbox}</div>
              </div>
              <div className="p-2 rounded bg-slate-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Atividades Pend.</div>
                <div className="text-lg font-black text-amber-400">{stats.activities}</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Segurança
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              O projeto opera em modo Offline-First. Todas as sessões terminadas são colocadas na fila local e validadas pelo servidor via Firebase Functions (AntiCheat) antes de compor o score final competitivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
