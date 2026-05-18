import { motion } from "framer-motion";
import { CreditCard, ArrowLeftRight, Coins, Globe, X } from "lucide-react";
import { useState } from "react";

export function Wallet() {
  const [activeTab, setActiveTab] = useState<"assets" | "transactions" | "credits">("assets");

  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Wallet
      </motion.h1>

      {/* Cards Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
      >
        {/* Wallet Info Card */}
        <div className="bg-ethy-bg-sidebar rounded-xl border border-ethy-border-subtle p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Wallet Address</h2>
          <p className="text-sm text-muted-foreground mb-6 font-mono">Not found</p>

          <div className="flex items-center gap-8 mb-6">
            <div>
              <p className="text-3xl font-bold text-white">$0.00</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Portfolio Value</p>
              <p className="text-xs text-muted-foreground mt-0.5">0.00 (+0%)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Credits</p>
              </div>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ethy-border-subtle text-sm text-muted-foreground hover:text-white hover:border-white/20 transition-all duration-150">
            <CreditCard className="w-4 h-4" />
            Withdraw
          </button>
        </div>

        {/* How it works card */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How it works</h3>
          <p className="text-sm text-purple-100/90 leading-relaxed mb-4">
            This is your Personal Onchain Agent. Ethy AI lets you define Automated Tasks to buy, sell, stake or transfer assets — based on your own strategy.
          </p>
          <p className="text-sm text-purple-100/90 leading-relaxed mb-4">
            You can set up rules like daily staking or DCA (Dollar Cost Averaging) to accumulate tokens over time. Just define the logic, frequency, and intent — Ethy will execute for you. Trade smarter, let Ethy do the work for you while you sleep.
          </p>
          <a href="#" className="text-sm text-white font-medium flex items-center gap-1 hover:underline group">
            Read more on our Docs
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* Tabs and Create Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-1 bg-ethy-bg-sidebar rounded-lg p-1">
          {(["assets", "transactions", "credits"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 capitalize ${
                activeTab === tab
                  ? "bg-ethy-bg-sidebarItem text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab === "assets" && <Globe className="w-4 h-4" />}
              {tab === "transactions" && <ArrowLeftRight className="w-4 h-4" />}
              {tab === "credits" && <Coins className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        <button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-5 py-2 rounded-full text-sm transition-all duration-150 hover:scale-[1.02]">
          Create Automation
        </button>
      </motion.div>

      {/* Loading spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center py-16"
      >
        <div className="w-8 h-8 border-2 border-ethy-purple border-t-transparent rounded-full animate-spin" />
      </motion.div>

      {/* X Integration Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-ethy-bg-sidebar rounded-xl border border-ethy-border-subtle p-5 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <X className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">X Integration</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect your profile for creating Automations or copy form others directly on X by simply interacting with @ethy_agent.
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
          Coming soon
        </span>
      </motion.div>
    </div>
  );
}
