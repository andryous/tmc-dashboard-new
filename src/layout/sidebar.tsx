// File: src/components/ui/sidebar.tsx

import { Link, useNavigate } from "react-router-dom";
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
    <aside className="w-52 p-4 h-screen flex flex-col justify-between shadow-md text-[#5e5b5b]">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-4">
          <img src={logo} alt="The Moving Company" className="h-30 w-auto" />
        </div>

        {/* Sidebar links */}
        <nav className="space-y-2">
          <SidebarLink
            to="/statistics"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarLink to="/orders" icon={ClipboardList} label="Orders" />
          <SidebarLink to="/customers" icon={Users} label="Customers" />
          <SidebarLink to="/consultants" icon={Briefcase} label="Consultants" />
          <SidebarLink to="/my-orders" icon={Folder} label="My Orders" />
          <SidebarLink to="/upcoming-orders" icon={Clock} label="Upcoming" />
          <SidebarLink
            to="/completed-orders"
            icon={CheckCircle}
            label="Completed"
          />
          <SidebarLink
            to="/pending-actions"
            icon={AlertTriangle}
            label="Pending Actions"
          />

          <SidebarLink to="/settings" icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* Welcome + Logout */}
      <Card className="bg-muted border border-blue-200 shadow-sm">
        <CardContent className="p-2 px-3">
          <p className="text-base text-inherit mb-1">
            Welcome <strong>John</strong>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-inherit hover:text-blue-600"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
