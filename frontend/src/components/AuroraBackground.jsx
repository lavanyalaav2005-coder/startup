/**
 * AuroraBackground — layered animated mesh gradient with floating orbs
 * and SVG grain. Performance-friendly (GPU transforms only).
 */
import { motion } from "framer-motion";

export default function AuroraBackground({ intensity = "high", className = "" }) {
    const blobs =
        intensity === "high"
            ? [
                  { from: "rgba(0, 240, 255, 0.65)", delay: 0, size: 520, top: "-10%", left: "-10%" },
                  { from: "rgba(79, 70, 229, 0.55)", delay: 2, size: 600, top: "15%", left: "45%" },
                  { from: "rgba(236, 72, 153, 0.45)", delay: 4, size: 460, top: "55%", left: "5%" },
                  { from: "rgba(34, 197, 94, 0.35)", delay: 6, size: 520, top: "40%", left: "65%" },
              ]
            : [
                  { from: "rgba(0, 240, 255, 0.4)", delay: 0, size: 420, top: "0%", left: "-10%" },
                  { from: "rgba(79, 70, 229, 0.35)", delay: 3, size: 480, top: "25%", left: "55%" },
              ];

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} data-testid="aurora-bg">
            {blobs.map((b, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                        scale: [0.9, 1.2, 0.95, 1.1, 0.9],
                        x: [0, 80, -40, 30, 0],
                        y: [0, -60, 40, -30, 0],
                        opacity: [0.6, 0.95, 0.55, 0.9, 0.6],
                    }}
                    transition={{
                        duration: 18 + i * 2,
                        delay: b.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute rounded-full"
                    style={{
                        width: b.size,
                        height: b.size,
                        top: b.top,
                        left: b.left,
                        background: `radial-gradient(circle at 30% 30%, ${b.from}, transparent 65%)`,
                        filter: "blur(50px)",
                    }}
                />
            ))}

            {/* subtle scanlines */}
            <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
                }}
            />
        </div>
    );
}
