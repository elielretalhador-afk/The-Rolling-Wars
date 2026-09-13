import React, { useState, useEffect } from 'react';
import { X, Play, Map, Navigation, Shield, Swords, ArrowRight, CheckCircle2, ChevronRight, User, Calendar, Target } from 'lucide-react';
import { TutorialState } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialState: TutorialState;
  onUpdateTutorial: (state: TutorialState) => void;
  onAction?: (action: 'explore_map' | 'start_activity' | 'go_hub') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  tutorialState,
  onUpdateTutorial,
  onAction
}) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      if (tutorialState.currentStep === 0) {
        setStep(1);
      } else {
         // Keep at current step if passed in? Or just always 1 if they open it manually
         setStep(1);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onUpdateTutorial({ ...tutorialState, isSkipped: true, isCompleted: true, currentStep: totalSteps });
    onClose();
  };

  const handleFinish = (action: 'explore_map' | 'start_activity' | 'go_hub') => {
    onUpdateTutorial({ ...tutorialState, isSkipped: false, isCompleted: true, currentStep: totalSteps });
    if (onAction) {
      onAction(action);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#000000] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        
        {/* Header with Progress */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#121a24]">
          <h2 className="text-sm font-black text-slate-400 font-display uppercase tracking-widest">
            {step === 1 ? 'Bem-vindo' : step === 8 ? 'Conclusão' : `Etapa ${step - 1} de 6`}
          </h2>
          <button
            onClick={handleSkip}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Pular"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Dots) */}
        {step > 1 && step < 8 && (
          <div className="flex justify-center items-center py-3 bg-[#0a0f16]">
            {[2, 3, 4, 5, 6, 7].map((s) => (
              <div 
                key={s} 
                className={`w-2 h-2 mx-1 rounded-full ${s === step ? 'bg-yellow-400' : s < step ? 'bg-yellow-400/50' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-center flex flex-col justify-center">
          {/* Logo Branding */}
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="THE ROLLING WARS" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-yellow-400 rounded-3xl p-1 shadow-[0_0_30px_rgba(252,232,3,0.3)]">
                  <div className="w-full h-full bg-[#000000] rounded-[22px] flex items-center justify-center">
                    <Play className="w-10 h-10 text-yellow-400 fill-yellow-400/20" />
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-2">
                THE ROLLING WARS
              </h3>
              <p className="text-yellow-400 font-bold uppercase tracking-wider mb-4">
                Patine. Conquiste. Desafie.
              </p>
              <p className="text-slate-300 font-medium">
                Transforme suas sessões de patins em uma guerra territorial.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-cyan-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <Map className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DO MAPA
              </h3>
              <p className="text-slate-300 font-medium mb-2">
                Este é o campo de batalha.
              </p>
              <p className="text-slate-300 font-medium">
                Zonas espalhadas pela cidade podem ser conquistadas, disputadas e defendidas.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-yellow-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <Play className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DA ATIVIDADE
              </h3>
              <p className="text-slate-300 font-medium mb-2">
                Saia para patinar.
              </p>
              <p className="text-slate-300 font-medium mb-2">
                Seu GPS registra sua atividade e seu percurso.
              </p>
              <p className="text-slate-300 font-medium">
                Quanto melhor sua sessão, maiores podem ser suas oportunidades dentro do jogo.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-amber-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <Shield className="w-10 h-10 text-amber-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DAS ZONAS
              </h3>
              <p className="text-slate-300 font-medium mb-2">
                Encontre uma Zona.
              </p>
              <p className="text-slate-300 font-medium mb-2">
                Durante uma atividade válida, você poderá disputar territórios.
              </p>
              <p className="text-slate-300 font-medium text-sm">
                Conquistas territoriais são validadas pelo servidor e pelo sistema Anti-Cheat.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-rose-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <Swords className="w-10 h-10 text-rose-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DOS CLÃS
              </h3>
              <p className="text-slate-300 font-medium mb-2">
                Jogue sozinho ou faça parte de um Clã.
              </p>
              <p className="text-slate-300 font-medium">
                Clãs disputam territórios, acumulam pontos e participam da Guerra Territorial.
              </p>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-purple-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <User className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DO HUB
              </h3>
              <p className="text-slate-300 font-medium">
                No HUB você encontra seu progresso, personalização, carteira, loja, inventário, cofres, temporada e outras áreas do jogo.
              </p>
            </div>
          )}

          {step === 7 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-green-400/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <Calendar className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-4">
                EXPLICAÇÃO DA TEMPORADA
              </h3>
              <p className="text-slate-300 font-medium mb-2">
                Cada temporada transforma suas conquistas em competição.
              </p>
              <p className="text-slate-300 font-medium">
                Suba no ranking individual e ajude seu Clã a dominar a temporada.
              </p>
            </div>
          )}

          {step === 8 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-white/5 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-4">
                VOCÊ ESTÁ PRONTO.
              </h3>
              <p className="text-slate-300 font-medium mb-8">
                Escolha seu caminho.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleFinish('explore_map')}
                  className="w-full py-4 rounded-2xl bg-[#121a24] hover:bg-[#1a2636] border border-white/10 text-white font-black font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Map className="w-5 h-5 text-cyan-400" />
                  EXPLORAR MAPA
                </button>
                
                <button
                  onClick={() => handleFinish('start_activity')}
                  className="w-full py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  INICIAR ATIVIDADE
                </button>

                <button
                  onClick={() => handleFinish('go_hub')}
                  className="w-full py-4 rounded-2xl bg-[#121a24] hover:bg-[#1a2636] border border-white/10 text-white font-black font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <User className="w-5 h-5 text-purple-400" />
                  IR PARA O HUB
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 8 && (
          <div className="p-4 border-t border-white/5 bg-[#121a24] flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-slate-400 font-bold transition-colors"
              >
                VOLTAR
              </button>
            ) : (
              <div /> // Spacer
            )}
            
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black font-display uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              {step === 1 ? 'COMEÇAR' : step === 2 ? 'ENTENDI' : 'PRÓXIMO'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
