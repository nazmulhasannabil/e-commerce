"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@heroui/react";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user]);

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <section className="w-full md:max-w-md space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold">Online <span className="text-orange-500">Shop</span></h1>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mt-4 flex flex-col gap-2">
                    <p className="text-center text-lg sm:text-xl font-semibold">Login to your account</p>
                 
                    <form className="space-y-5">
                        <div>
                            <label className="block text-base sm:text-lg mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base sm:text-lg mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                          Login
                        </button>
                    </form>
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                        <Link href="/register" className="text-sm text-blue-500 hover:underline text-center sm:text-left">
                            Don&apos;t have an account? Register
                        </Link>
                        <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline text-center sm:text-right">
                            Forgot Password?
                        </Link>
                    </div>
                    <hr />
                    <SignInWithGoogle />
                </div>
            </section>
        </main>
    );
}

function SignInWithGoogle() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");
            await signInWithPopup(auth, new GoogleAuthProvider());
            setMessage("Logged in successfully!");
            // Redirect to home page after successful login
            router.push("/");
        } catch (err) {
            setError(err?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <Button
                onPress={handleLogin}
                disabled={loading}
                className="w-full px-4 py-2 border border-orange-500 hover:bg-orange-500 hover:text-white text-gray-900 rounded transition-colors duration-300 ease-in-out disabled:opacity-50"
            >
                Login With Google
            </Button>
        </div>
    )
};