import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import AuroraBackground from "../components/AuroraBackground";
import ServiceCard from "../components/ServiceCard";
import { services } from "../lib/services";

const BG =
    "https://static.prod-images.emergentagent.com/jobs/9b52b19f-af98-4daf-8e66-07af33f330a6/images/1d06e5b10e33acf80bcc83a430d139a0ab60808ed717fbe5415e9ef2bb2fff72.png";

export default function Services() {
    return (
        <div className="relative" data-testid="services-page">
            <section className="relative overflow-hidden pb-20 pt-40">
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url(${BG})` }}
                />
                <div className="absolute inset-0 -z-10 bg-background/70 dark:bg-black/70" />
                <AuroraBackground intensity="low" />
                <div className="absolute inset-0 -z-10 fc-grid-bg fc-grid-fade opacity-40" />

                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="mb-6 text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)]">
                            ◆ Capabilities
                        </div>
                        <h1 className="max-w-4xl font-[Outfit] text-5xl font-light leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl">
                            Every surface of your product,
                            <br />
                            <span className="italic">engineered to compound.</span>
                        </h1>
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            We operate as a cross-functional cell: one PM, senior engineers, a designer,
                            and an AI specialist so you get startup velocity with big-company rigor.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="pb-24">
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
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

            <section className="border-t border-border py-24">
                <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
                    <h2 className="font-[Outfit] text-4xl font-light tracking-tighter sm:text-5xl">
                        Don't see your stack?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        We've shipped on everything from Rust to COBOL. Tell us what you're building.
                    </p>
                    <Link
                        to="/contact"
                        className="fc-btn-primary mt-8 inline-flex"
                        data-testid="services-contact-cta"
                    >
                        Talk to an engineer
                    </Link>
                </div>
            </section>
        </div>
    );
}
