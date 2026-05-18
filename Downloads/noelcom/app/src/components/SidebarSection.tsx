import { type ReactNode } from "react";

interface SidebarSectionProps {
  label?: string;
  badge?: "soon" | "new";
  children: ReactNode;
}

export function SidebarSection({ label, badge, children }: SidebarSectionProps) {
  return (
    <div className="mb-5">
      {label && (
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {badge === "soon" && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-ethy-badge-soon-bg text-ethy-badge-soon-text">
              Soon
            </span>
          )}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
