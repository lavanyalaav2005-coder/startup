import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground({ id = "tsparticles" }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            if (mounted) setReady(true);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const options = {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        detectRetina: true,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true,
            },
            modes: {
                grab: { distance: 150, links: { opacity: 0.4 } },
            },
        },
        particles: {
            color: { value: "#00F0FF" },
            links: { color: "#00F0FF", distance: 140, enable: true, opacity: 0.15, width: 1 },
            move: {
                enable: true,
                speed: 0.6,
                direction: "none",
                outModes: { default: "out" },
                random: true,
            },
            number: { density: { enable: true, area: 900 }, value: 60 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2.5 } },
        },
    };

    if (!ready) return null;
    return <Particles id={id} options={options} className="absolute inset-0 -z-0" />;
}
