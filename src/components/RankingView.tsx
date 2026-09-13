import React, { useState } from 'react';
import { Trophy, Crown, Shield, Calendar, Flame, Users, Zap, ArrowRight } from 'lucide-react';
import { Clan, RankPlayer, RankingPeriod, UserProfile } from '../types';
import { MOCK_WEEKLY_LEADERBOARD, MOCK_MONTHLY_LEADERBOARD } from '../data/mockData';
import { PublicProfileModal } from './PublicProfileModal';

interface RankingViewProps {
  leaderboard?: RankPlayer[];
  clans?: Clan[];
  currentUser?: UserProfile;
  onSelectClan?: (clan: Clan) => void;
  onSelectPlayer?: (player: RankPlayer) => void;
  onSendChallenge?: (player: RankPlayer) => void;
  onOpenSeasonHub?: (tab?: 'visao_geral' | 'ranking' | 'recompensas' | 'historico') => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  clans = [],
  currentUser,
  onSelectClan,
  onSelectPlayer,
  onSendChallenge,
  onOpenSeasonHub,
}) => {
  const [mainCategory, setMainCategory] = useState<'jogadores' | 'clas'>('jogadores');
  const [period, setPeriod] = useState<RankingPeriod>('semanal');
  const [selectedPlayer, setSelectedPlayer] = useState<RankPlayer | null>(null);

  const currentLeaderboard =
    period === 'semanal' ? MOCK_WEEKLY_LEADERBOARD : MOCK_MONTHLY_LEADERBOARD;

  const top3Players = currentLeaderboard.slice(0, 3);
  const sortedClans = [...clans].sort((a, b) => {
    const scoreDiff = (b.territoryScore || 0) - (a.territoryScore || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (b.zonesControlledCount || 0) - (a.zonesControlledCount || 0);
  });
  const top3Clans = sortedClans.slice(0, 3);

  const handlePlayerClick = (p: RankPlayer) => {
    if (onSelectPlayer) {
      onSelectPlayer(p);
    } else {
      setSelectedPlayer(p);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain px-4 py-4 pb-36 bg-[#050505]">
      {/* Header */}
      <div className="text-center mb-4">
        <button
          type="button"
          
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/50 rounded-full text-amber-300 text-[10px] font-black uppercase tracking-wider mb-2 font-mono-stat transition-all active:scale-95 shadow-[0_0_12px_rgba(251,191,36,0.2)] cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>TEMPORADA #1: PRIMEIRO ROLÊ (ATIVA)</span>
          <span className="text-[9px] text-yellow-400 underline font-bold ml-0.5">HUB DA TEMPORADA →</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
          {mainCategory === 'jogadores' ? 'LÍDERES DE TERRITÓRIO' : 'RANKING GERAL DE CLÃS'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {mainCategory === 'jogadores'
            ? period === 'semanal'
              ? 'Patinadores que dominam as zonas da metrópole nesta semana.'
              : 'Os maiores conquistadores de território deste mês na cidade.'
            : 'Pelotões urbanos disputando domínio territorial e quilometragem coletiva.'}
        </p>
      </div>

      {/* Main Category Switch: PATINADORES vs CLÃS */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="grid grid-cols-2 p-1 bg-[#0a0a0a] border-2 border-white/10 rounded-2xl w-full max-w-xs shadow-lg">
          <button
            id="tab-ranking-jogadores"
            onClick={() => setMainCategory('jogadores')}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              mainCategory === 'jogadores'
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(252,232,3,0.4)] font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Patinadores
          </button>
          <button
            id="tab-ranking-clas"
            onClick={() => setMainCategory('clas')}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase font-mono-stat tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              mainCategory === 'clas'
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(252,232,3,0.4)] font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Clãs ({clans.length})
          </button>
        </div>
      </div>

      {/* JOGADORES VIEW */}
      {mainCategory === 'jogadores' ? (
        <>
          {/* Period Selector Tabs: Semanal vs Mensal */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="grid grid-cols-2 p-1 bg-[#090e15] border border-white/10 rounded-xl w-full max-w-[220px]">
              <button
                id="tab-ranking-semanal"
                onClick={() => setPeriod('semanal')}
                className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase font-mono-stat tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  period === 'semanal'
                    ? 'bg-white/15 text-white font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 text-orange-400" />
                Semanal
              </button>
              <button
                id="tab-ranking-mensal"
                onClick={() => setPeriod('mensal')}
                className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase font-mono-stat tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  period === 'mensal'
                    ? 'bg-white/15 text-white font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3 h-3 text-cyan-400" />
                Mensal
              </button>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 items-end mb-6 pt-4">
            {/* 2nd Place */}
            {top3Players[1] && (
              <div
                onClick={() => handlePlayerClick(top3Players[1])}
                className="p-2.5 rounded-2xl bg-[#050505] border-2 border-slate-600 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-slate-400 transition-transform active:scale-95"
                title="Toque para ver perfil"
              >
                <div className="w-5 h-5 rounded bg-slate-300 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                  2
                </div>
                <img
                  src={top3Players[1].avatar}
                  alt={top3Players[1].nickname}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-slate-300 mt-1"
                />
                <div className="text-xs font-bold text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Players[1].nickname.split('_')[0]}
                </div>
                <div className="text-[10px] text-cyan-400 font-bold font-mono-stat">
                  {top3Players[1].zonesControlled} ZONAS
                </div>
                <div className="text-[10px] font-bold text-amber-400 mt-0.5 font-mono-stat">
                  {top3Players[1].points} PTS
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3Players[0] && (
              <div
                onClick={() => handlePlayerClick(top3Players[0])}
                className="p-3 rounded-2xl bg-[#101b28] border-2 border-amber-400 text-center relative flex flex-col items-center shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-105 cursor-pointer hover:border-amber-300 transition-transform active:scale-100"
                title="Toque para ver perfil"
              >
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400/40 absolute -top-4" />
                <img
                  src={top3Players[0].avatar}
                  alt={top3Players[0].nickname}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 mt-2"
                />
                <div className="text-xs font-bold text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Players[0].nickname}
                </div>
                <div className="text-[11px] text-yellow-400 font-bold font-mono-stat">
                  {top3Players[0].zonesControlled} ZONAS
                </div>
                <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono-stat">
                  {top3Players[0].points} PTS
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3Players[2] && (
              <div
                onClick={() => handlePlayerClick(top3Players[2])}
                className="p-2.5 rounded-2xl bg-[#050505] border-2 border-amber-700 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-amber-600 transition-transform active:scale-95"
                title="Toque para ver perfil"
              >
                <div className="w-5 h-5 rounded bg-amber-600 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                  3
                </div>
                <img
                  src={top3Players[2].avatar}
                  alt={top3Players[2].nickname}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-600 mt-1"
                />
                <div className="text-xs font-bold text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Players[2].nickname}
                </div>
                <div className="text-[10px] text-cyan-400 font-bold font-mono-stat">
                  {top3Players[2].zonesControlled} ZONAS
                </div>
                <div className="text-[10px] font-bold text-amber-400 mt-0.5 font-mono-stat">
                  {top3Players[2].points} PTS
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table / Rows */}
          <div className="space-y-2">
            {currentLeaderboard.map((skater) => (
              <div
                key={skater.rank}
                id={`leaderboard-row-${skater.rank}`}
                onClick={() => handlePlayerClick(skater)}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer hover:border-yellow-400/70 active:scale-[0.98] ${
                  skater.isCurrentUser
                    ? 'bg-neutral-900/50 border-2 border-yellow-400 shadow-[0_0_20px_rgba(252,232,3,0.2)]'
                    : 'bg-[#000000] border-2 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 text-center font-bold text-sm font-mono-stat shrink-0 ${
                      skater.rank === 1
                        ? 'text-amber-400'
                        : skater.rank === 2
                        ? 'text-slate-300'
                        : skater.rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    #{skater.rank}
                  </span>

                  <img
                    src={skater.avatar}
                    alt={skater.nickname}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white/10 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white uppercase font-display truncate">
                        {skater.nickname}
                      </span>
                      {skater.isCurrentUser && (
                        <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/20 px-1 rounded uppercase font-mono-stat border border-yellow-400/40 shrink-0">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 font-medium font-mono-stat truncate">
                      <span className="truncate">{skater.crew}</span>
                      <span>•</span>
                      <span className="text-slate-300 shrink-0">
                        {period === 'semanal' ? (skater.weeklyKm || 0).toFixed(1) : (skater.monthlyKm || ((skater.weeklyKm || 0) * 3.5)).toFixed(1)} KM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-bold text-yellow-400 flex items-center justify-end gap-1 font-mono-stat">
                    <Shield className="w-3.5 h-3.5" />
                    {skater.zonesControlled} {skater.zonesControlled === 1 ? 'ZONA' : 'ZONAS'}
                  </div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono-stat">
                    {skater.points} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
        {/* CLÃS VIEW */}
        <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black text-yellow-400 uppercase tracking-widest">GUERRA TERRITORIAL</h2></div>
        <div className="space-y-4">
          {/* Top 3 Podium Clãs */}
          {top3Clans.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 items-end mb-4 pt-4">
              {/* 2nd Place */}
              <div
                onClick={() => onSelectClan && onSelectClan(top3Clans[1])}
                className="p-2.5 rounded-2xl bg-[#050505] border-2 border-slate-600 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-slate-400 transition-transform active:scale-95"
              >
                <div className="w-5 h-5 rounded bg-slate-300 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                  2
                </div>
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center text-2xl mt-1 shadow-sm"
                  style={{
                    borderColor: top3Clans[1].color,
                    backgroundColor: `${top3Clans[1].color}20`,
                  }}
                >
                  {top3Clans[1].symbol}
                </div>
                <div className="text-[11px] font-black text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Clans[1].name}
                </div>
                <div className="text-[9px] text-slate-400 font-mono-stat">
                  [{top3Clans[1].tag}]
                </div>
                <div className="text-[10px] text-cyan-400 font-bold font-mono-stat mt-0.5">
                  {top3Clans[1].territoryScore || 0} PTS<br/>
                  {top3Clans[1].zonesControlledCount || 0} ZONAS
                </div>
              </div>

              {/* 1st Place */}
              <div
                onClick={() => onSelectClan && onSelectClan(top3Clans[0])}
                className="p-3 rounded-2xl bg-[#101b28] border-2 border-amber-400 text-center relative flex flex-col items-center shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-105 cursor-pointer hover:border-amber-300 transition-transform active:scale-100"
              >
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400/40 absolute -top-4" />
                <div
                  className="w-13 h-13 rounded-xl border-2 flex items-center justify-center text-2xl mt-2 shadow-md"
                  style={{
                    borderColor: top3Clans[0].color,
                    backgroundColor: `${top3Clans[0].color}25`,
                    boxShadow: `0 0 15px ${top3Clans[0].color}50`,
                  }}
                >
                  {top3Clans[0].symbol}
                </div>
                <div className="text-xs font-black text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Clans[0].name}
                </div>
                <div className="text-[10px] text-amber-300 font-mono-stat font-bold">
                  [{top3Clans[0].tag}]
                </div>
                <div className="text-[11px] text-yellow-400 font-bold font-mono-stat mt-0.5">
                  {top3Clans[0].territoryScore || 0} PTS<br/>
                  {top3Clans[0].zonesControlledCount || 0} ZONAS
                </div>
              </div>

              {/* 3rd Place */}
              <div
                onClick={() => onSelectClan && onSelectClan(top3Clans[2])}
                className="p-2.5 rounded-2xl bg-[#050505] border-2 border-amber-700 text-center relative flex flex-col items-center shadow-lg cursor-pointer hover:border-amber-600 transition-transform active:scale-95"
              >
                <div className="w-5 h-5 rounded bg-amber-600 text-black font-black text-xs flex items-center justify-center absolute -top-2.5 font-mono-stat">
                  3
                </div>
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center text-2xl mt-1 shadow-sm"
                  style={{
                    borderColor: top3Clans[2].color,
                    backgroundColor: `${top3Clans[2].color}20`,
                  }}
                >
                  {top3Clans[2].symbol}
                </div>
                <div className="text-[11px] font-black text-white mt-1.5 truncate max-w-full font-display uppercase">
                  {top3Clans[2].name}
                </div>
                <div className="text-[9px] text-slate-400 font-mono-stat">
                  [{top3Clans[2].tag}]
                </div>
                <div className="text-[10px] text-cyan-400 font-bold font-mono-stat mt-0.5">
                  {top3Clans[2].territoryScore || 0} PTS<br/>
                  {top3Clans[2].zonesControlledCount || 0} ZONAS
                </div>
              </div>
            </div>
          )}

          {/* Clan Rows */}
          <div className="space-y-2">
            {sortedClans.map((clan, idx) => {
              const rank = clan.rankPosition || idx + 1;
              return (
                <div
                  key={clan.id}
                  onClick={() => onSelectClan && onSelectClan(clan)}
                  className="p-3 rounded-2xl bg-[#000000] border-2 border-white/10 hover:border-yellow-400/70 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 text-center font-bold text-sm font-mono-stat shrink-0 ${
                        rank === 1
                          ? 'text-amber-400'
                          : rank === 2
                          ? 'text-slate-300'
                          : rank === 3
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      #{rank}
                    </span>

                    <div
                      className="w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform"
                      style={{
                        borderColor: clan.color,
                        backgroundColor: `${clan.color}20`,
                      }}
                    >
                      {clan.symbol}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white uppercase font-display truncate">
                          {clan.name}
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-black font-mono-stat uppercase"
                          style={{
                            backgroundColor: `${clan.color}20`,
                            color: clan.color,
                          }}
                        >
                          [{clan.tag}]
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 font-mono-stat truncate">
                        <span>{clan.membersCount} membros</span>
                        <span>•</span>
                        <span className="text-cyan-300">{(clan.totalKm || 0).toFixed(0)} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <div className="text-xs font-bold text-yellow-400 flex items-center justify-end gap-1 font-mono-stat">
                        <Shield className="w-3.5 h-3.5" />
                        {clan.territoryScore || 0} PTS
                      </div>
                      <div className="text-[10px] font-bold text-cyan-300 mt-0.5 font-mono-stat text-right">
                        {clan.zonesControlledCount || 0} ZONAS
                      </div>
                      <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono-stat">
                        {(clan.xp || 0).toLocaleString('pt-BR')} XP
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </>
      )}

      {/* Public Profile Modal (if triggered internally) */}
      <PublicProfileModal
        player={selectedPlayer}
        period={period}
        currentUser={currentUser}
        onClose={() => setSelectedPlayer(null)}
        onSendChallenge={(p) => {
          setSelectedPlayer(null);
          if (onSendChallenge) onSendChallenge(p);
        }}
      />
    </div>
  );
};

