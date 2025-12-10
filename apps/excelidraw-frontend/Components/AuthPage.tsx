"use client";

import { useState } from "react";
import { authAPI } from "@/utlis/api";
import { tokenStorage } from "@/utlis/auth";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: {
    isSignin: boolean
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isSignin) {  
                const response = await authAPI.SignIn({
                    username: email,
                    password: password,
                });

                if (response.token) {
                    tokenStorage.set(response.token);
                    router.push('/dashboard'); 
                } else {
                    setError(response.message || "Sign in failed");
                }
            } else {
                // Sign Up
                const response = await authAPI.SignUp({
                    username: email,
                    password: password,
                    name: name,
                });

                if (response.userId) {
                    // Auto sign in after signup
                    const signInResponse = await authAPI.SignIn({
                        username: email,
                        password: password,
                    });
                    
                    if (signInResponse.token) {
                        tokenStorage.set(signInResponse.token);
                        router.push('/dashboard');
                    }
                } else {
                    setError(response.message || "Sign up failed");
                }
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="w-full max-w-md p-8 m-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isSignin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-600">
                        {isSignin ? "Sign in to continue your journey" : "Sign up to get started"}
                    </p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isSignin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input 
                                id="name"
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required={!isSignin}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 placeholder:text-gray-400"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 placeholder:text-gray-400"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 placeholder:text-gray-400"
                        />
                        {isSignin && (
                            <div className="mt-2 text-right">
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Processing..." : (isSignin ? "Sign In" : "Sign Up")}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <a 
                            href={isSignin ? "/signup" : "/signin"} 
                            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition duration-200"
                        >
                            {isSignin ? "Sign Up" : "Sign In"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}