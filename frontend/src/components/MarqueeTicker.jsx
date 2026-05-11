/**
 * MarqueeTicker — vertical scrolling text ribbon (like luxury watch brand sites).
 * Used to fill spatial gaps and signal dynamism.
 */
import { motion } from "framer-motion";

export default function MarqueeTicker({
    items = ["AI · ENGINEERING", "CLOUD · PLATFORMS", "PRODUCT · DESIGN", "DEVOPS · SRE"],
    speed = 40,
    direction = "left",
}) {
    const loop = [...items, ...items, ...items];
    return (
        <div className="relative overflow-hidden py-6 border-y border-border" data-testid="marquee-ticker">
            <motion.div
                className="flex gap-14 whitespace-nowrap will-change-transform"
                animate={{ x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            >
                {loop.map((text, i) => (
                    <span
                        key={i}
                        className="font-[Outfit] text-4xl md:text-6xl font-light tracking-tighter text-foreground/60 flex items-center gap-14"
                    >
                        {text}
                        <span className="w-2 h-2 rounded-full bg-[var(--fc-accent)] shadow-[0_0_20px_var(--fc-glow)]" />
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
