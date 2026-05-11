import { motion } from "framer-motion";

const brands = [
    {
        name: "LuxWorks",
        description: "Gold diamond",
        accentClass: "fc-trusted-brand-lux",
        icon: (
            <svg width="36" height="36" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <rect
                    x="12"
                    y="12"
                    width="28"
                    height="28"
                    rx="3"
                    transform="rotate(45 26 26)"
                    stroke="currentColor"
                    strokeWidth="1.3"
                />
                <rect
                    x="18"
                    y="18"
                    width="16"
                    height="16"
                    rx="2"
                    transform="rotate(45 26 26)"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    opacity="0.35"
                />
                <line x1="18" y1="22" x2="18" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="18" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="28" y1="22" x2="34" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="28" y1="30" x2="34" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "NebulaGrid",
        description: "Teal grid squares",
        accentClass: "fc-trusted-brand-cyan",
        icon: (
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="26" y="2" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
                <rect x="2" y="26" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
                <rect x="26" y="26" width="16" height="16" rx="2.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="22" cy="22" r="2.2" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "Octavio",
        description: "Violet octagon",
        accentClass: "fc-trusted-brand-violet",
        icon: (
            <svg width="36" height="36" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <polygon
                    points="26,4 42,10 48,26 42,42 26,48 10,42 4,26 10,10"
                    stroke="currentColor"
                    strokeWidth="1.3"
                />
                <polygon
                    points="26,12 37,16 41,27 37,38 26,42 15,38 11,27 15,16"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    opacity="0.35"
                />
                <circle cx="26" cy="26" r="3" fill="currentColor" />
                <circle cx="26" cy="26" r="6" fill="currentColor" fillOpacity="0.1" />
            </svg>
        ),
    },
    {
        name: "Lumen AI",
        description: "Teal hexagon beam",
        accentClass: "fc-trusted-brand-cyan",
        icon: (
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                <polygon
                    points="21,3 37,12 37,30 21,39 5,30 5,12"
                    stroke="currentColor"
                    strokeWidth="1.3"
                />
                <polygon
                    points="21,9 32,27 10,27"
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="0.9"
                />
                <circle cx="21" cy="21" r="2.5" fill="currentColor" />
                <line x1="21" y1="9" x2="21" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Kern Labs",
        description: "Teal atom orbital",
        accentClass: "fc-trusted-brand-cyan",
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <ellipse cx="24" cy="24" rx="20" ry="8" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
                <ellipse
                    cx="24"
                    cy="24"
                    rx="20"
                    ry="8"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    opacity="0.5"
                    transform="rotate(60 24 24)"
                />
                <ellipse
                    cx="24"
                    cy="24"
                    rx="20"
                    ry="8"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    opacity="0.5"
                    transform="rotate(120 24 24)"
                />
                <circle cx="24" cy="24" r="3.2" fill="currentColor" />
                <circle cx="44" cy="24" r="1.8" fill="currentColor" opacity="0.55" />
            </svg>
        ),
    },
    {
        name: "Harborline",
        description: "Navigation anchor",
        accentClass: "fc-trusted-brand-frost",
        icon: (
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <circle cx="22" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="22" cy="14" r="2" fill="currentColor" />
                <line x1="22" y1="19.5" x2="22" y2="33" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="11" y1="33" x2="33" y2="33" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="11" y1="33" x2="15" y2="27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="33" y1="33" x2="29" y2="27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
        ),
    },
];

const track = [...brands, ...brands];

export default function TrustedTeamsTicker() {
    return (
        <section className="border-b border-border py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <div className="fc-trusted-shell" data-testid="trusted-teams-ticker">
                    <div className="fc-trusted-label">Trusted by pioneering teams</div>
                    <div className="fc-trusted-outer" aria-label="Trusted by pioneering teams">
                        <motion.div
                            className="fc-trusted-track"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                duration: 22,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            {track.map((brand, index) => (
                                <div
                                    className="fc-trusted-brand"
                                    key={`${brand.name}-${index}`}
                                    aria-label={`${brand.name} ${brand.description}`}
                                    title={`${brand.name} - ${brand.description}`}
                                >
                                    <div className={`fc-trusted-icon ${brand.accentClass}`}>{brand.icon}</div>
                                    <div className="fc-trusted-copy">
                                        <span className="fc-trusted-name">{brand.name}</span>
                                        <span className="fc-trusted-meta">{brand.description}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
