import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogOut, Save, Globe, Bell, Lock, Eye, Database } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  const form = useForm({
    defaultValues: {
      imageQuality: "high",
      exportFormat: "json",
      maxImageSize: "1800"
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveSettings = () => {
    // This would typically save settings to the server
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handleSaveSettings}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="messaging">Messaging</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                          Customize how the application looks and feels
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-sm text-gray-500">
                              Enable dark mode for the application
                            </p>
                          </div>
                          <Switch
                            id="dark-mode"
                            checked={darkMode}
                            onCheckedChange={setDarkMode}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notifications">Notifications</Label>
                            <p className="text-sm text-gray-500">
                              Receive notifications about RCS format updates
                            </p>
                          </div>
                          <Switch
                            id="notifications"
                            checked={notificationsEnabled}
                            onCheckedChange={setNotificationsEnabled}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-save">Auto-Save</Label>
                            <p className="text-sm text-gray-500">
                              Automatically save formats while editing
                            </p>
                          </div>
                          <Switch
                            id="auto-save"
                            checked={autoSave}
                            onCheckedChange={setAutoSave}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>
                          Information about your account and system
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Username</p>
                          <p className="text-sm text-gray-500">{user?.username || "Not available"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-gray-500">{user?.email || "Not available"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Application Version</p>
                          <p className="text-sm text-gray-500">RCS Formatter v1.0.0</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Last Login</p>
                          <p className="text-sm text-gray-500">Today at {new Date().toLocaleTimeString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="messaging">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>RCS Format Settings</CardTitle>
                        <CardDescription>
                          Configure default settings for RCS message formatting
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="imageQuality"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Image Quality</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="low" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Low (Faster loading)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="medium" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Medium (Balanced)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="high" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          High (Better quality)
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormDescription>
                                    Select the default image quality for RCS formats
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <Separator />

                            <FormField
                              control={form.control}
                              name="exportFormat"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Default Export Format</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="json" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          JSON
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="image" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Image
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="both" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Both
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormDescription>
                                    Choose the default export format for RCS formats
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <Separator />

                            <FormField
                              control={form.control}
                              name="maxImageSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Maximum Image Size (KB)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      min="500"
                                      max="2000"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Set the maximum image size in KB (500-2000)
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                        </Form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>RCS Best Practices</CardTitle>
                        <CardDescription>
                          Recommended settings and practices for RCS messaging
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start">
                          <Globe className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Global Format Compatibility</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Keep image sizes under 1.8MB for optimal delivery across all networks.
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start">
                          <Bell className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Suggested Replies</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Limit suggested replies to 25 characters for best customer experience.
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start">
                          <Lock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Brand Verification</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Always include brand verification symbol for increased trust and engagement.
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start">
                          <Eye className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Image Optimization</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Use JPEG format for photos and PNG for graphics with transparency.
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start">
                          <Database className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Campaign Planning</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Store frequently used brand assets in the brand profile for quick access.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Management</CardTitle>
                      <CardDescription>
                        Manage your account settings and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Change Password</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Update your password to maintain account security
                          </p>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                  id="current-password"
                                  type="password"
                                  placeholder="••••••••"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                  id="new-password"
                                  type="password"
                                  placeholder="••••••••"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  placeholder="••••••••"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <Button variant="outline">
                              Change Password
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium">Update Profile Information</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Keep your contact information up to date
                          </p>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  defaultValue={user?.name || ""}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  defaultValue={user?.email || ""}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                placeholder="Your company"
                                className="mt-1"
                              />
                            </div>
                            
                            <Button variant="outline">
                              Update Profile
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Permanent actions that cannot be undone
                          </p>
                          
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}