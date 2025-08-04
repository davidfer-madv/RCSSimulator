import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, TrendingUp, MessageSquare, Eye, MousePointer, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getQueryFn } from "@/lib/queryClient";
import type { Analytics, Campaign, RcsFormat } from "@shared/schema";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics", { period: selectedPeriod, campaign: selectedCampaign }],
    queryFn: getQueryFn(),
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    queryFn: getQueryFn(),
  });

  // Generate mock analytics data for demonstration
  const mockAnalytics = generateMockAnalytics(selectedPeriod);
  const overviewStats = calculateOverviewStats(mockAnalytics);
  const performanceData = generatePerformanceData(mockAnalytics);
  const campaignComparison = generateCampaignComparison(campaigns);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track message performance and engagement metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id.toString()}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Messages Sent"
          value={overviewStats.messagesSent}
          change={overviewStats.sentChange}
          icon={MessageSquare}
          color="blue"
        />
        <MetricCard
          title="Delivery Rate"
          value={`${overviewStats.deliveryRate}%`}
          change={overviewStats.deliveryChange}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Read Rate"
          value={`${overviewStats.readRate}%`}
          change={overviewStats.readChange}
          icon={Eye}
          color="purple"
        />
        <MetricCard
          title="Click-Through Rate"
          value={`${overviewStats.clickRate}%`}
          change={overviewStats.clickChange}
          icon={MousePointer}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Comparison</TabsTrigger>
          <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Volume Trend</CardTitle>
                <CardDescription>Messages sent and delivered over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="delivered" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Rates</CardTitle>
                <CardDescription>Read and click rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="readRate" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="clickRate" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Comparison</CardTitle>
              <CardDescription>Compare metrics across different campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={campaignComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#8884d8" />
                  <Bar dataKey="delivered" fill="#82ca9d" />
                  <Bar dataKey="clicked" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Messages by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Android', value: 65, color: '#0088FE' },
                        { name: 'iOS', value: 35, color: '#00C49F' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Android', value: 65, color: '#0088FE' },
                        { name: 'iOS', value: 35, color: '#00C49F' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrier Breakdown</CardTitle>
                <CardDescription>Messages by carrier network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Verizon', share: 34, delivered: 98.5 },
                    { name: 'AT&T', share: 28, delivered: 97.8 },
                    { name: 'T-Mobile', share: 22, delivered: 98.1 },
                    { name: 'Other', share: 16, delivered: 96.2 }
                  ].map((carrier) => (
                    <div key={carrier.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{carrier.name}</span>
                        <span className="text-gray-500">{carrier.share}% share • {carrier.delivered}% delivered</span>
                      </div>
                      <Progress value={carrier.share} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Heatmap</CardTitle>
              <CardDescription>Best times to send messages for optimal engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }, (_, hour) => 
                  Array.from({ length: 7 }, (_, day) => {
                    const engagement = Math.random() * 100;
                    const intensity = engagement > 75 ? 'bg-green-500' : 
                                    engagement > 50 ? 'bg-green-300' :
                                    engagement > 25 ? 'bg-yellow-300' : 'bg-gray-200';
                    return (
                      <div
                        key={`${hour}-${day}`}
                        className={`w-3 h-3 rounded-sm ${intensity}`}
                        title={`${hour}:00 - ${engagement.toFixed(1)}% engagement`}
                      />
                    );
                  })
                ).flat()}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaign Activity</CardTitle>
          <CardDescription>Latest campaign performance updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateRecentActivity().map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">{activity.campaign}</p>
                    <p className="text-sm text-gray-500">{activity.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.value}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-1">
              <TrendingUp className={`h-3 w-3 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}% from last period
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data generators for demonstration
function generateMockAnalytics(period: string) {
  const days = period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sent: Math.floor(Math.random() * 1000) + 500,
    delivered: Math.floor(Math.random() * 950) + 450,
    read: Math.floor(Math.random() * 600) + 200,
    clicked: Math.floor(Math.random() * 150) + 50
  }));
}

function calculateOverviewStats(analytics: any[]) {
  const total = analytics.reduce((acc, day) => ({
    sent: acc.sent + day.sent,
    delivered: acc.delivered + day.delivered,
    read: acc.read + day.read,
    clicked: acc.clicked + day.clicked
  }), { sent: 0, delivered: 0, read: 0, clicked: 0 });

  return {
    messagesSent: total.sent.toLocaleString(),
    deliveryRate: Math.round((total.delivered / total.sent) * 100),
    readRate: Math.round((total.read / total.delivered) * 100),
    clickRate: Math.round((total.clicked / total.read) * 100),
    sentChange: Math.floor(Math.random() * 20) - 10,
    deliveryChange: Math.floor(Math.random() * 10) - 5,
    readChange: Math.floor(Math.random() * 15) - 7,
    clickChange: Math.floor(Math.random() * 8) - 4
  };
}

function generatePerformanceData(analytics: any[]) {
  return analytics.map(day => ({
    ...day,
    readRate: Math.round((day.read / day.delivered) * 100),
    clickRate: Math.round((day.clicked / day.read) * 100)
  }));
}

function generateCampaignComparison(campaigns: Campaign[]) {
  return campaigns.slice(0, 5).map(campaign => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
    sent: Math.floor(Math.random() * 5000) + 1000,
    delivered: Math.floor(Math.random() * 4500) + 900,
    clicked: Math.floor(Math.random() * 500) + 100
  }));
}

function generateRecentActivity() {
  return [
    {
      campaign: "Summer Sale 2024",
      message: "High engagement rate detected",
      value: "12.5% CTR",
      time: "2 hours ago",
      status: "success"
    },
    {
      campaign: "New Product Launch",
      message: "Delivery rate below threshold",
      value: "89.2% delivered",
      time: "4 hours ago", 
      status: "warning"
    },
    {
      campaign: "Customer Retention",
      message: "Campaign completed successfully",
      value: "1,247 sent",
      time: "6 hours ago",
      status: "success"
    },
    {
      campaign: "Black Friday Preview",
      message: "A/B test results available",
      value: "Variant B +15%",
      time: "1 day ago",
      status: "success"
    }
  ];
}