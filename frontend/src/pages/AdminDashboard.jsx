import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { Users, FolderKanban, Sparkles, Check, X, Loader2, Mail, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";

const COLORS = ["#00F0FF", "#4F46E5", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

const STATUSES = ["pending", "approved", "in_progress", "completed", "rejected"];

export default function AdminDashboard() {
    const [tab, setTab] = useState("overview");
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [flags, setFlags] = useState([]);
    const [selected, setSelected] = useState(null);
    const [proposal, setProposal] = useState(null);
    const [proposing, setProposing] = useState(false);

    const load = async () => {
        try {
            const [a, u, p, f] = await Promise.all([
                api.get("/admin/analytics"),
                api.get("/admin/users"),
                api.get("/projects"),
                api.get("/admin/feature-flags"),
            ]);
            setAnalytics(a.data);
            setUsers(u.data || []);
            setProjects(p.data || []);
            setFlags(f.data || []);
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    useEffect(() => {
        load();
    }, []);

    const updateStatus = async (id, status, note = null) => {
        try {
            const { data } = await api.patch(`/projects/${id}/status`, { status, admin_note: note });
            setProjects((ps) => ps.map((p) => (p.id === id ? data : p)));
            toast.success(`Project ${status}`);
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    const generateProposal = async (id) => {
        setProposing(true);
        try {
            const { data } = await api.post(`/chatbot/proposal/${id}`);
            setProposal(data.proposal);
            setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ai_proposal: data.proposal } : p)));
            toast.success("AI proposal generated");
        } catch (e) {
            toast.error(formatApiError(e));
        } finally {
            setProposing(false);
        }
    };

    const toggleFlag = async (key, enabled) => {
        try {
            await api.patch(`/admin/feature-flags/${key}`, { enabled });
            setFlags((fs) => fs.map((f) => (f.key === key ? { ...f, enabled } : f)));
            toast.success(`${key}: ${enabled ? "enabled" : "disabled"}`);
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    return (
        <div className="pt-28 pb-16 min-h-screen" data-testid="admin-dashboard">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        ◆ Admin Console
                    </div>
                    <h1 className="font-[Outfit] text-4xl sm:text-5xl font-light tracking-tighter">
                        Command center.
                    </h1>
                </motion.div>

                <div className="border-b border-border flex gap-1 mb-8 overflow-x-auto">
                    {[
                        { k: "overview", l: "Overview" },
                        { k: "projects", l: "Projects" },
                        { k: "users", l: "Users" },
                        { k: "flags", l: "Feature Flags" },
                    ].map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setTab(t.k)}
                            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors relative ${
                                tab === t.k
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                            data-testid={`admin-tab-${t.k}`}
                        >
                            {t.l}
                            {tab === t.k && (
                                <motion.div
                                    layoutId="admin-tab-underline"
                                    className="absolute inset-x-0 -bottom-px h-px bg-[var(--fc-accent)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {tab === "overview" && analytics && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { label: "Total users", v: analytics.total_users, icon: Users },
                                { label: "Clients", v: analytics.total_clients, icon: Users },
                                { label: "Projects", v: analytics.total_projects, icon: FolderKanban },
                                { label: "Contact msgs", v: analytics.contact_messages, icon: Mail },
                            ].map((k) => (
                                <div
                                    key={k.label}
                                    className="border border-border rounded-2xl p-6 bg-card"
                                    data-testid={`kpi-${k.label.toLowerCase().replace(" ", "-")}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            {k.label}
                                        </div>
                                        <k.icon size={15} className="text-[var(--fc-accent)]" />
                                    </div>
                                    <div className="font-[Outfit] text-4xl font-light">{k.v}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card">
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                    Projects over time
                                </div>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={analytics.timeline}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="date" stroke="#666" fontSize={11} />
                                        <YAxis stroke="#666" fontSize={11} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#0a0a0a",
                                                border: "1px solid #222",
                                                borderRadius: 8,
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#00F0FF"
                                            strokeWidth={2}
                                            dot={{ fill: "#00F0FF", r: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="border border-border rounded-2xl p-6 bg-card">
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                    By category
                                </div>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.by_category}
                                            dataKey="count"
                                            nameKey="category"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                        >
                                            {analytics.by_category.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: "#0a0a0a",
                                                border: "1px solid #222",
                                                borderRadius: 8,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="lg:col-span-3 border border-border rounded-2xl p-6 bg-card">
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                    Status distribution
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={STATUSES.map((s) => ({ name: s, count: analytics.by_status[s] || 0 }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={11} />
                                        <YAxis stroke="#666" fontSize={11} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#0a0a0a",
                                                border: "1px solid #222",
                                                borderRadius: 8,
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#00F0FF" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "projects" && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-3">
                            {projects.length === 0 ? (
                                <div className="border border-border rounded-2xl p-12 text-center text-muted-foreground bg-card">
                                    No projects yet.
                                </div>
                            ) : (
                                projects.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            setSelected(p);
                                            setProposal(p.ai_proposal);
                                        }}
                                        className={`border rounded-2xl p-5 bg-card cursor-pointer transition-colors ${
                                            selected?.id === p.id
                                                ? "border-[var(--fc-accent)]"
                                                : "border-border hover:border-foreground/30"
                                        }`}
                                        data-testid={`admin-project-${p.id}`}
                                    >
                                        <div className="flex justify-between gap-4 flex-wrap">
                                            <div className="min-w-0">
                                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                    {p.category} · {p.client_name}
                                                </div>
                                                <div className="font-[Outfit] text-lg font-medium mt-1">
                                                    {p.title}
                                                </div>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full border ${
                                                p.status === "approved" || p.status === "completed"
                                                    ? "border-emerald-500/40 text-emerald-500"
                                                    : p.status === "rejected"
                                                    ? "border-rose-500/40 text-rose-500"
                                                    : "border-[var(--fc-accent)]/40 text-[var(--fc-accent)]"
                                            }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                            {p.description}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border border-border rounded-2xl p-6 bg-card lg:sticky lg:top-28 self-start">
                            {!selected ? (
                                <div className="text-center py-16 text-sm text-muted-foreground">
                                    <Sparkles size={22} className="mx-auto mb-3 opacity-40" />
                                    Select a project to manage.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            {selected.category}
                                        </div>
                                        <div className="font-[Outfit] text-xl font-medium mt-1">
                                            {selected.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {selected.client_name} · {selected.client_email}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto">
                                        {selected.description}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => updateStatus(selected.id, "approved")}
                                            className="border border-emerald-500/30 text-emerald-500 rounded-xl py-2 text-sm inline-flex items-center justify-center gap-1 hover:bg-emerald-500/10"
                                            data-testid="project-approve"
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selected.id, "rejected")}
                                            className="border border-rose-500/30 text-rose-500 rounded-xl py-2 text-sm inline-flex items-center justify-center gap-1 hover:bg-rose-500/10"
                                            data-testid="project-reject"
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selected.id, "in_progress")}
                                            className="border border-blue-500/30 text-blue-500 rounded-xl py-2 text-sm inline-flex items-center justify-center gap-1 hover:bg-blue-500/10"
                                            data-testid="project-in-progress"
                                        >
                                            <Loader2 size={14} /> In progress
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selected.id, "completed")}
                                            className="border border-emerald-500/30 text-emerald-500 rounded-xl py-2 text-sm inline-flex items-center justify-center gap-1 hover:bg-emerald-500/10"
                                            data-testid="project-complete"
                                        >
                                            <Check size={14} /> Complete
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => generateProposal(selected.id)}
                                        disabled={proposing}
                                        className="fc-btn-primary w-full inline-flex items-center justify-center gap-2"
                                        data-testid="generate-proposal"
                                    >
                                        <Wand2 size={15} />
                                        {proposing ? "Generating..." : "AI Proposal"}
                                    </button>

                                    {proposal && (
                                        <div className="border-t border-border pt-4">
                                            <div className="text-xs uppercase tracking-[0.2em] text-[var(--fc-accent)] mb-2">
                                                AI Proposal
                                            </div>
                                            <div className="text-xs text-muted-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
                                                {proposal}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === "users" && (
                    <div className="border border-border rounded-2xl bg-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Company</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} data-testid={`user-row-${u.id}`}>
                                        <td className="px-6 py-4 font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs px-2 py-1 rounded-full border border-border">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{u.company || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "flags" && (
                    <div className="space-y-3">
                        {flags.map((f) => (
                            <div
                                key={f.key}
                                className="border border-border rounded-2xl p-6 bg-card flex items-center justify-between gap-4"
                                data-testid={`flag-${f.key}`}
                            >
                                <div>
                                    <div className="font-[Outfit] font-medium">{f.key}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{f.description}</div>
                                </div>
                                <button
                                    onClick={() => toggleFlag(f.key, !f.enabled)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${
                                        f.enabled ? "bg-[var(--fc-accent)]" : "bg-muted border border-border"
                                    }`}
                                    data-testid={`flag-toggle-${f.key}`}
                                >
                                    <motion.div
                                        animate={{ x: f.enabled ? 26 : 2 }}
                                        className="absolute top-1 w-6 h-6 rounded-full bg-background shadow"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
