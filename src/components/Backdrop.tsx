/**
 * Fixed page backdrop.
 *
 * Sections themselves are transparent, so this is what everything sits on:
 * a warm studio wash and a vignette. Because it is
 * fixed, the lighting stays put while the content scrolls past it.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0d0a07 0%, #080706 42%, #0b0806 100%)",
        }}
      />

      {/* warm key light, upper left */}
      <div
        className="absolute -left-[18%] -top-[26%] h-[85vh] w-[85vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(217,155,60,0.17) 0%, rgba(122,63,16,0.09) 42%, transparent 68%)",
          filter: "blur(90px)",
        }}
      />

      {/* ember bounce, right */}
      <div
        className="absolute -right-[22%] top-[22%] h-[80vh] w-[70vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(190,110,35,0.14) 0%, rgba(60,30,10,0.08) 46%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* cool accent, lower left — echoes the cyan in the card artwork */}
      <div
        className="absolute -left-[12%] bottom-[4%] h-[60vh] w-[55vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 66%)",
          filter: "blur(110px)",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 45%, transparent 42%, rgba(5,4,4,0.55) 82%, rgba(5,4,4,0.85) 100%)",
        }}
      />
    </div>
  );
}
