export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="safe-px-6 safe-pb-6 mx-auto flex max-w-6xl items-center justify-between pt-6 font-mono text-[10px] text-muted-foreground tracking-wide">
        <span>© {new Date().getFullYear()} Adam Rasfeld</span>
        <span className="opacity-60">built with taste</span>
      </div>
    </footer>
  );
}
