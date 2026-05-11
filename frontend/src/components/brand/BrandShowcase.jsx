import { motion } from "framer-motion";
import BrandLogo from "./BrandLogo";

const variants = [
    {
        id: "primary",
        title: "Primary lockup",
        note: "Best for navbars, decks, and pitch materials.",
        render: () => <BrandLogo animated className="text-left" />,
    },
    {
        id: "stacked",
        title: "Stacked signature",
        note: "Compact composition for splash screens and posters.",
        render: () => <BrandLogo variant="stacked" animated className="text-left" />,
    },
    {
        id: "mark",
        title: "App icon",
        note: "High-contrast symbol for favicon, app tile, and avatars.",
        render: () => <BrandLogo variant="mark" animated markClassName="h-20 w-20" />,
    },
    {
        id: "wordmark",
        title: "Wordmark",
        note: "Minimal premium treatment for editorial or footer use.",
        render: () => <BrandLogo variant="wordmark" className="text-left" />,
    },
];

export default function BrandShowcase() {
    return (
        <section className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55 }}
                    className="max-w-3xl"
                >
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--fc-accent)]">
                        Brand system
                    </p>
                    <h2 className="mt-3 font-[Outfit] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        A sharper identity for premium AI delivery.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-muted-foreground">
                        The new FusionCircle mark combines an orbital ring, luminous core, and FC
                        monogram to signal motion, systems thinking, and polished execution.
                    </p>
                </motion.div>

                <div className="mt-10 grid gap-5 lg:grid-cols-2">
                    {variants.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: index * 0.08 }}
                            className="fc-brand-card"
                        >
                            <div className="fc-brand-card-stage">{item.render()}</div>
                            <div className="mt-8">
                                <p className="font-[Outfit] text-2xl font-semibold tracking-tight text-foreground">
                                    {item.title}
                                </p>
                                <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                                    {item.note}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

