import { motion } from "framer-motion";
import { Zap, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Automations() {
  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          Automations
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/create-automation"
            className="inline-flex items-center gap-2 bg-ethy-purple hover:bg-ethy-purple-hover text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-150 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </Link>
        </motion.div>
      </div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="w-16 h-16 rounded-full bg-ethy-bg-sidebarItem flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No automations yet</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          Create your first automation to start trading automatically. Choose from pre-built templates or create your own custom strategy.
        </p>
        <Link
          to="/create-automation"
          className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2.5 rounded-full transition-all duration-150 hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4" />
          Create Your First Automation
        </Link>
      </motion.div>
    </div>
  );
}
