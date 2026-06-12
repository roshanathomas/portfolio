"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print px-4 py-2 rounded-full bg-accent text-white text-sm hover:opacity-90 transition"
    >
      Download PDF ↓
    </button>
  );
}
