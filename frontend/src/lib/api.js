import axios from "axios";

function resolveBaseUrl() {
    const configured = process.env.REACT_APP_BACKEND_URL?.trim();
    if (configured) {
        return configured.replace(/\/+$/, "");
    }

    if (typeof window !== "undefined") {
        const { protocol, hostname, origin } = window.location;
        const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
        if (isLocalhost) {
            return `${protocol}//${hostname}:8000`;
        }
        return origin;
    }

    return "http://localhost:8000";
}

const BASE = resolveBaseUrl();

export const api = axios.create({
    baseURL: `${BASE}/api`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

export function formatApiError(err) {
    const d = err?.response?.data?.detail;
    if (!d) return err?.message || "Something went wrong.";
    if (typeof d === "string") return d;
    if (Array.isArray(d))
        return d
            .map((e) => (e?.msg ? e.msg : JSON.stringify(e)))
            .filter(Boolean)
            .join(" ");
    if (d?.msg) return d.msg;
    return String(d);
}
