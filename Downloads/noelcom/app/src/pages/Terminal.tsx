import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, ArrowUp, Zap } from "lucide-react";
import { AgentOrb } from "@/components/AgentOrb";
import { ExampleCommands } from "@/components/ExampleCommands";
import { AgentAvatars } from "@/components/AgentAvatars";

export function Terminal() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ethy-bg-sidebarItem transition-colors duration-150">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ethy-bg-sidebarItem transition-colors duration-150">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button className="bg-ethy-purple hover:bg-ethy-purple-hover text-white font-medium px-5 py-2 rounded-full text-sm transition-all duration-150 hover:scale-[1.02]">
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col items-center justify-center px-6 -mt-16"
      >
        <div className="max-w-xl w-full flex flex-col items-center">
          <AgentOrb />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-center"
          >
            <h1 className="text-2xl font-bold text-white leading-tight">
              Automate your trading strategies with
              <br />
              your own AI Agent
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-sm text-muted-foreground"
          >
            Just ask Ethy to do anything, like:
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-3 w-full"
          >
            <ExampleCommands />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <Link
              to="/deploy"
              className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-2.5 rounded-full transition-all duration-150 hover:scale-[1.02] hover:shadow-lg group"
            >
              <Rocket className="w-4 h-4 mr-2 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
              Deploy Your Agent
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="mt-5"
          >
            <AgentAvatars />
          </motion.div>
        </div>
      </motion.section>

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        className="px-6 pb-6 pt-2"
      >
        <div className={`max-w-2xl mx-auto bg-ethy-bg-input rounded-xl transition-all duration-200 ${isFocused ? "ring-2 ring-purple-500/20" : ""}`}>
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
            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${inputValue.trim() ? "bg-ethy-purple hover:bg-ethy-purple-hover text-white" : "bg-muted text-muted-foreground"}`}>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
