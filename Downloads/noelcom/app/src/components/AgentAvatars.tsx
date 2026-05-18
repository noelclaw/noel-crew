import { motion } from "framer-motion";

const avatarColors = [
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-emerald-400 to-emerald-600",
  "bg-gradient-to-br from-amber-400 to-amber-600",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600",
  "bg-gradient-to-br from-violet-400 to-violet-600",
];

const avatarIcons = ["E", "T", "C", "D", "V", "W"];

export function AgentAvatars() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8, ease: [0, 0, 0.2, 1] }}
      className="flex items-center gap-2"
    >
      <div className="flex -space-x-2">
        {avatarColors.map((gradient, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.15, zIndex: 10 }}
            transition={{ duration: 0.2 }}
            className={`w-7 h-7 rounded-full ${gradient} flex items-center justify-center text-[10px] font-bold text-white border-2 border-ethy-bg-primary cursor-pointer ring-2 ring-transparent hover:ring-white/20 transition-all`}
          >
            {avatarIcons[index]}
          </motion.div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">
        Powered by expert<br />agents & plugins
      </span>
    </motion.div>
  );
}
