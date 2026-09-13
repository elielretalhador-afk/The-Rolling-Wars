import React, { useState } from 'react';
import { X, Check, Disc } from 'lucide-react';
import { UserProfile } from '../types';

interface EquipmentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSave: (setup: any) => void;
}

export const EquipmentSetupModal: React.FC<EquipmentSetupModalProps> = ({ isOpen, onClose, currentUser, onSave }) => {
  const [model, setModel] = useState(currentUser.skateSetup?.model || '');
  const [wheels, setWheels] = useState<any>(typeof currentUser.skateSetup?.wheels === 'object' ? currentUser.skateSetup.wheels : { brand: '', model: '', size: '', hardness: '', quantity: '', custom: '' });
  const [bearings, setBearings] = useState<any>(typeof currentUser.skateSetup?.bearings === 'object' ? currentUser.skateSetup.bearings : { brand: '', model: '', type: '', custom: '' });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ model, wheels, bearings });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#000000] text-white">
      <div className="p-4 bg-gradient-to-r from-[#0d141e] via-[#091119] to-[#0d141e] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 -ml-1.5 mr-1 rounded-xl bg-white/5 hover:bg-white/10">
            <X className="w-6 h-6 text-neutral-300" />
          </button>
          <h3 className="text-base font-black text-white font-display uppercase tracking-wider">
            SETUP DE EQUIPAMENTO
          </h3>
        </div>
        <button onClick={handleSave} className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-xl">
          <Check className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* BOTA */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase font-mono-stat">Bota / Modelo</label>
          <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Ex: Rollerblade Twister Edge" className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
        </div>

        {/* RODAS */}
        <div className="space-y-3 p-4 bg-[#0d141e] rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase text-xs font-mono-stat">
            <Disc className="w-4 h-4" /> Rodas
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Marca</label>
              <input type="text" value={wheels.brand} onChange={e => setWheels({...wheels, brand: e.target.value})} placeholder="Ex: Undercover" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Modelo</label>
              <input type="text" value={wheels.model} onChange={e => setWheels({...wheels, model: e.target.value})} placeholder="Ex: Team Blank" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Tamanho (mm)</label>
              <input type="text" value={wheels.size} onChange={e => setWheels({...wheels, size: e.target.value})} placeholder="Ex: 80" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Dureza</label>
              <input type="text" value={wheels.hardness} onChange={e => setWheels({...wheels, hardness: e.target.value})} placeholder="Ex: 86A" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Quantidade</label>
              <input type="text" value={wheels.quantity} onChange={e => setWheels({...wheels, quantity: e.target.value})} placeholder="Ex: 8" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase">Outro / Detalhes</label>
            <input type="text" value={wheels.custom} onChange={e => setWheels({...wheels, custom: e.target.value})} placeholder="Ex: Perfil bullet, desgastadas" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
          </div>
        </div>

        {/* ROLAMENTOS */}
        <div className="space-y-3 p-4 bg-[#0d141e] rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs font-mono-stat">
            <Disc className="w-4 h-4" /> Rolamentos
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Marca</label>
              <input type="text" value={bearings.brand} onChange={e => setBearings({...bearings, brand: e.target.value})} placeholder="Ex: Bones" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase">Modelo</label>
              <input type="text" value={bearings.model} onChange={e => setBearings({...bearings, model: e.target.value})} placeholder="Ex: Reds" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500 uppercase">Especificação / Tipo</label>
              <input type="text" value={bearings.type} onChange={e => setBearings({...bearings, type: e.target.value})} placeholder="Ex: ABEC 9, ILQ 9 Classic" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase">Outro / Detalhes</label>
            <input type="text" value={bearings.custom} onChange={e => setBearings({...bearings, custom: e.target.value})} placeholder="Ex: Limpos recentemente" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
