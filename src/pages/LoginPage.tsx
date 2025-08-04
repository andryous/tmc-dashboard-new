// File: src/pages/LoginPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  // Hooks must be called inside the component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const user = localStorage.getItem("tmc_logged_in_consultant");
    if (user) {
      navigate("/statistics");
    }
  }, [navigate]);

  // Send login request to backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/persons/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // form value, should match "john@tmc.no"
          password: password, // form value, must match "demo123"
        }),
      });

      if (response.ok) {
        const user = await response.json();

        // Show welcome toast before navigating
        toast.success("Welcome back, " + user.firstName + "!");

        // Save user in localStorage and navigate
        localStorage.setItem("tmc_logged_in_consultant", user.firstName);
        navigate("/statistics");
      } else {
        // Show error toast if login fails
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Server error. Please try again later.");
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
        <CardContent className="space-y-4">
          {/* Email input */}
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
            />
          </div>

          {/* Password input */}
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
            />
          </div>

          {/* Submit button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
