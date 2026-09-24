import { Text, useScrollReveal, useScrolled } from "@cuddles/design-system";
import { type ReactNode, useRef } from "react";

export interface PageProps {
  readonly title: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

/** Scrollable page with a sticky header (border appears on scroll) and ScrollTrigger reveals. */
export function Page({ title, actions, children }: PageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(scrollRef);
  useScrollReveal(scrollRef);

  return (
    <div className="cd-page">
      <header className="cd-pagehead" data-scrolled={scrolled || undefined}>
        <Text as="h1" variant="title">
          {title}
        </Text>
        {actions ? <div className="cd-pagehead-actions">{actions}</div> : null}
      </header>
      <div ref={scrollRef} className="cd-scroll cd-page-scroll">
        <div className="cd-page-inner">{children}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="cd-section" data-scroll-reveal>
      <Text as="h2" variant="caption" className="cd-eyebrow">
        {title}
      </Text>
      {children}
    </section>
  );
}