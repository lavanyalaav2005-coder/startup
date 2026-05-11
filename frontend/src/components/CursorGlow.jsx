/**
 * CursorGlow — follows the user's cursor with a soft glowing halo.
 * Disabled on touch devices to save battery.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
    const [pos, setPos] = useState({ x: -200, y: -200 });
    const [visible, setVisible] = useState(false);
    const [touch, setTouch] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) {
            setTouch(true);
            return;
        }
        const onMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };
        const onLeave = () => setVisible(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    if (touch) return null;

    return (
        <motion.div
            aria-hidden
            className="fixed pointer-events-none z-[1] mix-blend-screen"
            animate={{
                x: pos.x - 220,
                y: pos.y - 220,
                opacity: visible ? 1 : 0,
            }}
            transition={{ type: "spring", damping: 24, stiffness: 180 }}
            style={{
                width: 440,
                height: 440,
                background:
                    "radial-gradient(circle, rgba(0,240,255,0.18) 0%, rgba(0,240,255,0.05) 35%, transparent 70%)",
            }}
        />
    );
}
