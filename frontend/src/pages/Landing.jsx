import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Rocket } from "lucide-react";

import AuroraBackground from "../components/AuroraBackground";
import MarqueeTicker from "../components/MarqueeTicker";
import ParticlesBackground from "../components/ParticlesBackground";
import ServiceCard from "../components/ServiceCard";
import StatCounter from "../components/StatCounter";
import TrustedTeamsTicker from "../components/brand/TrustedTeamsTicker";
import { featuredServices } from "../lib/services";

const HERO_BG =
    "https://static.prod-images.emergentagent.com/jobs/9b52b19f-af98-4daf-8e66-07af33f330a6/images/bbfab8c54078f74383c8459b29b6043c77ac589b8cfe4f80f763b1cd60687207.png";

export default function Landing() {
    return (
        <div className="relative" data-testid="landing-page">
            <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
                <div
                    className="absolute inset-0 -z-30 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(${HERO_BG})` }}
                />
                <div className="absolute inset-0 -z-20 bg-background/40 dark:bg-black/40" />
                <AuroraBackground intensity="high" className="-z-10" />
                <div className="absolute inset-0 -z-10 fc-grid-bg fc-grid-fade opacity-40" />
                <ParticlesBackground />

                <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground fc-glass"
                        data-testid="hero-eyebrow"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-accent)] fc-pulse" />
                        Now shipping · Winter '26
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                        className="max-w-5xl font-[Outfit] text-5xl font-light leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl"
                        data-testid="hero-heading"
                    >
                        Engineering the <span className="fc-gradient-text italic font-normal">ambitious</span>
                        <br />
                        software of tomorrow.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25 }}
                        className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                    >
                        FusionCircle Tech is a studio of AI engineers, cloud architects, and product
                        designers that builds category-defining software for startups and growth-stage
                        companies.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <Link
                            to="/register"
                            className="fc-btn-primary inline-flex items-center gap-2"
                            data-testid="hero-cta-primary"
                        >
                            Start a project <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/services"
                            className="fc-btn-secondary inline-flex items-center gap-2"
                            data-testid="hero-cta-secondary"
                        >
                            Explore capabilities
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-20 grid max-w-4xl grid-cols-2 gap-10 md:grid-cols-4"
                    >
                        <StatCounter value={212} suffix="+" label="Products shipped" testid="stat-products" />
                        <StatCounter value={47} label="Engineers" testid="stat-engineers" />
                        <StatCounter value={38} suffix="M$" label="Client revenue" testid="stat-revenue" />
                        <StatCounter value={99} suffix="%" label="Retention" testid="stat-retention" />
                    </motion.div>
                </div>
            </section>

            <MarqueeTicker
                items={[
                    "AI · ENGINEERING",
                    "CLOUD · PLATFORMS",
                    "PRODUCT · DESIGN",
                    "DEVOPS · SRE",
                    "CYBERSECURITY",
                    "DATA · ENGINEERING",
                ]}
                speed={45}
            />

            <TrustedTeamsTicker />

            <section className="relative py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)]">
                                ◆ What we do
                            </div>
                            <h2 className="max-w-2xl font-[Outfit] text-4xl font-light tracking-tighter sm:text-5xl">
                                A full-stack partner for <span className="italic">product-first</span> teams.
                            </h2>
                        </div>
                        <Link
                            to="/services"
                            className="fc-btn-secondary inline-flex items-center gap-2"
                            data-testid="services-cta"
                        >
                            See all services <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {featuredServices.map((service, index) => (
                            <ServiceCard
                                key={service.slug}
                                {...service}
                                index={index}
                                testid={`service-card-${index}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative border-t border-border py-24 md:py-32">
                <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-12">
                    <div className="self-start lg:col-span-5 lg:sticky lg:top-32">
                        <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)]">
                            ◆ The method
                        </div>
                        <h2 className="font-[Outfit] text-4xl font-light tracking-tighter sm:text-5xl">
                            Pragmatic. AI-native.
                            <br />
                            <span className="italic">Relentlessly shipped.</span>
                        </h2>
                        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                            We work as an embedded team, not a traditional agency. Each engagement has
                            a clear north star, a lean cell of senior operators, and weekly visible
                            progress.
                        </p>
                    </div>

                    <div className="space-y-4 lg:col-span-7">
                        {[
                            { t: "Discover", d: "48-hour diagnostic sprint to map goals, constraints, and the riskiest assumption.", n: "01" },
                            { t: "Prototype", d: "Weekly usable prototypes. Real code, real data, never Figma theater.", n: "02" },
                            { t: "Ship", d: "Production-grade release with observability, CI/CD, and runbooks.", n: "03" },
                            { t: "Scale", d: "Continuous optimization: performance, cost, and compounding AI features.", n: "04" },
                        ].map((step, index) => (
                            <motion.div
                                key={step.t}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="fc-trace-card flex items-start gap-6 rounded-2xl border border-border bg-card p-6 md:p-8"
                                data-testid={`method-step-${index}`}
                            >
                                <span className="font-[Outfit] text-5xl font-thin text-muted-foreground/40">
                                    {step.n}
                                </span>
                                <div>
                                    <h3 className="mb-1 font-[Outfit] text-xl font-medium">{step.t}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6 md:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="fc-trace-card relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center md:p-20"
                        data-testid="cta-section"
                    >
                        <div className="absolute inset-0 fc-grid-bg opacity-30" />
                        <div className="relative">
                            <Rocket size={28} className="mx-auto mb-6 text-[var(--fc-accent)]" />
                            <h2 className="font-[Outfit] text-4xl font-light tracking-tighter sm:text-5xl lg:text-6xl">
                                Let's build something
                                <br />
                                <span className="italic">inevitable.</span>
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
                                48-hour response guarantee. Senior engineers from day one.
                            </p>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <Link to="/register" className="fc-btn-primary inline-flex items-center gap-2" data-testid="cta-register">
                                    Submit a project <ArrowRight size={15} />
                                </Link>
                                <Link to="/contact" className="fc-btn-secondary" data-testid="cta-contact">
                                    Talk to us
                                </Link>
                            </div>
                            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                                {["No lock-in", "IP transfer guaranteed", "NDA-first"].map((item) => (
                                    <div key={item} className="inline-flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-[var(--fc-accent)]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
