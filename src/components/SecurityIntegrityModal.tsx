import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Activity,
  UserCheck,
  Flag,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  Compass,
  Zap,
  Filter,
} from 'lucide-react';
import {
  SecurityEvent,
  SecuritySeverity,
  SecurityEventType,
  AuditLog,
  PlayerReport,
  PlayerAccountStatus,
} from '../types';
import {
  getSeverityBadgeStyle,
  getSecurityEventTypeLabel,
  getAccountStatusDetails,
} from '../data/securityData';

interface SecurityIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountStatus?: PlayerAccountStatus;
  securityEvents: SecurityEvent[];
  auditLogs: AuditLog[];
  reports: PlayerReport[];
  onSimulateGpsAnomaly?: () => void;
  onSimulateDuplicateRewardCheck?: () => void;
  onSimulateReportPlayer?: (reportedId: string, reason: any, desc: string) => void;
}

export const SecurityIntegrityModal: React.FC<SecurityIntegrityModalProps> = ({
  isOpen,
  onClose,
  accountStatus = 'ACTIVE',
  securityEvents,
  auditLogs,
  reports,
  onSimulateGpsAnomaly,
  onSimulateDuplicateRewardCheck,
  onSimulateReportPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'eventos' | 'auditoria' | 'denuncias' | 'simulador' | 'diretrizes'>('eventos');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SecuritySeverity>('ALL');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  const statusInfo = getAccountStatusDetails(accountStatus);

  const filteredEvents = securityEvents.filter((evt) => {
    if (severityFilter === 'ALL') return true;
    return evt.severity === severityFilter;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="security-integrity-modal-container"
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0a0f16] border-2 border-yellow-500/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0d141e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#080d13] rounded-[14px] flex items-center justify-center text-yellow-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase text-white font-display tracking-tight">
                  SEGURANÇA & FAIR PLAY
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-yellow-400/20 text-emerald-300 border border-yellow-400/30 rounded-md font-mono-stat">
                  INTEGRIDADE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                Monitoramento de Anomalias, Auditoria & Proteção de Recompensas
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-security-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar modal de segurança"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackToast && (
          <div className="relative z-20 px-4 py-2.5 mx-4 mt-3 flex items-center gap-2 rounded-2xl text-xs font-bold font-mono-stat shadow-lg bg-emerald-950/95 border border-yellow-400 text-emerald-200 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="flex-1">{feedbackToast}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {/* Account Status Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#111924] via-[#0d141e] to-[#090e15] border-2 border-yellow-500/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400/90 font-mono-stat">
                  ESTADO DA CONTA
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono-stat">
                    {statusInfo.label}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md font-mono-stat bg-yellow-500/20 text-emerald-300 border border-yellow-500/30">
                    VERIFICADO
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  {statusInfo.description}
                </p>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
                  <span className="text-[9px] font-black uppercase text-yellow-400 font-mono-stat block">
                    TELEMETRIA
                  </span>
                  <span className="text-xs font-black text-white font-mono-stat">
                    ATIVA
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <span className="text-[9px] font-black uppercase text-blue-400 font-mono-stat block">
                    IDEMPOTÊNCIA
                  </span>
                  <span className="text-xs font-black text-white font-mono-stat">
                    100%
                  </span>
                </div>
              </div>
            </div>

            {/* Core Principle Notice */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>
                <strong>Princípio de Fair Play:</strong> Sinalizações são avaliadas contextualmente. Variações ambientais de GPS não bloqueiam o jogador.
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-2xl bg-[#0d141e] p-1 border border-white/10 overflow-x-auto">
            <button
              type="button"
              id="tab-security-eventos"
              onClick={() => setActiveTab('eventos')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'eventos'
                  ? 'bg-yellow-400 text-black font-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>EVENTOS ({securityEvents.length})</span>
            </button>

            <button
              type="button"
              id="tab-security-auditoria"
              onClick={() => setActiveTab('auditoria')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'auditoria'
                  ? 'bg-yellow-400 text-black font-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AUDITORIA ({auditLogs.length})</span>
            </button>

            <button
              type="button"
              id="tab-security-denuncias"
              onClick={() => setActiveTab('denuncias')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'denuncias'
                  ? 'bg-yellow-400 text-black font-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>DENÚNCIAS ({reports.length})</span>
            </button>

            <button
              type="button"
              id="tab-security-simulador"
              onClick={() => setActiveTab('simulador')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'simulador'
                  ? 'bg-yellow-400 text-black font-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>TESTES</span>
            </button>

            <button
              type="button"
              id="tab-security-diretrizes"
              onClick={() => setActiveTab('diretrizes')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono-stat cursor-pointer ${
                activeTab === 'diretrizes'
                  ? 'bg-yellow-400 text-black font-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>DIRETRIZES</span>
            </button>
          </div>

          {/* TAB 1: EVENTOS DE SEGURANÇA */}
          {activeTab === 'eventos' && (
            <div className="space-y-3">
              {/* Severity Filter Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 font-mono-stat flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-yellow-400" />
                  FILTRAR SEVERIDADE:
                </span>
                <div className="flex items-center gap-1">
                  {(['ALL', 'INFO', 'LOW', 'MEDIUM', 'HIGH'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black font-mono-stat transition-all cursor-pointer ${
                        severityFilter === sev
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sev === 'ALL' ? 'TODOS' : sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {filteredEvents.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0d141e] border border-white/10 text-neutral-400 text-xs font-mono-stat">
                    Nenhum evento registrado nesta categoria.
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const sevStyle = getSeverityBadgeStyle(evt.severity);
                    const typeLabel = getSecurityEventTypeLabel(evt.type);

                    return (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-2xl bg-[#0e1622] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base shrink-0">{typeLabel.icon}</span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {typeLabel.label}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono-stat">
                                ID: {evt.id} • {formatDate(evt.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-black uppercase font-mono-stat rounded-md border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                            >
                              {sevStyle.label}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono-stat rounded bg-white/10 text-neutral-300">
                              {evt.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed pl-7">
                          {evt.description}
                        </p>

                        {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                          <div className="mt-1 ml-7 p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono-stat text-neutral-400 grid grid-cols-2 gap-1">
                            {Object.entries(evt.metadata).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-500">{k}:</span>{' '}
                                <strong className="text-neutral-300">{String(v)}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AUDITORIA */}
          {activeTab === 'auditoria' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
                <p className="font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Trilha de Auditoria Imutável (Audit Log)
                </p>
                <p className="text-[11px] text-neutral-300 mt-1">
                  Registra ações estruturais de jogo (conquistas, transações, desafios e recompensas) sem armazenar dados pessoais desnecessários.
                </p>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-yellow-500/20 text-emerald-300 border border-yellow-500/30 font-mono-stat">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono-stat">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1">
                        Alvo: <strong className="text-amber-400">{log.targetType}</strong> (ID: {log.targetId})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-400 font-mono-stat block">
                        Ator: {log.actorId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DENÚNCIAS */}
          {activeTab === 'denuncias' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-amber-400" />
                  Módulo de Moderação e Relato Comunitário
                </p>
                <p className="text-[11px] text-neutral-300 mt-1">
                  Denúncias de conduta, abuso ou suspeita passam por moderação antes de qualquer ação restritiva.
                </p>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {reports.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0d141e] border border-white/10 text-neutral-400 text-xs font-mono-stat">
                    Nenhuma denúncia aberta no momento.
                  </div>
                ) : (
                  reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 flex flex-col gap-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono-stat">
                            {rep.reason}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono-stat">
                            {formatDate(rep.createdAt)}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-white/10 text-neutral-300 font-mono-stat">
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">
                        {rep.description}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono-stat">
                        Denunciado: <strong>{rep.reportedPlayerId}</strong> • Relatado por: <strong>{rep.reporterId}</strong>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TESTES E SIMULADOR */}
          {activeTab === 'simulador' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 text-xs text-neutral-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Simulador de Integridade e Proteções
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Valide como o sistema lida com anomalias de GPS sem travar a patinação e como previne duplicidades.
                </p>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {/* 1. Simulate GPS Anomaly without blocking */}
                <div className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📡</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Simular Instabilidade de GPS</h4>
                      <p className="text-[10px] text-neutral-400">Gera um evento LOW sem cancelar a sessão de rolê</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSimulateGpsAnomaly) {
                        onSimulateGpsAnomaly();
                      }
                      showToast('📡 Evento de anomalia registrado como LOW. Sessão do atleta segue ativa!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    TESTAR GPS
                  </button>
                </div>

                {/* 2. Simulate Duplicate Reward Rejection */}
                <div className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🎁</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Idempotência de Recompensas</h4>
                      <p className="text-[10px] text-neutral-400">Tenta resgatar a mesma chave de recompensa 2x</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSimulateDuplicateRewardCheck) {
                        onSimulateDuplicateRewardCheck();
                      }
                      showToast('🛡️ Idempotência ativa: tentativa duplicada bloqueada com sucesso!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-emerald-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    TESTAR IDEMPOTÊNCIA
                  </button>
                </div>

                {/* 3. Simulate Report Creation */}
                <div className="p-3 rounded-2xl bg-[#0e1622] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📢</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Simular Envio de Denúncia</h4>
                      <p className="text-[10px] text-neutral-400">Cria um relato estruturado no canal de moderação</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSimulateReportPlayer) {
                        onSimulateReportPlayer('usr_bot_x', 'SPAM', 'Comportamento repetitivo detectado');
                      }
                      showToast('📢 Denúncia enviada para fila de moderação!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black font-mono-stat uppercase cursor-pointer"
                  >
                    CRIAR DENÚNCIA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DIRETRIZES */}
          {activeTab === 'diretrizes' && (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs">
              <div className="p-4 rounded-2xl bg-[#0e1622] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-bold font-mono-stat">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DIRETRIZES DE MODERAÇÃO E SEGURANÇA</span>
                </div>

                <div className="space-y-2 text-neutral-300 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">1. Tratamento de Falsos Positivos de GPS</strong>
                    <span>
                      Instabilidades no sinal de GPS por túneis, viadutos ou edifícios são registradas apenas como informativas. Nunca interrompem a sessão do jogador.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">2. Proteção de XP e Moedas</strong>
                    <span>
                      Resgates utilizam referências de chave única (idempotência). A carteira virtual impede saldos negativos e transações duplicadas.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">3. Moderação Humana sem Banimento Automático</strong>
                    <span>
                      Os estados de conta suportam ACTIVE, RESTRICTED, SUSPENDED e BANNED, mas punições severas não ocorrem sem processo de revisão.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <strong className="text-white block font-mono-stat">4. Privacidade Estrita</strong>
                    <span>
                      Auditorias guardam apenas identificadores essenciais de contexto, sem armazenar dados pessoais ou PII.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-3 sm:p-4 bg-[#080d13] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono-stat">
            <span>Status:</span>
            <strong className="text-yellow-400 font-bold">FAIR PLAY ATIVO</strong>
          </div>

          <button
            type="button"
            id="btn-dismiss-security-modal"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono-stat uppercase transition-all cursor-pointer"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};
