import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { api, formatApiError } from "../lib/api";

function sessionId() {
    const k = "fc-chat-session";
    let s = localStorage.getItem(k);
    if (!s) {
        s = crypto.randomUUID();
        localStorage.setItem(k, s);
    }
    return s;
}

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi, I'm Nova — FusionCircle's AI concierge. What are you building? I can recommend services or kick off a proposal in minutes.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const sid = useRef(sessionId());

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, open]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const text = input.trim();
        setMessages((m) => [...m, { role: "user", content: text }]);
        setInput("");
        setLoading(true);
        try {
            const { data } = await api.post("/chatbot/message", {
                session_id: sid.current,
                message: text,
            });
            setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        } catch (e) {
            setMessages((m) => [
                ...m,
                { role: "assistant", content: `⚠️ ${formatApiError(e)}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--fc-accent)] text-black flex items-center justify-center shadow-[0_10px_40px_var(--fc-glow)] fc-pulse hover:scale-105 transition-transform"
                aria-label="Open chatbot"
                data-testid="chatbot-toggle"
            >
                {open ? <X size={20} /> : <MessageCircle size={22} />}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ type: "spring", damping: 24 }}
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] fc-glass rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                        data-testid="chatbot-panel"
                    >
                        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--fc-accent)] flex items-center justify-center">
                                <Sparkles size={14} className="text-black" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">Nova</div>
                                <div className="text-xs text-muted-foreground">
                                    Online · AI concierge
                                </div>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                            data-testid="chatbot-messages"
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            m.role === "user"
                                                ? "bg-[var(--fc-accent)] text-black rounded-br-sm"
                                                : "bg-muted text-foreground rounded-bl-sm"
                                        }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.15,
                                                }}
                                                className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border p-3 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send()}
                                placeholder="Ask Nova anything..."
                                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--fc-accent)]"
                                data-testid="chatbot-input"
                            />
                            <button
                                onClick={send}
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 rounded-full bg-[var(--fc-accent)] text-black flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform"
                                data-testid="chatbot-send"
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
