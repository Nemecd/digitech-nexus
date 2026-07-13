export default function AnimatedBlobs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[5%] -left-20 w-96 h-96 rounded-full blur-3xl bg-gold/10 animate-float-slow" />
      <div className="absolute top-[35%] right-[-10%] w-[28rem] h-[28rem] rounded-full blur-3xl bg-[#2B7FE0]/15 animate-float-slower" />
      <div className="absolute top-[65%] left-[10%] w-80 h-80 rounded-full blur-3xl bg-gold/10 animate-float-slow" />
      <div className="absolute bottom-0 right-[15%] w-72 h-72 rounded-full blur-3xl bg-[#2B7FE0]/12 animate-float-slower" />
    </div>
  );
}