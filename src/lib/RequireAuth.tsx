// File: src/lib/RequireAuth.tsx
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("tmc_logged_in_consultant");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
}
