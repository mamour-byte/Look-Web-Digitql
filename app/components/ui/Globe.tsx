export default function Globe() {
  return (
    <div aria-hidden="true" className="relative h-72 w-72 overflow-hidden rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_80px_rgba(249,115,22,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.5),transparent_18%),radial-gradient(circle_at_65%_65%,rgba(249,115,22,0.55),transparent_48%)]" />
      <div className="absolute inset-[12%] rounded-full border border-primary/30" />
      <div className="absolute inset-[25%_-12%] rounded-[50%] border border-primary/30" />
      <div className="absolute inset-[-12%_25%] rounded-[50%] border border-primary/30" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/20" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/20" />
    </div>
  );
}
