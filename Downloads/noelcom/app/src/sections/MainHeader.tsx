import { motion } from "framer-motion";
import { Pencil, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainHeader() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
      className="flex items-center justify-between px-6 py-3"
    >
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ethy-bg-sidebarItem transition-colors duration-150">
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-ethy-bg-sidebarItem transition-colors duration-150">
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        </button>
        <Button
          className="bg-ethy-purple hover:bg-ethy-purple-hover text-white font-medium px-5 py-2 rounded-full transition-all duration-150 hover:scale-[1.02]"
        >
          Login
        </Button>
      </div>
    </motion.header>
  );
}
