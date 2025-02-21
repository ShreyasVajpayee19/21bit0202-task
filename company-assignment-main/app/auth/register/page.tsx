"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/app/config/config"; // If inside app/config

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      });
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-purple-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 to-purple-800 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative">
          <div className="text-3xl font-bold text-white tracking-tight">TaskFlow AI</div>
        </div>
        <div className="relative space-y-8">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Start Your Journey<br />With TaskFlow AI
          </h1>
          <p className="text-violet-200 text-xl leading-relaxed max-w-md">
            Join thousands of teams already using our platform to enhance their productivity.
          </p>
        </div>
        <div className="relative text-sm text-violet-200/80">
          © 2024 TaskFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px] space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-base text-gray-600">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"/>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-violet-50 via-pink-50 to-purple-50 text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link href="/auth/login" className="block w-full">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                >
                  Sign in instead
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}