export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-wide text-muted-foreground">
        <span>© {new Date().getFullYear()} Adam Rasfeld</span>
        <span className="opacity-60">built with taste</span>
      </div>
    </footer>
  );
}
