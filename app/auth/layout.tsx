export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-navy p-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 30%, #2B7FE0 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #1AA3E8 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10">
          <span className="font-display font-bold text-lg tracking-tight">
            DIGITECH <span className="text-gold">NEXUS</span>
          </span>
        </div>
        <div className="relative z-10 max-w-sm">
          <h1 className="font-display text-3xl font-bold leading-tight">
            Empowering dreams.<br />Building futures.
          </h1>
          <p className="mt-4 text-muted text-sm">
            Courses, services, and opportunities — one platform, one login.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gold/40 transition-colors" />
          {children}
        </div>
      </div>
    </div>
  );
}