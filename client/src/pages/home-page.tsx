import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loader2, FileImage, FolderOpen, Building } from "lucide-react";
import { Link } from "wouter";

// Interface for statistics from the server
interface Stats {
  totalFormats: number;
  totalCustomers: number;
}

export default function HomePage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // For demo purposes, we'll use hardcoded stats until the API endpoint is implemented
  const mockStats = {
    totalFormats: 5,
    totalCustomers: 10
  };
  
  // In a real implementation, we would fetch from the server:
  // const { data: stats, isLoading: isLoadingStats } = useQuery<Stats>({
  //   queryKey: ["/api/statistics"],
  //   queryFn: async ({ queryKey }) => {
  //     const res = await fetch(queryKey[0] as string);
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch statistics");
  //     }
  //     return res.json();
  //   }
  // });
  
  // Using mock data for now
  const stats = mockStats;
  const isLoadingStats = false;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page Title */}
              <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <Link href="/rcs-formatter">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FileImage className="mr-2 -ml-1 h-5 w-5" />
                      New RCS Format
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="my-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {isLoadingStats ? (
                  <div className="col-span-2 flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <StatsCard
                      title="Total RCS Formats"
                      value={stats?.totalFormats || 0}
                      icon={<FileImage className="text-white h-5 w-5" />}
                      color="blue"
                      href="/rcs-formatter"
                      linkText="Create New Format"
                    />
                    <StatsCard
                      title="Brands"
                      value={stats?.totalCustomers || 0}
                      icon={<Building className="text-white h-5 w-5" />}
                      color="violet"
                      href="/customers"
                      linkText="Manage Brands"
                    />
                  </>
                )}
              </div>

              {/* Quick Start Guide */}
              <div className="mt-10 bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Getting Started with RCS Formatter</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                      <span className="h-6 w-6 text-blue-600 flex items-center justify-center font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Create Brands</h3>
                      <p className="text-gray-600 mt-1">Add your brands with logo, color, and contact information.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-3">
                      <span className="h-6 w-6 text-purple-600 flex items-center justify-center font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Format RCS Messages</h3>
                      <p className="text-gray-600 mt-1">Upload images and create rich card or carousel formats with the RCS Formatter.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                      <span className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Export & Use</h3>
                      <p className="text-gray-600 mt-1">Export your RCS formats as JSON for implementation or as images for presentations.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link href="/customers">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                      <Building className="mr-2 -ml-1 h-5 w-5" />
                      Manage Brands
                    </button>
                  </Link>
                  <Link href="/rcs-formatter">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <FileImage className="mr-2 -ml-1 h-5 w-5" />
                      Create RCS Format
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
