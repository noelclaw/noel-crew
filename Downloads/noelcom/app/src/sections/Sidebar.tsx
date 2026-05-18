import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  Wallet,
  Brain,
  Zap,
  Globe,
  Users,
  Trophy,
  Store,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { SidebarSection } from "@/components/SidebarSection";
import { SocialIcons } from "@/components/SocialIcons";

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: "soon" | "new";
}

function NavItem({ to, icon: Icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
          isActive
            ? "bg-ethy-bg-sidebarItem text-white"
            : "text-ethy-sidebar-foreground hover:bg-ethy-bg-sidebarItem hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-[18px] h-[18px] transition-colors duration-150 ${
              isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
            }`}
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
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-[280px] min-w-[280px] h-screen bg-ethy-bg-sidebar border-r border-ethy-border-subtle flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <NavLink to="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-white">ethy</span>
            <span className="text-xs font-medium text-ethy-purple ml-0.5">AI</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <SidebarSection>
          <NavItem to="/" icon={Terminal} label="Terminal" />
          <NavItem to="/wallet" icon={Wallet} label="Wallet" />
          <NavItem to="/brain" icon={Brain} label="Brain" />
          <NavItem to="/automations" icon={Zap} label="Automations" />
        </SidebarSection>

        <SidebarSection label="Social Trading" badge="soon">
          <NavItem to="/discover" icon={Globe} label="Discover" badge="soon" />
          <NavItem to="/activity" icon={Users} label="Activity" badge="soon" />
          <NavItem to="/leaderboard" icon={Trophy} label="Leaderboard" badge="soon" />
        </SidebarSection>

        <SidebarSection>
          <NavItem to="/marketplace" icon={Store} label="Marketplace" />
          <NavItem to="/metrics" icon={BarChart3} label="Metrics" badge="new" />
          <NavItem to="/subscription" icon={CreditCard} label="Subscription" />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-ethy-border-subtle">
        <SocialIcons />
      </div>
    </motion.aside>
  );
}
