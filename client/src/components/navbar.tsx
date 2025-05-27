import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: () => apiRequest("GET", "/api/me"),
    retry: false,
    staleTime: 0,
  });

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
  });

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-primary font-bold text-2xl cursor-pointer">CarRental</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/cars">
              <span className={`${isActive("/cars") || isActive("/") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                Cars
              </span>
            </Link>
            <Link href="/contact">
              <span className={`${isActive("/contact") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                Contact Us
              </span>
            </Link>
            {user && (
              <Link href="/profile">
                <span className={`${isActive("/profile") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                  My Account
                </span>
              </Link>
            )}
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <span>English</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">English</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">Arabic</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">French</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">Spanish</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <span>USD</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">USD</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">EUR</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">GBP</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">AED</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isLoading ? (
              <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <Button variant="destructive" onClick={() => logout.mutate()} className="px-4 py-2 rounded-md text-sm font-medium">
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button className="px-4 py-2 rounded-md text-sm font-medium">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/cars">
            <span className={`${isActive("/cars") || isActive("/") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} block pl-3 pr-4 py-2 text-base font-medium cursor-pointer transition-colors duration-200`}>
              Cars
            </span>
          </Link>
          <Link href="/contact">
            <span className={`${isActive("/contact") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} block pl-3 pr-4 py-2 text-base font-medium cursor-pointer transition-colors duration-200`}>
              Contact Us
            </span>
          </Link>
          {user && (
            <Link href="/profile">
              <span className={`${isActive("/profile") ? "text-primary font-bold" : "text-gray-600 hover:text-primary"} block pl-3 pr-4 py-2 text-base font-medium cursor-pointer transition-colors duration-200`}>
                My Account
              </span>
            </Link>
          )}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <span>English</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">English</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">Arabic</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">French</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">Spanish</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <span>USD</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">USD</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">EUR</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">GBP</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary">AED</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {isLoading ? (
              <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <Button variant="destructive" onClick={() => logout.mutate()} className="px-4 py-2 rounded-md text-sm font-medium">
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button className="px-4 py-2 rounded-md text-sm font-medium">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}