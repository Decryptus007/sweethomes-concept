"use client";

import { useEffect, useState } from "react";
import { Home, User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import clsx from "clsx"; // Optional: use clsx for cleaner class toggling
import { usePathname, useRouter } from "next/navigation";
import { useUserAuth } from "@/hooks/useUserAuth";
import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10); // Adjust threshold as needed
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-profile-dropdown]')) {
        setIsProfileDropdownOpen(false);
      }
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    toast.success("Logged out successfully");
    router.push('/');
  };

  const handleDashboardClick = () => {
    setIsProfileDropdownOpen(false);
    router.push('/dashboard');
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav
        className={clsx(
          "fixed inset-x-0 top-0 z-20 h-fit py-4 text-white transition-all duration-300",
          scrolled
            ? "bg-black/70 shadow-md backdrop-blur-md"
            : "bg-black/50 bg-gradient-to-b from-black/60 to-black/30",
        )}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Home className="size-8" />
            <h1 className="text-2xl font-bold">SweetHomes</h1>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-lg absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className={clsx(
                "hover:text-gray-300 transition-colors",
                pathname === "/" && "underline underline-offset-4"
              )}
            >
              Home
            </Link>
            <Link
              href="/rooms"
              className={clsx(
                "hover:text-gray-300 transition-colors",
                pathname.startsWith("/rooms") && "underline underline-offset-4",
              )}
            >
              Rooms
            </Link>
          </div>

          {/* Desktop Authentication Section - Right */}
          <div className="hidden md:flex">
            {isAuthenticated && user ? (
              <div className="relative" data-profile-dropdown>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="bg-white/20 backdrop-blur-sm flex items-center justify-center size-8 rounded-full text-sm font-medium">
                    {getUserInitials(user.name)}
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-gray-900">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="size-4" />
                      My Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            data-mobile-menu-button
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-white/30 pt-4 bg-black/60 backdrop-blur-md rounded-b-lg mx-4 px-4 pb-4" data-mobile-menu>
            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className={clsx(
                    "block py-2 px-4 rounded-lg hover:bg-white/20 transition-colors",
                    pathname === "/" && "bg-white/20"
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/rooms"
                  className={clsx(
                    "block py-2 px-4 rounded-lg hover:bg-white/20 transition-colors",
                    pathname.startsWith("/rooms") && "bg-white/20"
                  )}
                >
                  Rooms
                </Link>
              </div>

              {/* Authentication Section */}
              <div className="border-t border-white/30 pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg">
                      <div className="bg-white/30 backdrop-blur-sm flex items-center justify-center size-10 rounded-full text-sm font-medium">
                        {getUserInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-200">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                      <User className="size-4" />
                      My Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-red-300"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    variant="outline"
                    className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
