/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result) {
        const userRef = collection(db, "users");
        const userQuery = query(userRef, where("uid", "==", result?.user?.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = { ...userDoc.data(), id: userDoc.id } as any;

          if (userData?.userType === "admin") {
            router.push("/admin");
          } else if (userData?.userType === "instructor") {
            router.push("/instructor");
          } else if (userData?.userType === "student") {
            router.push("/student");
          }
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen musical-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        {/* Logo */}
        <div className="login-logo flex justify-center">
          <img
            src="/logo.png"
            alt="Sernan's Music Clinic Logo"
            className="h-50 h-50"
          />
        </div>

        <CardHeader className="smc-login text-center">
          <CardTitle className="login-text text-2xl font-bold">
            Studio Management Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="login-text text-2xl font-bold justify-center "
          >
            <div className="login-card space-y-2 m-5 text-black">
              <Label htmlFor="email"></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="login-card space-y-2 m-5 text-black">
              <Label htmlFor="password"></Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center ">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full mx-auto justify-center"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
