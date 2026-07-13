'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { Award, Dices, RefreshCcw, ShieldCheck, Zap, Crown, Gem, Gift } from 'lucide-react';
import { formatCFA } from '@/lib/data';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { FirstDepositModal } from '@/components/FirstDepositModal';

type PrizeType = 'cash' | 'bomb' | 'jackpot';

interface Prize {
  id: number;
  label: string;
  value: number;
  type: PrizeType;
  color: string;
  weight: number;
}

const prizes: Prize[] = [
  { id: 0, label: '50',  value: 50,  type: 'cash',    color: '#10B981', weight: 32 },
  { id: 1, label: '💣',  value: 0,   type: 'bomb',    color: '#0F172A', weight: 24 },
  { id: 2, label: '100', value: 100, type: 'cash',    color: '#6366F1', weight: 18 },
  { id: 3, label: '💣',  value: 0,   type: 'bomb',    color: '#1E293B', weight: 14 },
  { id: 4, label: '200', value: 200, type: 'cash',    color: '#F59E0B', weight: 7  },
  { id: 5, label: '💣',  value: 0,   type: 'bomb',    color: '#334155', weight: 3  },
  { id: 6, label: '400', value: 400, type: 'cash',    color: '#D4AF37', weight: 1.5 },
  { id: 7, label: '800', value: 800, type: 'jackpot', color: '#EF4444', weight: 0.5 },
];

const SPIN_KEY = 'afilipro_spin_data';
const MAX_FREE_SPINS = 3;

function todayKey() { return new Date().toISOString().slice(0, 10); }

function loadSpinData() {
  if (typeof window === 'undefined') return { used: 0, history: [] as any[] };
  try {
    const raw = localStorage.getItem(SPIN_KEY);
    if (!raw) return { used: 0, history: [] };
    const data = JSON.parse(raw);
    if (data.date !== todayKey()) return { used: 0, history: [] };
    return { used: data.used ?? 0, history: data.history ?? [] };
  } catch { return { used: 0, history: [] }; }
}

function saveSpinData(used: number, history: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SPIN_KEY, JSON.stringify({ date: todayKey(), used, history }));
}

