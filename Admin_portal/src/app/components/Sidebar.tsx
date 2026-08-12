import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Home,
  Users,
  Mail,
  Newspaper,
  Award,
  Link2,
  ChevronLeft,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { toast } from "sonner";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  gradient: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />,
    section: "OVERVIEW",
    gradient: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
  },
  {
    label: "All Tournaments",
    path: "/tournaments",
    icon: <Trophy size={20} />,
    section: "TOURNAMENTS",
    gradient: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
  },
  {
    label: "Rules",
    path: "/rules",
    icon: <FileText size={20} />,
    gradient: "linear-gradient(135deg, #c084fc 0%, #ec4899 100%)",
  },
  {
    label: "Homepage",
    path: "/homepage",
    icon: <Home size={20} />,
    section: "CONTENT",
    gradient: "linear-gradient(135deg, #4ade80 0%, #10b981 100%)",
  },
  {
    label: "About Us",
    path: "/about",
    icon: <Users size={20} />,
    gradient: "linear-gradient(135deg, #60a5fa 0%, #6366f1 100%)",
  },
  {
    label: "Services",
    path: "/services",
    icon: <Zap size={20} />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  },
  {
    label: "Contact",
    path: "/contact",
    icon: <Mail size={20} />,
    gradient: "linear-gradient(135deg, #f87171 0%, #fb7185 100%)",
  },
  {
    label: "News / Articles",
    path: "/articles",
    icon: <Newspaper size={20} />,
    gradient: "linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)",
  },
  {
    label: "Sponsors",
    path: "/sponsors",
    icon: <Award size={20} />,
    gradient: "linear-gradient(135deg, #fbbf24 0%, #eab308 100%)",
  },
  {
    label: "Footer & Social",
    path: "/footer-social",
    icon: <Link2 size={20} />,
    gradient: "linear-gradient(135deg, #a78bfa 0%, #a855f7 100%)",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-16" : "w-62",
      )}
    >
      {/* Header */}
      <div className="p-1 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-ktsa-primary to-ktsa-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-ktsa-primary/20">
          <Zap size={24} className="text-black" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent truncate">
              KTSA
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              Admin Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const showSection =
            item.section &&
            (index === 0 || navItems[index - 1]?.section !== item.section);

          return (
            <div key={item.path}>
              {showSection && !collapsed && (
                <div className="px-4 py-1 text-xs text-muted-foreground uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-1 mx-5 rounded-lg transition-all duration-200 relative group",
                  isActive
                    ? "bg-gradient-to-r from-ktsa-primary/10 to-ktsa-accent/10 text-ktsa-primary border border-ktsa-primary/30 shadow-md shadow-ktsa-primary/10"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:border-ktsa-accent/20 border border-transparent",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0 relative">
                  <span
                    className="absolute inset-0 rounded-lg blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-200"
                    style={{ background: item.gradient }}
                  />
                  <span
                    className={cn(
                      "relative block p-1.5 rounded-lg transition-all duration-200",
                      isActive && "shadow-lg scale-105",
                    )}
                    style={{
                      background: item.gradient,
                    }}
                  >
                    <span className="block text-black">{item.icon}</span>
                  </span>
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-0.5 border-t border-sidebar-border">
        <button
          onClick={onToggleCollapse}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg",
            "text-muted-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center",
          )}
        >
          <ChevronLeft
            size={20}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* User Section */}
      <div className="p-0.5 border-t border-sidebar-border bg-gradient-to-br from-ktsa-secondary/20 to-transparent">
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <div className="w-10 h-10 bg-gradient-to-br from-ktsa-primary to-ktsa-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-ktsa-primary/30">
            <span className="text-black font-bold">KA</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">KTSA Admin</p>
              <p className="text-xs text-muted-foreground truncate">
                admin@ktsaofficial.in
              </p>
            </div>
          )}
        </div>
        {!collapsed ? (
          <Button
            variant="ghost"
            className="w-full mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full mt-0.5 flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};
