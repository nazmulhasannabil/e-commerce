"use client";
import { useRouter } from "next/navigation";
import AuthContextProvider, { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";

export default function Layout({ children }) {
    return (
        <AuthContextProvider>
            <AdminChecking>{children}</AdminChecking>
        </AuthContextProvider>
        
    )
}

function AdminChecking({ children }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading]);

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">
        <div className="spinner border-b-2 border-t-2 border-orange-500"></div>
    </div>;
    return (
        <AdminLayout>{children}</AdminLayout>
    )
}
