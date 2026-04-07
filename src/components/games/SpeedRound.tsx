"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useIsPro } from "@/lib/ProContext";

export type SRQuestion = {
  q: string;
  options: string[];
  answer: number; // 0-3
};

type Props = {
  questions: SRQuestion[];
  gameId: string;
  subject?: string;
  variant?: "sidebar"; // vertical centered card for sidebars
};

type Phase = "idle" | "countdown" | "playing" | "result";

const DURATION = 60;
const RING_R   = 40;
const RING_C   = 2 * Math.PI * RING_R;

function timerColor(t: number) {
  if (t > 30) return "#4ade80";
  if (t > 15) return "#fbbf24";
  return "#f87171";
}
function timerGlow(t: number) {
  if (t > 30) return "rgba(74,222,128,0.4)";
  if (t > 15) return "rgba(251,191,36,0.4)";
  return "rgba(248,113,113,0.45)";
}
function bestKey(id: string) { return `sr_best_${id}`; }
function buildPool(qs: SRQuestion[]): SRQuestion[] {
  const pool: SRQuestion[] = [];
  const s = () => [...qs].sort(() => Math.random() - 0.5);
  while (pool.length < 80) pool.push(...s());
  return pool;
}

/* ─── Web Audio ─────────────────────────────────────────────────────────── */

// Composed melody: [freq_hz, beats] — 32-step phrase, loops seamlessly
// Normal BPM = 116, Urgent BPM = 158
const MELODY: [number, number][] = [
  [523.25, 0.5], [659.25, 0.5], [783.99, 1],       // C5 E5 G5(long)
  [659.25, 0.5], [587.33, 0.5], [523.25, 0.5], [440.00, 0.5], // E5 D5 C5 A4
  [392.00, 1],   [440.00, 0.5], [523.25, 0.5],      // G4(long) A4 C5
  [659.25, 1.5], [523.25, 0.5],                      // E5(dotted) C5
  [440.00, 0.5], [523.25, 0.5], [587.33, 0.5], [659.25, 0.5], // A4 C5 D5 E5
  [783.99, 0.5], [880.00, 0.5], [783.99, 1],        // G5 A5 G5(long)
  [659.25, 0.5], [587.33, 0.5], [523.25, 0.5], [440.00, 0.5], // E5 D5 C5 A4
  [392.00, 0.5], [329.63, 0.5], [392.00, 0.5], [440.00, 0.5], // G4 E4 G4 A4
  [523.25, 2],                                        // C5(long hold)
  [329.63, 0.5], [392.00, 0.5], [440.00, 0.5], [523.25, 0.5], // E4 G4 A4 C5
];

// Bass pattern: [freq_hz, every N beats]
const BASS_NOTES = [130.81, 98.00, 110.00, 87.31]; // C3 G2 A2 F2

