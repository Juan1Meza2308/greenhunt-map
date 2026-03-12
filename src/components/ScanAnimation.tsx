import { motion } from "framer-motion";

const ScanAnimation = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
      {/* Scanning laser line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        style={{ boxShadow: "0 0 20px hsl(var(--gh-green)), 0 0 60px hsl(var(--gh-green) / 0.5)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Corner brackets */}
      {[
        "top-2 left-2",
        "top-2 right-2 rotate-90",
        "bottom-2 left-2 -rotate-90",
        "bottom-2 right-2 rotate-180",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 8V2H8" stroke="hsl(var(--gh-green))" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -15],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gh-asphalt-deep/30" />

      {/* Status text */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="gh-glass rounded-full px-4 py-2">
          <p className="text-primary text-xs font-display font-semibold tracking-wider">
            ANALIZANDO CON IA...
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanAnimation;
