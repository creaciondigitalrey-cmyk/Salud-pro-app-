"use client";
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, rgba(13,148,136,0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(212,175,55,0.06) 0%, transparent 50%)" }} />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl animate-float" style={{ background: "radial-gradient(circle, rgba(13,148,136,0.5) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full opacity-30 blur-3xl animate-float" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)", animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl animate-float" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)", animationDelay: "4s" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgba(6,21,32,0.4) 100%)" }} />
    </div>
  );
}
