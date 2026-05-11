import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, formatApiError } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null = loading, false = anon, object = authed
    const [error, setError] = useState("");

    const bootstrap = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
        } catch {
            setUser(false);
        }
    }, []);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = async (email, password) => {
        setError("");
        try {
            const { data } = await api.post("/auth/login", { email, password });
            if (data.otp_required) return { otp: true, email: data.email };
            setUser(data.user);
            return { otp: false, user: data.user };
        } catch (e) {
            const msg = formatApiError(e);
            setError(msg);
            throw new Error(msg);
        }
    };

    const verifyOtp = async (email, code) => {
        setError("");
        const { data } = await api.post("/auth/verify-otp", { email, code });
        setUser(data.user);
        return data.user;
    };

    const register = async (payload) => {
        setError("");
        try {
            const { data } = await api.post("/auth/register", payload);
            setUser(data.user);
            return data.user;
        } catch (e) {
            const msg = formatApiError(e);
            setError(msg);
            throw new Error(msg);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(false);
        }
    };

    return (
        <AuthCtx.Provider value={{ user, error, login, register, logout, verifyOtp, refreshMe: bootstrap }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);
