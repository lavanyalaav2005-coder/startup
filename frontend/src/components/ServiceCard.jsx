import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const MotionLink = motion.create(Link);

export default function ServiceCard({
    icon: Icon,
    title,
    slug,
    description,
    tags = [],
    index = 0,
    testid,
}) {
    const [ripples, setRipples] = useState([]);

    const handlePointerDown = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const ripple = {
            id: Date.now() + Math.random(),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        setRipples((current) => [...current, ripple]);
        window.setTimeout(() => {
            setRipples((current) => current.filter((item) => item.id !== ripple.id));
        }, 650);
    };

    return (
        <MotionLink
            to={`/services/${slug}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -10, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            onPointerDown={handlePointerDown}
            className="fc-service-list-card group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-white/10 bg-card/90 p-6 md:p-8"
            data-testid={testid}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(125,92,255,0.12),transparent_30%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="fc-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            ))}

            <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)] shadow-[0_0_30px_rgba(0,240,255,0.12)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={20} />
                </div>
                <div className="flex items-center gap-3">
                    <span className="fc-card-badge">0{index + 1}</span>
                    <ArrowUpRight
                        size={18}
                        className="text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fc-accent)]"
                    />
                </div>
            </div>

            <h3 className="relative font-[Outfit] text-xl font-medium tracking-tight md:text-[1.35rem]">
                {title}
            </h3>
            <p className="relative text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
            <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-[var(--fc-accent)]/30 group-hover:text-foreground"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </MotionLink>
    );
}
