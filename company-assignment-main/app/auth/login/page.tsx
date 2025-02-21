"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/app/config/config";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      toast({ title: "Success", description: "Logged in successfully" });
      router.push("/dashboard");
    } catch (error) {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-full max-w-md p-8 bg-gray-800 bg-opacity-40 shadow-xl backdrop-blur-lg rounded-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-6">Log in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              required 
              className="h-12 bg-gray-700 text-white border-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="h-12 bg-gray-700 text-white border-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-transform transform hover:scale-105 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Continue"}
          </Button>
        </form>
        
        <div className="text-center text-gray-400 mt-4">
          <Link href="/auth/forgot-password" className="hover:text-indigo-400">Forgot password?</Link>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-400">Don’t have an account?</p>
          <Link href="/auth/register">
            <Button 
              type="button" 
              className="w-full mt-2 h-12 text-lg font-semibold border border-gray-500 hover:bg-gray-700 text-gray-300 rounded-lg"
            >
              Sign up now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
