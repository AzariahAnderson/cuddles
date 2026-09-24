// Central motion layer. Components never call GSAP directly; they use these hooks.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export const duration = { instant: 0.09, fast: 0.14, base: 0.22, slow: 0.4 } as const;
export const ease = { out: "power3.out", exit: "power2.in", inOut: "power2.inOut" } as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fades and lifts every [data-reveal] descendant once on mount. */
export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  selector = "[data-reveal]",
) {
  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) {
      return undefined;
    }
    const context = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y: 6,
        duration: duration.base,
        ease: ease.out,
        stagger: 0.05,
        clearProps: "all",
      });
    }, scope);
    return () => context.revert();
  }, [ref, selector]);
}

/** Staggered first-paint entrance for application chrome ([data-startup] descendants). */
export function useStartup<T extends HTMLElement>(ref: RefObject<T | null>) {
  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) {
      return undefined;
    }
    const context = gsap.context(() => {
      gsap.from("[data-startup]", {
        opacity: 0,
        y: 4,
        duration: duration.slow,
        ease: ease.out,
        stagger: 0.05,
        clearProps: "opacity,transform",
      });
    }, scope);
    return () => context.revert();
  }, [ref]);
}

/** Plays a short enter animation whenever `key` changes (skips the first render). */
export function useEnterOnChange<T extends HTMLElement>(ref: RefObject<T | null>, key: string) {
  const first = useRef(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (!el || prefersReducedMotion()) {
      return undefined;
    }
    el.dataset.route = key;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 6 },
      {
        opacity: 1,
        y: 0,
        duration: duration.base,
        ease: ease.out,
        clearProps: "opacity,transform",
      },
    );
    return () => {
      tween.kill();
    };
  }, [ref, key]);
}

/**
 * Scroll-triggered staggered reveal of every [data-scroll-reveal] descendant of the scroller.
 * Uses ScrollTrigger.batch bound to the scroll container, refreshed when it resizes.
 */
export function useScrollReveal<T extends HTMLElement>(
  scrollerRef: RefObject<T | null>,
  selector = "[data-scroll-reveal]",
) {
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || prefersReducedMotion()) {
      return undefined;
    }
    const context = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector, scroller);
      if (targets.length === 0) {
        return;
      }
      gsap.set(targets, { opacity: 0, y: 14 });
      ScrollTrigger.batch(targets, {
        scroller,
        start: "top 94%",
        once: true,
        interval: 0.08,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: duration.slow,
            ease: ease.out,
            stagger: 0.08,
            overwrite: true,
            clearProps: "opacity,transform",
          });
        },
      });
    }, scroller);

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(scroller);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      context.revert();
    };
  }, [scrollerRef, selector]);
}

/** True once the scroller has been scrolled a few pixels (ScrollTrigger-driven). */
export function useScrolled<T extends HTMLElement>(scrollerRef: RefObject<T | null>): boolean {
  const [scrolled, setScrolled] = useState(false);
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const content = scroller?.firstElementChild;
    if (!scroller || !content) {
      return undefined;
    }
    const trigger = ScrollTrigger.create({
      trigger: content,
      scroller,
      start: "top -6",
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => trigger.kill();
  }, [scrollerRef]);
  return scrolled;
}

export type PresenceKind = "pop" | "modal" | "tip";

function panelOf(el: HTMLElement): HTMLElement | null {
  return el.querySelector<HTMLElement>("[data-panel]");
}

function animateIn(el: HTMLElement, kind: PresenceKind): void {
  if (kind === "modal") {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: duration.fast, ease: ease.out });
    const panel = panelOf(el);
    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 8, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: duration.base, ease: ease.out },
      );
    }
    return;
  }
  if (kind === "tip") {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: duration.fast, ease: ease.out });
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: -4, scale: 0.985 },
    { opacity: 1, y: 0, scale: 1, duration: duration.fast, ease: ease.out },
  );
}

function animateOut(el: HTMLElement, kind: PresenceKind, done: () => void): void {
  if (kind === "modal") {
    const panel = panelOf(el);
    if (panel) {
      gsap.to(panel, { opacity: 0, y: 4, scale: 0.99, duration: duration.fast, ease: ease.exit });
    }
  }
  gsap.to(el, { opacity: 0, duration: duration.fast, ease: ease.exit, onComplete: done });
}

/** Mount/unmount with GSAP enter and exit animations. Attach `ref` to the animated element. */
export function usePresence<T extends HTMLElement>(open: boolean, kind: PresenceKind = "pop") {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) {
    setMounted(true);
  }

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }
    const kill = () => {
      gsap.killTweensOf(el);
      const panel = panelOf(el);
      if (panel) {
        gsap.killTweensOf(panel);
      }
    };
    if (open) {
      if (!prefersReducedMotion()) {
        animateIn(el, kind);
      }
      return kill;
    }
    if (mounted) {
      if (prefersReducedMotion()) {
        setMounted(false);
        return undefined;
      }
      animateOut(el, kind, () => setMounted(false));
      return kill;
    }
    return undefined;
  }, [open, mounted, kind]);

  return { ref, mounted } as const;
}

/** Animates a panel's width/height when it opens or closes. Dragging is not animated. */
export function useCollapseMotion<T extends HTMLElement>(
  ref: RefObject<T | null>,
  open: boolean,
  axis: "width" | "height",
  size: number,
) {
  const previous = useRef(open);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || previous.current === open) {
      return;
    }
    previous.current = open;
    if (prefersReducedMotion()) {
      return;
    }
    gsap.killTweensOf(el);
    gsap.from(el, { [axis]: open ? 0 : size, duration: duration.base, ease: ease.inOut });
  }, [ref, open, axis, size]);
}

/** Slides an indicator to the element marked data-nav-key={activeKey} inside the container. */
export function useSlideIndicator<C extends HTMLElement, I extends HTMLElement>(
  containerRef: RefObject<C | null>,
  indicatorRef: RefObject<I | null>,
  activeKey: string | null,
) {
  const placed = useRef(false);
  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) {
      return undefined;
    }
    const target =
      activeKey === null
        ? null
        : container.querySelector<HTMLElement>(`[data-nav-key="${activeKey}"]`);
    if (!target) {
      gsap.to(indicator, { opacity: 0, duration: duration.fast });
      return undefined;
    }
    const y = target.offsetTop + (target.offsetHeight - indicator.offsetHeight) / 2;
    if (!placed.current || prefersReducedMotion()) {
      placed.current = true;
      gsap.set(indicator, { y, opacity: 1 });
      return undefined;
    }
    const tween = gsap.to(indicator, { y, opacity: 1, duration: duration.base, ease: ease.out });
    return () => {
      tween.kill();
    };
  }, [containerRef, indicatorRef, activeKey]);
}