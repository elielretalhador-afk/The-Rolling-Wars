import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, AlertTriangle, Book, Navigation, Target, Shield, Map, Zap, Award, User, Settings as SettingsIcon, ChevronRight, Swords } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorial: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'O que é uma zona?',
    a: 'Zonas são áreas geográficas no mapa que os jogadores podem conquistar. Dominar uma zona concede vantagens e XP.'
  },
  {
    q: 'Como começo uma patinação?',
    a: 'Toque no grande botão de Patinar no menu inferior. O GPS será ativado e sua rota será rastreada.'
  },
  {
    q: 'Como funciona a conquista?',
    a: 'Para conquistar, você deve patinar fisicamente dentro de uma zona durante uma sessão ativa até completar 100% de domínio.'
  },
  {
    q: 'Como desafio outro jogador?',
    a: 'Encontre o jogador no mapa ou no hub social e toque em Desafiar. Vocês podem apostar moedas ou competir por XP.'
  },
  {
    q: 'O que é XP?',
    a: 'XP (Pontos de Experiência) mede sua progressão no THE ROLLING WARS. Ganhe XP patinando e completando objetivos para subir de nível.'
  },
  {
    q: 'Como ganho recompensas?',
    a: 'Subindo de nível, completando desafios diários e participando de temporadas.'
  },
  {
    q: 'O que acontece se o GPS falhar?',
    a: 'A sessão será pausada automaticamente. Certifique-se de que o aplicativo tem permissão de localização "Sempre".'
  }
];

const HELP_CATEGORIES = [
  { icon: Target, label: 'Como Jogar' },
  { icon: Map, label: 'Mapa e GPS' },
  { icon: Shield, label: 'Zonas' },
  { icon: Swords, label: 'Desafios' },
  { icon: Navigation, label: 'Rotas' },
  { icon: Zap, label: 'XP e Níveis' },
  { icon: Award, label: 'Recompensas' },
  { icon: User, label: 'Conta e Privacidade' },
  { icon: AlertTriangle, label: 'Problemas Técnicos' }
];

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  onOpenTutorial
}) => {
  const [activeTab, setActiveTab] = useState<'help' | 'faq' | 'support'>('help');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000000]/90 " onClick={onClose} />
      
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#000000] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#121a24]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white font-display uppercase tracking-tight">Ajuda & Suporte</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-white/5 bg-[#000000]">
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'help' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Guia
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'faq' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'support' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Suporte
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          {activeTab === 'help' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-br from-yellow-500/10 to-transparent p-5 rounded-2xl border border-yellow-500/20 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl">
                  <Book className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-bold font-display uppercase">Tutorial Interativo</h3>
                  <p className="text-sm text-slate-400 mt-1">Refaça o passo a passo inicial para entender os fundamentos do THE ROLLING WARS.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTutorial();
                  }}
                  className="px-6 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  Iniciar Tutorial
                </button>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Tópicos de Ajuda</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HELP_CATEGORIES.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <button key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-left">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-200 font-bold">{cat.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#121a24] border border-white/5">
                  <h4 className="text-white font-bold text-lg mb-2">{item.q}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center py-6">
                <div className="inline-flex p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Fale com a Equipe</h3>
                <p className="text-slate-400 mt-2 max-w-md mx-auto">
                  Precisa de assistência técnica, quer enviar uma sugestão ou relatar um problema?
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-[#121a24] border border-white/5 hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all text-left group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                      <AlertTriangle className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Relatar Erro (Bug)</div>
                      <div className="text-sm text-slate-500 mt-1">Problemas no mapa, travamentos, erro de GPS.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                </button>

                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-[#121a24] border border-white/5 hover:border-yellow-400/50 hover:bg-yellow-500/5 transition-all text-left group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-yellow-500/20 group-hover:text-yellow-400 transition-colors">
                      <MessageSquare className="w-6 h-6 text-slate-400 group-hover:text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Enviar Feedback</div>
                      <div className="text-sm text-slate-500 mt-1">Sugestões, elogios ou reclamações sobre o jogo.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400" />
                </button>

                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-[#121a24] border border-rose-500/10 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all text-left group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 text-rose-400 transition-colors">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Relatar Comportamento</div>
                      <div className="text-sm text-slate-500 mt-1">Denunciar jogadores por assédio, trapaça ou ofensas.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 text-center text-xs text-slate-500">
                A equipe do THE ROLLING WARS pode levar até 48 horas para responder. Esta é uma estrutura de suporte preparada para atendimento futuro.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
