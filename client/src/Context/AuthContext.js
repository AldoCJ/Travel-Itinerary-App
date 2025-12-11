import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // Load saved session on refresh
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [token]);

    const signIn = async (email, password) => {
        const res = await axios.post("/api/auth/signin", { email, password });

        setUser(res.data.user);
        setToken(res.data.access_token);

        // Persist token
        localStorage.setItem("token", res.data.access_token);

        // Attach to axios globally
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;

        return res.data;
    };

    const signUp = async (email, password, name) => {
        const res = await axios.post("/api/auth/signup", { email, password, name });
        return res.data; // frontend MUST then call signIn()
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}
