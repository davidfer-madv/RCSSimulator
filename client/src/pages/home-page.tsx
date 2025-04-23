import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loader2, FileImage, FolderOpen, Building } from "lucide-react";
import { Link } from "wouter";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Campaign } from "@shared/schema";

// Mock data for demo purposes
const mockStats = {
  totalFormats: 5,
  activeCampaigns: 3,
  totalCustomers: 10
};

// Hardcoded campaigns data for demo
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Promotion",
    description: "Summer promotional campaign for retail customers",
    status: "active",
    customerId: 1,
    userId: 1,
    formatType: "richCard",
    provider: "Google Messages",
    createdAt: new Date(),
    scheduledDate: null
  },
  {
    id: 2,
    name: "New Product Launch",
    description: "Campaign for new product line introduction",
    status: "active",
    customerId: 2,
    userId: 1,
    formatType: "carousel",
    provider: "Apple Business Chat",
    createdAt: new Date(),
    scheduledDate: null
  },
  {
    id: 3,
    name: "Holiday Special",
    description: "Special holiday messaging campaign",
    status: "scheduled",
    customerId: 1,
    userId: 1,
    formatType: "richCard",
    provider: "Google Messages",
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }
];

export default function HomePage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Use local mock data 
  const stats = mockStats;
  const isLoadingStats = false;

  // Use local mock campaigns data
  const campaigns = mockCampaigns as Campaign[];
  const isLoadingCampaigns = false;

  // Handle campaign edit
  const handleEditCampaign = (id: number) => {
    // This would typically navigate to an edit page
    console.log(`Edit campaign ${id}`);
  };

  // Get recent campaigns
  const recentCampaigns = campaigns?.slice(0, 3) || [];

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
              <div className="my-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingStats ? (
                  <div className="col-span-3 flex justify-center py-8">
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
                    />
                    <StatsCard
                      title="Active Campaigns"
                      value={stats?.activeCampaigns || 0}
                      icon={<FolderOpen className="text-white h-5 w-5" />}
                      color="emerald"
                      href="/campaigns"
                    />
                    <StatsCard
                      title="Customers"
                      value={stats?.totalCustomers || 0}
                      icon={<Building className="text-white h-5 w-5" />}
                      color="violet"
                      href="/customers"
                    />
                  </>
                )}
              </div>

              {/* Recent Campaigns Section */}
              <div className="mt-10">
                <div className="mb-5 sm:flex sm:items-center sm:justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Campaigns</h2>
                  <div className="mt-3 sm:mt-0">
                    <Link href="/campaigns">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <FolderOpen className="mr-2 -ml-1 h-5 w-5" />
                        New Campaign
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {isLoadingCampaigns ? (
                    <div className="col-span-3 flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onEdit={handleEditCampaign}
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      <p>No campaigns found. Create your first campaign now!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
