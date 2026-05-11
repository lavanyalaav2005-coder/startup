import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children, allow }) {
    const { user } = useAuth();
    const loc = useLocation();

    if (user === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-[var(--fc-accent)] border-t-transparent"
                />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

    if (allow && !allow.includes(user.role)) {
        return <Navigate to={user.role === "client" ? "/app/client" : "/app/admin"} replace />;
    }

    return children;
}
