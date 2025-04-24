import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WebhookConfig } from "@shared/schema";
import { Loader2, Plus, Trash2, ExternalLink, MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Campaign, RcsFormat } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { WebhookConfig as WebhookConfigType } from "@shared/schema";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function WebhooksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfigType | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [testPhoneNumbers, setTestPhoneNumbers] = useState<string>("");
  const [location] = useLocation();
  
  // Get campaignId from URL query parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("campaignId");
    if (campaignId) {
      setSelectedCampaignId(campaignId);
      setIsTestDialogOpen(true);
    }
  }, [location]);
  
  // Form state for new webhook
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    token: "",
    provider: "google", // Default to Google
    isActive: true
  });
  
  // Fetch campaigns if we're in test mode
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: ["/api/campaigns", selectedCampaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${selectedCampaignId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
    enabled: !!selectedCampaignId,
  });

  // Fetch campaign formats if we're in test mode
  const { data: formats = [], isLoading: isLoadingFormats } = useQuery<RcsFormat[]>({
    queryKey: ["/api/campaign", selectedCampaignId, "formats"],
    queryFn: async () => {
      const res = await fetch(`/api/campaign/${selectedCampaignId}/formats`);
      if (!res.ok) throw new Error("Failed to fetch formats");
      return res.json();
    },
    enabled: !!selectedCampaignId,
  });

  // Test webhook mutation
  const testWebhookMutation = useMutation({
    mutationFn: async ({ webhookId, campaignId, phoneNumbers }: { webhookId: number, campaignId: number, phoneNumbers: string[] }) => {
      const res = await fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          phoneNumbers
        }),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setIsTestDialogOpen(false);
      setSelectedWebhook(null);
      setSelectedCampaignId(null);
      setTestPhoneNumbers("");
      toast({
        title: "Success",
        description: "RCS message sent successfully via webhook",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle phone numbers change
  const handlePhoneNumbersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestPhoneNumbers(e.target.value);
  };

  // Submit test
  const handleTestSubmit = () => {
    if (!selectedWebhook || !selectedCampaignId) {
      toast({
        title: "Error",
        description: "Please select a webhook and campaign",
        variant: "destructive",
      });
      return;
    }
    
    // Convert phone numbers string to array
    const phoneNumbers = testPhoneNumbers
      .split(',')
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    if (phoneNumbers.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one phone number",
        variant: "destructive",
      });
      return;
    }
    
    testWebhookMutation.mutate({
      webhookId: selectedWebhook.id,
      campaignId: parseInt(selectedCampaignId, 10),
      phoneNumbers
    });
  };

  // Fetch webhooks
  const { data: webhooks = [], isLoading } = useQuery<WebhookConfigType[]>({
    queryKey: ["/api/webhooks"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      if (res.status === 401) {
        return []; // Return empty array on unauthorized
      }
      
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      
      return res.json();
    },
  });
  
  // Add webhook mutation
  const addWebhookMutation = useMutation({
    mutationFn: async (webhook: Omit<WebhookConfigType, "id" | "createdAt" | "lastUsed" | "userId">) => {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...webhook,
          userId: user?.id
        }),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setIsAddDialogOpen(false);
      setNewWebhook({
        name: "",
        url: "",
        token: "",
        provider: "google",
        isActive: true
      });
      toast({
        title: "Success",
        description: "Webhook added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update webhook mutation (for toggling active state)
  const updateWebhookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WebhookConfigType> }) => {
      const res = await fetch(`/api/webhooks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      toast({
        title: "Success",
        description: "Webhook updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete webhook mutation
  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/webhooks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWebhook(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle provider change
  const handleProviderChange = (value: string) => {
    setNewWebhook(prev => ({
      ...prev,
      provider: value
    }));
  };
  
  // Handle switch change
  const handleSwitchChange = (checked: boolean) => {
    setNewWebhook(prev => ({
      ...prev,
      isActive: checked
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWebhookMutation.mutate(newWebhook);
  };
  
  // Toggle webhook active state
  const toggleWebhookActive = (webhook: WebhookConfigType) => {
    updateWebhookMutation.mutate({
      id: webhook.id,
      data: { isActive: !webhook.isActive }
    });
  };
  
  // Delete webhook
  const deleteWebhook = (id: number) => {
    if (confirm("Are you sure you want to delete this webhook?")) {
      deleteWebhookMutation.mutate(id);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Webhook Configurations</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Webhook</DialogTitle>
                      <DialogDescription>
                        Create a new webhook configuration to connect with external RCS messaging services.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={newWebhook.name}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="url" className="text-right">
                            Webhook URL
                          </Label>
                          <Input
                            id="url"
                            name="url"
                            value={newWebhook.url}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="token" className="text-right">
                            Auth Token
                          </Label>
                          <Input
                            id="token"
                            name="token"
                            value={newWebhook.token}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="provider" className="text-right">
                            Provider
                          </Label>
                          <Select
                            value={newWebhook.provider}
                            onValueChange={handleProviderChange}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="google">Google RCS Business Messaging</SelectItem>
                              <SelectItem value="apple">Apple Messages for Business</SelectItem>
                              <SelectItem value="custom">Custom Provider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="isActive" className="text-right">
                            Active
                          </Label>
                          <div className="flex items-center space-x-2 col-span-3">
                            <Switch
                              id="isActive"
                              checked={newWebhook.isActive}
                              onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="isActive" className="font-normal">
                              Webhook is active
                            </Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={addWebhookMutation.isPending}>
                          {addWebhookMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : webhooks.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
                    <p className="text-gray-500 mb-4">
                      Add a webhook to connect with external RCS messaging services.
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Webhook
                    </Button>
                  </div>
                ) : (
                  webhooks.map((webhook) => (
                    <Card key={webhook.id} className={webhook.isActive ? "" : "opacity-75"}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{webhook.name}</CardTitle>
                            <CardDescription className="mt-1 truncate max-w-[250px]">
                              {webhook.url}
                            </CardDescription>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteWebhook(webhook.id)}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Provider:</span>
                            <span className="text-sm capitalize">{webhook.provider}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Last Used:</span>
                            <span className="text-sm">
                              {webhook.lastUsed ? new Date(webhook.lastUsed).toLocaleDateString() : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Created:</span>
                            <span className="text-sm">
                              {new Date(webhook.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`active-${webhook.id}`}
                            checked={webhook.isActive}
                            onCheckedChange={() => toggleWebhookActive(webhook)}
                          />
                          <Label htmlFor={`active-${webhook.id}`} className="font-normal text-sm">
                            {webhook.isActive ? "Active" : "Inactive"}
                          </Label>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => window.open(webhook.url, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Webhooks</h2>
                <p className="text-gray-600 mb-4">
                  Webhooks allow you to connect your RCS Formatter with external messaging services to send rich cards
                  and carousels to your customers through RCS messaging channels.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How to use webhooks:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>
                    <strong>Configure a webhook</strong> - Add a new webhook with the URL provided by your RCS messaging provider.
                  </li>
                  <li>
                    <strong>Create a campaign</strong> - Design your RCS message using the RCS Formatter.
                  </li>
                  <li>
                    <strong>Activate the campaign</strong> - When activating a campaign, select the webhook to use for delivery.
                  </li>
                  <li>
                    <strong>Monitor delivery</strong> - Track the status of your messages in the campaign dashboard.
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-md font-semibold text-blue-800 mb-2">Google Business Messages Demo</h3>
                  <p className="text-blue-700 text-sm">
                    To test with Google's RCS Business Messaging sandbox, you'll need to get API credentials from the 
                    Google Business Messages console. This webhook allows you to send messages to test devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}