import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Compass,
    Layers3,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import TrustedTeamsTicker from "../components/brand/TrustedTeamsTicker";

const proofStats = [
    { value: 50, suffix: "+", label: "Projects delivered" },
    { value: 8, suffix: "+", label: "Years of experience" },
    { value: 9, suffix: "", label: "Time zones covered" },
    { value: 100, suffix: "%", label: "Senior-led work" },
];

const principles = [
    {
        icon: Compass,
        title: "Clear message",
        text: "We make your company message easy to read and easy to understand.",
    },
    {
        icon: Layers3,
        title: "Clean design",
        text: "We keep every section neat, simple, and modern.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted work",
        text: "We build with care so your business looks professional and strong.",
    },
];

const approach = [
    "Start with your story.",
    "Keep the layout simple.",
    "Add soft animation.",
    "Make the page feel clean and strong.",
];

const differentiators = [
    {
        icon: BriefcaseBusiness,
        title: "Professional look",
        text: "Your company looks more polished and ready for clients.",
    },
    {
        icon: Users,
        title: "Good teamwork",
        text: "We work closely with you and keep the process easy.",
    },
    {
        icon: Sparkles,
        title: "Simple style",
        text: "We use simple words and clean design for a better page.",
    },
];

function FadeUp({ children, delay = 0, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function CountOnView({ value, suffix, label, delay = 0 }) {
    const ref = useRef(null);
    const frameRef = useRef(null);
    const visibleRef = useRef(false);
    const [runId, setRunId] = useState(0);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !visibleRef.current) {
                    visibleRef.current = true;
                    setRunId((prev) => prev + 1);
                }

                if (!entry.isIntersecting && visibleRef.current) {
                    visibleRef.current = false;
                    setDisplay(0);
                    if (frameRef.current) {
                        window.cancelAnimationFrame(frameRef.current);
                    }
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (runId === 0) return;

        const startTime = performance.now();
        const duration = 1100 + delay * 120;

        const tick = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));

            if (progress < 1) {
                frameRef.current = window.requestAnimationFrame(tick);
            }
        };

        setDisplay(0);
        frameRef.current = window.requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [runId, value, delay]);

    return (
        <div
            ref={ref}
            className="rounded-[1.9rem] border border-white/10 bg-black px-8 py-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
        >
            <div className="font-[Outfit] text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {display}
                {suffix}
            </div>
            <p className="mt-3 text-sm text-white/65 md:text-base">{label}</p>
        </div>
    );
}

export default function AboutPage() {
    return (
        <div
            data-testid="about-page"
            className="bg-[radial-gradient(circle_at_top_left,rgba(0,85,255,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,rgba(148,163,184,0.06)_100%)] text-foreground"
        >
            <section className="px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-36">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div>
                            <FadeUp>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--fc-accent)]/15 bg-[var(--fc-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                                    About FusionCircle
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.08}>
                                <h1 className="mt-6 max-w-4xl font-[Outfit] text-[clamp(3rem,6vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground">
                                    We help companies look clear, strong, and professional.
                                </h1>
                            </FadeUp>

                            <FadeUp delay={0.16}>
                                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                                    We build simple About pages with clean design, easy words, and soft animation.
                                </p>
                            </FadeUp>
                        </div>

                        <FadeUp
                            delay={0.22}
                            className="rounded-[2rem] border border-border bg-card/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
                        >
                            <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                                Our mission
                            </p>
                            <p className="mt-4 font-[Outfit] text-3xl font-semibold leading-tight text-foreground">
                                Build simple and modern pages people can trust.
                            </p>
                            <p className="mt-5 text-sm leading-7 text-muted-foreground">
                                We mix clean design and good development to give your business a better online look.
                            </p>
                        </FadeUp>
                    </div>

                    <FadeUp delay={0.28}>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link to="/contact" className="fc-btn-primary inline-flex items-center gap-2">
                                Start a conversation <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/services"
                                className="fc-btn-secondary inline-flex items-center gap-2"
                            >
                                Explore services
                            </Link>
                        </div>
                    </FadeUp>
                </div>
            </section>

            <section className="px-6 py-8 md:px-10 md:py-12">
                <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#050505] p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] md:p-12">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {proofStats.map((item, index) => (
                            <FadeUp key={item.label} delay={index * 0.05}>
                                <CountOnView
                                    value={item.value}
                                    suffix={item.suffix}
                                    label={item.label}
                                    delay={index}
                                />
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            <TrustedTeamsTicker />

            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <FadeUp>
                        <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                            Who we are
                        </p>
                        <h2 className="mt-3 font-[Outfit] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            A small team that builds clean and modern work.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.08}>
                        <div className="space-y-5 text-base leading-8 text-muted-foreground">
                            <p>
                                FusionCircle helps businesses show their brand in a better way. A good
                                page helps people trust your company faster.
                            </p>
                            <p>
                                We create pages that are simple, neat, and easy to use. The result
                                feels modern and professional.
                            </p>
                        </div>
                    </FadeUp>
                </div>
            </section>

            <section className="px-6 py-16 md:px-10 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <FadeUp>
                            <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                                Our principles
                            </p>
                            <h2 className="mt-3 font-[Outfit] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Good About pages are simple and easy to read.
                            </h2>
                        </FadeUp>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        {principles.map((item, index) => (
                            <FadeUp key={item.title} delay={index * 0.08}>
                                <div className="group rounded-[1.8rem] border border-border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)] transition duration-300 group-hover:scale-105">
                                        <item.icon size={22} />
                                    </div>
                                    <h3 className="mt-5 font-[Outfit] text-2xl font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                        {item.text}
                                    </p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-16 md:px-10 md:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <FadeUp>
                        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
                            <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                                Our approach
                            </p>
                            <h2 className="mt-3 font-[Outfit] text-4xl font-semibold tracking-tight text-foreground">
                                Simple, neat, and easy to trust.
                            </h2>
                            <div className="mt-8 space-y-4">
                                {approach.map((step, index) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: -18 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.25 }}
                                        transition={{ duration: 0.45, delay: index * 0.06 }}
                                        className="flex items-start gap-4 rounded-[1.4rem] border border-border bg-background/80 p-5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fc-accent)] font-[Outfit] text-sm font-semibold text-black">
                                            0{index + 1}
                                        </div>
                                        <p className="pt-1 text-sm leading-7 text-muted-foreground">
                                            {step}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </FadeUp>

                    <div className="space-y-5">
                        {differentiators.map((item, index) => (
                            <FadeUp key={item.title} delay={index * 0.08}>
                                <div className="rounded-[1.8rem] border border-border bg-card p-7 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)]">
                                            <item.icon size={20} />
                                        </div>
                                        <h3 className="font-[Outfit] text-2xl font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                        {item.text}
                                    </p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24 pt-8 md:px-10">
                <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.2rem] border border-border bg-[linear-gradient(135deg,rgba(0,85,255,0.12),rgba(148,163,184,0.06))] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-12">
                    <FadeUp>
                        <div className="text-center">
                            <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                                Final note
                            </p>
                            <h2 className="mt-4 font-[Outfit] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                A good About page should feel simple and clear.
                            </h2>
                            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                                This page uses simple words, clean sections, and soft animation for a better result.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Link
                                    to="/contact"
                                    className="fc-btn-primary inline-flex items-center gap-2"
                                >
                                    Talk to our team <ArrowRight size={16} />
                                </Link>
                                <Link
                                    to="/services"
                                    className="fc-btn-secondary inline-flex items-center gap-2"
                                >
                                    View our services
                                </Link>
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
