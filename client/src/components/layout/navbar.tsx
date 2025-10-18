import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  HelpCircle,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";
import companyLogo from "../../assets/company-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Only show "New Format" dropdown on non-formatter pages
  const isFormatterPage = location === '/rcs-formatter' || location.startsWith('/rcs-formatter/');

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex items-center mr-4">
          <img 
            src={companyLogo} 
            alt="Messaging Advisory Logo" 
            className="h-10 object-contain" 
          />
        </div>
        <div className="flex-1 flex justify-center">
          <form className="w-full max-w-md flex md:ml-0" onSubmit={handleSearch}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4" />
              </div>
              <Input
                id="search"
                className="block w-full h-9 pl-9 pr-3 py-1.5 border-transparent rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search brands, campaigns..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
          
          <div className="ml-4 flex items-center md:ml-6">
            {!isFormatterPage && (
              <div className="hidden md:block mr-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      New Format
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <Link href="/rcs-formatter?type=message">
                      <DropdownMenuItem asChild>
                        <button className="w-full text-left">Message</button>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/rcs-formatter?type=richCard">
                      <DropdownMenuItem asChild>
                        <button className="w-full text-left">Rich Card</button>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/rcs-formatter?type=carousel">
                      <DropdownMenuItem asChild>
                        <button className="w-full text-left">Carousel</button>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/rcs-formatter?type=chip">
                      <DropdownMenuItem asChild>
                        <button className="w-full text-left">Chip List</button>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="ml-3 text-gray-400 hover:text-gray-500">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          
          {user && (
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className="text-sm font-medium text-gray-700">{user.name || user.username}</div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs text-gray-500 p-0"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
