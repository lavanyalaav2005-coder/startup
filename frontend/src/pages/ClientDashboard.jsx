import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bell, Sparkles, Clock, CheckCircle2, XCircle, Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ProjectRequestModal from "./ProjectRequest";

const STATUS_META = {
    pending: { icon: Clock, color: "text-[var(--fc-accent)]", label: "Pending review" },
    approved: { icon: CheckCircle2, color: "text-emerald-500", label: "Approved" },
    in_progress: { icon: Loader2, color: "text-blue-500", label: "In progress" },
    completed: { icon: Rocket, color: "text-emerald-500", label: "Completed" },
    rejected: { icon: XCircle, color: "text-rose-500", label: "Rejected" },
};

export default function ClientDashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [notifs, setNotifs] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const [{ data: p }, { data: n }] = await Promise.all([
                api.get("/projects/mine"),
                api.get("/notifications/mine"),
            ]);
            setProjects(p || []);
            setNotifs(n || []);
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const unread = notifs.filter((n) => !n.read).length;

    const markAllRead = async () => {
        try {
            await api.post("/notifications/read-all");
            setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    const byStatus = projects.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="pt-28 pb-16 min-h-screen" data-testid="client-dashboard">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10"
                >
                    <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                            ◆ Client Portal
                        </div>
                        <h1 className="font-[Outfit] text-4xl sm:text-5xl font-light tracking-tighter">
                            Hello, <span className="italic">{user?.name?.split(" ")[0] || "there"}</span>.
                        </h1>
                    </div>
                    <button
                        onClick={() => setOpen(true)}
                        className="fc-btn-primary inline-flex items-center gap-2"
                        data-testid="new-project-btn"
                    >
                        <Plus size={16} /> New project
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total", value: projects.length },
                        { label: "Pending", value: byStatus.pending || 0 },
                        { label: "In progress", value: byStatus.in_progress || 0 },
                        { label: "Completed", value: byStatus.completed || 0 },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border border-border rounded-2xl p-6 bg-card"
                            data-testid={`stat-${s.label.toLowerCase().replace(" ", "-")}`}
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                {s.label}
                            </div>
                            <div className="font-[Outfit] text-4xl font-light mt-2">{s.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2">
                        <div className="flex items-end justify-between mb-4">
                            <h2 className="font-[Outfit] text-xl font-medium">Your projects</h2>
                            <div className="text-xs text-muted-foreground">{projects.length} total</div>
                        </div>
                        {loading ? (
                            <div className="border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm bg-card">
                                Loading projects…
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="border border-dashed border-border rounded-2xl p-12 text-center space-y-4 bg-card">
                                <Sparkles size={24} className="mx-auto text-[var(--fc-accent)]" />
                                <div>
                                    <div className="font-medium">No projects yet</div>
                                    <div className="text-sm text-muted-foreground">
                                        Submit a request to kick things off.
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="fc-btn-primary inline-flex items-center gap-2"
                                >
                                    <Plus size={15} /> New project
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {projects.map((p) => {
                                    const meta = STATUS_META[p.status] || STATUS_META.pending;
                                    const Icon = meta.icon;
                                    return (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="border border-border rounded-2xl p-5 bg-card hover:border-[var(--fc-accent)]/50 transition-colors"
                                            data-testid={`project-${p.id}`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                            {p.category}
                                                        </span>
                                                    </div>
                                                    <div className="font-[Outfit] text-lg font-medium mb-1">
                                                        {p.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                                        {p.description}
                                                    </div>
                                                    {p.admin_note && (
                                                        <div className="mt-3 text-xs text-muted-foreground italic border-l-2 border-[var(--fc-accent)] pl-3">
                                                            Note: {p.admin_note}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 text-xs ${meta.color} shrink-0`}>
                                                    <Icon size={14} />
                                                    {meta.label}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-end justify-between mb-4">
                            <h2 className="font-[Outfit] text-xl font-medium">Notifications</h2>
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-[var(--fc-accent)] hover:underline"
                                    data-testid="notif-mark-all-read"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="border border-border rounded-2xl bg-card">
                            {notifs.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    <Bell size={20} className="mx-auto mb-3 opacity-40" />
                                    No notifications yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {notifs.slice(0, 8).map((n) => (
                                        <div key={n.id} className="p-4 text-sm relative" data-testid={`notif-${n.id}`}>
                                            {!n.read && (
                                                <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-[var(--fc-accent)]" />
                                            )}
                                            <div className="font-medium">{n.title}</div>
                                            <div className="text-muted-foreground text-xs mt-1 leading-relaxed">
                                                {n.body}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <ProjectRequestModal open={open} onClose={() => setOpen(false)} onCreated={load} />
        </div>
    );
}
