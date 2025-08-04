import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Smartphone, CheckCircle, AlertCircle, Clock, Eye, MousePointer, Copy, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign, RcsFormat, WebhookLog } from "@shared/schema";

const statusIcons = {
  pending: Clock,
  sent: Send,
  delivered: CheckCircle,
  read: Eye,
  clicked: MousePointer,
  failed: AlertCircle
};

const statusColors = {
  pending: "text-gray-500",
  sent: "text-blue-500", 
  delivered: "text-green-500",
  read: "text-purple-500",
  clicked: "text-orange-500",
  failed: "text-red-500"
};

export default function WebhookSimulatorPage() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [testPhoneNumber, setTestPhoneNumber] = useState("+1234567890");
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWebhookCode, setShowWebhookCode] = useState(false);

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    queryFn: getQueryFn(),
  });

  const { data: webhookLogs = [] } = useQuery<WebhookLog[]>({
    queryKey: ["/api/webhook-logs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: rcsFormats = [] } = useQuery<RcsFormat[]>({
    queryKey: ["/api/rcs-formats"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const sendTestMessageMutation = useMutation({
    mutationFn: async (data: { campaignId: string; phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/webhook/simulate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSimulationInProgress(true);
      setCurrentStep(0);
      simulateDeliveryFlow(data.logId);
      toast({ title: "Test message sent", description: "Simulating delivery flow..." });
    }
  });

  const simulateDeliveryFlow = async (logId: string) => {
    const steps = ["sent", "delivered", "read", "clicked"];
    const delays = [1000, 2000, 3000, 2000]; // Delays between steps

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[i]));
      setCurrentStep(i + 1);
      
      // Update webhook log status
      await apiRequest("PUT", `/api/webhook-logs/${logId}`, {
        status: steps[i],
        timestamp: new Date().toISOString()
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/webhook-logs"] });
    }
    
    setSimulationInProgress(false);
    toast({ title: "Simulation complete", description: "Message delivery flow completed successfully" });
  };

  const selectedCampaignData = campaigns.find(c => c.id.toString() === selectedCampaign);
  const selectedFormat = rcsFormats.find(f => f.campaignId?.toString() === selectedCampaign);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Webhook Simulator</h1>
          <p className="text-gray-600">Test RCS message delivery and webhook integrations</p>
        </div>
        <Dialog open={showWebhookCode} onOpenChange={setShowWebhookCode}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Code className="mr-2 h-4 w-4" />
              View Integration Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Webhook Integration Examples</DialogTitle>
            </DialogHeader>
            <WebhookCodeExamples />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure your test message parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaign-select">Select Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id.toString()}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone-number">Test Phone Number</Label>
              <Input
                id="phone-number"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            {selectedCampaignData && (
              <div className="space-y-2">
                <Label>Campaign Details</Label>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Name:</span> {selectedCampaignData.name}</div>
                  <div><span className="font-medium">Format:</span> {selectedCampaignData.formatType}</div>
                  <div><span className="font-medium">Status:</span> 
                    <Badge className="ml-2">{selectedCampaignData.status}</Badge>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => sendTestMessageMutation.mutate({ 
                campaignId: selectedCampaign, 
                phoneNumber: testPhoneNumber 
              })}
              disabled={!selectedCampaign || simulationInProgress}
              className="w-full"
            >
              {simulationInProgress ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Message
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Delivery Simulation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Simulation</CardTitle>
            <CardDescription>Real-time message delivery status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="flow" className="space-y-4">
              <TabsList>
                <TabsTrigger value="flow">Delivery Flow</TabsTrigger>
                <TabsTrigger value="payload">Webhook Payloads</TabsTrigger>
                <TabsTrigger value="preview">Message Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="flow" className="space-y-4">
                <DeliveryFlowVisualization 
                  currentStep={currentStep}
                  inProgress={simulationInProgress}
                />
              </TabsContent>

              <TabsContent value="payload" className="space-y-4">
                <WebhookPayloadViewer 
                  phoneNumber={testPhoneNumber}
                  campaign={selectedCampaignData}
                  currentStep={currentStep}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                {selectedFormat ? (
                  <MessagePreview format={selectedFormat} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Select a campaign to preview the message
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>History of webhook simulation tests</CardDescription>
        </CardHeader>
        <CardContent>
          <TestResultsTable logs={webhookLogs.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  );
}

function DeliveryFlowVisualization({ currentStep, inProgress }: { currentStep: number; inProgress: boolean }) {
  const steps = [
    { name: "Message Queued", icon: Clock, status: "pending" },
    { name: "Message Sent", icon: Send, status: "sent" },
    { name: "Message Delivered", icon: CheckCircle, status: "delivered" },
    { name: "Message Read", icon: Eye, status: "read" },
    { name: "Action Clicked", icon: MousePointer, status: "clicked" }
  ];

  const getStepStatus = (index: number) => {
    if (!inProgress && currentStep === 0) return 'pending';
    if (index < currentStep) return 'completed';
    if (index === currentStep && inProgress) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Delivery Progress</span>
        <span className="text-sm text-gray-500">
          {currentStep}/{steps.length} steps completed
        </span>
      </div>
      
      <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);
          
          return (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${
                status === 'completed' ? 'bg-green-100 text-green-600' :
                status === 'active' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                <Icon className={`h-4 w-4 ${status === 'active' ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  status === 'completed' ? 'text-green-600' :
                  status === 'active' ? 'text-blue-600' :
                  'text-gray-400'
                }`}>
                  {step.name}
                </div>
                <div className="text-sm text-gray-500">
                  {status === 'completed' ? 'Completed' :
                   status === 'active' ? 'In progress...' :
                   'Waiting'}
                </div>
              </div>
              {status === 'completed' && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Done
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WebhookPayloadViewer({ phoneNumber, campaign, currentStep }: {
  phoneNumber: string;
  campaign?: Campaign;
  currentStep: number;
}) {
  const generatePayload = (status: string) => ({
    messageId: "msg_" + Math.random().toString(36).substr(2, 9),
    campaignId: campaign?.id || "campaign_123",
    phoneNumber,
    status,
    timestamp: new Date().toISOString(),
    carrier: "Verizon",
    device: "Android",
    ...(status === 'clicked' && {
      actionType: "url",
      actionValue: "https://example.com/offer"
    })
  });

  const statuses = ['pending', 'sent', 'delivered', 'read', 'clicked'];
  const currentStatus = statuses[Math.min(currentStep, statuses.length - 1)];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Webhook Payload ({currentStatus})</Label>
        <Button size="sm" variant="outline" onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(generatePayload(currentStatus), null, 2));
        }}>
          <Copy className="mr-1 h-3 w-3" />
          Copy
        </Button>
      </div>
      
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{JSON.stringify(generatePayload(currentStatus), null, 2)}</pre>
      </div>
      
      <div className="text-xs text-gray-500">
        This payload would be sent to your webhook endpoint when the message status changes.
      </div>
    </div>
  );
}

function MessagePreview({ format }: { format: RcsFormat }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg border">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-3 text-sm font-medium">
            RCS Message Preview
          </div>
          
          {format.imageUrls && (format.imageUrls as string[]).length > 0 && (
            <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
              <Smartphone className="h-8 w-8" />
              <span className="ml-2">Image Content</span>
            </div>
          )}
          
          <div className="p-4 space-y-3">
            {format.title && <h3 className="font-semibold">{format.title}</h3>}
            {format.description && <p className="text-sm text-gray-600">{format.description}</p>}
            
            {format.actions && (format.actions as any[]).length > 0 && (
              <div className="space-y-2">
                {(format.actions as any[]).map((action: any, index: number) => (
                  <Button key={index} variant="outline" size="sm" className="w-full">
                    {action.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-center text-gray-500">
        This is how your message will appear on supported devices
      </div>
    </div>
  );
}

function TestResultsTable({ logs }: { logs: WebhookLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No test results yet. Send a test message to see results here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Phone Number</th>
            <th className="text-left p-2">Campaign</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Sent At</th>
            <th className="text-left p-2">Delivered At</th>
            <th className="text-left p-2">Read At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const StatusIcon = statusIcons[log.status as keyof typeof statusIcons];
            return (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono">{log.phoneNumber}</td>
                <td className="p-2">Campaign #{log.campaignId}</td>
                <td className="p-2">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${statusColors[log.status as keyof typeof statusColors]}`} />
                    <span className="capitalize">{log.status}</span>
                  </div>
                </td>
                <td className="p-2 text-gray-500">
                  {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                </td>
                <td className="p-2 text-gray-500">
                  {log.deliveredAt ? new Date(log.deliveredAt).toLocaleString() : '-'}
                </td>
                <td className="p-2 text-gray-500">
                  {log.readAt ? new Date(log.readAt).toLocaleString() : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WebhookCodeExamples() {
  const nodeJsExample = `// Express.js webhook endpoint
app.post('/webhook/rcs-status', (req, res) => {
  const { messageId, status, timestamp, phoneNumber } = req.body;
  
  console.log(\`Message \${messageId} status: \${status}\`);
  
  // Update your database
  await updateMessageStatus(messageId, status, timestamp);
  
  // Send response
  res.status(200).json({ success: true });
});`;

  const pythonExample = `# Flask webhook endpoint
@app.route('/webhook/rcs-status', methods=['POST'])
def handle_rcs_webhook():
    data = request.get_json()
    message_id = data.get('messageId')
    status = data.get('status')
    timestamp = data.get('timestamp')
    
    print(f"Message {message_id} status: {status}")
    
    # Update your database
    update_message_status(message_id, status, timestamp)
    
    return jsonify({'success': True}), 200`;

  const curlExample = `# Test webhook endpoint
curl -X POST https://your-app.com/webhook/rcs-status \\
  -H "Content-Type: application/json" \\
  -d '{
    "messageId": "msg_abc123",
    "campaignId": "campaign_456",
    "phoneNumber": "+1234567890",
    "status": "delivered",
    "timestamp": "2024-01-01T12:00:00Z",
    "carrier": "Verizon",
    "device": "Android"
  }'`;

  return (
    <Tabs defaultValue="nodejs" className="space-y-4">
      <TabsList>
        <TabsTrigger value="nodejs">Node.js</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="curl">cURL Test</TabsTrigger>
      </TabsList>

      <TabsContent value="nodejs">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Express.js Webhook Handler</h4>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(nodeJsExample)}>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{nodeJsExample}</pre>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="python">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Flask Webhook Handler</h4>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(pythonExample)}>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{pythonExample}</pre>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="curl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Test Webhook with cURL</h4>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(curlExample)}>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{curlExample}</pre>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}