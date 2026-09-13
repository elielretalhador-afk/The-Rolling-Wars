import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Flag } from 'lucide-react';
import { PlayerReportReason, SocialPlayer, RankPlayer } from '../types';

interface ReportPlayerModalProps {
  isOpen: boolean;
  player: SocialPlayer | RankPlayer | null;
  onClose: () => void;
  onSubmitReport: (
    playerId: string,
    playerNickname: string,
    reason: PlayerReportReason,
    description: string
  ) => void;
}

const REPORT_REASONS: { reason: PlayerReportReason; label: string; description: string }[] = [
  {
    reason: 'INAPPROPRIATE_BEHAVIOR',
    label: 'Comportamento Inadequado',
    description: 'Conduta desrespeitosa, linguagem ofensiva ou atitude antidesportiva.',
  },
  {
    reason: 'CHEATING',
    label: 'Fraude / Trapaça de GPS',
    description: 'Uso de veículos motorizados, simulação de teleporte ou falsificação de telemetria.',
  },
  {
    reason: 'ABUSE',
    label: 'Abuso ou Assédio',
    description: 'Perseguição nas zonas, mensagens abusivas ou intimidação a outros patinadores.',
  },
  {
    reason: 'SPAM',
    label: 'Spam ou Propaganda',
    description: 'Envio repetitivo de convites ou divulgação não autorizada.',
  },
  {
    reason: 'OTHER',
    label: 'Outro Motivo',
    description: 'Outras violações não listadas acima para moderação e análise.',
  },
];

export const ReportPlayerModal: React.FC<ReportPlayerModalProps> = ({
  isOpen,
  player,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<PlayerReportReason>('INAPPROPRIATE_BEHAVIOR');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !player) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(player.id || 'usr_unknown', player.nickname, selectedReason, details);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div
      id="modal-report-player"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#090e15] border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.25)] overflow-hidden flex flex-col max-h-[90vh] text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-red-950/40 via-[#0a121c] to-[#090e15] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-display tracking-tight">
                DENUNCIAR JOGADOR
              </h3>
              <p className="text-[10px] text-slate-400 font-mono-stat">
                {player.nickname} {player.tag ? `(${player.tag})` : ''}
              </p>
            </div>
          </div>

          <button
            id="btn-close-report-modal"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-400/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(252,232,3,0.3)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-white uppercase font-display">
              DENÚNCIA REGISTRADA
            </h4>
            <p className="text-xs text-slate-300">
              Obrigado por manter o asfalto do THE ROLLING WARS seguro e justo. Nossa moderação irá analisar o histórico.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[60vh]">
            <div className="p-3 rounded-2xl bg-red-950/20 border border-red-500/30 text-[11px] text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>
                As denúncias são anônimas e analisadas com base nos registros de telemetria e integridade da comunidade.
              </span>
            </div>

            {/* Motivo */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono-stat block mb-2">
                Selecione o Motivo:
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((r) => {
                  const isSelected = selectedReason === r.reason;
                  return (
                    <div
                      key={r.reason}
                      onClick={() => setSelectedReason(r.reason)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-red-500/15 border-red-400/80 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                          : 'bg-[#0a0a0a] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-red-400 bg-red-500 text-white'
                            : 'border-slate-500 bg-transparent'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono-stat uppercase">{r.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          {r.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalhes Adicionais */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono-stat block mb-1.5">
                Detalhes Adicionais (Opcional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Descreva o que aconteceu ou aponte a zona/horário do ocorrido..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-400 transition-all resize-none"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono-stat tracking-wider transition-all"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-confirm-report-player"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-xs uppercase font-mono-stat tracking-wider shadow-[0_0_18px_rgba(239,68,68,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Enviar Denúncia</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
