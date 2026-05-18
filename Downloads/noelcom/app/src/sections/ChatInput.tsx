import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Zap } from "lucide-react";

export function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0, 0, 0.2, 1] }}
      className="px-6 pb-6 pt-2"
    >
      <div
        className={`
          max-w-2xl mx-auto bg-ethy-bg-input rounded-xl transition-all duration-200
          ${isFocused ? "ring-2 ring-purple-500/20" : ""}
        `}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What I can do for you today...?"
          rows={1}
          className="w-full bg-transparent text-sm text-white placeholder:text-muted-foreground px-4 pt-3.5 pb-2 resize-none outline-none"
          style={{ minHeight: "24px", maxHeight: "120px" }}
        />
        <div className="flex items-center justify-between px-3 pb-2.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ethy-bg-sidebarItem hover:bg-ethy-border-subtle transition-colors duration-150 group">
            <Zap className="w-3.5 h-3.5 text-ethy-purple group-hover:text-ethy-purple-light transition-colors" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">
              Automations
            </span>
          </button>

          <button
            className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150
              ${inputValue.trim()
                ? "bg-ethy-purple hover:bg-ethy-purple-hover text-white"
                : "bg-muted text-muted-foreground"
              }
            `}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
