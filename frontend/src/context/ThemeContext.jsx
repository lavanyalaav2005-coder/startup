import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "dark";
        return localStorage.getItem("fc-theme") || "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
        localStorage.setItem("fc-theme", theme);
    }, [theme]);

    const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
            {children}
        </ThemeCtx.Provider>
    );
}

export const useTheme = () => useContext(ThemeCtx);
