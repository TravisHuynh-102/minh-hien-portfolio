"use client";

import {
  AnimatePresence,
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, RotateCcw, Sparkles, X } from "lucide-react";

export interface TunnelImageItem {
  src: string;
  title: string;
}

const DEFAULT_IMAGES: TunnelImageItem[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg",
    title: "Chroma I",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg",
    title: "Prism III",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg",
    title: "Ether IV",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c440db3f71d4e8c03262a3287577.jpg",
    title: "Quantum V",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ef/ef25eff6ce655fba459b3b7e7711524dc92499aa18f6c7dbea9a0fcc56a8f908.jpg",
    title: "Nebula VI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/f2/f28b370a5dcbf76240f1504579c4b05fc0ff0bb990a42aff8dc2f73a5dc46072.jpg",
    title: "Cyber VII",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/f2/f26a1eac85704dda924820392dedfb72d51d8261d35354f83b35d683617295f3.jpg",
    title: "Flux VIII",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/77/7755d23eaaa0aa5b403343f44afa7a29b2d06d3065fe54c602b14ba01d00f2aa.jpg",
    title: "Aether IX",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/65/657317761fe9058a1d43711b13c543a71eb5199b7a5d9abf4c28479674e39cf7.jpg",
    title: "Chroma X",
  },
];

interface TunnelCardData {
  item: TunnelImageItem;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const buildTunnelCards = (items: TunnelImageItem[]): TunnelCardData[] =>
  items.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.28 + (i % 3) * 0.08;
    const radiusFactorY = 0.26 + (i % 2) * 0.09;

    return {
      item,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX,
      radiusFactorY,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  onInspect: (item: TunnelImageItem) => void;
}

function TunnelCard({
  card,
  progress,
  pointer,
  total,
  stage,
  onInspect,
}: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(
    localProgress,
    [0, 0.18, 0.82, 0.98],
    [0, 1, 1, 0]
  );

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    }
  );

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      onClick={() => onInspect(card.item)}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-2xl shadow-neutral-950/20 dark:shadow-black/90 ring-1 ring-black/10 dark:ring-white/15 transition-all duration-500 hover:ring-indigo-500/70 dark:hover:ring-indigo-400/70 hover:shadow-indigo-500/25">
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4 sm:p-5">
          <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white/95 drop-shadow-md">
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export interface PerspectiveTunnelHeroProps {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  scrollHint?: string;
  images?: TunnelImageItem[];
  className?: string;
}

export default function PerspectiveTunnelHero({
  eyebrow = "Warp Drive Sequence",
  titleLine1 = "INTO THE",
  titleLine2 = "ETHER.",
  subtitle = "Scroll your trackpad or mouse wheel to fly through the spatial 3D corridor.",
  scrollHint = "Scroll to Explore",
  images = DEFAULT_IMAGES,
  className = "",
}: PerspectiveTunnelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tunnelCards = buildTunnelCards(images);
  const [depthPct, setDepthPct] = useState(28);
  const [inspectedItem, setInspectedItem] = useState<TunnelImageItem | null>(
    null
  );

  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setStage({
        width: rect?.width || window.innerWidth,
        height: rect?.height || window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Raw motion value controlled directly by mouse wheel / touch trackpad
  const rawProgress = useMotionValue(0.28);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setDepthPct(Math.round(Math.min(100, Math.max(0, latest * 100))));
  });

  // Handle wheel scrolling locally inside the viewport container and release at ends
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const current = rawProgress.get();
      const delta = e.deltaY * 0.0008;
      if ((delta > 0 && current >= 0.995) || (delta < 0 && current <= 0.005)) {
        return;
      }
      e.preventDefault();
      const next = Math.min(1, Math.max(0, current + delta));
      rawProgress.set(next);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.85, 1],
    [0.25, 1, 1, 0]
  );
  const hudBarScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[88svh] w-full overflow-hidden border-y border-neutral-200/80 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white select-none flex items-center justify-center ${className}`}
      style={{
        perspective: stage.isMobile ? "900px" : "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Immersive Background Grid & Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-70 dark:opacity-65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22)_0%,transparent_75%)]" />

      {/* Animated Rotating Depth Ring Guides */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-indigo-500/20 dark:border-indigo-400/15"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-neutral-300/70 dark:border-white/10"
      />

      {/* Central Anchor Typography */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none z-0 flex flex-col items-center text-center px-6 max-w-xl"
      >
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mb-4">
          {eyebrow}
        </p>
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-400 dark:from-white dark:via-white dark:to-white/40 bg-clip-text text-transparent">
          {titleLine1}
          <br />
          {titleLine2}
        </h2>
        <p className="mt-4 max-w-[36ch] text-sm sm:text-base font-light text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
      </motion.div>

      {/* Interactive Bottom Depth Progress HUD Bar */}
      <div className="z-30 absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-neutral-200/90 dark:border-white/15 bg-white/90 dark:bg-neutral-900/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="uppercase tracking-wider">{scrollHint}</span>
        </div>

        {/* Depth Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 sm:w-32 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              style={{ scaleX: hudBarScaleX }}
              className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
          </div>
          <span className="w-9 text-right font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            {depthPct}%
          </span>
        </div>

        {/* Quick Scrub / Jump Buttons */}
        <div className="flex items-center gap-1.5 border-l border-neutral-200 dark:border-neutral-800 pl-2.5">
          <button
            type="button"
            onClick={() => rawProgress.set(0.15)}
            title="Reset Tunnel Depth"
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2 font-mono text-[10px] font-medium text-neutral-700 dark:text-neutral-200 transition hover:border-indigo-500 hover:text-indigo-600"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <a
            href="#journey"
            className="inline-flex h-7 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 font-mono text-[10px] font-semibold text-white transition hover:bg-indigo-700"
          >
            <span>Timeline</span>
            <ArrowDown className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* 3D Z-Space Plane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {tunnelCards.map((card, i) => (
          <TunnelCard
            key={i}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={tunnelCards.length}
            stage={stage}
            onInspect={(item) => setInspectedItem(item)}
          />
        ))}
      </div>

      {/* Interactive Card Preview Modal when clicking any 3D card */}
      <AnimatePresence>
        {inspectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInspectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-indigo-600"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={inspectedItem.src}
                alt={inspectedItem.title}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-indigo-400">
                  3D ARCHIVE ASSET PREVIEW
                </div>
                <h3 className="mt-1 text-lg font-bold tracking-tight">
                  {inspectedItem.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
