'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Toast';
import { useWallet } from '@/components/WalletProvider';
import { getClientAuthHeaders } from '@/lib/client-auth';
import { Award, Clock, Dices, Euro, Gift, RefreshCcw, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import { formatCFA } from '@/lib/data';
import { useActivationGuard } from '@/hooks/useActivationGuard';
import { FirstDepositModal } from '@/components/FirstDepositModal';

// ─── Config des segments ─────────────────────────────────────────────────────
type PrizeType = 'cash' | 'bomb' | 'jackpot';

interface Prize {
  id: number;
  label: string;
  value: number;
  type: PrizeType;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  weight: number;
}

const prizes: Prize[] = [
  { id: 0, label: '50 FCFA',  value: 50,  type: 'cash',    color: '#10B981', icon: Euro,     weight: 30 },
  { id: 1, label: '💣',        value: 0,   type: 'bomb',    color: '#334155', icon: Zap,      weight: 25 },
  { id: 2, label: '100 FCFA', value: 100, type: 'cash',    color: '#6366F1', icon: Star,     weight: 18 },
  { id: 3, label: '💣',        value: 0,   type: 'bomb',    color: '#1E293B', icon: Zap,      weight: 14 },
  { id: 4, label: '200 FCFA', value: 200, type: 'cash',    color: '#F59E0B', icon: Sparkles, weight: 7  },
  { id: 5, label: '💣',        value: 0,   type: 'bomb',    color: '#475569', icon: Zap,      weight: 3  },
  { id: 6, label: '400 FCFA', value: 400, type: 'cash',    color: '#D4AF37', icon: Gift,     weight: 2  },
  { id: 7, label: '800 FCFA', value: 800, type: 'jackpot', color: '#EF4444', icon: Trophy,   weight: 1  },
];

// ─── Clé localStorage ────────────────────────────────────────────────────────
const SPIN_KEY = 'afilipro_spin_data';
const MAX_FREE_SPINS = 3; // 3 tours gratuits par jour

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSpinData() {
  if (typeof window === 'undefined') return { used: 0, history: [] as { label: string; value: number; type: string; time: string }[] };
  try {
    const raw = localStorage.getItem(SPIN_KEY);
    if (!raw) return { used: 0, history: [] };
    const data = JSON.parse(raw);
    // Reset si c'est un nouveau jour
    if (data.date !== todayKey()) return { used: 0, history: [] };
    return { used: data.used ?? 0, history: data.history ?? [] };
  } catch {
    return { used: 0, history: [] };
  }
}

function saveSpinData(used: number, history: { label: string; value: number; type: string; time: string }[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SPIN_KEY, JSON.stringify({ date: todayKey(), used, history }));
}

// ─── Composant ───────────────────────────────────────────────────────────────
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

  // Données persistées
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
    for (const p of prizes) {
      rnd -= p.weight;
      if (rnd <= 0) return p;
    }
    return prizes[0];
  };

  const handleSpin = async () => {
    guardAction(async () => {
      await doSpin();
    });
  };

  const doSpin = async () => {
    if (spinning) return;
    if (spinsLeft <= 0) {
      showToast('Tours gratuits épuisés pour aujourd\'hui ! Revenez demain 🌅', 'error');
      return;
    }

    setSpinning(true);
    setShowResult(false);

    const prize = pickPrize();
    const targetCenter = prize.id * segmentAngle + segmentAngle / 2;
    const currentMod   = rotation % 360;
    const spinTo       = rotation + (360 - currentMod) + 360 * 5 + (360 - targetCenter);
    setRotation(spinTo);

    setTimeout(async () => {
      setLastPrize(prize);
      setShowResult(true);

      const newUsed = spinsUsed + 1;
      const newEntry = {
        label: prize.type === 'bomb' ? '💣 Bombe' : prize.label,
        value: prize.value,
        type:  prize.type,
        time:  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      const newHistory = [newEntry, ...history].slice(0, 10);

      setSpinsUsed(newUsed);
      setHistory(newHistory);
      saveSpinData(newUsed, newHistory);

      if (prize.type === 'bomb') {
        showToast('💣 Bombe ! Pas de chance cette fois…', 'error');
      } else if (prize.value > 0) {
        setTotalWon((t) => t + prize.value);
        try {
          await fetch('/api/lucky-spin/claim', {
            method: 'POST',
            headers: getClientAuthHeaders(true),
            body: JSON.stringify({ amount: prize.value }),
          });
          await refresh();
          showToast(`🎉 +${prize.value} FCFA crédités sur votre compte !`, 'success');
        } catch {
          showToast(`🎉 Vous avez gagné ${prize.value} FCFA !`, 'success');
        }
      }

      setSpinning(false);
    }, 4500);
  };

  return (
    <>
    {showDepositModal && <FirstDepositModal onClose={closeDepositModal} />}
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-600 p-7 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Dices className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Lucky Spin</h1>
              <p className="text-white/80">100% gratuit • Gains crédités automatiquement</p>
            </div>
          </div>

          {/* Compteur de tours */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">
            <div className="text-center">
              <p className="text-2xl font-black font-display">{spinsLeft}</p>
              <p className="text-[11px] text-white/70">tours restants</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-black font-display text-yellow-200">{MAX_FREE_SPINS}</p>
              <p className="text-[11px] text-white/70">gratuits par jour</p>
            </div>
          </div>
        </div>

        {/* Barre de progression des tours */}
        <div className="relative mt-5">
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_FREE_SPINS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < spinsUsed ? 'bg-white/30' : 'bg-white/80'
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-white/60">
            {spinsUsed}/{MAX_FREE_SPINS} tours utilisés aujourd'hui — reset demain à minuit
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Roue ── */}
        <div className="lg:col-span-2 flex flex-col items-center rounded-3xl bg-white p-6 shadow-lg">
          <div className="relative mb-6 h-72 w-72 sm:h-80 sm:w-80">
            {/* Pointeur */}
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
              <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
            </div>

            {/* Anneau extérieur */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-yellow-600 p-2 shadow-2xl">
              <div className="h-full w-full rounded-full bg-gray-900 p-1">
                {/* Roue SVG rotative */}
                <div
                  ref={wheelRef}
                  className="relative h-full w-full overflow-hidden rounded-full"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? 'transform 4.5s cubic-bezier(0.17,0.67,0.21,0.99)' : 'none',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="h-full w-full">
                    {prizes.map((prize, i) => {
                      const toRad  = (d: number) => (d * Math.PI) / 180;
                      const sAngle = i * segmentAngle - 90;
                      const eAngle = (i + 1) * segmentAngle - 90;
                      const x1 = 100 + 95 * Math.cos(toRad(sAngle));
                      const y1 = 100 + 95 * Math.sin(toRad(sAngle));
                      const x2 = 100 + 95 * Math.cos(toRad(eAngle));
                      const y2 = 100 + 95 * Math.sin(toRad(eAngle));
                      const largeArc = segmentAngle > 180 ? 1 : 0;
                      const midAngle = (sAngle + eAngle) / 2;
                      const tx = 100 + 58 * Math.cos(toRad(midAngle));
                      const ty = 100 + 58 * Math.sin(toRad(midAngle));
                      const txt = prize.type === 'bomb' ? '💣' : prize.type === 'jackpot' ? '🏆' : prize.label.replace(' FCFA', '');
                      const fSize = prize.type !== 'cash' ? '14' : '7';
                      return (
                        <g key={prize.id}>
                          <path
                            d={`M100 100 L${x1} ${y1} A95 95 0 ${largeArc} 1 ${x2} ${y2}Z`}
                            fill={prize.color}
                            stroke="white"
                            strokeWidth="1"
                          />
                          <text
                            x={tx} y={ty}
                            fill="white"
                            fontSize={fSize}
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${midAngle + 90} ${tx} ${ty})`}
                          >
                            {txt}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Centre */}
            <div className="absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-accent bg-white shadow-xl flex items-center justify-center">
              <Dices className={`h-8 w-8 text-accent ${spinning ? 'animate-spin' : ''}`} />
            </div>
          </div>

          {/* Bouton Tourner */}
          <button
            onClick={handleSpin}
            disabled={spinning || spinsLeft <= 0}
            className="btn-primary w-full max-w-xs py-4 text-lg font-bold tracking-wide shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spinning ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                En cours…
              </span>
            ) : spinsLeft > 0 ? (
              `🎰 Tourner — Gratuit`
            ) : (
              <span className="flex items-center justify-center gap-2">
                <RefreshCcw className="h-5 w-5" /> Demain à minuit
              </span>
            )}
          </button>

          {/* Résultat */}
          {showResult && lastPrize && (
            <div
              className={`mt-5 w-full max-w-xs rounded-2xl p-5 text-center animate-slide-up ${
                lastPrize.type === 'bomb'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gradient-to-br from-success to-emerald-600 text-white'
              }`}
            >
              {lastPrize.type === 'bomb' ? (
                <>
                  <div className="text-5xl mb-2">💣</div>
                  <p className="text-lg font-bold">Boom ! Pas de chance…</p>
                  <p className="text-sm text-white/60 mt-1">Il reste {spinsLeft} tour{spinsLeft > 1 ? 's' : ''}</p>
                </>
              ) : (
                <>
                  <Award className="mx-auto mb-2 h-10 w-10" />
                  <p className="text-sm text-white/80">Gagné !</p>
                  <p className="text-3xl font-black font-display">+{lastPrize.value} FCFA</p>
                  <p className="text-xs text-white/70 mt-1">Crédité sur votre compte ✓</p>
                </>
              )}
            </div>
          )}

          {/* Épuisé */}
          {spinsLeft === 0 && !spinning && (
            <div className="mt-5 w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <RefreshCcw className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <p className="font-bold text-slate-700">Tous vos tours sont utilisés</p>
              <p className="text-sm text-slate-500 mt-1">Revenez demain pour 5 nouveaux tours gratuits !</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* Total gagné */}
          <div className="rounded-3xl bg-gradient-to-br from-accent to-yellow-600 p-5 text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Gagné aujourd'hui</p>
            <p className="mt-2 text-3xl font-black font-display">{formatCFA(totalWon)}</p>
          </div>

          {/* Légende */}
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-3 font-bold font-display text-slate-800">Segments de la roue</h3>
            <div className="space-y-2">
              {prizes.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 shrink-0 rounded-md flex items-center justify-center text-xs text-white font-bold"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.type === 'bomb' ? '💣' : p.type === 'jackpot' ? '🏆' : ''}
                  </div>
                  <span className="flex-1 text-xs font-medium text-slate-700">
                    {p.type === 'bomb' ? 'Bombe — rien' : p.label}
                  </span>
                  <span className="text-[10px] text-slate-400">{p.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historique */}
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-3 font-bold font-display text-slate-800 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Mes tours du jour
            </h3>
            {history.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">Aucun tour encore</p>
            ) : (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
                      h.type === 'bomb'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    <span className="font-medium">{h.label}</span>
                    <span className="text-[10px] text-slate-400">{h.time}</span>
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
