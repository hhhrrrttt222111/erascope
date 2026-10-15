import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

const LINKS = [
  { id: "years", label: "Years" },
  { id: "about", label: "About" },
  { id: "how", label: "How it works" },
  { id: "inside", label: "Inside" },
];

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

/** Home-page-only navigation: logo and name on the left, section links on the right. */
export function Navbar() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 24));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: solid ? "rgba(16,15,20,0.72)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        WebkitBackdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: `1px solid ${solid ? "#2f2b20" : "transparent"}`,
        transition: "background .3s, border-color .3s",
      }}
    >
      <nav aria-label="Home" style={{ maxWidth: 1200, margin: "0 auto", padding: solid ? "10px 24px" : "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "padding .3s" }}>
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ display: "flex", alignItems: "center", gap: 10, color: "#f5f2ea", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 18, letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          <img src="/favicon.svg" alt="" width={28} height={28} />
          Erascope
        </a>
        <ul className="landing-nav-links" style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <button type="button" onClick={() => go(l.id)} className="landing-nav-link">
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
