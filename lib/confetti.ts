/**
 * Safe client-side confetti launcher.
 * Dynamically loads canvas-confetti on demand to prevent Webpack module initialization errors during SSR/Fast Refresh.
 */
export async function triggerConfetti(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
}) {
  if (typeof window === "undefined") return;

  try {
    const confettiModule = await import("canvas-confetti");
    const confettiFn = (confettiModule.default || confettiModule) as any;

    if (typeof confettiFn === "function") {
      confettiFn({
        particleCount: options?.particleCount ?? 35,
        spread: options?.spread ?? 55,
        origin: options?.origin ?? { y: 0.8 },
        colors: options?.colors ?? ["#059669", "#10b981", "#3b82f6", "#f59e0b"],
      });
    }
  } catch (err) {
    // Non-blocking fallback
    console.debug("[Confetti] Animation skipped:", err);
  }
}
