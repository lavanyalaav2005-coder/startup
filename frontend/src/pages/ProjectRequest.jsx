import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";

const CATEGORIES = [
    "AI & ML",
    "Cloud Architecture",
    "Web Application",
    "Mobile Application",
    "Data Engineering",
    "DevOps & SRE",
    "Cybersecurity",
    "Product Design",
    "Other",
];

export default function ProjectRequestModal({ open, onClose, onCreated }) {
    const [form, setForm] = useState({
        title: "",
        category: "AI & ML",
        description: "",
        budget: "",
        timeline: "",
    });
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/projects", form);
            toast.success("Project submitted. Our team will respond shortly.");
            onCreated?.();
            onClose?.();
            setForm({ title: "", category: "AI & ML", description: "", budget: "", timeline: "" });
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                    data-testid="project-modal"
                >
                    <motion.form
                        onSubmit={submit}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fc-glass border border-border rounded-3xl p-8 md:p-10 w-full max-w-2xl space-y-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)] mb-2">
                                    ◆ New project
                                </div>
                                <h2 className="font-[Outfit] text-3xl font-light tracking-tight">
                                    Tell us what you're building.
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                                aria-label="Close"
                                data-testid="project-modal-close"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Project title</label>
                            <input
                                required
                                value={form.title}
                                onChange={set("title")}
                                placeholder="e.g. AI-powered inventory forecaster"
                                className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                data-testid="project-title"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                                <select
                                    value={form.category}
                                    onChange={set("category")}
                                    className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                    data-testid="project-category"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timeline</label>
                                <input
                                    value={form.timeline}
                                    onChange={set("timeline")}
                                    placeholder="e.g. 8-12 weeks"
                                    className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                    data-testid="project-timeline"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget <span className="text-muted-foreground/70">(optional)</span></label>
                            <input
                                value={form.budget}
                                onChange={set("budget")}
                                placeholder="e.g. $50k–$100k"
                                className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                data-testid="project-budget"
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Describe your project</label>
                            <textarea
                                required
                                rows={6}
                                value={form.description}
                                onChange={set("description")}
                                placeholder="Goals, constraints, and current state."
                                className="mt-2 w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)] resize-none"
                                data-testid="project-description"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="fc-btn-primary w-full inline-flex items-center justify-center gap-2"
                            data-testid="project-submit"
                        >
                            {loading ? "Submitting..." : "Submit project"} <ArrowRight size={15} />
                        </button>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
