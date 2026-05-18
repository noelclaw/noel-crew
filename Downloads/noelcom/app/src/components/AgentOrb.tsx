import { motion } from "framer-motion";

export function AgentOrb() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-28 h-28"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-glow-pulse" />
        
        {/* Orb image */}
        <img
          src="/agent-orb.png"
          alt="Ethy AI Agent"
          className="w-full h-full object-contain relative z-10"
        />
      </motion.div>
    </motion.div>
  );
}
