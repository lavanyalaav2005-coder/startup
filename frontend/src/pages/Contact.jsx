import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";
import AuroraBackground from "../components/AuroraBackground";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/contact", form);
            setDone(true);
            toast.success("Message sent. We'll reply within one business day.");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <div data-testid="contact-page">
            <section className="relative pt-40 pb-20 overflow-hidden">
                <AuroraBackground intensity="low" />
                <div className="absolute inset-0 -z-10 fc-grid-bg opacity-30 fc-grid-fade" />
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-5"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)] mb-6">
                            ◆ Talk to us
                        </div>
                        <h1 className="font-[Outfit] text-5xl sm:text-6xl font-light tracking-tighter leading-[1.02]">
                            Let's get to
                            <br />
                            <span className="italic">building.</span>
                        </h1>
                        <p className="mt-8 text-muted-foreground leading-relaxed">
                            Drop us a line and we'll respond within one business day. For active
                            projects, <a href="/register" className="text-[var(--fc-accent)] underline-offset-4 hover:underline">create an account</a> and submit a request for
                            faster turnaround.
                        </p>

                        <div className="mt-12 space-y-5">
                            {[
                                { icon: Mail, l: "Email", v: "hello@fusioncircle.tech" },
                                { icon: Phone, l: "Phone", v: "+1 (415) 555-0188" },
                                { icon: MapPin, l: "HQ", v: "San Francisco · Distributed globally" },
                            ].map((row) => (
                                <div key={row.l} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--fc-accent-soft)] text-[var(--fc-accent)] flex items-center justify-center">
                                        <row.icon size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            {row.l}
                                        </div>
                                        <div className="text-sm mt-1">{row.v}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.form
                        onSubmit={submit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-7 fc-trace-card border border-border rounded-3xl p-8 md:p-10 bg-card space-y-5"
                        data-testid="contact-form"
                    >
                        {done ? (
                            <div className="py-14 text-center space-y-4">
                                <CheckCircle2 size={40} className="mx-auto text-[var(--fc-accent)]" />
                                <h3 className="font-[Outfit] text-2xl font-medium">Message sent</h3>
                                <p className="text-muted-foreground text-sm">
                                    We'll reply to your email within one business day.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setDone(false)}
                                    className="fc-btn-secondary text-sm"
                                >
                                    Send another
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={update("name")}
                                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                            data-testid="contact-name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={update("email")}
                                            className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                            data-testid="contact-email"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subject</label>
                                    <input
                                        required
                                        value={form.subject}
                                        onChange={update("subject")}
                                        className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                        data-testid="contact-subject"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={update("message")}
                                        className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)] resize-none"
                                        data-testid="contact-message"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="fc-btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                                    data-testid="contact-submit"
                                >
                                    {loading ? "Sending..." : "Send message"} <Send size={15} />
                                </button>
                            </>
                        )}
                    </motion.form>
                </div>
            </section>
        </div>
    );
}
