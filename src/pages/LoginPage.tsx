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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("tmc_logged_in_consultant");
    if (user) {
      navigate("/statistics");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/persons/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        toast.success("Welcome back, " + user.firstName + "!");
        localStorage.setItem("tmc_logged_in_consultant", user.firstName);
        navigate("/statistics");
      } else {
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
        {/* We wrap the content in a <form> tag and use its onSubmit event */}
        <form onSubmit={handleLogin}>
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
                required // Added for better form validation
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
                required // Added for better form validation
              />
            </div>

            {/* The button now submits the form */}
            <Button
              type="submit" // Changed from default to "submit"
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
