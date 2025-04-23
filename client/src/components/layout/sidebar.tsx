import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart3,
  FileImage,
  FolderOpen,
  Home,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: "/home", label: "Dashboard", icon: <Home className="mr-3 h-5 w-5" /> },
    { href: "/rcs-formatter", label: "RCS Formatter", icon: <FileImage className="mr-3 h-5 w-5" /> },
    { href: "/campaigns", label: "Campaigns", icon: <FolderOpen className="mr-3 h-5 w-5" /> },
    { href: "/customers", label: "Brands", icon: <Users className="mr-3 h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  const sidebarClasses = cn(
    "flex flex-col w-64 bg-gray-800 h-full",
    isOpen ? "fixed inset-y-0 left-0 z-50 md:relative md:z-0" : "hidden md:flex"
  );

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <Link href="/home">
          <button className="text-xl font-bold text-white">RCS Format</button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-300"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link href={item.href}>
                <button
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md group w-full text-left",
                    location === item.href
                      ? "text-white bg-gray-900"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Link>
            </div>
          ))}
        </nav>
        
        {user && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user.name || user.username}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
