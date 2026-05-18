import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "@/sections/Sidebar";
import { BrainHeader } from "@/components/BrainHeader";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";

export function MainLayout() {
  const location = useLocation();
  const isBrainPage = location.pathname === "/brain";
  const isMarketplace = location.pathname === "/marketplace";
  const isSubscription = location.pathname === "/subscription";

  return (
    <div className="flex h-screen w-screen bg-ethy-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {isBrainPage && <BrainHeader />}
        {(isMarketplace || isSubscription) && <MarketplaceHeader />}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
