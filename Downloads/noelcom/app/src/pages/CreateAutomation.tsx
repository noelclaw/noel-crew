import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Link } from "react-router-dom";

interface Strategy {
  title: string;
  description: string;
}

const strategies: Strategy[] = [
  {
    title: "DCA Strategy",
    description: "Buy $50 worth of ETHY every day",
  },
  {
    title: "ETHY Price Action",
    description: "Buy when price drops 5%, sell when it rises 25%",
  },
  {
    title: "FACY RSI Trading",
    description: "Buy $50 of FACY when RSI drops below 30, sell when it rises above 70",
  },
];

export function CreateAutomation() {
  return (
    <div>
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold text-white text-center mb-6"
      >
        Welcome to Ethy AI
      </motion.h2>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        {/* Step 1 - Complete */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-emerald-500 font-medium">Deploy Agent</span>
        </div>
        <div className="w-8 h-px bg-emerald-500/50" />
        {/* Step 2 - Complete */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-emerald-500 font-medium">Fund Wallet</span>
        </div>
        <div className="w-8 h-px bg-ethy-border-subtle" />
        {/* Step 3 - Active */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ethy-purple flex items-center justify-center text-sm font-bold text-white">
            3
          </div>
          <span className="text-sm text-ethy-purple font-medium">Create Automation</span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white mb-2">Create your first Automation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose from our pre-built trading strategy templates to get started quickly.
        </p>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-ethy-bg-sidebar rounded-xl border border-ethy-border-subtle p-5 hover:border-ethy-purple/30 transition-all duration-200"
            >
              <h4 className="text-sm font-semibold text-white mb-1">{strategy.title}</h4>
              <p className="text-xs text-muted-foreground mb-4">{strategy.description}</p>
              <button className="w-full py-2 rounded-lg bg-ethy-purple hover:bg-ethy-purple-hover text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 hover:scale-[1.01]">
                <Copy className="w-3.5 h-3.5" />
                Copy Automation
              </button>
            </motion.div>
          ))}
        </div>

        {/* Skip Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-white transition-colors duration-150"
          >
            Skip for now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
