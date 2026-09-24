// Central motion layer. Components never call GSAP directly; they use these helpers.
import { gsap } from "gsap";
import { type RefObject, useLayoutEffect } from "react";

export const duration = { instant: 0.09, fast: 0.14, base: 0.22, slow: 0.36 } as const;
export const ease = { out: "power3.out", inOut: "power2.inOut" } as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fades and lifts every [data-reveal] descendant once on mount. Lifecycle-safe (gsap.context). */
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
