import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./brand/BrandLogo";

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [loc.pathname]);

    const dashPath =
        user && user.role ? (user.role === "client" ? "/app/client" : "/app/admin") : null;

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
                scrolled ? "fc-glass" : "bg-transparent"
            }`}
            data-testid="site-navbar"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
                    <BrandLogo animated className="scale-[0.92] origin-left" />
                </Link>

                <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
                    {navLinks.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `px-4 py-2 text-sm rounded-full transition-all ${
                                    isActive
                                        ? "text-[var(--fc-accent)]"
                                        : "text-muted-foreground hover:text-foreground"
                                }`
                            }
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        className="w-9 h-9 rounded-full border border-border hover:bg-muted transition-colors flex items-center justify-center"
                        data-testid="theme-toggle"
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {user && typeof user === "object" ? (
                        <>
                            <button
                                onClick={() => nav(dashPath)}
                                className="hidden sm:inline-flex fc-btn-secondary text-sm py-2 px-4"
                                data-testid="nav-dashboard-btn"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => logout().then(() => nav("/"))}
                                className="w-9 h-9 rounded-full border border-border hover:bg-muted flex items-center justify-center"
                                aria-label="Logout"
                                data-testid="nav-logout-btn"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hidden sm:inline-flex text-sm px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                data-testid="nav-login-link"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="fc-btn-primary text-sm"
                                data-testid="nav-register-link"
                            >
                                Get started
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden w-9 h-9 rounded-full border border-border flex items-center justify-center"
                        aria-label="Menu"
                        data-testid="nav-mobile-toggle"
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </div>

            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden fc-glass border-t border-border"
                    data-testid="nav-mobile-panel"
                >
                    <div className="px-6 py-4 flex flex-col gap-2">
                        {navLinks.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="py-2 text-sm text-foreground"
                                data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                            >
                                {l.label}
                            </Link>
                        ))}
                        {user && typeof user === "object" && (
                            <Link to={dashPath} className="py-2 text-sm text-[var(--fc-accent)]">
                                Dashboard
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
