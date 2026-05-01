export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-xl font-medium italic tracking-tight group cursor-default">
            <span className="text-primary group-hover:text-foreground transition-colors duration-300">
              Ry
            </span>
            <span className="text-foreground group-hover:text-primary transition-colors duration-300">
              dex
            </span>
          </span>
          <p className="text-sm text-muted-foreground">
            2026 Rydex. Premium car rentals.
          </p>
        </div>
      </div>
    </footer>
  );
}
