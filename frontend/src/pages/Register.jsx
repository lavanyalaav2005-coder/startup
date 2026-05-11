import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/brand/BrandLogo";

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
    });
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await register(form);
            toast.success("Welcome to FusionCircle.");
            nav(user.role === "client" ? "/app/client" : "/app/admin");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6" data-testid="register-page">
            <div className="absolute inset-0 fc-grid-bg opacity-30 -z-10" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="fc-trace-card w-full max-w-md border border-border bg-card rounded-3xl p-8 md:p-10"
            >
                <div className="mb-8">
                    <BrandLogo animated className="origin-left scale-[0.92]" />
                </div>

                <h1 className="font-[Outfit] text-3xl font-light tracking-tight">Get started.</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Create a client account. No credit card required.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-4" data-testid="register-form">
                    <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
                        <input
                            required
                            value={form.name}
                            onChange={set("name")}
                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                            data-testid="register-name"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={set("email")}
                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                            data-testid="register-email"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Company <span className="text-muted-foreground/70">(optional)</span></label>
                        <input
                            value={form.company}
                            onChange={set("company")}
                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                            data-testid="register-company"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                        <input
                            required
                            type="password"
                            minLength={6}
                            value={form.password}
                            onChange={set("password")}
                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                            data-testid="register-password"
                        />
                    </div>

                    <button disabled={loading} className="fc-btn-primary w-full inline-flex items-center justify-center gap-2" data-testid="register-submit">
                        {loading ? "Creating..." : "Create account"} <ArrowRight size={15} />
                    </button>
                </form>

                <p className="text-sm text-muted-foreground mt-8 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[var(--fc-accent)] hover:underline" data-testid="register-to-login">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
