import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Campaign, RcsFormat } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageSquare, Users, Loader2, Power, PowerOff, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (id: number) => void; // Kept for backward compatibility but no longer used
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
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

  // Fetch RCS formats for this campaign
  const { 
    data: formats, 
    isLoading: isLoadingFormats,
    isError,
  } = useQuery<RcsFormat[]>({
    queryKey: ["/api/campaign", campaign.id, "formats"],
    queryFn: async () => {
      const res = await fetch(`/api/campaign/${campaign.id}/formats`);
      if (!res.ok) throw new Error("Failed to fetch formats");
      return res.json();
    },
    enabled: isExpanded, // Only fetch when expanded
  });
  
  // Activate campaign mutation
  const activateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/campaigns/${campaign.id}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign activated",
        description: "The campaign is now active and ready to send RCS messages",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Activation failed",
        description: error.message || "Could not activate the campaign",
        variant: "destructive",
      });
    }
  });
  
  // Deactivate campaign mutation
  const deactivateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/campaigns/${campaign.id}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign deactivated",
        description: "The campaign has been deactivated",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deactivation failed",
        description: error.message || "Could not deactivate the campaign",
        variant: "destructive",
      });
    }
  });

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
            
            {/* Active Campaign Status */}
            <div className="flex items-center justify-between text-sm mt-1">
              <div className="text-gray-500">Active:</div>
              <div className="font-medium flex items-center">
                {campaign.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                    <Power className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 flex items-center">
                    <PowerOff className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            
            {campaign.isActive && campaign.activatedAt && (
              <div className="flex items-center justify-between text-sm mt-1">
                <div className="text-gray-500">Activated:</div>
                <div className="font-medium text-gray-900">
                  {formatDate(campaign.activatedAt)}
                </div>
              </div>
            )}
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">RCS Formats</h4>
                
                {isLoadingFormats ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : isError ? (
                  <p className="text-sm text-red-500">Error loading formats</p>
                ) : formats && formats.length > 0 ? (
                  <div className="space-y-2">
                    {formats.map((format) => (
                      <div key={format.id} className="p-2 bg-gray-50 rounded-md text-sm">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{format.title || "Untitled Format"}</div>
                          <Badge variant="outline">{format.formatType === "richCard" ? "Rich Card" : "Carousel"}</Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {format.description || "No description"}
                        </div>
                        <div className="mt-2">
                          <Link href={`/format/${format.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              View Format
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No RCS formats created yet</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="text-sm font-medium text-primary hover:text-blue-700"
              onClick={() => navigate(`/rcs-formatter/campaign/${campaign.id}`)}
            >
              Edit
            </Button>
            
            {/* Activation/Deactivation Button */}
            {campaign.isActive ? (
              <Button
                variant="ghost"
                className="text-sm font-medium text-red-600 hover:text-red-800"
                onClick={() => deactivateMutation.mutate()}
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <PowerOff className="h-4 w-4 mr-1" />
                )}
                Deactivate
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-sm font-medium text-green-600 hover:text-green-800"
                onClick={() => activateMutation.mutate()}
                disabled={activateMutation.isPending}
              >
                {activateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Power className="h-4 w-4 mr-1" />
                )}
                Activate
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-primary hover:text-blue-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide Formats" : "Show Formats"}
            </Button>
            
            {campaign.isActive && (
              <Link href={`/webhooks?campaignId=${campaign.id}`}>
                <Button variant="ghost" className="text-sm font-medium text-green-600 hover:text-green-800">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Test via Webhook
                </Button>
              </Link>
            )}
            
            <Link href={`/campaigns/${campaign.id}`}>
              <Button variant="ghost" className="text-sm font-medium text-primary hover:text-blue-700">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
