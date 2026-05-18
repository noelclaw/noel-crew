import { motion } from "framer-motion";

const commands = [
  "Hey Ethy, buy me 1000$ of ETHY",
  "Automate DCA 50$ of ETHY every day. Stop after spending 1000$",
  "Give me trending coins last 24h from Coingecko",
  "If 15min RSI on FACY is below 30, buy it. Sell 50% when 10x from first buy",
  "Check every 4 hours if WIRE is down at least 10% last day, then buy 500$",
];

export function ExampleCommands() {
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.5,
          },
        },
      }}
      className="space-y-2 text-sm text-muted-foreground"
    >
      {commands.map((cmd, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.08, ease: "easeOut" }}
          className="flex items-start gap-2"
        >
          <span className="text-muted-foreground select-none">{">_"}</span>
          <span>{cmd}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
