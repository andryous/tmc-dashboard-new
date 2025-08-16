// File: src/layout/sidebar.tsx

import { Link, useLocation, useNavigate } from "react-router-dom"; // ADDED: useLocation
import logo from "@/assets/logo-small.png";
import {
  LayoutDashboard,
  ClipboardList,
  Folder,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tmc_logged_in_consultant");
    navigate("/login");
  };

  return (
    <aside className="w-56 p-4 h-screen flex flex-col justify-between shadow-md text-gray-700">
      <div>
        <div className="flex items-center space-x-2 p-2 mb-4">
          <img src={logo} alt="The Moving Company" className="h-auto w-full" />
        </div>

        {/* --- Sidebar links --- */}
        <nav className="space-y-1">
          {/* Functional Links */}
          <SidebarLink
            to="/statistics"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarLink to="/orders" icon={ClipboardList} label="Orders" />
          <SidebarLink to="/customers" icon={Users} label="Customers" />
          <SidebarLink to="/consultants" icon={Briefcase} label="Consultants" />

          {/* Separator for clarity */}
          <hr className="my-3" />

          {/* ADDED: Disabled links for future demonstration */}
          <SidebarLink to="#" icon={Folder} label="My Orders" disabled />
          <SidebarLink to="#" icon={Clock} label="Upcoming" disabled />
          <SidebarLink to="#" icon={CheckCircle} label="Completed" disabled />
          <SidebarLink
            to="#"
            icon={AlertTriangle}
            label="Pending Actions"
            disabled
          />

          <hr className="my-3" />

          {/* Settings Link */}
          <SidebarLink to="/settings" icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* --- Welcome + Logout --- */}
      <Card className="bg-gray-50 border border-gray-200 shadow-sm">
        <CardContent className="p-3">
          <p className="text-sm text-gray-800 mb-1">
            Welcome, <strong>John</strong>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-2 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}

// --- SidebarLink Sub-Component ---
// CHANGED: This component is now aware of the active page and disabled state.
function SidebarLink({
  to,
  icon: Icon,
  label,
  disabled = false, // ADDED: disabled prop
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
}) {
  const location = useLocation();
  // Check if the current URL matches the link's destination
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        // Base styles
        "text-gray-700",
        // Hover styles (only if not active and not disabled)
        !isActive && !disabled && "hover:bg-blue-100 hover:text-blue-700",
        // Active styles
        isActive && "bg-blue-600 text-white",
        // Disabled styles
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5",
          // Active icon is white, otherwise it's blue
          isActive ? "text-white" : "text-blue-600"
        )}
      />
      {label}
    </Link>
  );
}
