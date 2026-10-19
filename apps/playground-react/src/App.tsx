import { useEffect, useState, type CSSProperties } from "react";

import {
  getNotedBootstrapState,
  onNotedBootstrapState,
  toggleCapture,
} from "./noted-bootstrap";

export default function App() {
  const [noted, setNoted] = useState(getNotedBootstrapState);

  useEffect(() => onNotedBootstrapState(setNoted), []);

  return (
    <div style={styles.page}>
      <div style={styles.captureBar} data-noted-ui="1">
        <button type="button" style={styles.captureBtn} onClick={() => toggleCapture()}>
          Start capture
        </button>
        <span style={styles.captureHint}>
          {noted === "ready" &&
            "No extension — local daemon only. Alt+Shift+N or this button → pick element → comment"}
          {noted === "loading" && "Loading capture script from daemon…"}
          {noted === "error" &&
            "Daemon not reachable. New terminal: $env:NOTED_SYNTHESIS='agent'; pnpm noted:restart — then click Start capture again"}
        </span>
      </div>
      <header style={styles.header}>
        <span style={styles.logo}>Sweet Crumb Bakery</span>
      </header>
      <section style={styles.hero}>
        <h1 style={styles.h1}>Fresh bread, every morning</h1>
        <p style={styles.lead}>
          Family-run since 1987. Order online for pickup — demo page for note&apos;d
          capture (intentionally weak CTA on mobile).
        </p>
        <div style={styles.spacer} aria-hidden />
        <button type="button" className="cta-primary" style={styles.cta}>
          Order now
        </button>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    fontFamily: "Georgia, serif",
    background: "#faf6ef",
    minHeight: "100vh",
    margin: 0,
  },
  captureBar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    background: "#1a1f2e",
    color: "#f9f7f2",
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
  },
  captureBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#d4843a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  captureHint: { opacity: 0.9, flex: "1 1 200px" },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid #e8dfd0",
  },
  logo: { fontWeight: 700, letterSpacing: "0.02em" },
  hero: {
    padding: "24px 20px 80px",
    maxWidth: 480,
  },
  h1: { fontSize: 28, margin: "0 0 12px" },
  lead: { color: "#6b6358", lineHeight: 1.5, margin: "0 0 16px" },
  spacer: { height: "55vh" },
  cta: {
    height: 32,
    fontSize: 13,
    padding: "0 14px",
    background: "#c4a574",
    color: "#e8dfd0",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
