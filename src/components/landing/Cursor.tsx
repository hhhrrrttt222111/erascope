import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Click ripple: a gold ring that expands from wherever the page is pressed.
 *  The native cursor is left alone. */
export function Cursor() {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const down = (e: PointerEvent) => {
      const id = ++idRef.current;
      setPulses((p) => [...p, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setPulses((p) => p.filter((q) => q.id !== id)), 700);
    };
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, []);

  return (
    <div aria-hidden>
      {pulses.map((p) => (
        <motion.span
          key={p.id}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, x: p.x - 30, y: p.y - 30, width: 60, height: 60, borderRadius: "50%", border: "2px solid #c9b48a" }}
          initial={{ opacity: 0.9, scale: 0.2 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
