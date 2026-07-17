"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { playBottleGame } from "@/lib/actions";

type Phase = "idle" | "shuffling" | "picking" | "result";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BOTTLE_EMOJIS = ["🍾", "🍾", "🍾"];
const COLORS = ["from-violet-500 to-violet-700", "from-blue-500 to-blue-700", "from-indigo-500 to-indigo-700"];

export default function BottleGame({ canPlay, taskId }: { canPlay: boolean; taskId: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [positions, setPositions] = useState([0, 1, 2]);   // which bottle index is at which position
  const [ballAt, setBallAt] = useState(0);                  // real bottle index (0,1,2) holding the ball
  const [revealed, setRevealed] = useState<number | null>(null);
  const [result, setResult] = useState<{ won: boolean; reward: number; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Animate shuffle: swap pairs randomly multiple times
  async function doShuffle() {
    let current = [0, 1, 2];
    let ball = Math.floor(Math.random() * 3); // where ball starts
    setBallAt(ball);
    setPhase("shuffling");

    const rounds = 12 + Math.floor(Math.random() * 8); // 12-19 swaps
    for (let i = 0; i < rounds; i++) {
      await new Promise(r => setTimeout(r, 120 + Math.random() * 100));
      // pick two random distinct indices to swap
      let a = Math.floor(Math.random() * 3);
      let b = Math.floor(Math.random() * 3);
      while (b === a) b = Math.floor(Math.random() * 3);

      // swap in positions array
      const next = [...current];
      const posA = next.indexOf(a);
      const posB = next.indexOf(b);
      [next[posA], next[posB]] = [next[posB], next[posA]];
      current = next;
      setPositions([...next]);

      // also track where ball moved
      if (ball === a) ball = b;
      else if (ball === b) ball = a;
      setBallAt(ball);
    }

    setPhase("picking");
  }

  async function handleStart() {
    if (!canPlay || phase !== "idle" || loading) return;
    setResult(null);
    setRevealed(null);
    setPositions([0, 1, 2]);
    await doShuffle();
  }

  async function handlePick(bottleIndex: number) {
    if (phase !== "picking" || loading) return;
    setLoading(true);
    setPhase("result");
    setRevealed(bottleIndex);

    const res = await playBottleGame(taskId, bottleIndex, ballAt);
    setResult(res);
    router.refresh();
    setLoading(false);
  }

  const bottleOrder = positions; // bottleOrder[position] = bottle index

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phase indicator */}
      <div className={`w-full rounded-2xl px-4 py-3 text-center text-[13px] font-black ${
        phase === "idle"      ? "bg-slate-100 text-slate-600" :
        phase === "shuffling" ? "bg-amber-50 text-amber-700" :
        phase === "picking"   ? "bg-violet-50 text-violet-700" :
        "bg-slate-50 text-slate-700"
      }`}>
        {phase === "idle"      && "Clique sur « Commencer » pour lancer le jeu"}
        {phase === "shuffling" && "🔀 Les bouteilles bougent... Suivez la boule !"}
        {phase === "picking"   && "👆 Cliquez sur la bouteille qui cache la boule !"}
        {phase === "result"    && (result?.won ? "🎉 Vous avez gagné !" : "😔 Raté ! La boule était ailleurs.")}
      </div>

      {/* Bottles */}
      <div className="relative flex h-40 w-full items-end justify-around gap-4">
        {[0, 1, 2].map((position) => {
          const bottleIdx = bottleOrder[position];
          const isRevealed = phase === "result" && revealed !== null;
          const isChosen = revealed === bottleIdx;
          const hasBall = bottleIdx === ballAt;

          return (
            <div key={`pos-${position}`} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
              {/* Ball indicator (shown on reveal) */}
              {isRevealed && hasBall && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[28px]"
                >
                  ⚽
                </motion.div>
              )}
              {isRevealed && !hasBall && <div className="h-9" />}

              {/* Bottle */}
              <motion.button
                layout
                layoutId={`bottle-${bottleIdx}`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => handlePick(bottleIdx)}
                disabled={phase !== "picking"}
                className={`relative flex h-28 w-full flex-col items-center justify-end rounded-[20px] bg-gradient-to-b ${COLORS[bottleIdx]} text-white shadow-lg transition active:scale-95 disabled:cursor-default ${phase === "picking" ? "hover:scale-105 cursor-pointer" : ""} ${isChosen && result?.won ? "ring-4 ring-emerald-400" : ""} ${isChosen && !result?.won ? "opacity-60" : ""}`}
              >
                <span className="text-[52px] leading-none mb-1">🍾</span>
                {/* Glow on ball bottle after reveal */}
                {isRevealed && hasBall && (
                  <div className="absolute inset-0 rounded-[20px] ring-4 ring-amber-400 animate-pulse" />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`w-full rounded-2xl p-5 text-center ${
              result.won ? "bg-emerald-50 border-2 border-emerald-400" : "bg-rose-50 border border-rose-200"
            }`}
          >
            <p className="text-[30px]">{result.won ? "🎉" : "😔"}</p>
            <p className="mt-1 text-[15px] font-black text-slate-900">{result.message}</p>
            {result.won && result.reward > 0 && (
              <p className="mt-1 text-[13px] font-bold text-emerald-600">+{result.reward} FCFA crédités immédiatement</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      {!canPlay ? (
        <div className="w-full rounded-2xl bg-rose-50 border border-rose-200 p-4 text-center">
          <p className="text-[14px] font-black text-rose-700">⛔ Dépôt de 2 500 FCFA requis pour jouer</p>
        </div>
      ) : phase === "idle" ? (
        <button
          onClick={handleStart}
          className="w-full rounded-2xl bg-[#0B1120] py-4 text-[15px] font-black text-white transition active:scale-[0.98] shadow-lg"
        >
          🎮 Commencer le jeu
        </button>
      ) : phase === "result" ? (
        <button
          onClick={() => { setPhase("idle"); setRevealed(null); setResult(null); }}
          className="w-full rounded-2xl bg-slate-900 py-4 text-[15px] font-black text-white transition active:scale-[0.98]"
        >
          Rejouer une partie
        </button>
      ) : null}
    </div>
  );
}
