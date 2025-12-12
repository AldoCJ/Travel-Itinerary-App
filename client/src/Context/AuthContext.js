import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from '../api/axiosInstance';

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
        const response = await api.post("/auth/signin", { email, password });

        if (!response.data.access_token || !response.data.user) {
            throw new Error("Login failed: no user info or token returned.");
        }

        // Return both token and user info
        return {
            token: response.data.access_token,
            user: response.data.user
        };
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
