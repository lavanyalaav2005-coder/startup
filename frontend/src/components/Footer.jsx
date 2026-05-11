import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import BrandLogo from "./brand/BrandLogo";

export default function Footer() {
    return (
        <footer className="relative mt-32 border-t border-border" data-testid="site-footer">
            <div className="max-w-7xl mx-auto px-6 py-16 md:px-10 grid grid-cols-2 gap-10 md:grid-cols-5">
                <div className="col-span-2">
                    <Link to="/" className="flex items-center gap-2">
                        <BrandLogo animated />
                    </Link>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Engineering ambitious software. We ship AI-native products, cloud platforms,
                        and brand-defining web experiences for the next generation of startups.
                    </p>
                    <div className="mt-6 flex gap-2">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                                aria-label="social"
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Product
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/services" className="hover:text-[var(--fc-accent)]">Services</Link></li>
                        <li><Link to="/about" className="hover:text-[var(--fc-accent)]">About</Link></li>
                        <li><Link to="/contact" className="hover:text-[var(--fc-accent)]">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Company
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li>Careers</li>
                        <li>Partners</li>
                        <li>Press</li>
                    </ul>
                </div>

                <div>
                    <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Legal
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li>Privacy</li>
                        <li>Terms</li>
                        <li>Security</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="max-w-7xl mx-auto flex flex-col justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
                    <div>&copy; {new Date().getFullYear()} FusionCircle Tech. All rights reserved.</div>
                    <div>Crafted with intention. Made globally.</div>
                </div>
            </div>
        </footer>
    );
}
