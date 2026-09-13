import React, { useState, useEffect } from 'react';
import { X, Play, Map, Navigation, Shield, Swords, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { TutorialState } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialState: TutorialState;
  onUpdateTutorial: (state: TutorialState) => void;
}

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Conheça o mapa.',
    description: 'Aqui você visualiza sua localização, zonas de controle, rotas e eventos ao seu redor.',
    icon: Map,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10'
  },
  {
    id: 2,
    title: 'Comece a patinar.',
    description: 'Toque no botão INICIAR PATINAÇÃO para começar a rastrear sua sessão via GPS.',
    icon: Play,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10'
  },
  {
    id: 3,
    title: 'Encontre uma zona.',
    description: 'Zonas são áreas estratégicas no mapa. Explore a cidade para encontrá-las.',
    icon: Navigation,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: 4,
    title: 'Conquiste.',
    description: 'Durante uma sessão ativa, patine dentro de uma zona para assumir o controle.',
    icon: Shield,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10'
  },
  {
    id: 5,
    title: 'Desafie.',
    description: 'Desafie outros jogadores para corridas ou participe de eventos da comunidade.',
    icon: Swords,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10'
  },
  {
    id: 6,
    title: 'Evolua.',
    description: 'Ganhe XP, suba de nível, desbloqueie títulos, medalhas e recompensas.',
    icon: CheckCircle2,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  tutorialState,
  onUpdateTutorial
}) => {
  const [view, setView] = useState<'welcome' | 'tutorial'>('welcome');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen && tutorialState.currentStep > 0) {
      setView('tutorial');
    }
  }, [isOpen]);

  const getTargetElementId = (step: number) => {
    switch (step) {
      case 1: return 'btn-open-search-header'; // Busca no header
      case 2: return 'btn-start-skate-session'; // Botão central de patinar
      case 3: return 'btn-explore-zones'; // Botão de zonas próximas
      case 4: return 'nav-tab-rotas'; // Aba de rotas
      case 5: return 'nav-tab-desafios'; // Aba de desafios
      case 6: return 'btn-header-player-profile'; // Perfil no header com nível
      default: return null;
    }
  };

  useEffect(() => {
    if (view === 'tutorial' && isOpen) {
      const updateRect = () => {
        const id = getTargetElementId(tutorialState.currentStep);
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            setTargetRect(el.getBoundingClientRect());
            return;
          }
        }
        setTargetRect(null);
      };
      
      updateRect();
      window.addEventListener('resize', updateRect);
      const interval = setInterval(updateRect, 300);
      
      return () => {
        window.removeEventListener('resize', updateRect);
        clearInterval(interval);
      };
    }
  }, [view, isOpen, tutorialState.currentStep]);

  if (!isOpen) return null;

  const handleSkip = () => {
    onUpdateTutorial({
      ...tutorialState,
      isSkipped: true,
      isCompleted: false
    });
    onClose();
  };

  const handleNextStep = () => {
    if (tutorialState.currentStep < TUTORIAL_STEPS.length) {
      onUpdateTutorial({
        ...tutorialState,
        currentStep: tutorialState.currentStep + 1
      });
    } else {
      onUpdateTutorial({
        ...tutorialState,
        isCompleted: true,
        isSkipped: false
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {view === 'welcome' || !targetRect ? (
        <div className="absolute inset-0 bg-[#080d14]/90  pointer-events-auto" />
      ) : (
        <div
          className="absolute z-[105] pointer-events-auto transition-all duration-500 ease-out cursor-pointer"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            borderRadius: '24px',
            boxShadow: '0 0 0 9999px rgba(8, 13, 20, 0.85)',
            border: '2px dashed #00ff66',
          }}
          onClick={handleNextStep}
        >
          {/* Pulse Indicator & CTA */}
          <div className="absolute inset-0 rounded-[22px] animate-ping opacity-20 border-2 border-yellow-400 pointer-events-none" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-yellow-400 text-xs font-black uppercase font-mono-stat drop-shadow-md animate-pulse">
            Toque aqui
          </div>
        </div>
      )}

      {/* Container Principal do Card */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md pointer-events-auto transition-all duration-500 ease-out"
        style={
          view === 'tutorial' && targetRect
            ? {
                top: targetRect.top > window.innerHeight / 2 ? '8%' : 'auto',
                bottom: targetRect.top > window.innerHeight / 2 ? 'auto' : 'max(5%, 120px)',
              }
            : {
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }
        }
      >
        <div className="w-full bg-[#0d141d] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#121a24]">
            <h2 className="text-lg font-black text-white font-display uppercase tracking-tight">
              {view === 'welcome' ? 'Urbanozeiro' : 'Tutorial Interativo'}
            </h2>
            <button
              onClick={handleSkip}
              className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
              title="Pular Tutorial"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {view === 'welcome' ? (
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl p-1 shadow-[0_0_30px_rgba(0,255,102,0.3)]">
                  <div className="w-full h-full bg-[#0d141d] rounded-[22px] flex items-center justify-center">
                    <Play className="w-10 h-10 text-yellow-400 fill-emerald-400/20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight">
                    Bem-vindo ao Urbanozeiro.
                  </h3>
                  <p className="text-neutral-400 font-medium">
                    A cidade é sua pista. O asfalto é seu território.
                  </p>
                </div>

                <div className="w-full space-y-3 py-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Play className="w-6 h-6 text-yellow-400" />
                    <div className="text-left">
                      <div className="text-white font-bold font-display uppercase">Patine.</div>
                      <div className="text-xs text-neutral-400">Rastreie suas sessões com GPS.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-white font-bold font-display uppercase">Conquiste.</div>
                      <div className="text-xs text-neutral-400">Domine zonas pela cidade.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Swords className="w-6 h-6 text-rose-400" />
                    <div className="text-left">
                      <div className="text-white font-bold font-display uppercase">Desafie.</div>
                      <div className="text-xs text-neutral-400">Enfrente outros jogadores.</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col h-full space-y-6">
                {/* Tutorial Steps */}
                <div className="flex justify-between items-center mb-2 px-2">
                  {TUTORIAL_STEPS.map((step) => (
                    <div 
                      key={step.id}
                      className={`h-1.5 flex-1 mx-1 rounded-full ${
                        step.id < tutorialState.currentStep ? 'bg-yellow-400' :
                        step.id === tutorialState.currentStep ? 'bg-yellow-400/50' :
                        'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {TUTORIAL_STEPS.filter(s => s.id === tutorialState.currentStep).map(step => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center justify-center text-center py-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className={`w-20 h-20 rounded-3xl ${step.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                        <Icon className={`w-10 h-10 ${step.color}`} />
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                          Etapa {step.id} de {TUTORIAL_STEPS.length}
                        </div>
                        <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-neutral-300 font-medium px-4">
                          {step.description}
                        </p>
                      </div>

                      {/* Info on interactivity */}
                      {targetRect && (
                        <div className="text-xs text-yellow-400/80 font-mono-stat flex items-center gap-2 mt-4 animate-pulse">
                          <ArrowRight className="w-4 h-4" />
                          Toque na área destacada para continuar
                        </div>
                      )}
                    </div>
                  )
                })}

              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/5 bg-[#0a0f16] flex flex-col gap-3">
            {view === 'welcome' ? (
              <>
                <button
                  onClick={() => {
                    setView('tutorial');
                    if (tutorialState.currentStep === 0) {
                      onUpdateTutorial({ ...tutorialState, currentStep: 1 });
                    }
                  }}
                  className="w-full py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full py-3 rounded-2xl bg-transparent hover:bg-white/5 text-neutral-400 font-bold transition-colors"
                >
                  Pular Introdução
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 rounded-2xl bg-[#121a24] hover:bg-[#1a2636] border border-white/10 text-white font-black font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {tutorialState.currentStep < TUTORIAL_STEPS.length ? 'Avançar Manualmente' : 'Concluir Tutorial'}
                  {tutorialState.currentStep < TUTORIAL_STEPS.length ? <ChevronRight className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full py-3 rounded-2xl bg-transparent hover:bg-white/5 text-neutral-400 font-bold transition-colors"
                >
                  Pular e explorar sozinho
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
