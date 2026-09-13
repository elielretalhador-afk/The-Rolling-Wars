import React, { useState } from 'react';
import { X, PlusCircle, MapPin, Sparkles, Check, Layers, BookOpen, Flag, AlertCircle } from 'lucide-react';
import { UserProfile, Zone, ZoneType } from '../types';

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateZone: (newZone: Zone) => void;
  currentUser: UserProfile;
  userCoords?: [number, number] | null;
  pickedCoords: [number, number] | null;
  shapeType?: 'circle' | 'segment' | 'zone';
  drawnPath?: [number, number][];
}

export const CreateZoneModal: React.FC<CreateZoneModalProps> = ({
  isOpen,
  onClose,
  onCreateZone,
  currentUser,
  userCoords,
  pickedCoords,
  shapeType = 'circle',
  drawnPath,
}) => {
  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<ZoneType | ''>('street');
  const [radius, setRadius] = useState<number>(300);
  const [color, setColor] = useState<string>('#00FF66');
  const [surface, setSurface] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');

  // Validation / Error tracking state
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    radius?: string;
    color?: string;
    description?: string;
    rules?: string;
    surface?: string;
    referencePoint?: string;
  }>({});

  if (!isOpen) return null;

  const typeOptions: { id: ZoneType; label: string; legacy: 'Street' | 'Speed' | 'Freeskate' | 'Slalom' }[] = [
    { id: 'street', label: 'STREET', legacy: 'Street' },
    { id: 'speed', label: 'SPEED', legacy: 'Speed' },
    { id: 'free_skate', label: 'FREE SKATE', legacy: 'Freeskate' },
    { id: 'slalom', label: 'SLALOM', legacy: 'Slalom' },
  ];

  const allowedRadii = [200, 300, 400, 500, 600, 700];

  const colorOptions = [
    { label: 'Verde Neon', hex: '#00FF66' },
    { label: 'Ciano Cyber', hex: '#00E5FF' },
    { label: 'Rosa Shock', hex: '#FF0055' },
    { label: 'Amarelo Flash', hex: '#FFE600' },
    { label: 'Roxo Nitro', hex: '#A855F7' },
    { label: 'Laranja Flame', hex: '#FF7A00' },
  ];

  const surfaceSuggestions = [
    'Perfeito',
    'Bom',
    'Regular',
    'Ruim',
    'Desafiador',
    'Asfalto liso',
    'Granito polido',
    'Concreto nivelado',
  ];

  const validateForm = () => {
    const newErrors: {
      name?: string;
      type?: string;
      radius?: string;
      color?: string;
      description?: string;
      rules?: string;
      surface?: string;
      referencePoint?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Informe o nome da zona.';
    }
    if (!type) {
      newErrors.type = 'Escolha o estilo da zona.';
    }
    if (!radius || !allowedRadii.includes(radius)) {
      newErrors.radius = 'Defina o raio do território (200m a 700m).';
    }
    if (!color) {
      newErrors.color = 'Selecione a cor da zona.';
    }
    if (!description.trim()) {
      newErrors.description = 'Informe a descrição da zona.';
    }
    if (!rules.trim()) {
      newErrors.rules = 'Defina as regras e requisitos de conquista.';
    }
    if (!surface.trim()) {
      newErrors.surface = 'Informe a qualidade do piso.';
    }
    if (!referencePoint.trim()) {
      newErrors.referencePoint = 'Informe o ponto de referência da zona.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // Precise coordinates: use picked point if chosen on map, otherwise exact player GPS coords
    const safeBaseLat =
      typeof userCoords?.[0] === 'number' && !isNaN(userCoords[0]) && isFinite(userCoords[0])
        ? userCoords[0]
        : -23.5558;
    const safeBaseLng =
      typeof userCoords?.[1] === 'number' && !isNaN(userCoords[1]) && isFinite(userCoords[1])
        ? userCoords[1]
        : -46.6608;

    const coordsToUse: [number, number] = pickedCoords
      ? [pickedCoords[0], pickedCoords[1]]
      : (drawnPath && drawnPath.length > 0 ? drawnPath[0] : [safeBaseLat, safeBaseLng]);

    const selectedType = type as ZoneType;
    const selectedTypeObj = typeOptions.find((t) => t.id === selectedType) || typeOptions[0];

    const newZone: Zone = {
      id: shapeType === 'segment' ? `seg_${Date.now()}` : `zone_${Date.now()}`,
      name: name.trim(),
      type: selectedType,
      center: coordsToUse,
      radius: radius,
      color: color,
      creator: {
        id: currentUser.id || 'usr_me',
        name: currentUser.name || currentUser.nickname || 'Patinador Urbano',
        avatar: currentUser.avatar,
      },
      controller: null, // Starts as free (LIVRE)
      description: description.trim(),
      rules: rules.trim(),
      surface: surface.trim(),
      referencePoint: referencePoint.trim(),
      status: 'free', // Starts as free (LIVRE)
      dominance: 0, // 0%
      skatersCount: 0,
      xpPerHour: Math.round(radius * 0.4),
      createdAt: new Date().toISOString().split('T')[0],
      captureRequirements: {
        minDistance: 100, // Requisito padrão: 100m percorridos dentro da zona
      },

      // Backward compatibility fields
      accentColor: color,
      fillColor: `${color}28`,
      category: selectedTypeObj.legacy,
      controllerName: '',
      controllerNickname: '',
      controllerAvatar: '',
      controllerLevel: 0,
      controllerCrew: '',
      dominancePercent: 0,
      activeSkatersCount: 0,
      pointsPerHour: Math.round(radius * 0.4),
      contested: false,
      lastConquered: '',
    };

    onCreateZone(newZone);
    onClose();
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85  animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0a0f15] border-2 border-yellow-500/50 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display uppercase tracking-tight">
                CRIAR NOVA ZONA
              </h2>
              <p className="text-xs text-yellow-400 font-extrabold uppercase font-mono-stat flex items-center gap-1">
                <Flag className="w-3 h-3" /> Zonas 2.0 • Inicia como Zona Livre (0%)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário de criação de zona"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-neutral-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Global Error Banner if submitted with missing fields */}
        {hasErrors && (
          <div className="mt-3.5 p-3 rounded-2xl bg-rose-950/60 border-2 border-rose-500/60 text-rose-300 text-xs font-bold flex items-start gap-2 animate-in shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-black uppercase tracking-wider font-mono-stat text-rose-200">
                Preencha todos os campos obrigatórios para criar a zona.
              </div>
              <div className="text-[11px] text-rose-300/90 mt-0.5">
                Revise os campos destacados em vermelho abaixo antes de salvar.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          {/* 1. Nome da Zona * */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat">
                Nome da zona <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.name && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.name}
                </span>
              )}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Ex: Pista Marquise Skate Park"
              className={`w-full px-3.5 py-2.5 bg-[#0f1722] border-2 rounded-xl text-white text-sm font-bold placeholder-slate-500 focus:outline-none transition-colors ${
                submitted && errors.name
                  ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
            />
          </div>

          {/* 2. Estilo da Zona * */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat">
                Estilo <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.type && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.type}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {typeOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setType(opt.id);
                    if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
                  }}
                  className={`py-2 px-1 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all font-mono-stat cursor-pointer flex items-center justify-center gap-1 ${
                    type === opt.id
                      ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(0,255,102,0.5)] border-2 border-yellow-400 scale-[1.02]'
                      : 'bg-[#0f1722] text-neutral-400 border-2 border-white/10 hover:border-white/20'
                  }`}
                >
                  {type === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Raio do Território * */}
          {shapeType === 'circle' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat">
                Raio <span className="text-rose-400 font-black">*</span>
              </label>
              <span className="text-xs font-black text-yellow-400 font-mono-stat">
                {radius} METROS
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              {allowedRadii.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => {
                    setRadius(r);
                    if (errors.radius) setErrors((prev) => ({ ...prev, radius: undefined }));
                  }}
                  className={`py-1.5 px-0.5 text-[10px] font-black rounded-lg transition-all font-mono-stat cursor-pointer text-center ${
                    radius === r
                      ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                      : 'bg-[#0f1722] text-neutral-400 border border-white/10 hover:border-white/25'
                  }`}
                >
                  {r}m
                </button>
              ))}
            </div>
            <input
              type="range"
              min="200"
              max="700"
              step="100"
              value={radius}
              onChange={(e) => {
                setRadius(Number(e.target.value));
                if (errors.radius) setErrors((prev) => ({ ...prev, radius: undefined }));
              }}
              className="w-full accent-emerald-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
            />
          </div>
          )}
          {/* 4. Cor da Zona * */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat">
                Cor <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.color && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.color}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    if (errors.color) setErrors((prev) => ({ ...prev, color: undefined }));
                  }}
                  aria-label={c.label}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-transform cursor-pointer ${
                    color === c.hex ? 'scale-115 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && <Check className="w-4 h-4 text-black stroke-[3.5]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Descrição * */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat">
                Descrição <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.description && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.description}
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Ex: Área urbana com escadarias, corrimãos e transições de concreto..."
              className={`w-full px-3.5 py-2 bg-[#0f1722] border-2 rounded-xl text-white text-xs font-semibold placeholder-slate-500 focus:outline-none transition-colors ${
                submitted && errors.description
                  ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
            />
          </div>

          {/* 6. Regras e Requisitos do Desafio * */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Regras <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.rules && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.rules}
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => {
                setRules(e.target.value);
                if (errors.rules) setErrors((prev) => ({ ...prev, rules: undefined }));
              }}
              placeholder="Ex: Conquista baseada em manobras e percurso realizado dentro da zona..."
              className={`w-full px-3.5 py-2 bg-[#0f1722] border-2 rounded-xl text-white text-xs font-semibold placeholder-slate-500 focus:outline-none transition-colors ${
                submitted && errors.rules
                  ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
            />
          </div>

          {/* 7. Qualidade do Piso * */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-yellow-400" /> Qualidade do piso <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.surface && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.surface}
                </span>
              )}
            </div>
            <input
              type="text"
              value={surface}
              onChange={(e) => {
                setSurface(e.target.value);
                if (errors.surface) setErrors((prev) => ({ ...prev, surface: undefined }));
              }}
              placeholder="Ex: Perfeito / Asfalto liso sem buracos"
              className={`w-full px-3.5 py-2 bg-[#0f1722] border-2 rounded-xl text-white text-xs font-semibold placeholder-slate-500 focus:outline-none transition-colors ${
                submitted && errors.surface
                  ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
            />
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 no-scrollbar">
              {surfaceSuggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setSurface(s);
                    if (errors.surface) setErrors((prev) => ({ ...prev, surface: undefined }));
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 border border-white/10 whitespace-nowrap font-mono-stat cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Ponto de Referência * */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono-stat flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Ponto de referência <span className="text-rose-400 font-black">*</span>
              </label>
              {submitted && errors.referencePoint && (
                <span className="text-[10px] font-bold text-rose-400 font-mono-stat">
                  {errors.referencePoint}
                </span>
              )}
            </div>
            <input
              type="text"
              value={referencePoint}
              onChange={(e) => {
                setReferencePoint(e.target.value);
                if (errors.referencePoint) setErrors((prev) => ({ ...prev, referencePoint: undefined }));
              }}
              placeholder="Ex: Praça central / Ao lado da pista de skate"
              className={`w-full px-3.5 py-2 bg-[#0f1722] border-2 rounded-xl text-white text-xs font-semibold placeholder-slate-500 focus:outline-none transition-colors ${
                submitted && errors.referencePoint
                  ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
            />
          </div>

          {/* Status info note */}
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-yellow-500/30 text-[11px] text-emerald-300 font-mono-stat flex items-center gap-2">
            <Flag className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>A zona será registrada no mapa como <strong>LIVRE (0% domínio)</strong> com os dados exatos informados.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-yellow-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(0,255,102,0.5)] transition-all flex items-center justify-center gap-2 font-mono-stat cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              CRIAR E REGISTRAR ZONA NO MAPA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
