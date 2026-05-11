import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { formatApiError } from "../lib/api";
import BrandLogo from "../components/brand/BrandLogo";

export default function Login() {
    const { login, verifyOtp } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [otpPhase, setOtpPhase] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(email, password);
            if (res.otp) {
                setOtpPhase(true);
                toast.info("We sent a 6-digit code to your email.");
            } else {
                toast.success("Welcome back.");
                const to = res.user.role === "client" ? "/app/client" : "/app/admin";
                nav(loc.state?.from?.pathname || to);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await verifyOtp(email, code);
            toast.success("Verified. Welcome.");
            nav(user.role === "client" ? "/app/client" : "/app/admin");
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6" data-testid="login-page">
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

                <h1 className="font-[Outfit] text-3xl font-light tracking-tight">
                    {otpPhase ? "Verify your email" : "Welcome back."}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {otpPhase ? "Enter the 6-digit code we sent." : "Sign in to your client portal."}
                </p>

                {otpPhase ? (
                    <form onSubmit={submitOtp} className="mt-8 space-y-4">
                        <input
                            autoFocus
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="6-digit code"
                            className="w-full bg-muted rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                            data-testid="otp-input"
                        />
                        <button disabled={loading} className="fc-btn-primary w-full inline-flex items-center justify-center gap-2" data-testid="otp-submit">
                            {loading ? "Verifying..." : "Verify"} <ArrowRight size={15} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submit} className="mt-8 space-y-4" data-testid="login-form">
                        <div>
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                data-testid="login-email"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                data-testid="login-password"
                            />
                        </div>

                        <button disabled={loading} className="fc-btn-primary w-full inline-flex items-center justify-center gap-2" data-testid="login-submit">
                            {loading ? "Signing in..." : "Sign in"} <ArrowRight size={15} />
                        </button>
                    </form>
                )}

                <p className="text-sm text-muted-foreground mt-8 text-center">
                    New here?{" "}
                    <Link to="/register" className="text-[var(--fc-accent)] hover:underline" data-testid="login-to-register">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
