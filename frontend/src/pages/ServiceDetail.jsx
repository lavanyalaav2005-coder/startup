import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import AuroraBackground from "../components/AuroraBackground";
import MagneticLink from "../components/MagneticLink";
import ParticlesBackground from "../components/ParticlesBackground";
import { getServiceBySlug, services } from "../lib/services";

const sectionReveal = {
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

function highlightText(text, highlights) {
  const ordered = [...highlights].sort((a, b) => b.length - a.length);
  const escaped = ordered.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  return text.split(regex).map((part, index) => {
    const isHighlight = ordered.some((item) => item.toLowerCase() === part.toLowerCase());
    return isHighlight ? (
      <span key={`${part}-${index}`} className="fc-inline-highlight">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = useMemo(() => getServiceBySlug(slug), [slug]);
  const timelineRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(heroProgress, [0, 1], [0, 160]);
  const meshY = useTransform(heroProgress, [0, 1], [0, 90]);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.7"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto fc-trace-card rounded-[2rem] border border-border bg-card/70 p-10 md:p-14 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--fc-accent)]">Service not found</p>
          <h1 className="mt-4 font-[Outfit] text-4xl md:text-5xl tracking-tight">That service page is not available.</h1>
          <p className="mt-5 text-muted-foreground">Choose another capability and we will take you to the right experience.</p>
          <div className="mt-8 flex justify-center">
            <MagneticLink to="/services" className="fc-btn-primary gap-2">
              Back to services <ArrowRight size={16} />
            </MagneticLink>
          </div>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <div className="relative overflow-hidden" data-testid="service-detail-page">
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden pt-32 pb-20 md:pt-40">
        <AuroraBackground intensity="high" className="-z-20" />
        <ParticlesBackground />
        <motion.div style={{ y: orbY }} className="fc-service-orb fc-service-orb-a" />
        <motion.div style={{ y: meshY }} className="fc-service-orb fc-service-orb-b" />
        <div className="absolute inset-0 -z-10 fc-grid-bg opacity-35 fc-grid-fade" />
        <div className="absolute inset-0 -z-10 fc-service-gradient" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
              Back to services
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)] fc-glass">
              <span className="h-2 w-2 rounded-full bg-[var(--fc-accent)] fc-pulse" />
              {service.heroLabel}
            </div>
          </motion.div>

          <div className="mt-14 grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[var(--fc-accent)] shadow-[0_0_60px_rgba(0,240,255,0.12)] fc-glass"
              >
                <Icon size={28} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.12 }}
                className="max-w-5xl font-[Outfit] text-5xl font-light leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
              >
                <span className="fc-gradient-text">{service.title}</span>
                <br />
                built to feel sharp under pressure.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
              >
                {service.heroDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <MagneticLink to="/contact" className="fc-btn-primary gap-2">
                  Talk to an engineer <ArrowRight size={16} />
                </MagneticLink>
                <MagneticLink to="/register" className="fc-btn-secondary gap-2">
                  Start a project
                </MagneticLink>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
              className="fc-service-panel fc-noise"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Service snapshot</p>
                  <p className="mt-2 font-[Outfit] text-2xl tracking-tight">Premium execution surfaces</p>
                </div>
                <div className="rounded-full border border-[var(--fc-accent)]/30 bg-[var(--fc-accent-soft)] px-3 py-1 text-xs text-[var(--fc-accent)]">
                  High-touch
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {service.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="font-[Outfit] text-3xl tracking-tight">{metric.value}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="fc-tech-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div {...sectionReveal} className="lg:sticky lg:top-28 self-start">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Service description</p>
            <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">
              Clarity, taste, and execution in one surface.
            </h2>
          </motion.div>

          <div className="space-y-6">
            {service.overview.map((paragraph, index) => (
              <motion.p
                key={index}
                {...sectionReveal}
                transition={{ ...sectionReveal.transition, delay: index * 0.08 }}
                className="text-base leading-8 text-muted-foreground md:text-lg"
              >
                {highlightText(paragraph, service.highlights)}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...sectionReveal} className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Feature architecture</p>
              <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">Interactive systems, not feature lists.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Each capability is shaped as a composable layer with clear interaction, visible state, and room to evolve.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {service.features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: index * 0.06 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="fc-service-card group"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[var(--fc-accent)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FeatureIcon size={24} />
                    </div>
                    <div className="fc-card-badge">0{index + 1}</div>
                  </div>
                  <h3 className="mt-7 font-[Outfit] text-2xl tracking-tight">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{feature.detail}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...sectionReveal} className="mb-10">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Technology stack</p>
            <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">The stack flexes to the product, not the other way around.</h2>
          </motion.div>

          <div className="fc-marquee">
            <div className="fc-marquee-track">
              {[...service.stack, ...service.stack].map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="fc-tech-pill fc-tech-pill-strong"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {service.stack.map((item, index) => (
              <motion.div
                key={`${item}-grid`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,240,255,0.16)" }}
                className="fc-tech-grid-item"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div {...sectionReveal} className="lg:sticky lg:top-28 self-start">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Workflow</p>
            <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">A process built to move from promise to proof quickly.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              The line fills as the team advances. The goal is steady visible progress, not long periods of invisible activity.
            </p>
          </motion.div>

          <div className="relative pl-10">
            <div className="fc-timeline-line" />
            <motion.div style={{ scaleY: progressScale }} className="fc-timeline-progress origin-top" />
            <div className="space-y-8">
              {service.process.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="fc-timeline-card"
                >
                  <div className="fc-timeline-dot" />
                  <div className="fc-card-badge">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="mt-5 font-[Outfit] text-2xl tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{step.detail}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...sectionReveal} className="mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Benefits</p>
            <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">What high-end execution changes for the business.</h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {service.benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="fc-benefit-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)] shadow-[0_0_24px_rgba(0,240,255,0.18)]">
                    <BenefitIcon size={22} />
                  </div>
                  <h3 className="mt-6 font-[Outfit] text-2xl tracking-tight">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{benefit.detail}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="fc-cta-panel"
          >
            <div className="absolute inset-0 fc-grid-bg opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.28),transparent_40%),radial-gradient(circle_at_85%_20%,rgba(125,92,255,0.22),transparent_28%)]" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Call to action</p>
                <h2 className="mt-4 font-[Outfit] text-4xl font-light tracking-tight sm:text-5xl">{service.ctaTitle}</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  {service.ctaText}
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <MagneticLink to="/contact" className="fc-btn-primary w-full gap-2 sm:w-auto">
                  Book a strategy call <ArrowRight size={16} />
                </MagneticLink>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {["Senior team from day one", "Fast scoping", "Clear delivery rhythm"].map((item) => (
                    <div key={item} className="inline-flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[var(--fc-accent)]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...sectionReveal} className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--fc-accent)]">Related capabilities</p>
              <h2 className="mt-4 font-[Outfit] text-3xl font-light tracking-tight sm:text-4xl">Explore adjacent expertise.</h2>
            </div>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse all services
            </Link>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item, index) => {
              const RelatedIcon = item.icon;
              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="fc-related-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)]">
                    <RelatedIcon size={20} />
                  </div>
                  <h3 className="mt-5 font-[Outfit] text-2xl tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  <MagneticLink to={`/services/${item.slug}`} className="mt-6 self-start text-sm text-[var(--fc-accent)]">
                    View service <ArrowRight size={14} />
                  </MagneticLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
