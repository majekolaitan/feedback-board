"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { LoginData } from "@/types";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async (credentials: LoginData) => {
    await login(credentials);
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to admin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="py-16">
        <LoginForm onLogin={handleLogin} />
      </main>
    </div>
  );
}
