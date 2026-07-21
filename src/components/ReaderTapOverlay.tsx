"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, AlignJustify, Settings, Play, Pause, Home } from "lucide-react";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { useLibraryStore } from "@/lib/store";
import { Komik } from "@/types/komik";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

interface Props {
  komik: Komik;
  chapters: Chapter[];
  slug: string;
  currentChapterId: string;
  prevChapterId?: string | null;
  nextChapterId?: string | null;
  chapterNumber: number;
  t: Dictionary["reader"];
}

export default function ReaderTapOverlay({
  komik,
  chapters,
  slug,
  currentChapterId,
  prevChapterId,
  nextChapterId,
  chapterNumber,
  t,
}: Props) {
  const store = useLibraryStore();

  useEffect(() => {
    // Record history and mark as read
    store.addToHistory(komik, currentChapterId, chapterNumber);
    store.markChapterRead(currentChapterId);
  }, [komik.slug, currentChapterId, chapterNumber]);

  useEffect(() => {
    document.body.classList.add("reading-mode");
    return () => {
      document.body.classList.remove("reading-mode");
    };
  }, []);

  const [showUI, setShowUI] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Autoscroll — persisted in localStorage
  const LS_KEY = "reader:autoscrollSpeed";
  const savedSpeed = typeof window !== "undefined"
    ? parseFloat(localStorage.getItem(LS_KEY) ?? "1.0") || 1.0
    : 1.0;
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(savedSpeed);
  const [draftSpeed, setDraftSpeed] = useState(savedSpeed);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  // px per second at speed 1.0
  const BASE_PX_PER_SEC = 80;

  const scrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeItemRef = useRef<HTMLLIElement | null>(null);

  // ── Auto-scroll loop ──────────────────────────────────────────
  const startAutoScroll = useCallback((speed: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = null;

    const step = (ts: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      const px = (BASE_PX_PER_SEC * speed * delta) / 1000;
      window.scrollBy(0, px);

      // Stop at page bottom
      const atBottom =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 2;
      if (atBottom) {
        setIsAutoScrolling(false);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  // Toggle play/pause
  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrolling((prev) => {
      if (prev) {
        stopAutoScroll();
        return false;
      } else {
        startAutoScroll(autoScrollSpeed);
        return true;
      }
    });
  }, [autoScrollSpeed, startAutoScroll, stopAutoScroll]);

  // Restart loop whenever speed changes while active
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll(autoScrollSpeed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScrollSpeed]);

  // Cleanup on unmount
  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  // ── Scroll tracking (for tap detection) ──────────────────────
  useEffect(() => {
    const onScroll = () => {
      scrollingRef.current = true;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        scrollingRef.current = false;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll active chapter into view when list opens
  useEffect(() => {
    if (showList && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [showList]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);
      pointerStartRef.current = null;

      if (dx > 8 || dy > 8 || scrollingRef.current) return;

      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;

      setShowUI((v) => !v);
      setShowList(false);
      setShowSettings(false);
    },
    []
  );

  const scrollPage = (direction: "up" | "down") => {
    window.scrollBy({
      top: direction === "up" ? -window.innerHeight * 0.8 : window.innerHeight * 0.8,
      behavior: "smooth",
    });
  };

  // Speed tick marks for slider
  const SPEED_MIN = 0.5;
  const SPEED_MAX = 1.5;
  const SPEED_STEP = 0.05;
  const ticks = [0.5, 0.75, 1.0, 1.25, 1.5];
  const speedPct = ((draftSpeed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;

  return (
    <>
      {/* Invisible tap layer */}
      <div
        className="fixed inset-0 z-10 select-none"
        style={{ pointerEvents: showList || showSettings ? "none" : "auto" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />

      {/* Floating UI — top bar + scroll buttons (only when showUI) */}
      {showUI && !showList && !showSettings && (
        <>
          {/* Top bar */}
          <div className="fixed top-0 inset-x-0 z-20 flex items-center justify-between gap-2 border-b border-line bg-background/95 backdrop-blur px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href={`/komik/${slug}`}
                className="text-sm text-muted hover:text-foreground shrink-0"
              >
                ← {t.back}
              </Link>
              <Link
                href="/"
                className="text-muted hover:text-foreground shrink-0"
                title="Home"
              >
                <Home size={18} />
              </Link>
            </div>
            <span className="font-display tracking-wide text-sm shrink-0">
              CHAPTER {chapterNumber}
            </span>
            <button
              onClick={() => setShowList(true)}
              className="text-sm text-muted hover:text-foreground shrink-0"
            >
              {t.list}
            </button>
          </div>

          {/* Right-side scroll buttons (only when showUI) */}
          <div className="fixed right-4 bottom-24 z-20 flex flex-col gap-3">
            <button
              onClick={() => scrollPage("up")}
              title="Scroll ke atas"
              className="w-11 h-11 rounded-full bg-[#2e2e2e]/90 hover:bg-[#3e3e3e] backdrop-blur active:scale-95 flex items-center justify-center text-white shadow-lg transition-all"
            >
              <ChevronUp size={20} />
            </button>
            <button
              onClick={() => scrollPage("down")}
              title="Scroll ke bawah"
              className="w-11 h-11 rounded-full bg-[#2e2e2e]/90 hover:bg-[#3e3e3e] backdrop-blur active:scale-95 flex items-center justify-center text-white shadow-lg transition-all"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </>
      )}

      {/* Bottom floating pill toolbar — always visible when showUI OR autoscrolling */}
      {(showUI || isAutoScrolling) && !showList && !showSettings && (
        <>
          {/* Bottom floating pill toolbar */}
          <div className="fixed bottom-8 inset-x-0 z-20 flex justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#1c1c1c]/95 backdrop-blur-md rounded-full px-3 py-2 shadow-2xl border border-white/10">
              {/* Prev chapter */}
              {prevChapterId ? (
                <Link
                  href={`/komik/${slug}/baca/${prevChapterId}`}
                  title="Chapter sebelumnya"
                  className="w-11 h-11 rounded-full bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </Link>
              ) : (
                <span className="w-11 h-11 rounded-full bg-[#1e1e1e] flex items-center justify-center text-white/20">
                  <ChevronLeft size={20} />
                </span>
              )}

              {/* Settings — opens autoscroll speed popup */}
              <button
                title="Kecepatan auto-scroll"
                onClick={() => {
                  setDraftSpeed(autoScrollSpeed);
                  setShowSettings(true);
                }}
                className="w-11 h-11 rounded-full bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 flex items-center justify-center text-white transition-all"
              >
                <Settings size={17} />
              </button>

              {/* Play / Pause — toggles autoscroll */}
              <button
                onClick={toggleAutoScroll}
                title={isAutoScrolling ? "Pause auto-scroll" : "Mulai auto-scroll"}
                className={`w-12 h-12 rounded-full active:scale-95 flex items-center justify-center text-white transition-all ${
                  isAutoScrolling
                    ? "bg-violet-600 hover:bg-violet-500"
                    : "bg-[#2e2e2e] hover:bg-[#3e3e3e]"
                }`}
              >
                {isAutoScrolling ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" />
                )}
              </button>

              {/* Chapter list */}
              <button
                onClick={() => setShowList(true)}
                title="Daftar chapter"
                className="w-11 h-11 rounded-full bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 flex items-center justify-center text-white transition-all"
              >
                <AlignJustify size={18} />
              </button>

              {/* Next chapter */}
              {nextChapterId ? (
                <Link
                  href={`/komik/${slug}/baca/${nextChapterId}`}
                  title="Chapter selanjutnya"
                  className="w-11 h-11 rounded-full bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight size={20} />
                </Link>
              ) : (
                <span className="w-11 h-11 rounded-full bg-[#1e1e1e] flex items-center justify-center text-white/20">
                  <ChevronRight size={20} />
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Autoscroll Speed Settings Popup ────────────────────── */}
      {showSettings && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/70"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-[#111111] border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-white text-xl font-bold mb-6">{t.autoScrollSpeed}</h2>

            {/* Slider track */}
            <div className="relative mb-2">
              <div className="relative h-1.5 rounded-full bg-white/20 mx-1">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${speedPct}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-violet-500 shadow-lg border-2 border-white transition-all"
                  style={{ left: `calc(${speedPct}% - 10px)` }}
                />
              </div>

              {/* Native range input — transparent, sits on top */}
              <input
                type="range"
                min={SPEED_MIN}
                max={SPEED_MAX}
                step={SPEED_STEP}
                value={draftSpeed}
                onChange={(e) => setDraftSpeed(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 -top-2"
              />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between px-1 mb-1">
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i} className="w-px h-2 bg-white/30" />
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between px-0 mb-8">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={`text-sm font-medium transition-colors ${
                    Math.abs(draftSpeed - t) < 0.03 ? "text-white" : "text-white/50"
                  }`}
                >
                  {t === 1.0 ? "1.0" : String(t)}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  setAutoScrollSpeed(draftSpeed);
                  localStorage.setItem(LS_KEY, String(draftSpeed));
                  setShowSettings(false);
                  if (isAutoScrolling) startAutoScroll(draftSpeed);
                }}
                className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-base transition-all"
              >
                {t.save}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 text-white/70 hover:text-white font-semibold text-base transition-colors"
              >
                {t.later}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter list popup */}
      {showList && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/70"
          onClick={() => setShowList(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-line bg-background max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <span className="font-display tracking-wide text-sm">{t.chooseChapter}</span>
              <button
                onClick={() => {
                  setShowList(false);
                  setShowUI(false);
                }}
                className="text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Prev / Next quick nav */}
            <div className="flex gap-2 px-4 py-2 border-b border-line shrink-0">
              {prevChapterId ? (
                <Link
                  href={`/komik/${slug}/baca/${prevChapterId}`}
                  onClick={() => { setShowList(false); setShowUI(false); }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-xs hover:border-accent hover:text-accent transition-colors"
                >
                  <ChevronLeft size={13} /> {t.prev}
                </Link>
              ) : (
                <span className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-line/30 px-3 py-2 text-xs text-muted/40 cursor-not-allowed">
                  <ChevronLeft size={13} /> {t.prev}
                </span>
              )}
              {nextChapterId ? (
                <Link
                  href={`/komik/${slug}/baca/${nextChapterId}`}
                  onClick={() => { setShowList(false); setShowUI(false); }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-xs hover:border-accent hover:text-accent transition-colors"
                >
                  {t.next} <ChevronRight size={13} />
                </Link>
              ) : (
                <span className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-line/30 px-3 py-2 text-xs text-muted/40 cursor-not-allowed">
                  {t.next} <ChevronRight size={13} />
                </span>
              )}
            </div>

            {/* Chapter list */}
            <ul className="overflow-y-auto divide-y divide-line">
              {chapters.map((c) => {
                const active = c.id === currentChapterId;
                return (
                  <li
                    key={c.id}
                    ref={active ? (el) => { activeItemRef.current = el; } : undefined}
                  >
                    <Link
                      href={`/komik/${slug}/baca/${c.id}`}
                      onClick={() => {
                        setShowList(false);
                        setShowUI(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        active
                          ? "bg-accent/10 text-accent font-medium"
                          : "hover:bg-surface-2 text-foreground"
                      }`}
                    >
                      <span>Chapter {c.number}</span>
                      {active && (
                        <span className="text-xs rounded-full bg-accent text-background px-2 py-0.5">
                          {t.reading}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
