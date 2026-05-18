import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentOrb } from "@/components/AgentOrb";
import { ExampleCommands } from "@/components/ExampleCommands";
import { AgentAvatars } from "@/components/AgentAvatars";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center px-6 -mt-16"
    >
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Agent Orb */}
        <AgentOrb />

        {/* Heading */}
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

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-sm text-muted-foreground"
        >
          Just ask Ethy to do anything, like:
        </motion.p>

        {/* Example Commands */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-3 w-full"
        >
          <ExampleCommands />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <Button
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-2.5 rounded-full transition-all duration-150 hover:scale-[1.02] hover:shadow-lg group"
          >
            <Rocket className="w-4 h-4 mr-2 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
            Deploy Your Agent
          </Button>
        </motion.div>

        {/* Agent Avatars */}
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
  );
}
