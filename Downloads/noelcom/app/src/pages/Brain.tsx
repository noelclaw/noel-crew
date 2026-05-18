import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function Brain() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Terminal Window */}
        <div className="bg-black rounded-xl overflow-hidden border border-ethy-border-subtle shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ethy-border-subtle/50">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-ethy-purple" />
              <span className="text-sm font-medium text-ethy-purple">agent-brain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/90" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
              <div className="w-3 h-3 rounded-full bg-green-500/90" />
            </div>
          </div>

          {/* Terminal Body with Star Field */}
          <div className="relative h-96 p-4 overflow-hidden">
            {/* Star Field Background */}
            <div className="absolute inset-0">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Terminal Content */}
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-mono">$ No agent logs found</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
