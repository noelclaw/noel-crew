import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export function OnboardingLayout() {
  return (
    <div className="h-screen w-screen bg-ethy-bg-primary flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl px-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-white">ethy</span>
              <span className="text-xs font-medium text-ethy-purple ml-0.5">AI</span>
            </div>
          </div>
        </div>

        <Outlet />
      </motion.div>
    </div>
  );
}
