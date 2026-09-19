import React, { useState } from 'react';
import { Zap, X, Clock, PlaySquare, CheckCircle2, ShieldCheck, AlertTriangle, BatteryCharging, Sparkles } from 'lucide-react';
import { UserEnergy, SessionStatus } from '../types';
import { EnergyService, MAX_ENERGY, MAX_DAILY_REWARDED_ADS } from '../services/energyService';

interface EnergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  energy: UserEnergy;
  sessionStatus?: SessionStatus;
  isOutOfEnergyTrigger?: boolean;
  onClaimDailyFree?: () => Promise<boolean>;
  onClaimRewardedAd: () => Promise<boolean>;
}

export const EnergyModal: React.FC<EnergyModalProps> = ({
  isOpen,
  onClose,
  energy,
  sessionStatus = 'IDLE',
  isOutOfEnergyTrigger = false,
  onClaimRewardedAd
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentVal = Math.max(0, energy.current || 0);
  const isZero = currentVal <= 0;
  const remainingSeconds = EnergyService.energyToSeconds(currentVal);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsOnly = remainingSeconds % 60;
  const isEnergyFull = currentVal >= MAX_ENERGY;
  const adsLeft = Math.max(0, MAX_DAILY_REWARDED_ADS - (energy.dailyRewardedAdsUsed || 0));

  const handleClaimAd = async () => {
    if (loadingAction) return;
    setLoadingAction('ad');
    setFeedbackMessage(null);
    try {
      const ok = await onClaimRewardedAd();
      if (ok) {
        setFeedbackMessage({ type: 'success', text: '⚡ +20% de Energia (18 minutos) adicionados!' });
      } else {
        setFeedbackMessage({ type: 'error', text: 'Falha ao processar recompensa de anúncio.' });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200">
      <div className="relative w-full max-w-lg bg-[#0c1017] border-2 border-yellow-400/40 rounded-3xl shadow-[0_0_35px_rgba(252,232,3,0.25)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Decorative Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-cyan-400" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shadow-[0_0_12px_rgba(252,232,3,0.3)]">
              <Zap className="w-5 h-5 fill-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase font-display tracking-wider">
                Energia do Patinador
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Tempo de atividade e patinação urbana
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-2 overflow-y-auto space-y-4 flex-1">
          {/* Out of energy banner if triggered by 0 energy */}
          {isOutOfEnergyTrigger && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-amber-300 uppercase font-display">
                  Energia Esgotada
                </h4>
                <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                  {sessionStatus === 'ACTIVE'
                    ? 'Sua Energy acabou, mas sua sessão continua ativa. Você pode continuar patinando ou encerrar quando quiser.'
                    : 'Sua energia está zerada. Recupere energia através dos anúncios recompensados ou aguarde o reset diário para iniciar uma nova sessão.'}
                </p>
              </div>
            </div>
          )}

          {/* Session status banner */}
          {sessionStatus === 'ACTIVE' && (
            <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-xs font-black text-yellow-300 uppercase tracking-wide font-mono-stat">
                  Sessão em Andamento
                </span>
              </div>
              <span className="text-[11px] text-slate-300">
                {isZero ? 'Tolerância ativa (sessão mantida)' : 'Consumo contínuo em tempo real'}
              </span>
            </div>
          )}

          {sessionStatus === 'PAUSED' && (
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wide font-mono-stat">
                  Sessão Pausada
                </span>
              </div>
              <span className="text-[11px] text-cyan-200">
                Consumo congelado (Zero gasto)
              </span>
            </div>
          )}

          {/* Main Gauge Card */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-stat">
                Nível Atual
              </span>
              <span className="text-xs font-bold text-yellow-400/90 font-mono-stat">
                Capacidade: 90 min (100%)
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl font-black font-mono-stat tracking-tight ${isZero ? 'text-red-400' : 'text-white'}`}>
                  {Math.round(currentVal)}%
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 100%</span>
                {isZero && (
                  <span className="ml-2 text-[10px] font-black font-mono-stat px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40">
                    ESGOTADA
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-1.5 text-xs font-mono-stat font-bold px-2.5 py-1 rounded-lg border ${
                isZero
                  ? 'bg-red-950/60 text-red-300 border-red-500/30'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isZero ? 'text-red-400' : 'text-cyan-400'}`} />
                <span>
                  {isZero ? '0m 00s (ESGOTADA)' : `${remainingMinutes}m ${String(remainingSecondsOnly).padStart(2, '0')}s`}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isZero
                    ? 'bg-red-500 shadow-[0_0_12px_#ef4444]'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-cyan-400 shadow-[0_0_12px_#fce803]'
                }`}
                style={{ width: `${Math.min(100, Math.max(isZero ? 2 : 0, currentVal))}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              Cada 1% de energia equivale a 54 segundos de patinação ativa. A energia só é consumida enquanto a sessão estiver ativa (ACTIVE).
            </p>
          </div>

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/40 text-red-300'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* RECHARGE OPTIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-stat">
              Recargas Oficiais (Energia 1.0)
            </h3>

            {/* 1. Daily Automatic Reset Card (No manual button) */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shrink-0">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white font-display">
                        Recarga Automática Diária
                      </h4>
                      <span className="text-[10px] font-bold font-mono-stat px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                        100% (90 MIN)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Sua energia retorna automaticamente para 100% no início de cada novo dia no servidor. O saldo anterior é substituído e não é necessário resgate manual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono-stat text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Ativa a cada novo dia (00:00)
                </span>
                <span className="text-[10px] font-mono-stat text-slate-500 font-bold uppercase">
                  Server-Authoritative
                </span>
              </div>
            </div>

            {/* 2. Rewarded Ads Recharge */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 shrink-0">
                    <PlaySquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white font-display">
                        Recompensa por Anúncio
                      </h4>
                      <span className="text-[10px] font-bold font-mono-stat px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        +20% (18 min)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Ganhe 18 minutos extras de atividade. Limite de até 5 anúncios por dia. Teto máximo de 100%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono-stat text-slate-400">
                  Utilizados hoje: <strong className="text-white">{energy.dailyRewardedAdsUsed || 0}/5</strong> (Restam: <strong className="text-cyan-400">{adsLeft}/5</strong>)
                </span>

                <button
                  type="button"
                  id="btn-claim-rewarded-ad-energy"
                  disabled={adsLeft <= 0 || isEnergyFull || loadingAction !== null}
                  onClick={handleClaimAd}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase font-display tracking-wider transition-all ${
                    adsLeft <= 0 || isEnergyFull
                      ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-cyan-400 text-black hover:bg-cyan-300 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer'
                  }`}
                  title={
                    isEnergyFull
                      ? 'Sua energia já está na capacidade máxima (100%)'
                      : adsLeft <= 0
                      ? 'Limite diário de 5 anúncios atingido'
                      : 'Assistir anúncio para recuperar +20% de energia'
                  }
                >
                  {loadingAction === 'ad'
                    ? 'Processando...'
                    : isEnergyFull
                    ? 'Energia em 100%'
                    : adsLeft <= 0
                    ? 'Limite Atingido'
                    : 'Recuperar +20%'}
                </button>
              </div>
            </div>
          </div>

          {/* Architecture / Future Systems Preview (Extensible Architecture) */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400/70" />
              <span className="text-[11px] font-bold uppercase font-mono-stat tracking-wider">
                Módulos de Expansão (Fases Futuras)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Zonas de Descanso Urbanas, Multiplicadores de Clã, Itens Consumíveis e Patrocinadores Oficiais estão em desenvolvimento e serão ativados nas próximas temporadas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Validação server-authoritative com idempotência de sessão e proteção contra fraudes.
            </span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-black uppercase font-display tracking-wider transition-all cursor-pointer"
          >
            {isOutOfEnergyTrigger ? 'Agora Não' : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};
