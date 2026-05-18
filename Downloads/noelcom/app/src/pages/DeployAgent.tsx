import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function DeployAgent() {
  const [isDeploying, setIsDeploying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsDeploying(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Autonomous Trading",
      description:
        "Run any strategy you want, from RSI or MACD setups to full price action automations. Just describe it in plain language and your agent executes it for you while you touch grass.",
    },
    {
      title: "24/7 Monitoring",
      description:
        "Your agent never sleeps. It scans every chart, dip, and opportunity so you don't have to. Automations can run as often as every 5 minutes or up to every 24 hours, depending on your trading strategy.",
    },
    {
      title: "Initial FREE credits",
      description:
        "Get 1,000 ETHY credits to test your first automations and watch your agent in action instantly.",
    },
  ];

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
        {/* Step 1 - Active */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ethy-purple flex items-center justify-center text-sm font-bold text-white">
            1
          </div>
          <span className="text-sm text-ethy-purple font-medium">Deploy Agent</span>
        </div>
        <div className="w-8 h-px bg-ethy-border-subtle" />
        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-ethy-border-subtle flex items-center justify-center text-sm font-medium text-muted-foreground">
            2
          </div>
          <span className="text-sm text-muted-foreground">Fund Wallet</span>
        </div>
        <div className="w-8 h-px bg-ethy-border-subtle" />
        {/* Step 3 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-ethy-border-subtle flex items-center justify-center text-sm font-medium text-muted-foreground">
            3
          </div>
          <span className="text-sm text-muted-foreground">Create Automation</span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white mb-3">Deploy your Ethy Agent</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Create your personal AI trading assistant with its own secure wallet — non-custodial, protected by Privy, and powered by TEE for hardware-level encryption and full control of your keys.
        </p>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Deploy Button */}
        <Link
          to="/create-automation"
          className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isDeploying
              ? "bg-ethy-purple/70 text-white/80 cursor-wait"
              : "bg-ethy-purple hover:bg-ethy-purple-hover text-white"
          }`}
        >
          {isDeploying && <Loader2 className="w-4 h-4 animate-spin" />}
          {isDeploying ? "Deploying Agent..." : "Continue"}
        </Link>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Protected by Privy
        </p>
      </motion.div>
    </div>
  );
}
