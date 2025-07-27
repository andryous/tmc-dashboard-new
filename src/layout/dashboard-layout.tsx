// Import required components from React Router
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/layout/sidebar";

// Layout component that renders the sidebar and the dynamic page content
export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Page content on the right */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
