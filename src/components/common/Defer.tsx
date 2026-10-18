import { useEffect, useRef, useState, type ReactNode } from "react";

/** Renders children once near the viewport, holding `minHeight` meanwhile so the page doesn't shift. */
export function Defer({ children, minHeight = 320, eager = false }: { children: ReactNode; minHeight?: number; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(eager);
  useEffect(() => {
    if (eager) setOn(true);
  }, [eager]);
  useEffect(() => {
    const el = ref.current;
    if (on || !el) return;
    if (!("IntersectionObserver" in window)) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [on]);
  return (
    <div ref={ref} style={on ? undefined : { minHeight }}>
      {on && children}
    </div>
  );
}
