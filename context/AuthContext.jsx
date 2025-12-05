"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Import auth from firebase config

const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading: user === undefined,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);