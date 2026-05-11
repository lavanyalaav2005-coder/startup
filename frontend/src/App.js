import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";

import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import CursorGlow from "./components/CursorGlow";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Landing from "./pages/Landing";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.985, y: 16, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.01, y: -14, filter: "blur(10px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
        >
            {children}
        </motion.div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
                <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route
                    path="/app/client"
                    element={
                        <ProtectedRoute allow={["client"]}>
                            <PageTransition><ClientDashboard /></PageTransition>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/app/admin"
                    element={
                        <ProtectedRoute allow={["admin", "super_admin"]}>
                            <PageTransition><AdminDashboard /></PageTransition>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <div className="App relative min-h-screen">
                        <CursorGlow />
                        <Navbar />
                        <AnimatedRoutes />
                        <Footer />
                        <ChatbotWidget />
                    </div>
                    <Toaster
                        position="bottom-right"
                        theme="dark"
                        toastOptions={{
                            style: {
                                background: "rgba(10,10,10,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                                backdropFilter: "blur(20px)",
                            },
                        }}
                    />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}
