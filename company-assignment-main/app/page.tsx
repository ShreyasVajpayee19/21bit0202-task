"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">TaskFlow AI</h1>
          <p className="text-gray-600">
            Intelligent task management powered by AI
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            <Link href="/auth/login">
              <Button className="w-full" size="lg">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full" size="lg">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Features
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-4 rounded-lg bg-white/50 shadow-sm">
              <h3 className="font-medium">AI-Powered</h3>
              <p className="text-gray-600">Smart task suggestions</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 shadow-sm">
              <h3 className="font-medium">Real-time</h3>
              <p className="text-gray-600">Live updates</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 shadow-sm">
              <h3 className="font-medium">Collaborative</h3>
              <p className="text-gray-600">Team management</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 shadow-sm">
              <h3 className="font-medium">Secure</h3>
              <p className="text-gray-600">JWT authentication</p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}