import { motion } from "framer-motion";
import { Check, X, ChevronRight, Zap, MessageSquare } from "lucide-react";

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  priceNote: string;
  features: { text: string; included: boolean; bold?: string }[];
  cta: string;
  ctaStyle: "active" | "upgrade";
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "STARTER",
    subtitle: "pay-as-you-go",
    price: "$0",
    priceNote: "No payment required",
    features: [
      { text: "1,000 free one-time credits", included: true, bold: "1,000" },
      { text: "2 live Automations", included: true, bold: "2" },
      { text: "Social Trading", included: false },
      { text: "10 message x day", included: true, bold: "10" },
      { text: "$20 per invited friend", included: true, bold: "$20" },
    ],
    cta: "ACTIVE PLAN",
    ctaStyle: "active",
  },
  {
    name: "PRO",
    subtitle: "",
    price: "$14.99",
    priceNote: "or stake >50,000 ETHY",
    features: [
      { text: "15,000 credits / month", included: true, bold: "15,000" },
      { text: "10 live Automations", included: true, bold: "10" },
      { text: "Social Trading", included: true },
      { text: "Unlimited Terminal messages", included: true, bold: "Unlimited" },
      { text: "$20 per invited friend", included: true, bold: "$20" },
    ],
    cta: "UPGRADE",
    ctaStyle: "upgrade",
  },
  {
    name: "EXPERT",
    subtitle: "",
    price: "$39.99",
    priceNote: "or stake >300,000 ETHY",
    features: [
      { text: "65,000 credits / month", included: true, bold: "65,000" },
      { text: "25 live Automations", included: true, bold: "25" },
      { text: "Social Trading", included: true },
      { text: "Unlimited Terminal messages", included: true, bold: "Unlimited" },
      { text: "$25 per invited friend", included: true, bold: "$25" },
    ],
    cta: "UPGRADE",
    ctaStyle: "upgrade",
    popular: true,
  },
  {
    name: "WHALE",
    subtitle: "",
    price: "$99.99",
    priceNote: "or stake >1,000,000 ETHY",
    features: [
      { text: "250,000 credits / month + bonus", included: true, bold: "250,000" },
      { text: "150 live Automations", included: true, bold: "150" },
      { text: "Social Trading", included: true },
      { text: "Unlimited Terminal messages", included: true, bold: "Unlimited" },
      { text: "$30 per invited friend", included: true, bold: "$30" },
    ],
    cta: "UPGRADE",
    ctaStyle: "upgrade",
  },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className={`relative bg-ethy-bg-sidebar rounded-xl border p-6 ${
        plan.popular
          ? "border-ethy-purple/50 shadow-lg shadow-ethy-purple/10"
          : "border-ethy-border-subtle"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-ethy-purple text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-bold text-white tracking-wider">{plan.name}</h3>
          {plan.subtitle && (
            <span className="text-[10px] text-muted-foreground border border-ethy-border-subtle px-2 py-0.5 rounded">
              {plan.subtitle}
            </span>
          )}
          {plan.name === "PRO" && <span className="text-ethy-purple text-xs">★</span>}
          {plan.name === "EXPERT" && <span className="text-ethy-purple text-xs">★ ★</span>}
          {plan.name === "WHALE" && <span className="text-ethy-purple text-xs">★ ★ ★</span>}
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {plan.name === "STARTER" && "Best way to try the platform before scaling"}
          {plan.name === "PRO" && "For traders ready to run strategies and start social trading"}
          {plan.name === "EXPERT" && "For degens running multiple strategies and letting others copy them"}
          {plan.name === "WHALE" && "For institutions, market makers and whales running high-frequency trading"}
        </p>
        <p className="text-3xl font-bold text-white">{plan.price}</p>
        <p className="text-xs text-muted-foreground mt-1">{plan.priceNote}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-xs text-muted-foreground">
              {feature.bold ? (
                <>
                  <span className="text-white font-medium">{feature.bold}</span>
                  {feature.text.replace(feature.bold, "")}
                </>
              ) : (
                feature.text
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {plan.ctaStyle === "active" ? (
        <button className="w-full py-2.5 rounded-lg border border-ethy-border-subtle text-xs font-medium text-muted-foreground cursor-default">
          {plan.cta}
        </button>
      ) : (
        <button className="w-full py-2.5 rounded-lg bg-ethy-purple hover:bg-ethy-purple-hover text-white text-xs font-medium flex items-center justify-center gap-1 transition-all duration-150 hover:scale-[1.01]">
          {plan.cta}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}

export function Subscription() {
  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-8"
      >
        Plans and Pricing
      </motion.h1>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {plans.map((plan, index) => (
          <PlanCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      {/* Footer Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-ethy-orange" />
          <p className="text-sm text-white font-medium">Each Automation execution = 10 credits</p>
        </div>
        <p className="text-xs text-muted-foreground ml-7">$0.02 per execution when out of credits</p>

        <div className="flex items-center gap-3 mt-4">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <p className="text-sm text-muted-foreground">
            Trading View Advanced Charts are <span className="text-white font-medium">free to use</span>, included also on all tiers
          </p>
        </div>
      </motion.div>
    </div>
  );
}