function useGameAudio() {
  const ctxRef       = useRef<AudioContext | null>(null);
  const schedRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urgentRef    = useRef(false);
  const runningRef   = useRef(false);
  const nextTimeRef  = useRef(0); // AudioContext time for next note
  const noteIdxRef   = useRef(0); // current position in MELODY
  const beatCountRef = useRef(0); // total beats elapsed (for bass)

  function ctx(): AudioContext {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }

  function scheduleNote(freq: number, startTime: number, dur: number, vol: number, type: OscillatorType = "triangle") {
    try {
      const c = ctxRef.current!;
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(c.destination);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.85);
      osc.start(startTime);
      osc.stop(startTime + dur);
    } catch { /* ignore */ }
  }

  function scheduleChunk() {
    if (!runningRef.current || !ctxRef.current) return;
    const c = ctxRef.current;
    const bpm = urgentRef.current ? 158 : 116;
    const beatSec = 60 / bpm;
    const lookahead = 0.3; // seconds to look ahead

    while (nextTimeRef.current < c.currentTime + lookahead) {
      const [freq, beats] = MELODY[noteIdxRef.current % MELODY.length];
      const dur = beats * beatSec;
      const vol = urgentRef.current ? 0.07 : 0.05;

      scheduleNote(freq, nextTimeRef.current, dur, vol);

      // Bass every 2 beats
      if (Math.floor(beatCountRef.current) % 2 === 0) {
        const bassIdx = Math.floor(beatCountRef.current / 2) % BASS_NOTES.length;
        scheduleNote(BASS_NOTES[bassIdx], nextTimeRef.current, beatSec * 1.8,
          urgentRef.current ? 0.065 : 0.045, "sine");
      }

      nextTimeRef.current += dur;
      beatCountRef.current += beats;
      noteIdxRef.current++;
    }

    schedRef.current = setTimeout(scheduleChunk, 100);
  }

  // Play a single short note (for SFX)
  function note(freq: number, vol: number, dur: number, type: OscillatorType = "triangle") {
    try {
      const c = ctx();
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(c.destination);
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + dur + 0.02);
    } catch { /* ignore */ }
  }

  const startAmbient = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    urgentRef.current = false;
    const c = ctx();
    nextTimeRef.current = c.currentTime + 0.05;
    noteIdxRef.current = 0;
    beatCountRef.current = 0;
    scheduleChunk();
  }, []); // eslint-disable-line

  const setAmbientUrgency = useCallback((urgent: boolean) => {
    if (urgentRef.current === urgent) return;
    urgentRef.current = urgent;
    // Reschedule immediately with new BPM from current position
    if (schedRef.current) { clearTimeout(schedRef.current); schedRef.current = null; }
    if (runningRef.current && ctxRef.current) {
      nextTimeRef.current = ctxRef.current.currentTime + 0.05;
      scheduleChunk();
    }
  }, []); // eslint-disable-line

  const stopAmbient = useCallback(() => {
    runningRef.current = false;
    urgentRef.current = false;
    if (schedRef.current) { clearTimeout(schedRef.current); schedRef.current = null; }
  }, []);

  const playTick = useCallback((urgent: boolean) => {
    try {
      const c = ctx();
      const buf = c.createBuffer(1, c.sampleRate * 0.04, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.008));
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const gain = c.createGain();
      gain.gain.value = urgent ? 0.35 : 0.18;
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = urgent ? 1800 : 1200;
      filter.Q.value = 2;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      src.start();
    } catch { /* ignore */ }
  }, []);

  const playCorrect = useCallback(() => {
    try {
      const c = ctx();
      const freqs = [523, 659, 784]; // C5 E5 G5
      freqs.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(c.destination);
        gain.gain.setValueAtTime(0, c.currentTime + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, c.currentTime + i * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.06 + 0.25);
        osc.start(c.currentTime + i * 0.06);
        osc.stop(c.currentTime + i * 0.06 + 0.3);
      });
    } catch { /* ignore */ }
  }, []);

  const playWrong = useCallback(() => {
    try {
      const c = ctx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, c.currentTime);
      osc.frequency.linearRampToValueAtTime(110, c.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(c.destination);
      gain.gain.setValueAtTime(0.1, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
      osc.start();
      osc.stop(c.currentTime + 0.3);
    } catch { /* ignore */ }
  }, []);

  const playEnd = useCallback(() => {
    try {
      const c = ctx();
      // Descending fanfare
      [523, 494, 440, 392].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(c.destination);
        const t = c.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => () => { try { ctxRef.current?.close(); } catch { /* ignore */ } }, []);

  return { startAmbient, stopAmbient, setAmbientUrgency, playTick, playCorrect, playWrong, playEnd };
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function SpeedRound({ questions, gameId, subject, variant }: Props) {
  const isPro = useIsPro();
  const audio  = useGameAudio();

  const [phase, setPhase]         = useState<Phase>("idle");
  const [open, setOpen]           = useState(false);
  const [count, setCount]         = useState(3);
  const [timeLeft, setTimeLeft]   = useState(DURATION);
  const [pool, setPool]           = useState<SRQuestion[]>([]);
  const [qi, setQi]               = useState(0);
  const [score, setScore]         = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [chosen, setChosen]       = useState<number | null>(null);
  const [flash, setFlash]         = useState<"correct" | "wrong" | null>(null);
  const [pb, setPb]               = useState(0);
  const [newBest, setNewBest]     = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [plusAnim, setPlusAnim]   = useState(0); // increments to re-trigger anim

  const locked   = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try { const v = localStorage.getItem(bestKey(gameId)); if (v) setPb(parseInt(v, 10)); }
    catch { /* ignore */ }
  }, [gameId]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function startGame() {
    locked.current = false;
    setPool(buildPool(questions));
    setPhase("countdown");
    setCount(3);
    setScore(0); setAttempted(0); setStreak(0); setMaxStreak(0);
    setQi(0); setChosen(null); setFlash(null); setNewBest(false);
    setOpen(true);
  }

  function closeModal() {
    clearInterval(timerRef.current!);
    setOpen(false);
    setPhase("idle");
  }

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) { setPhase("playing"); setTimeLeft(DURATION); return; }
    const t = setTimeout(() => setCount(c => c - 1), 900);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Timer + ticking
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        audio.playTick(next <= 10);
        if (next <= 0) {
          clearInterval(timerRef.current!);
          audio.playEnd();
          setPhase("result");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { clearInterval(timerRef.current!); };
  }, [phase]); // eslint-disable-line

  // Count-up + personal best
  useEffect(() => {
    if (phase !== "result") return;
    setDisplayScore(0);
    if (score === 0) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(score / 20));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, score);
      setDisplayScore(cur);
      if (cur >= score) clearInterval(iv);
    }, 45);
    try {
      const stored = parseInt(localStorage.getItem(bestKey(gameId)) ?? "0", 10);
      if (score > stored) { setPb(score); setNewBest(true); localStorage.setItem(bestKey(gameId), String(score)); }
    } catch { /* ignore */ }
    return () => clearInterval(iv);
  }, [phase]); // eslint-disable-line

  function pick(idx: number) {
    if (locked.current || flash !== null) return;
    locked.current = true;
    const correct = idx === pool[qi]?.answer;
    setChosen(idx);
    setAttempted(a => a + 1);
    if (correct) {
      audio.playCorrect();
      setScore(s => s + 1);
      setStreak(s => { const ns = s + 1; setMaxStreak(ms => Math.max(ms, ns)); return ns; });
      setFlash("correct");
      setPlusAnim(n => n + 1);
    } else {
      audio.playWrong();
      setStreak(0);
      setFlash("wrong");
    }
    setTimeout(() => {
      setFlash(null); setChosen(null);
      setQi(i => i + 1);
      locked.current = false;
    }, 500);
  }

  // Keyboard shortcuts 1-4 / A-D
  useEffect(() => {
    if (phase !== "playing" || !open) return;
    function onKey(e: KeyboardEvent) {
      const map: Record<string, number> = { "1":0,"2":1,"3":2,"4":3,"a":0,"b":1,"c":2,"d":3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined) pick(idx);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, open, pool, qi, flash]); // eslint-disable-line

  const currentQ   = pool[qi];
  const tColor     = timerColor(timeLeft);
  const tGlow      = timerGlow(timeLeft);
  const dashOffset = RING_C * (timeLeft / DURATION);
  const accuracy   = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
  const stars      = score === 0 ? 0 : score < 8 ? 1 : score < 16 ? 2 : 3;
  const urgent     = timeLeft <= 10;

  /* ─── PRO GATE ──────────────────────────────────────────────────────── */
  if (!isPro) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0F0F12]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F5DA20]/6 blur-2xl" />
        <div className="relative flex items-center gap-4 px-6 py-5">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5DA20]/12 text-2xl ring-1 ring-[#F5DA20]/20">⚡</div>
            <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[#F5DA20] px-1.5 py-px text-[8px] font-black text-black">PRO</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-white">Speed Round</div>
            <div className="text-xs text-white/35">60 seconds · beat your personal best · Pro only</div>
          </div>
          <a href="/pro" className="shrink-0 rounded-xl bg-[#F5DA20] px-4 py-2 text-xs font-black text-black transition hover:opacity-90">
            Unlock
          </a>
        </div>
      </div>
    );
  }

  /* ─── TEASER CARD ───────────────────────────────────────────────────── */
  return (
    <>
      {variant === "sidebar" ? (
        <>
          {/* Desktop sidebar — vertical white card, hidden on mobile */}
          <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F5DA20]/20 blur-2xl" />
            <div className="relative flex flex-col items-center px-5 pt-7 pb-5 text-center">
              <div className="relative mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20] text-3xl shadow-sm">⚡</div>
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-black px-1.5 py-px text-[8px] font-black text-[#F5DA20] leading-none">PRO</span>
              </div>
              <p className="text-base font-black text-slate-900">Speed Round</p>
              {subject && <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{subject}</p>}
              <p className="mt-2 text-xs leading-relaxed text-slate-400">60 seconds · answer as many as you can</p>
              {pb > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-black/8 bg-slate-50 px-3 py-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Best</span>
                  <span className="text-lg font-black text-slate-900">{pb}</span>
                </div>
              )}
            </div>
            <div className="border-t border-black/6" />
            <div className="p-4">
              <button
                onClick={startGame}
                className="w-full rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition hover:bg-[#e8cf00] hover:shadow-[0_4px_16px_rgba(245,218,32,0.4)] active:scale-[0.97]"
              >
                Play
              </button>
            </div>
          </div>

          {/* Mobile — compact horizontal pill, visible only on small screens */}
          <div className="lg:hidden relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F12]">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-base">⚡</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white leading-tight">Speed Round</div>
                <div className="text-[11px] text-white/40 leading-tight">
                  60 sec{pb > 0 ? ` · Best: ${pb}` : " · beat your best"}
                </div>
              </div>
              <button
                onClick={startGame}
                className="shrink-0 rounded-xl bg-[#F5DA20] px-4 py-2 text-xs font-black text-black active:scale-95 transition touch-manipulation"
              >
                Play ⚡
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Default — horizontal row card */
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0F0F12]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F5DA20]/6 blur-2xl" />
          <div className="relative flex items-center gap-4 px-6 py-5">
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5DA20]/12 text-2xl ring-1 ring-[#F5DA20]/20">⚡</div>
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[#F5DA20] px-1.5 py-px text-[8px] font-black text-black">PRO</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-white">
                Speed Round{subject ? ` · ${subject}` : ""}
              </div>
              <div className="text-xs text-white/35">
                60 seconds · answer as many as you can
                {pb > 0 && <> · <span className="text-[#F5DA20]">Best: {pb}</span></>}
              </div>
            </div>
            <button
              onClick={startGame}
              className="shrink-0 rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black transition hover:scale-105 hover:shadow-[0_0_20px_rgba(245,218,32,0.35)] active:scale-95"
            >
              Play
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL (Portal → renders in document.body, outside any stacking context) ── */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.92)" }}
        >
          <div className="relative w-full max-w-lg">
            {/* Close — inside card on mobile, outside on desktop */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 sm:-right-11 sm:-top-1 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/50 transition hover:bg-white/15 hover:text-white touch-manipulation"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

          <div
            className="relative w-full overflow-hidden rounded-3xl bg-[#0F0F12]"
            style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
          >
            {/* Reactive ambient glow */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl transition-all duration-1000"
              style={{ background: phase === "playing" ? `${tColor}12` : "rgba(245,218,32,0.06)" }}
            />

            {/* ── COUNTDOWN ──────────────────────────────────────────── */}
            {phase === "countdown" && (
              <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                <p className="mb-10 text-[10px] font-black uppercase tracking-[5px] text-white/25">get ready</p>
                <div
                  key={`cd-${count}`}
                  className="font-black leading-none text-white"
                  style={{ fontSize: 120, animation: "srCountIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                  {count === 0 ? <span className="text-[#F5DA20]">GO!</span> : count}
                </div>
              </div>
            )}

            {/* ── PLAYING ────────────────────────────────────────────── */}
            {phase === "playing" && currentQ && (
              <div className="flex flex-col" style={{ minHeight: 440 }}>

                {/* Top bar */}
                <div
                  className="flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-700"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: urgent ? "rgba(248,113,113,0.04)" : "transparent" }}
                >
                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">Score</span>
                    <span
                      key={`score-${score}`}
                      className="text-2xl font-black text-white tabular-nums"
                      style={{ animation: score > 0 ? "srPop 0.3s cubic-bezier(0.34,1.56,0.64,1)" : undefined }}
                    >
                      {score}
                    </span>
                  </div>

                  {/* Streak */}
                  {streak >= 3 && (
                    <div
                      key={`streak-${streak}`}
                      className="flex items-center gap-1.5 rounded-xl border border-orange-500/25 bg-orange-500/10 px-2.5 py-1"
                      style={{ animation: "srPop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                    >
                      <span className="text-sm">🔥</span>
                      <span className="text-sm font-black text-orange-400">{streak}</span>
                    </div>
                  )}

                  {/* Ring timer */}
                  <div className="relative shrink-0">
                    <svg width="56" height="56" viewBox="0 0 88 88" className={`-rotate-90 ${urgent ? "animate-pulse" : ""}`}>
                      <circle cx="44" cy="44" r={RING_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                      <circle
                        cx="44" cy="44" r={RING_R} fill="none"
                        stroke={tColor} strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={RING_C} strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease", filter: `drop-shadow(0 0 6px ${tGlow})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-base font-black tabular-nums"
                        style={{ color: tColor, textShadow: `0 0 12px ${tGlow}` }}
                      >
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-[2px] w-full bg-white/5">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / DURATION) * 100}%`, background: tColor, boxShadow: `0 0 8px ${tGlow}` }}
                  />
                </div>

                <div className="flex flex-1 flex-col px-6 pt-6 pb-5">
                  <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                    Question #{qi + 1}
                  </div>

                  {/* Fixed-height question box — never resizes */}
                  <div
                    className="relative mb-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04]"
                    style={{ height: 96 }}
                  >
                    <div
                      key={`q-${qi}`}
                      className="absolute inset-0 flex items-center justify-center px-6"
                      style={{ animation: "srSlide 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                    >
                      <p className="text-center text-[17px] font-bold leading-snug text-white">
                        {currentQ.q}
                      </p>
                    </div>
                  </div>

                  {/* Answer grid — always 2×2, fixed layout */}
                  <div className="relative grid grid-cols-2 gap-2.5">
                    {/* +1 float — positioned inside the grid container */}
                    <div
                      key={`plus-${plusAnim}`}
                      className="pointer-events-none absolute -right-2 -top-8 z-20"
                    >
                      {plusAnim > 0 && (
                        <span
                          className="block text-2xl font-black text-green-400"
                          style={{ animation: "srFloat 0.7s ease forwards" }}
                        >
                          +1
                        </span>
                      )}
                    </div>

                    {currentQ.options.map((opt, idx) => {
                      const isChosen  = chosen === idx;
                      const isCorrect = idx === currentQ.answer;
                      let cls = "border-white/10 bg-white/[0.04] text-white/75 hover:enabled:border-white/25 hover:enabled:bg-white/8 hover:enabled:scale-[1.02]";
                      let lbl = "bg-white/8 text-white/35";
                      if (flash === "correct" && isChosen) {
                        cls = "border-green-400/60 bg-green-500/15 text-green-300 shadow-[0_0_16px_rgba(74,222,128,0.15)]";
                        lbl = "bg-green-400/25 text-green-300";
                      } else if (flash === "wrong" && isChosen) {
                        cls = "border-red-400/60 bg-red-500/15 text-red-300 shadow-[0_0_16px_rgba(248,113,113,0.15)]";
                        lbl = "bg-red-400/25 text-red-300";
                      } else if (flash === "wrong" && isCorrect) {
                        cls = "border-green-400/25 bg-green-500/8 text-green-400/60";
                        lbl = "bg-green-400/12 text-green-400/50";
                      }
                      return (
                        <button
                          key={`opt-${idx}`}
                          onClick={() => pick(idx)}
                          disabled={flash !== null}
                          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3.5 text-left text-sm font-semibold transition-all duration-150 disabled:cursor-default active:enabled:scale-[0.97] ${cls}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black transition-colors ${lbl}`}>
                            {["A","B","C","D"][idx]}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-center text-[10px] text-white/15">
                    press 1 – 4 or A – D to answer
                  </p>
                </div>
              </div>
            )}

            {/* ── RESULT ─────────────────────────────────────────────── */}
            {phase === "result" && (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F5DA20]/5 blur-3xl" />

                <p className="mb-3 text-[10px] font-black uppercase tracking-[4px] text-white/25">time&apos;s up</p>

                {newBest && (
                  <div
                    className="mb-4 flex items-center gap-2 rounded-xl border border-[#F5DA20]/30 bg-[#F5DA20]/10 px-5 py-2"
                    style={{ animation: "srPop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
                  >
                    <span>🎉</span>
                    <span className="text-sm font-black text-[#F5DA20]">New personal best!</span>
                  </div>
                )}

                <div
                  className="mb-1 font-black text-white tabular-nums"
                  style={{ fontSize: "clamp(5rem,18vw,7rem)", lineHeight: 1 }}
                >
                  {displayScore}
                </div>
                <p className="mb-6 text-sm text-white/30">correct answers</p>

                {/* Stars */}
                <div className="mb-6 flex items-center gap-2">
                  {[1,2,3].map(s => (
                    <div
                      key={`star-${s}`}
                      style={{ animation: stars >= s ? `srPop 0.4s ${(s-1)*0.12}s cubic-bezier(0.34,1.56,0.64,1) both` : undefined }}
                    >
                      <svg
                        className={`h-8 w-8 ${stars >= s ? "text-[#F5DA20] drop-shadow-[0_0_8px_rgba(245,218,32,0.5)]" : "text-white/8"}`}
                        viewBox="0 0 24 24" fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mb-6 grid w-full max-w-xs grid-cols-3 gap-2">
                  {[
                    { label: "attempted", val: String(attempted) },
                    { label: "accuracy",  val: `${accuracy}%` },
                    { label: "best streak", val: String(maxStreak), hot: maxStreak >= 5 },
                  ].map(({ label, val, hot }) => (
                    <div key={label} className="rounded-2xl border border-white/6 bg-white/[0.03] px-2 py-3">
                      <div className={`text-xl font-black ${hot ? "text-orange-400" : "text-white"}`}>
                        {hot && "🔥"}{val}
                      </div>
                      <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/25">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={startGame}
                    className="rounded-2xl bg-[#F5DA20] px-8 py-3 text-sm font-black text-black transition hover:scale-105 hover:shadow-[0_0_28px_rgba(245,218,32,0.35)] active:scale-95"
                  >
                    Play again
                  </button>
                  <button
                    onClick={closeModal}
                    className="rounded-2xl border border-white/10 bg-white/4 px-8 py-3 text-sm font-bold text-white/50 transition hover:bg-white/8"
                  >
                    Close
                  </button>
                </div>

                {pb > 0 && !newBest && (
                  <p className="mt-5 text-[11px] text-white/18">
                    Best: {pb}{score < pb ? ` · ${pb - score} to beat it` : " · you matched it!"}
                  </p>
                )}
              </div>
            )}

            <style>{`
              @keyframes srCountIn { from{transform:scale(0.2) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
              @keyframes srSlide   { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
              @keyframes srFloat   { from{transform:translateY(0);opacity:1} to{transform:translateY(-52px);opacity:0} }
              @keyframes srPop     { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
            `}</style>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
