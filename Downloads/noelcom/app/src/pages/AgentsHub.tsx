import { motion } from "framer-motion";
import { Globe, X } from "lucide-react";

interface AgentCard {
  name: string;
  type: string;
  typeColor: string;
  tags: string[];
  description: string;
  icon: string;
  iconBg: string;
}

const agents: AgentCard[] = [
  {
    name: "AIXBT",
    type: "Agent | x402",
    typeColor: "bg-emerald-500/20 text-emerald-400",
    tags: ["Alpha", "Mindshare"],
    description: "AIXBT scans narratives, social signals, and on-chain flows to surface actionable alpha ideas before they go mainstream. It's your alpha engine — ask it for trend insights, sentiment shifts or next big moves. Combine its insights with your agents' analysis for stronger trade conviction.",
    icon: "📡",
    iconBg: "bg-purple-600",
  },
  {
    name: "Gloria AI",
    type: "Agent | x402",
    typeColor: "bg-emerald-500/20 text-emerald-400",
    tags: ["Mindshare"],
    description: "Gloria AI monitors news, social sentiment, and developments in crypto & AI in real time to tell you when the market tone is shifting. Use it to layer sentiment insight onto your trade logic or to warn you when things may be turning. It helps you coordinate agents with a news-aware lens.",
    icon: "G",
    iconBg: "bg-white",
  },
  {
    name: "Loky",
    type: "Agent | ACP",
    typeColor: "bg-emerald-500/20 text-emerald-400",
    tags: ["Market Insights"],
    description: "Loky delivers technical analysis, volatility modeling, and contextual signal intelligence tailored to your positions and holdings. Ask it for support, resistance, momentum, or trade setups on any token. Its insights adapt as you trade and evolve your strategy.",
    icon: "L",
    iconBg: "bg-emerald-600",
  },
  {
    name: "Whale Intel",
    type: "Agent | MCP",
    typeColor: "bg-emerald-500/20 text-emerald-400",
    tags: ["Market Insights"],
    description: "Whale Intel watches large wallet flows, staking / unstaking events, and institutional moves in real time. Use it to detect where the big money is shifting, and validate or filter your trade ideas. It gives you early signals from macro on-chain behavior.",
    icon: "W",
    iconBg: "bg-indigo-600",
  },
  {
    name: "Coingecko",
    type: "Plugin",
    typeColor: "bg-blue-500/20 text-blue-400",
    tags: ["Market Insights"],
    description: "Coingecko plugin provides live pricing, volume, market cap and trending token data from a trusted source. Use it to catch up on the trends and help you discover your next gem.",
    icon: "🦎",
    iconBg: "bg-green-500",
  },
  {
    name: "0x",
    type: "Plugin",
    typeColor: "bg-blue-500/20 text-blue-400",
    tags: ["Trading"],
    description: "0x plugin is your seamless, optimized swap provider — route trades across liquidity to achieve best price and minimal friction. Let your agents execute trades automatically with routing intelligence and low slippage.",
    icon: "0x",
    iconBg: "bg-black",
  },
  {
    name: "Avantis",
    type: "Plugin",
    typeColor: "bg-blue-500/20 text-blue-400",
    tags: ["Trading"],
    description: "Avantis unlocks up to 500x leveraged trading, letting your Agent go long or short across crypto but also on Stocks and Forex! A new era of high-voltage strategies with managed risk and massive alpha.",
    icon: "A",
    iconBg: "bg-purple-500",
  },
  {
    name: "Indexy",
    type: "Plugin",
    typeColor: "bg-blue-500/20 text-blue-400",
    tags: ["Trading"],
    description: "Indexy plugin help you to surface top performing indexes and basket strategies for tokens and sectors. Use it to allocate across clusters of assets rather than single tokens, and spot hidden opportunities via diversified exposure.",
    icon: "I",
    iconBg: "bg-green-600",
  },
  {
    name: "Nansen AI",
    type: "Plugin",
    typeColor: "bg-blue-500/20 text-blue-400",
    tags: ["Market Insights"],
    description: "Nansen AI plugin unlocks powerful on-chain analytics — letting your agent track smart money flows, token holdings, and whale activity across the market. Use it to detect accumulation patterns, identify emerging trends, and make data-driven decisions.",
    icon: "N",
    iconBg: "bg-cyan-600",
  },
];

function AgentCardComponent({ agent, index }: { agent: AgentCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="bg-ethy-bg-sidebar rounded-xl border border-ethy-border-subtle p-5 hover:border-ethy-purple/30 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${agent.iconBg} flex items-center justify-center text-sm font-bold flex-shrink-0 ${agent.iconBg === "bg-white" ? "text-black" : "text-white"}`}>
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${agent.typeColor}`}>
              {agent.type}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-muted-foreground" />
              <X className="w-3 h-3 text-muted-foreground" />
            </div>
            {agent.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">
        {agent.description}
      </p>

      {/* Button */}
      <button className="text-xs font-medium text-ethy-purple hover:text-ethy-purple-light border border-ethy-purple/30 hover:border-ethy-purple/60 px-4 py-1.5 rounded-lg transition-all duration-150">
        Try it now
      </button>
    </motion.div>
  );
}

export function AgentsHub() {
  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Agents Hub & Plugins
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <AgentCardComponent key={agent.name} agent={agent} index={index} />
        ))}
      </div>
    </div>
  );
}
