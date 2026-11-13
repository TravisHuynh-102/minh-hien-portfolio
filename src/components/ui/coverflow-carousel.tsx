"use client";

import * as React from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  href?: string;
  badge?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Optional controlled active index */
  activeIndex?: number;
  /** Callback when active slide changes */
  onSlideChange?: (index: number) => void;
  /** Callback when the currently active center card is clicked */
  onActiveSlideClick?: (slide: CoverflowSlide, index: number) => void;
  /** Label for the CTA button on the active card */
  ctaLabel?: string;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(180px, 24vw, 290px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  activeIndex,
  onSlideChange,
  onActiveSlideClick,
  ctaLabel = "Xem chi tiết dự án",
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
    moved: boolean;
  } | null>(null);

  const [selected, setSelected] = React.useState(() => activeIndex ?? 0);
  const selectedRef = React.useRef(selected);
  const lastNotifiedRef = React.useRef(selected);
  const onSlideChangeRef = React.useRef(onSlideChange);

  React.useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const indexAt = React.useCallback(
    (pos: number) => (count > 0 ? ((Math.round(pos) % count) + count) % count : 0),
    [count]
  );

  const updateSelected = React.useCallback((idx: number) => {
    selectedRef.current = idx;
    setSelected((prev) => (prev === idx ? prev : idx));
  }, []);

  React.useEffect(() => {
    if (lastNotifiedRef.current !== selected) {
      lastNotifiedRef.current = selected;
      onSlideChangeRef.current?.(selected);
    }
  }, [selected]);

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || count === 0) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance * 10));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      updateSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint, updateSelected]
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = React.useCallback(
    (index: number) => {
      if (count === 0) return;
      let delta = index - indexAt(targetRef.current);
      if (loop) {
        if (delta > count / 2) delta -= count;
        else if (delta < -count / 2) delta += count;
      }
      const target = Math.round(targetRef.current) + delta;
      settle(clamp(target));
    },
    [clamp, count, indexAt, loop, settle]
  );

  React.useEffect(() => {
    if (
      activeIndex !== undefined &&
      activeIndex !== indexAt(targetRef.current)
    ) {
      lastNotifiedRef.current = activeIndex;
      goTo(activeIndex);
    }
  }, [activeIndex, goTo, indexAt]);

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    if (Math.abs(event.clientX - drag.x) > 14) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selectedRef.current) updateSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const wasMoved = drag.moved;
    dragRef.current = null;
    if (!wasMoved) {
      const rect = frameRef.current?.getBoundingClientRect();
      if (rect && widthRef.current) {
        const dx = event.clientX - (rect.left + rect.width / 2);
        if (Math.abs(dx) > widthRef.current * 0.45) {
          nudge(dx > 0 ? 1 : -1);
          return;
        } else if (onActiveSlideClick && slides[selectedRef.current]) {
          onActiveSlideClick(slides[selectedRef.current], selectedRef.current);
          return;
        }
      }
    }
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint, count]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        {/* Ambient Indigo Stage Spotlight Behind Active Card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[320px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.22)_0%,transparent_72%)] blur-2xl"
        />

        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            } else if (
              (event.key === "Enter" || event.key === " ") &&
              onActiveSlideClick &&
              slides[selected]
            ) {
              event.preventDefault();
              onActiveSlideClick(slides[selected], selected);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className={cn(
                    "group absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] shadow-xl will-change-transform transition-shadow",
                    isCenter &&
                      "cursor-pointer border-2 border-[#C05E3E] shadow-2xl shadow-indigo-500/20",
                    cardClassName
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  <div className="relative h-[68%] w-full overflow-hidden border-b border-[#D1CCC4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      draggable={false}
                      className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isCenter && (
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActiveSlideClick?.(slide, index);
                        }}
                        className="absolute right-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 font-mono text-[10px] font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-indigo-700"
                      >
                        <span>Case Study</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Card Bottom Label Strip — Spacious 32% height so title never clips */}
                  <div className="flex h-[32%] flex-col justify-between bg-[#FAF9F6] px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      {slide.badge && (
                        <span className="inline-block self-start rounded-md border border-[#C05E3E] bg-[#C05E3E] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FAF9F6]">
                          {slide.badge}
                        </span>
                      )}
                      <span className="font-mono text-[10px] font-semibold text-[#C05E3E]">
                        0{index + 1}
                      </span>
                    </div>
                    {slide.title && (
                      <p className="truncate text-xs font-semibold leading-snug text-[#0E0E0E] group-hover:text-[#C05E3E]">
                        {slide.title}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] p-2.5 text-[#0E0E0E] shadow-md transition-all hover:scale-105 hover:border-[#C05E3E] hover:bg-[#EBE7DF] hover:text-[#C05E3E]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] p-2.5 text-[#0E0E0E] shadow-md transition-all hover:scale-105 hover:border-[#C05E3E] hover:bg-[#EBE7DF] hover:text-[#C05E3E]"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <button
            type="button"
            onClick={() => onActiveSlideClick?.(active, selected)}
            className="group inline-flex items-center gap-1.5 text-center text-base font-bold tracking-tight text-[#0E0E0E] transition-colors hover:text-[#C05E3E] sm:text-lg"
          >
            <span>{active.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#C05E3E] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          {active.subtitle && (
            <p className="mt-1 max-w-xl text-center text-[13px] text-[#5C5852]">
              {active.subtitle}
            </p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-5 w-full max-w-[380px] divide-y divide-[#D1CCC4] rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] px-4 py-2 text-[12px]">
              {active.meta.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2"
                >
                  <dt className="font-mono text-[#5C5852]">{row.label}</dt>
                  <dd className="font-mono font-semibold text-[#C05E3E]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {onActiveSlideClick && (
            <button
              type="button"
              onClick={() => onActiveSlideClick(active, selected)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-4 py-2 font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#AD5234]"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full border border-[#D1CCC4] transition-all duration-300",
                index === selected
                  ? "w-7 border-[#C05E3E] bg-[#C05E3E]"
                  : "w-2 bg-[#E6E2DA] hover:bg-[#C05E3E]/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
