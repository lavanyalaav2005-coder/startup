import {
  BadgeCheck,
  BarChart3,
  Binary,
  Bot,
  Boxes,
  Brain,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe,
  Layers3,
  LineChart,
  Lock,
  MessageSquare,
  Monitor,
  NotebookTabs,
  Palette,
  PanelsTopLeft,
  Rocket,
  Server,
  Settings2,
  Shield,
  Sparkles,
  SwatchBook,
  Telescope,
  TimerReset,
  Users,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";

export const services = [
  {
    slug: "ai-machine-learning",
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "LLM applications, agentic workflows, predictive models, computer vision, and recommendation engines.",
    tags: ["LLMs", "RAG", "Agents", "Vision"],
    heroLabel: "AI Systems",
    heroDescription:
      "We design and ship production AI systems that feel fast, reliable, and commercially useful from day one.",
    metrics: [
      { value: "6-8 wks", label: "Pilot to production" },
      { value: "99.9%", label: "Runtime observability" },
      { value: "3x", label: "Team leverage" },
    ],
    overview: [
      "AI initiatives usually fail when the model is treated as the product. We build the full operating layer around the model: retrieval, orchestration, guardrails, analytics, and human review.",
      "That means your copilots, search experiences, automation flows, and recommendation systems stay grounded in business context and improve with use.",
    ],
    highlights: ["agentic workflows", "retrieval", "guardrails", "human review"],
    features: [
      {
        icon: Bot,
        title: "AI copilots with real context",
        detail: "Role-aware assistants connected to your docs, product data, and customer workflows.",
      },
      {
        icon: Cpu,
        title: "Model routing and orchestration",
        detail: "Choose the right model per task for speed, quality, and cost instead of overpaying everywhere.",
      },
      {
        icon: Shield,
        title: "Evaluation and safety loops",
        detail: "Prompt regression tests, feedback scoring, and fallback logic that make AI releases safe to scale.",
      },
      {
        icon: LineChart,
        title: "Decision intelligence",
        detail: "Forecasting, anomaly detection, and recommendation systems built around measurable outcomes.",
      },
    ],
    stack: ["OpenAI", "LangGraph", "Python", "FastAPI", "Vector DBs", "Postgres", "Redis", "Kubernetes"],
    process: [
      { title: "Map the operating surface", detail: "We identify where AI can remove friction, create differentiation, or unlock revenue in the current journey." },
      { title: "Prototype with real constraints", detail: "The first build is wired to actual data, permissions, and usage patterns so signal appears early." },
      { title: "Harden for production", detail: "Latency budgets, observability, fallback flows, and evals are added before rollout expands." },
      { title: "Improve through feedback", detail: "Usage analytics and reviewer feedback create a compounding improvement loop after launch." },
    ],
    benefits: [
      { icon: Zap, title: "Faster internal execution", detail: "Teams automate repetitive work and spend more time on judgment, shipping, and customers." },
      { icon: CheckCircle2, title: "Safer deployments", detail: "Every release is backed by monitoring, human override paths, and measurable quality gates." },
      { icon: Rocket, title: "Defensible product value", detail: "AI becomes part of the user experience, not a thin feature bolted on at the edge." },
    ],
    ctaTitle: "Turn AI into a product advantage",
    ctaText: "Bring us your workflow, dataset, or idea and we will shape the fastest path to a credible launch.",
  },
  {
    slug: "generative-product-features",
    icon: Sparkles,
    title: "Generative Product Features",
    description:
      "Copilots, creation tools, and personalization layers embedded into your existing product.",
    tags: ["Copilots", "Personalization", "Creation", "UX"],
    heroLabel: "Generative UX",
    heroDescription:
      "We craft generative experiences that feel native to your product, not like a modal stapled onto it.",
    metrics: [
      { value: "40%+", label: "Faster task completion" },
      { value: "2x", label: "Feature adoption" },
      { value: "Weeks", label: "To MVP" },
    ],
    overview: [
      "The best generative features remove effort, compress time, and make users feel unusually capable. We focus on moments where generation improves the product experience rather than distracting from it.",
      "From onboarding assistants to content generation and smart composition, every interaction is tuned for trust, speed, and clarity.",
    ],
    highlights: ["generative features", "product experience", "trust", "smart composition"],
    features: [
      {
        icon: Wand2,
        title: "Creation flows users actually finish",
        detail: "Structured prompts, previews, editing loops, and safeguards that help users reach a usable result quickly.",
      },
      {
        icon: MessageSquare,
        title: "Embedded assistants",
        detail: "Contextual guidance inside dashboards, forms, and workflows where users need help most.",
      },
      {
        icon: PanelsTopLeft,
        title: "Personalized interfaces",
        detail: "Adaptive content and recommendations shaped by role, activity, and behavioral signal.",
      },
      {
        icon: Gauge,
        title: "Latency-aware interaction design",
        detail: "Skeleton states, optimistic UI, and streaming output patterns that make AI feel premium.",
      },
    ],
    stack: ["React", "Framer Motion", "Streaming APIs", "Prompt libraries", "Feature flags", "Analytics", "A/B testing"],
    process: [
      { title: "Choose the right surface", detail: "We identify where generation creates momentum for users instead of interrupting them." },
      { title: "Design the loop", detail: "Prompt, preview, edit, approve, and publish states are mapped as one coherent flow." },
      { title: "Tune trust and clarity", detail: "Edge cases, low-confidence states, and control affordances are designed before scale-up." },
      { title: "Optimize adoption", detail: "We watch usage, identify drop-off, and improve activation until the feature earns repeat use." },
    ],
    benefits: [
      { icon: Users, title: "More intuitive user journeys", detail: "The product feels helpful, responsive, and distinctly more capable than category peers." },
      { icon: BarChart3, title: "Higher activation", detail: "Users reach value faster because the product does more of the heavy lifting for them." },
      { icon: Sparkles, title: "Memorable differentiation", detail: "The experience feels modern and polished enough to shape how prospects talk about the product." },
    ],
    ctaTitle: "Design a feature users will show other people",
    ctaText: "We can help you turn generative AI into a signature workflow that feels premium and unmistakably yours.",
  },
  {
    slug: "cloud-architecture",
    icon: Cloud,
    title: "Cloud Architecture",
    description:
      "Resilient multi-region, auto-scaling systems on AWS, GCP, and Azure with cost awareness built in.",
    tags: ["AWS", "GCP", "IaC", "Scalability"],
    heroLabel: "Platform Foundations",
    heroDescription:
      "We architect cloud platforms that scale without becoming fragile, expensive, or impossible to reason about.",
    metrics: [
      { value: "Multi-region", label: "Resilience patterns" },
      { value: "30%", label: "Typical cost cleanup" },
      { value: "24/7", label: "Operational visibility" },
    ],
    overview: [
      "Most cloud stacks drift into complexity long before they reach maturity. We simplify infrastructure around reliability, observability, and sustainable velocity.",
      "The result is a platform your team can actually ship on: predictable deployments, clearer cost signals, and fewer hidden failure modes.",
    ],
    highlights: ["reliability", "observability", "predictable deployments", "cost signals"],
    features: [
      { icon: Layers3, title: "Composable infrastructure", detail: "Infrastructure as code modules that let environments stay consistent as the product grows." },
      { icon: Settings2, title: "Operational guardrails", detail: "Policy, secrets, access boundaries, and backup strategies built in from the start." },
      { icon: Telescope, title: "Full-stack observability", detail: "Logs, metrics, tracing, and alerts connected to actual business and platform health." },
      { icon: Server, title: "Release-ready environments", detail: "Deployment paths for dev, staging, and production that reduce rollout anxiety and drift." },
    ],
    stack: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Cloudflare", "Grafana", "GitHub Actions"],
    process: [
      { title: "Audit the current state", detail: "We map the architecture, identify bottlenecks, and isolate the biggest reliability or cost risks." },
      { title: "Refactor the platform core", detail: "Networking, compute, deployment, and secrets management are reshaped into a cleaner backbone." },
      { title: "Instrument everything", detail: "Key system signals become visible so incidents can be understood quickly and fixed with confidence." },
      { title: "Operationalize the team", detail: "Runbooks, alarms, and deployment conventions make the platform easier to operate under pressure." },
    ],
    benefits: [
      { icon: Gauge, title: "Better performance under load", detail: "The platform scales more smoothly when traffic spikes or new workloads arrive." },
      { icon: TimerReset, title: "Faster incident recovery", detail: "Clear telemetry and automation reduce guesswork during outages and degraded states." },
      { icon: Globe, title: "Confident expansion", detail: "Launching into new regions, products, or enterprise requirements becomes far less risky." },
    ],
    ctaTitle: "Build a platform your team can trust",
    ctaText: "We can re-architect the cloud layer so engineering moves faster without carrying hidden operational debt.",
  },
  {
    slug: "devops-sre",
    icon: Server,
    title: "DevOps & SRE",
    description:
      "CI/CD, observability, on-call, and SRE playbooks that let teams ship with confidence.",
    tags: ["CI/CD", "Reliability", "Infra", "SRE"],
    heroLabel: "Delivery Systems",
    heroDescription:
      "We create delivery pipelines and operating practices that make shipping feel boring in the best possible way.",
    metrics: [
      { value: "Daily", label: "Safe deploy cadence" },
      { value: "Minutes", label: "Rollback response" },
      { value: "Lower", label: "On-call stress" },
    ],
    overview: [
      "Modern teams need delivery systems that are automated, observable, and resilient enough to keep pace with product ambition.",
      "We improve the mechanics of shipping so engineers spend less time fighting the pipeline and more time moving the roadmap forward.",
    ],
    highlights: ["automated", "observable", "resilient", "shipping"],
    features: [
      { icon: GitBranch, title: "High-confidence release flow", detail: "Smarter CI/CD paths with previews, checks, approvals, and rollback controls." },
      { icon: Workflow, title: "Operational playbooks", detail: "Codified response steps for incidents, scaling events, and service degradation." },
      { icon: Telescope, title: "Actionable alerting", detail: "Alerts tuned to real failure modes instead of noisy thresholds that burn attention." },
      { icon: Lock, title: "Secure delivery primitives", detail: "Secrets, environments, and permissions designed to reduce deployment risk." },
    ],
    stack: ["GitHub Actions", "Docker", "Kubernetes", "Terraform", "Prometheus", "Grafana", "Sentry", "PagerDuty"],
    process: [
      { title: "Unblock release friction", detail: "We identify the handoffs, flaky checks, and brittle steps slowing engineering down." },
      { title: "Stabilize the pipeline", detail: "Build, test, and deploy stages are simplified and hardened around repeatability." },
      { title: "Wire incident visibility", detail: "Meaningful signals, dashboards, and escalation paths are added across the stack." },
      { title: "Train the operating rhythm", detail: "Teams get practical runbooks and habits that keep systems healthy over time." },
    ],
    benefits: [
      { icon: Zap, title: "Shorter release cycles", detail: "Teams merge and ship more often because the path to production is trustworthy." },
      { icon: Shield, title: "Reduced operational risk", detail: "Safer defaults and clearer runbooks reduce the blast radius of mistakes." },
      { icon: Users, title: "Less engineer fatigue", detail: "On-call pressure drops when systems are visible, resilient, and better automated." },
    ],
    ctaTitle: "Make shipping a competitive advantage",
    ctaText: "We can tune your delivery stack so reliability and speed reinforce each other instead of competing.",
  },
  {
    slug: "web-mobile-apps",
    icon: Code2,
    title: "Web & Mobile Apps",
    description:
      "Product-grade apps on React, Next.js, Flutter, and Swift with obsessive UX polish.",
    tags: ["React", "Next.js", "Flutter", "UX"],
    heroLabel: "Product Experiences",
    heroDescription:
      "We build interfaces that feel crisp, fast, and unmistakably premium across web and mobile surfaces.",
    metrics: [
      { value: "Sub-2s", label: "Target interaction feel" },
      { value: "Responsive", label: "Across devices" },
      { value: "Design-system", label: "Ready" },
    ],
    overview: [
      "High-end software does not just work. It communicates clearly, responds instantly, and creates a sense of confidence every time a user touches it.",
      "We combine engineering rigor with product taste so the interface becomes part of the company's positioning, not just a delivery layer.",
    ],
    highlights: ["responds instantly", "engineering rigor", "product taste", "positioning"],
    features: [
      { icon: PanelsTopLeft, title: "Systems-first UI architecture", detail: "Reusable components, motion primitives, and patterns that scale across products and teams." },
      { icon: Monitor, title: "Cross-platform product flows", detail: "Journeys tuned for desktop, tablet, and mobile behavior instead of squeezed into one layout." },
      { icon: SwatchBook, title: "Premium interaction design", detail: "Thoughtful hierarchy, transitions, and tactile feedback that elevate the whole experience." },
      { icon: Gauge, title: "Performance-focused implementation", detail: "Animation, loading states, and rendering choices optimized for a polished feel." },
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Flutter", "Swift", "Storybook"],
    process: [
      { title: "Define the feel", detail: "We align on the emotional and product qualities the interface should communicate from the first screen." },
      { title: "Build the core journeys", detail: "Primary flows are designed and implemented together to keep motion and behavior tight." },
      { title: "Systematize the surface", detail: "Patterns and tokens are extracted so future screens ship faster and stay consistent." },
      { title: "Polish and optimize", detail: "Micro-interactions, responsiveness, and runtime performance are tuned before release." },
    ],
    benefits: [
      { icon: Sparkles, title: "Stronger first impression", detail: "The product feels premium immediately, which raises trust and perceived value." },
      { icon: BadgeCheck, title: "More consistent UX", detail: "Shared patterns reduce confusion and make the product easier to extend cleanly." },
      { icon: Rocket, title: "Faster future shipping", detail: "A strong UI foundation means new features are easier to build without regressions." },
    ],
    ctaTitle: "Create a product people feel in the first minute",
    ctaText: "We can shape the interface, motion system, and implementation details into something clients instantly trust.",
  },
  {
    slug: "cybersecurity",
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Threat modeling, pen-testing, Zero Trust, and SOC 2 or ISO 27001 preparation.",
    tags: ["Zero Trust", "SOC 2", "Audits", "Security"],
    heroLabel: "Security by Design",
    heroDescription:
      "We help teams raise their security posture without slowing product delivery to a crawl.",
    metrics: [
      { value: "Policy", label: "To controls mapping" },
      { value: "Reduced", label: "Attack surface" },
      { value: "Audit-ready", label: "Documentation" },
    ],
    overview: [
      "Security works best when it is woven into architecture, workflows, and decision making instead of layered on after something breaks.",
      "We focus on practical controls that reduce risk, support compliance, and keep teams moving quickly under real-world constraints.",
    ],
    highlights: ["architecture", "practical controls", "compliance", "real-world constraints"],
    features: [
      { icon: Fingerprint, title: "Identity and access strategy", detail: "Role design, access reviews, and trust boundaries shaped around how your team actually works." },
      { icon: Lock, title: "Application hardening", detail: "Threat modeling, secrets handling, and secure defaults for critical product surfaces." },
      { icon: NotebookTabs, title: "Audit preparation", detail: "Evidence paths, policy mapping, and implementation guidance for SOC 2 and related standards." },
      { icon: Telescope, title: "Continuous visibility", detail: "Monitoring and response hooks that make suspicious activity easier to spot and investigate." },
    ],
    stack: ["Threat modeling", "SSO/SAML", "Vault", "Audit logging", "Policy controls", "Pen testing", "Runbooks"],
    process: [
      { title: "Assess exposure", detail: "We review architecture, workflows, and controls to find the most meaningful gaps first." },
      { title: "Prioritize fixes", detail: "Risks are ranked by impact so the team focuses on what materially improves posture." },
      { title: "Implement guardrails", detail: "Controls, monitoring, and documentation are built into the platform and process." },
      { title: "Prove readiness", detail: "We help package the evidence and operating discipline clients, auditors, and partners expect." },
    ],
    benefits: [
      { icon: Shield, title: "Lower operational risk", detail: "Critical systems become harder to misuse, compromise, or expose accidentally." },
      { icon: CheckCircle2, title: "Enterprise-ready credibility", detail: "Buyers gain confidence when the product and team show mature security habits." },
      { icon: Users, title: "Aligned team behavior", detail: "Security expectations become easier to follow because the path is clearer and better tooled." },
    ],
    ctaTitle: "Strengthen trust before it becomes urgent",
    ctaText: "We can help you tighten the platform, prepare for buyer scrutiny, and make security a visible strength.",
  },
  {
    slug: "data-engineering",
    icon: Database,
    title: "Data Engineering",
    description:
      "Pipelines, lakes, warehouses, and feature stores that turn fragmented data into leverage.",
    tags: ["Snowflake", "dbt", "Kafka", "Analytics"],
    heroLabel: "Data Foundations",
    heroDescription:
      "We turn disconnected data systems into trustworthy pipelines that support analytics, AI, and sharper decisions.",
    metrics: [
      { value: "Unified", label: "Business context" },
      { value: "Reliable", label: "Pipeline health" },
      { value: "Faster", label: "Decision cycles" },
    ],
    overview: [
      "Teams struggle when reporting, product telemetry, and operational systems all tell different stories. We create a cleaner data backbone with clearer definitions and fewer surprises.",
      "That foundation supports analytics, experimentation, AI, and forecasting without requiring every decision to become a bespoke data project.",
    ],
    highlights: ["cleaner data backbone", "clearer definitions", "analytics", "forecasting"],
    features: [
      { icon: Layers3, title: "Pipeline design that survives growth", detail: "Batch and streaming patterns built for scale, observability, and evolution." },
      { icon: Binary, title: "Model-ready data layers", detail: "Feature stores and structured datasets that support machine learning and experimentation." },
      { icon: BarChart3, title: "Decision-grade analytics", detail: "Metrics layers and reporting patterns leaders can trust in weekly operating reviews." },
      { icon: Workflow, title: "Reliable transformation flow", detail: "Testing, lineage, and orchestration that reduce downstream breakage." },
    ],
    stack: ["Snowflake", "BigQuery", "dbt", "Kafka", "Airflow", "Dagster", "Python", "Looker"],
    process: [
      { title: "Map source systems", detail: "We trace where critical data lives, how it moves, and where trust breaks down today." },
      { title: "Design the canonical layer", detail: "Core entities, definitions, and transformation boundaries are cleaned up first." },
      { title: "Automate quality", detail: "Tests, monitoring, and lineage are added so issues are visible before they affect decisions." },
      { title: "Enable downstream teams", detail: "Analytics, product, and AI teams get cleaner interfaces and more reusable data assets." },
    ],
    benefits: [
      { icon: Gauge, title: "More dependable reporting", detail: "Leadership spends less time reconciling numbers and more time acting on them." },
      { icon: Brain, title: "AI-ready infrastructure", detail: "Data becomes easier to use for recommendation systems, assistants, and predictive workflows." },
      { icon: Rocket, title: "Faster experimentation", detail: "Teams can launch and measure new ideas with less manual wrangling." },
    ],
    ctaTitle: "Give your data stack a clear spine",
    ctaText: "We can modernize the flow from raw events to business insight so your data starts compounding instead of drifting.",
  },
  {
    slug: "design-systems",
    icon: Palette,
    title: "Design Systems",
    description:
      "Scalable multi-brand design systems with motion, accessibility, and clear documentation.",
    tags: ["Systems", "Motion", "A11y", "Scale"],
    heroLabel: "Design Infrastructure",
    heroDescription:
      "We create design systems that make premium interfaces repeatable across teams, products, and release cycles.",
    metrics: [
      { value: "Shared", label: "UI language" },
      { value: "Fewer", label: "Visual regressions" },
      { value: "Faster", label: "Feature assembly" },
    ],
    overview: [
      "A good design system is not a kit of components. It is a shared product language that helps designers and engineers move faster without making the experience generic.",
      "We shape tokens, patterns, and motion principles so the system supports scale while preserving brand character.",
    ],
    highlights: ["shared product language", "motion principles", "scale", "brand character"],
    features: [
      { icon: SwatchBook, title: "Tokenized visual foundation", detail: "Color, type, spacing, motion, and elevation choices translated into reusable system primitives." },
      { icon: PanelsTopLeft, title: "Composable components", detail: "Flexible building blocks that support product nuance without fragmenting the UI." },
      { icon: NotebookTabs, title: "Documentation teams use", detail: "Usage guidance, examples, and rationale that improve adoption across design and engineering." },
      { icon: Sparkles, title: "Motion language", detail: "Transitions and interaction patterns that give the product a recognizable, premium feel." },
    ],
    stack: ["Figma", "Storybook", "React", "Tailwind", "Tokens", "Accessibility testing", "Framer Motion"],
    process: [
      { title: "Audit the current surface", detail: "We identify repetition, inconsistency, and missing patterns across the product." },
      { title: "Define the primitives", detail: "Core tokens and components are created around real product needs, not abstract completeness." },
      { title: "Document and ship", detail: "Specs, code, and examples are aligned so the system is ready for immediate use." },
      { title: "Scale governance", detail: "Contribution rules and review habits keep the system coherent as teams grow." },
    ],
    benefits: [
      { icon: BadgeCheck, title: "More consistent brand expression", detail: "Products feel related, intentional, and polished across different surfaces." },
      { icon: Zap, title: "Faster UI development", detail: "Teams ship new screens using shared patterns instead of reinventing everything." },
      { icon: Users, title: "Better cross-team alignment", detail: "Design and engineering spend less time debating basics and more time solving product problems." },
    ],
    ctaTitle: "Build a system that keeps the polish intact",
    ctaText: "We can define the visual and interaction foundations that help every future feature feel more intentional.",
  },
  {
    slug: "product-strategy",
    icon: Boxes,
    title: "Product Strategy",
    description:
      "Research, positioning, pricing, and roadmaps that compound revenue per sprint.",
    tags: ["Research", "Positioning", "Roadmap", "Growth"],
    heroLabel: "Strategic Direction",
    heroDescription:
      "We help leadership teams decide what to build, why it matters, and how to sequence it for leverage.",
    metrics: [
      { value: "Sharper", label: "Roadmap focus" },
      { value: "Better", label: "Narrative clarity" },
      { value: "Higher", label: "Commercial signal" },
    ],
    overview: [
      "Strong execution still underperforms if the roadmap is diffuse or the market story is weak. We help teams focus on the choices that create momentum.",
      "That includes positioning, customer insight synthesis, packaging opportunities, and practical prioritization across engineering and go-to-market needs.",
    ],
    highlights: ["roadmap", "market story", "positioning", "prioritization"],
    features: [
      { icon: Telescope, title: "Opportunity mapping", detail: "Market, customer, and product signals synthesized into a clearer field of play." },
      { icon: Users, title: "Customer reality checks", detail: "Interviews, synthesis, and workflow analysis that sharpen what actually matters to buyers." },
      { icon: BarChart3, title: "Commercial prioritization", detail: "Roadmaps balanced around user value, technical effort, and revenue potential." },
      { icon: Rocket, title: "Launch narrative support", detail: "Feature packaging and positioning support so releases land with more force externally." },
    ],
    stack: ["Research synthesis", "Roadmapping", "Pricing inputs", "Product analytics", "GTM alignment", "Executive workshops"],
    process: [
      { title: "Clarify the ambition", detail: "We align leadership on the destination, constraints, and where leverage is most likely to emerge." },
      { title: "Pressure-test assumptions", detail: "Customer signal and product evidence are used to challenge weak beliefs early." },
      { title: "Sequence the roadmap", detail: "Initiatives are ordered around compounding effects instead of simple feature requests." },
      { title: "Equip the launch motion", detail: "The product story, internal alignment, and execution plan are tightened before release." },
    ],
    benefits: [
      { icon: Gauge, title: "Clearer roadmap decisions", detail: "Leadership can say no more confidently and keep teams focused on the work that matters most." },
      { icon: Sparkles, title: "Stronger market perception", detail: "The company sounds more coherent because the product story is more intentional." },
      { icon: Globe, title: "Better growth alignment", detail: "Engineering, product, and go-to-market teams work from the same strategic center of gravity." },
    ],
    ctaTitle: "Decide what deserves your next cycle",
    ctaText: "We can help sharpen the roadmap and story so the next release moves the business, not just the backlog.",
  },
];

export const featuredServices = services.slice(0, 6);

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug);
}