export default function LuckySpinPage() {
  const { showToast } = useToast();
  const { refresh } = useWallet();
  const { guardAction, showDepositModal, closeDepositModal } = useActivationGuard();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalWon, setTotalWon] = useState(0);
  const segmentAngle = 360 / prizes.length;
  const wheelRef = useRef<HTMLDivElement>(null);

  const [spinsUsed, setSpinsUsed] = useState(0);
  const [history, setHistory] = useState<{ label: string; value: number; type: string; time: string }[]>([]);

  useEffect(() => {
    const { used, history: h } = loadSpinData();
    setSpinsUsed(used);
    setHistory(h);
    setTotalWon(h.reduce((s: number, x: { value: number }) => s + x.value, 0));
  }, []);

  const spinsLeft = Math.max(0, MAX_FREE_SPINS - spinsUsed);

  const pickPrize = (): Prize => {
    const total = prizes.reduce((s, p) => s + p.weight, 0);
    let rnd = Math.random() * total;
    for (const p of prizes) { rnd -= p.weight; if (rnd <= 0) return p; }
    return prizes[0];
  };

  const handleSpin = async () => {
    guardAction(async () => { await doSpin(); });
  };

  const doSpin = async () => {
    if (spinning || spinsLeft <= 0) {
      if (spinsLeft <= 0) showToast('Plus de tours aujourd’hui. Revenez demain 🌅', 'error');
      return;
    }
    setSpinning(true);
    setShowResult(false);
    const prize = pickPrize();
    const targetCenter = prize.id * segmentAngle + segmentAngle / 2;
    const currentMod = rotation % 360;
    const spinTo = rotation + (360 - currentMod) + 360 * 6 + (360 - targetCenter);
    setRotation(spinTo);

    setTimeout(async () => {
      setLastPrize(prize);
      setShowResult(true);
      const newUsed = spinsUsed + 1;
      const newEntry = {
        label: prize.type === 'bomb' ? '💣' : `${prize.value} FCFA`,
        value: prize.value,
        type: prize.type,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      const newHistory = [newEntry, ...history].slice(0, 10);
      setSpinsUsed(newUsed);
      setHistory(newHistory);
      saveSpinData(newUsed, newHistory);

      if (prize.type === 'bomb') {
        showToast('💣 Perdu ! Réessayez.', 'error');
      } else {
        setTotalWon(t => t + prize.value);
        try {
          const res = await fetch('/api/lucky-spin/claim', {
            method: 'POST',
            headers: getClientAuthHeaders(true),
            body: JSON.stringify({ amount: prize.value }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          await refresh();
          showToast(`+${prize.value} FCFA crédités !`, 'success');
        } catch (e: any) {
          showToast(e.message || `+${prize.value} FCFA !`, 'info');
        }
      }
      setSpinning(false);
    }, 4800);
  };

  return (
    <>
      {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8 pb-10">
        
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0B0F1A] p-[1px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 via-yellow-500/20 to-transparent" />
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-[#0F172A] to-black p-7 sm:p-8 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-[80px]" />
            <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-violet-500/20 blur-[60px]" />
            
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl blur-md opacity-60" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg">
                    <Crown className="h-7 w-7 text-black" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">LUCKY SPIN</h1>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/70 mt-0.5">Premium • 100% Gratuit</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/[0.06] border border-white/10 px-5 py-3 backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Tours restants</p>
                  <p className="text-2xl font-black text-white">{spinsLeft}<span className="text-sm font-bold text-white/40">/{MAX_FREE_SPINS}</span></p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 px-5 py-3 shadow-lg shadow-amber-500/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Gagné aujourd'hui</p>
                  <p className="text-lg font-black text-black">{totalWon} FCFA</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {Array.from({ length: MAX_FREE_SPINS }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < spinsUsed ? 'bg-white/10' : 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-500/20'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Wheel */}
          <div className="relative rounded-[2.5rem] bg-white p-2 shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-slate-100">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 flex flex-col items-center">
              
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-800 tracking-wide">EN DIRECT • GAINS INSTANTANÉS</span>
              </div>

              <div className="relative my-4 h-[340px] w-[340px] sm:h-[400px] sm:w-[400px]">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 to-yellow-400 blur-[20px] opacity-30 scale-105" />
                
                {/* Pointer */}
                <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1">
                  <div className="relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-8 bg-gradient-to-b from-amber-300 to-yellow-600 rounded-t-md blur-[1px]" />
                    <div className="relative h-0 w-0 border-l-[20px] border-r-[20px] border-t-[36px] border-l-transparent border-r-transparent border-t-[#0F172A] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md" />
                  </div>
                </div>

                {/* Wheel container with premium bezel */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 p-[6px] shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_10px_40px_rgba(212,175,55,0.3)]">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-slate-900 via-[#101828] to-black p-[8px] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
                    <div className="h-full w-full rounded-full bg-[#0B0F1A] p-1.5">
                      <div
                        ref={wheelRef}
                        className="relative h-full w-full overflow-hidden rounded-full"
                        style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4.8s cubic-bezier(0.12,0.72,0.18,1)' : 'none' }}
                      >
                        <svg viewBox="0 0 200 200" className="h-full w-full">
                          <defs>
                            {prizes.map((p, i) => (
                              <radialGradient key={`g${i}`} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={p.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={p.color} stopOpacity="0.85" />
                              </radialGradient>
                            ))}
                          </defs>
                          {prizes.map((prize, i) => {
                            const toRad = (d: number) => (d * Math.PI) / 180;
                            const sA = i * segmentAngle - 90;
                            const eA = (i + 1) * segmentAngle - 90;
                            const x1 = 100 + 96 * Math.cos(toRad(sA));
                            const y1 = 100 + 96 * Math.sin(toRad(sA));
                            const x2 = 100 + 96 * Math.cos(toRad(eA));
                            const y2 = 100 + 96 * Math.sin(toRad(eA));
                            const largeArc = segmentAngle > 180 ? 1 : 0;
                            const mA = (sA + eA) / 2;
                            const tx = 100 + 60 * Math.cos(toRad(mA));
                            const ty = 100 + 60 * Math.sin(toRad(mA));
                            const isBomb = prize.type === 'bomb';
                            return (
                              <g key={prize.id}>
                                <path d={`M100 100 L${x1} ${y1} A96 96 0 ${largeArc} 1 ${x2} ${y2}Z`} fill={`url(#grad-${i})`} stroke="#0F172A" strokeWidth="1.2" />
                                <text x={tx} y={ty} fill="white" fontSize={isBomb ? '16' : '7.5'} fontWeight="900" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mA + 90} ${tx} ${ty})`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                  {prize.type === 'bomb' ? '💣' : prize.type === 'jackpot' ? '800' : prize.label.replace(' FCFA','')}
                                </text>
                              </g>
                            );
                          })}
                          {/* Inner circles for depth */}
                          <circle cx="100" cy="100" r="34" fill="#0B0F1A" stroke="#1E293B" strokeWidth="1" />
                          <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1" strokeDasharray="3 4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center hub premium */}
                <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-[12px] opacity-40" />
                    <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-black border-[3px] border-amber-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-inner">
                        <Gem className={`h-6 w-6 text-black ${spinning ? 'animate-spin' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSpin}
                disabled={spinning || spinsLeft <= 0}
                className="group relative mt-2 w-full max-w-[320px] overflow-hidden rounded-2xl bg-[#0F172A] p-[1.5px] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3 rounded-[15px] bg-gradient-to-br from-amber-400 to-yellow-600 py-4 text-[15px] font-black tracking-wide text-black">
                  {spinning ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      TIRAGE EN COURS...
                    </>
                  ) : spinsLeft > 0 ? (
                    <>
                      <Zap className="h-5 w-5" />
                      LANCER GRATUITEMENT
                      <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">{spinsLeft} restants</span>
                    </>
                  ) : (
                    <>Plus de tours aujourd'hui</>
                  )}
                </div>
              </button>

              {showResult && lastPrize && (
                <div className={`mt-5 w-full max-w-[320px] rounded-2xl p-4 text-center animate-slide-up border ${lastPrize.type === 'bomb' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/20 text-white shadow-lg shadow-emerald-500/20'}`}>
                  {lastPrize.type === 'bomb' ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-2xl">💥</div>
                      <div className="text-left">
                        <p className="font-bold text-sm">Perdu !</p>
                        <p className="text-xs text-white/60">Bombe touchée — tentez encore</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Gift className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Gain gagné</p>
                          <p className="text-lg font-black">+{lastPrize.value} FCFA</p>
                        </div>
                      </div>
                      <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">CRÉDITÉ ✓</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel — Premium Stats only, no legend */}
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[#0F172A] p-1">
              <div className="rounded-[1.4rem] bg-gradient-to-br from-slate-900 to-black p-5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sécurisé</p>
                      <p className="text-sm font-bold text-white">Gains instantanés</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mes gains</p>
                    <p className="mt-1 text-xl font-black text-white">{totalWon} <span className="text-xs font-bold text-white/40">FCFA</span></p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Jackpot max</p>
                    <p className="mt-1 text-xl font-black text-amber-300">800 <span className="text-xs font-bold text-amber-300/60">FCFA</span></p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                  <p className="text-[11px] font-semibold text-amber-200/80 leading-tight">Les gains sont crédités directement sur votre solde principal</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-sm tracking-wide">HISTORIQUE DU JOUR</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{history.length} tours</span>
              </div>
              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                    <Dices className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-400">Aucun tirage aujourd'hui</p>
                  <p className="text-xs text-slate-400/70 mt-1">Lancez la roue pour commencer</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scroll">
                  {history.map((h, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${h.type === 'bomb' ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/70 border-emerald-100'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black ${h.type === 'bomb' ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white'}`}>
                          {h.type === 'bomb' ? '💣' : '✓'}
                        </div>
                        <span className={`text-xs font-bold ${h.type === 'bomb' ? 'text-slate-600' : 'text-emerald-800'}`}>{h.label}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
