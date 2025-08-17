// File: src/pages/LoginPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to dashboard if already logged in from a previous session
  useEffect(() => {
    const user = localStorage.getItem("tmc_logged_in_consultant");
    if (user) {
      navigate("/statistics");
    }
  }, [navigate]);

  /**
   * --- FAKE LOGIN IMPLEMENTATION ---
   * This function now performs a simple, hardcoded check.
   * It does NOT contact the backend. This guarantees access for the demo.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // The hardcoded credentials for the fake login
    const FAKE_EMAIL = "john@tmc.no";
    const FAKE_PASSWORD = "demo123";

    if (email === FAKE_EMAIL && password === FAKE_PASSWORD) {
      // If credentials match, show success and navigate to the dashboard
      toast.success("Welcome back, John!");
      localStorage.setItem("tmc_logged_in_consultant", "John");
      navigate("/statistics");
    } else {
      // If they don't match, show an error
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted">
      <img
        src="/logo_tmc_landing.png"
        alt="The Moving Company"
        className="w-80 mb-6"
      />
      <Card className="w-full max-w-sm bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center">Consultant Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-blue-500 focus-visible:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-blue-500 focus-visible:ring-blue-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
