import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (id: number) => void;
}

export function CampaignCard({ campaign, onEdit }: CampaignCardProps) {
  // Format date using date-fns
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">{campaign.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-clamp-2">{campaign.description || "No description provided"}</p>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Format:</div>
              <div className="font-medium text-gray-900">
                {campaign.formatType === "richCard" ? "Rich Card" : "Carousel"}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-1">
              <div className="text-gray-500">Provider:</div>
              <div className="font-medium text-gray-900">{campaign.provider || "Not specified"}</div>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-1">
              <div className="text-gray-500">
                {campaign.status === "scheduled" ? "Scheduled:" : "Created:"}
              </div>
              <div className="font-medium text-gray-900">
                {campaign.status === "scheduled" && campaign.scheduledDate
                  ? formatDate(campaign.scheduledDate)
                  : formatDate(campaign.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 flex justify-between">
          <Button
            variant="ghost"
            className="text-sm font-medium text-primary hover:text-blue-700"
            onClick={() => onEdit(campaign.id)}
          >
            Edit
          </Button>
          
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant="ghost" className="text-sm font-medium text-primary hover:text-blue-700">
              {campaign.status === "active" ? "View Report" : "View Details"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
