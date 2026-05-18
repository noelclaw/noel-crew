import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight } from "lucide-react";

export function NotificationBar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          className="bg-gradient-notification overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <Sparkles className="w-4 h-4 text-white/90" />
              <p className="text-sm text-white/95">
                <span className="font-medium">Ethy V2 coming soon</span>
                <span className="text-white/75"> — More powerful, secure, and scalable agents. Join the waitlist for early access.</span>
              </p>
              <a
                href="#"
                className="text-sm text-white/90 hover:text-white flex items-center gap-1 transition-colors duration-150 group"
              >
                Learn more
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors duration-150"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
