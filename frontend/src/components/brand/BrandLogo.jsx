import { useId } from "react";

function joinClasses(...parts) {
    return parts.filter(Boolean).join(" ");
}

function BrandMark({ className = "", framed = true, glow = true }) {
    const id = useId().replace(/:/g, "");
    const orbitId = `${id}-orbit`;
    const coreId = `${id}-core`;
    const auraId = `${id}-aura`;
    const blurId = `${id}-blur`;

    return (
        <svg
            viewBox="0 0 96 96"
            fill="none"
            aria-hidden="true"
            className={joinClasses("fc-brand-mark", glow ? "fc-brand-mark-glow" : "", className)}
        >
            <defs>
                <linearGradient id={orbitId} x1="18" y1="16" x2="78" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#67E8F9" />
                    <stop offset="0.52" stopColor="#2563FF" />
                    <stop offset="1" stopColor="#7CF2C8" />
                </linearGradient>
                <linearGradient id={coreId} x1="26" y1="18" x2="76" y2="86" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" stopOpacity="0.96" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.24" />
                </linearGradient>
                <radialGradient id={auraId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 48) rotate(90) scale(36)">
                    <stop stopColor="#2563FF" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#2563FF" stopOpacity="0" />
                </radialGradient>
                <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="7" />
                </filter>
            </defs>

            {framed ? (
                <>
                    <rect x="8" y="8" width="80" height="80" rx="24" fill={`url(#${auraId})`} />
                    <rect
                        x="10"
                        y="10"
                        width="76"
                        height="76"
                        rx="22"
                        fill="#060A12"
                        fillOpacity="0.92"
                        stroke="#FFFFFF"
                        strokeOpacity="0.12"
                    />
                </>
            ) : null}

            <circle cx="48" cy="48" r="25" stroke={`url(#${orbitId})`} strokeWidth="5.5" strokeLinecap="round" strokeDasharray="112 44" transform="rotate(-42 48 48)" />
            <circle cx="48" cy="48" r="17.5" stroke={`url(#${orbitId})`} strokeOpacity="0.42" strokeWidth="2" strokeDasharray="42 22" transform="rotate(20 48 48)" />
            <circle cx="48" cy="48" r="10" fill={`url(#${auraId})`} filter={`url(#${blurId})`} opacity="0.85" />
            <circle cx="68" cy="28" r="3.5" fill="#67E8F9" />
            <circle cx="31" cy="66" r="3" fill="#7CF2C8" />

            <path
                d="M34 30.5H55.5M34 46.75H50.5M34 30.5V65.5"
                stroke={`url(#${coreId})`}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M61.5 31.5C56.8 28.8 52.1 28 48.6 28C37.7 28 29 36.9 29 48C29 59.1 37.7 68 48.6 68C52.2 68 57 67.1 61.5 64.4"
                stroke={`url(#${coreId})`}
                strokeWidth="5.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function BrandWordmark({ stacked = false, className = "" }) {
    return (
        <span className={joinClasses("fc-brand-wordmark", stacked ? "fc-brand-wordmark-stacked" : "", className)}>
            <span className="fc-brand-wordmark-main">FusionCircle</span>
            <span className="fc-brand-wordmark-sub">Tech</span>
        </span>
    );
}

export default function BrandLogo({
    variant = "lockup",
    className = "",
    markClassName = "",
    wordmarkClassName = "",
    framed = true,
    animated = false,
}) {
    const wrapClassName = joinClasses(
        "fc-brand-lockup",
        animated ? "fc-brand-animated" : "",
        variant === "stacked" ? "fc-brand-lockup-stacked" : "",
        className
    );

    if (variant === "mark") {
        return <BrandMark className={markClassName} framed={framed} glow={animated} />;
    }

    if (variant === "wordmark") {
        return <BrandWordmark className={joinClasses(wordmarkClassName, className)} />;
    }

    return (
        <span className={wrapClassName}>
            <BrandMark className={joinClasses("fc-brand-lockup-mark", markClassName)} framed={framed} glow={animated} />
            <BrandWordmark stacked={variant === "stacked"} className={wordmarkClassName} />
        </span>
    );
}
