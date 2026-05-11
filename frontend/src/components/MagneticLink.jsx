import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function MagneticLink({
  to,
  href,
  className = "",
  children,
  strength = 16,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
    setOffset({ x, y });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const sharedProps = {
    className: `fc-magnetic inline-flex items-center justify-center ${className}`.trim(),
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onBlur: handleLeave,
    whileTap: reduceMotion ? undefined : { scale: 0.98 },
    animate: reduceMotion ? undefined : { x: offset.x, y: offset.y },
    transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.35 },
    ...props,
  };

  if (href) {
    return (
      <motion.a href={href} {...sharedProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink to={to} {...sharedProps}>
      {children}
    </MotionLink>
  );
}
