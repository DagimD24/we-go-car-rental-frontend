import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    retry: false
  });
  
  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      window.location.href = "/";
    }
  });

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-primary font-bold text-2xl">CarRental</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/cars">
                <span className={`${isActive("/cars") || isActive("/") ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Cars
                </span>
              </Link>
              <Link href="/contact">
                <span className={`${isActive("/contact") ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Contact Us
                </span>
              </Link>
              {user && (
                <Link href="/profile">
                  <span className={`${isActive("/profile") ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    My Account
                  </span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <span>English</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Arabic</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
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
                <DropdownMenuItem>USD</DropdownMenuItem>
                <DropdownMenuItem>EUR</DropdownMenuItem>
                <DropdownMenuItem>GBP</DropdownMenuItem>
                <DropdownMenuItem>AED</DropdownMenuItem>
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
            <span className={`${isActive("/cars") || isActive("/") ? "bg-primary-50 border-primary text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}>
              Cars
            </span>
          </Link>
          <Link href="/contact">
            <span className={`${isActive("/contact") ? "bg-primary-50 border-primary text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}>
              Contact Us
            </span>
          </Link>
          {user && (
            <Link href="/profile">
              <span className={`${isActive("/profile") ? "bg-primary-50 border-primary text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}>
                My Account
              </span>
            </Link>
          )}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-sm text-gray-500">
                    <span>English</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Arabic</DropdownMenuItem>
                  <DropdownMenuItem>French</DropdownMenuItem>
                  <DropdownMenuItem>Spanish</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-sm text-gray-500">
                    <span>USD</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>USD</DropdownMenuItem>
                  <DropdownMenuItem>EUR</DropdownMenuItem>
                  <DropdownMenuItem>GBP</DropdownMenuItem>
                  <DropdownMenuItem>AED</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-3 px-3">
            {isLoading ? (
              <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <Button 
                variant="destructive" 
                onClick={() => logout.mutate()} 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium">
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
