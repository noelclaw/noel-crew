import { Link } from "react-router-dom";

export function BrainHeader() {
  return (
    <header className="flex items-center justify-end px-6 py-3 gap-4">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">STARTER</span>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ethy-bg-sidebarItem border border-ethy-border-subtle">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-muted-foreground">0 credits</span>
        <Link to="/subscription" className="text-xs text-ethy-orange hover:text-ethy-orange/80 transition-colors">
          Upgrade
        </Link>
      </div>
    </header>
  );
}
