import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value, suffix = "", label, testid }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const duration = 1400;
        const start = performance.now();
        let raf;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2"
            data-testid={testid}
        >
            <div className="font-[Outfit] text-4xl sm:text-5xl font-light tracking-tighter">
                {display.toLocaleString()}
                <span className="text-[var(--fc-accent)]">{suffix}</span>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {label}
            </div>
        </motion.div>
    );
}
