import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: "soon" | "new";
}

export function SidebarItem({ icon: Icon, label, isActive = false, onClick, badge }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
        isActive
          ? "bg-ethy-bg-sidebarItem text-white"
          : "text-ethy-sidebar-foreground hover:bg-ethy-bg-sidebarItem hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] transition-colors duration-150",
          isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
        )}
      />
      <span className="flex-1 text-left">{label}</span>
      {badge === "soon" && (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-ethy-badge-soon-bg text-ethy-badge-soon-text">
          Soon
        </span>
      )}
      {badge === "new" && (
        <span className="text-[11px] font-medium text-ethy-orange flex items-center gap-1">
          <span className="text-xs">🔥</span> New
        </span>
      )}
    </button>
  );
}
