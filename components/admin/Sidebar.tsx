"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  BedDouble,
  Sparkles,
  Building2,
  CalendarCheck,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  User,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Amenities", href: "/admin/amenities", icon: Sparkles },
  { name: "Facilities", href: "/admin/facilities", icon: Building2 },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
    } catch {
      // Error handling is done in the logout function
      setShowLogoutDialog(false);
    }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-5 shrink-0 transition-colors",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="bg-card fixed top-4 left-4 z-50 flex size-10 items-center justify-center rounded-lg shadow-md lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="border-border flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="text-primary flex items-center gap-2">
            <Home className="size-7 shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-lg font-bold">SweetHomes</span>
            )}
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="hover:bg-accent flex size-8 items-center justify-center rounded-lg lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-border border-t p-3">
          {(!isCollapsed || isMobileOpen) && user && (
            <div className="bg-accent/50 mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-foreground truncate text-sm font-medium">
                  {user.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          {isCollapsed && !isMobileOpen && user && (
            <div className="mb-3 flex justify-center">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-medium">
                <User className="size-5" />
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isCollapsed && !isMobileOpen && "justify-center",
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="border-border bg-card hover:bg-accent absolute top-20 -right-3 hidden size-6 items-center justify-center rounded-full border shadow-sm transition-colors lg:flex"
        >
          <ChevronLeft
            className={cn(
              "size-4 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
      </aside>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={(open) => setShowLogoutDialog(open)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to log in again to access the admin dashboard."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
