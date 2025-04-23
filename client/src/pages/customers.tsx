import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, UserPlus, Mail, Phone, Building, MapPin, Trash2, Edit, Info, Upload, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Customer form schema
const customerSchema = z.object({
  name: z.string().min(3, "Brand name must be at least 3 characters").max(50, "Brand name must be no more than 50 characters"),
  company: z.string().min(2, "Company name is required").max(100, "Company name must be no more than 100 characters"),
  brandLogoUrl: z.string().url("Please enter a valid URL").min(1, "Brand logo is required"),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color code (e.g., #FF5733)").min(1, "Brand color is required"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  brandBannerUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function Customers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Fetch customers
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Form for new customer
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      brandLogoUrl: "",
      brandColor: "",
      brandBannerUrl: "",
    },
  });
  
  // Form for editing customer
  const editForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      brandLogoUrl: "",
      brandColor: "",
      brandBannerUrl: "",
    },
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      const res = await apiRequest("POST", "/api/customers", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand created",
        description: "Your brand has been created successfully.",
      });
      setIsNewCustomerDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create brand",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (data: { id: number; customer: CustomerFormValues }) => {
      const res = await apiRequest("PATCH", `/api/customers/${data.id}`, data.customer);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand updated",
        description: "Your brand has been updated successfully.",
      });
      setIsEditCustomerDialogOpen(false);
      setSelectedCustomer(null);
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update brand",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/customers/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete brand");
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Brand deleted",
        description: "The brand has been deleted successfully.",
      });
      setIsDeleteConfirmOpen(false);
      setSelectedCustomer(null);
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete brand",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Open edit dialog with customer data
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    editForm.reset({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      company: customer.company || "",
      brandLogoUrl: customer.brandLogoUrl || "",
      brandColor: customer.brandColor || "",
      brandBannerUrl: customer.brandBannerUrl || "",
    });
    setIsEditCustomerDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteConfirmOpen(true);
  };

  // Handle create form submission
  const onSubmit = (data: CustomerFormValues) => {
    createCustomerMutation.mutate(data);
  };
  
  // Handle edit form submission
  const onEditSubmit = (data: CustomerFormValues) => {
    if (selectedCustomer) {
      updateCustomerMutation.mutate({ id: selectedCustomer.id, customer: data });
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        New Brand
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Brand</DialogTitle>
                        <DialogDescription>
                          Create a new brand to associate with your campaigns
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brand Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter brand name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter company name" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter address" 
                                    {...field} 
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="brandLogoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Brand Logo
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex items-center">
                                          <Info className="ml-1 h-4 w-4 text-gray-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="w-80">
                                        <p>Brand logo displays in RCS message headers. Recommended size: Square, 224x224 pixels.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-shrink-0 w-12 h-12 border rounded-md overflow-hidden">
                                        {field.value ? (
                                          <img 
                                            src={field.value} 
                                            alt="Brand logo" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">Upload or enter URL</div>
                                        <div className="text-xs text-gray-500">Square image recommended (224x224px)</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="url"
                                        placeholder="https://example.com/logo.png"
                                        {...field}
                                        value={field.value || ''}
                                        className="flex-1"
                                      />
                                      <div className="relative">
                                        <input
                                          type="file"
                                          id="logo-upload"
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const objectUrl = URL.createObjectURL(file);
                                              field.onChange(objectUrl);
                                            }
                                          }}
                                        />
                                        <Button type="button" size="sm" variant="outline">
                                          <Upload className="w-4 h-4 mr-1" />
                                          Browse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="brandColor"
                            render={({ field }) => {
                              // Define color palette options
                              const colorPalette = [
                                // Brand colors
                                "#1E88E5", // Blue
                                "#D81B60", // Pink
                                "#43A047", // Green
                                "#E53935", // Red
                                "#5E35B1", // Deep Purple
                                "#FB8C00", // Orange
                                "#00ACC1", // Cyan
                                "#3949AB", // Indigo
                                "#8E24AA", // Purple
                                "#F4511E", // Deep Orange
                                "#039BE5", // Light Blue
                                "#7CB342", // Light Green
                                "#C0CA33", // Lime
                                "#00897B", // Teal
                                "#FDD835", // Yellow
                                "#6D4C41", // Brown
                                "#546E7A", // Blue Grey
                                "#757575", // Grey
                                "#000000", // Black
                                "#E91E63", // Pink
                              ];
                              
                              return (
                                <FormItem>
                                  <FormLabel>
                                    Brand Color
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="inline-flex items-center">
                                            <Info className="ml-1 h-4 w-4 text-gray-400" />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-80">
                                          <p>Brand color used for accents and text color on rich card actions/replies.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="flex flex-col gap-3">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-10 h-10 border rounded-md flex-shrink-0" 
                                          style={{backgroundColor: field.value || '#ffffff'}}
                                        ></div>
                                        <div className="flex-1">
                                          <div className="text-sm font-medium">Selected color</div>
                                          <div className="text-xs text-gray-500">{field.value || 'No color selected'}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-10 gap-1">
                                        {colorPalette.map((color) => (
                                          <button
                                            key={color}
                                            type="button"
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${field.value === color ? 'border-primary scale-110' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                          />
                                        ))}
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="text"
                                          placeholder="#FF5733"
                                          {...field}
                                          value={field.value || ''}
                                          className="flex-1"
                                          onChange={(e) => {
                                            // Update color field when text is changed
                                            field.onChange(e.target.value);
                                          }}
                                        />
                                        <div className="relative">
                                          <input
                                            type="color"
                                            id="color-picker"
                                            value={field.value || '#ffffff'}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                              // Update text field when color is picked
                                              field.onChange(e.target.value);
                                            }}
                                          />
                                          <Button type="button" size="sm" variant="outline">
                                            <Palette className="w-4 h-4 mr-1" />
                                            Custom
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={form.control}
                            name="brandBannerUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Brand Banner
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex items-center">
                                          <Info className="ml-1 h-4 w-4 text-gray-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="w-80">
                                        <p>Brand banner image for large format display. Recommended size: 1440x448 pixels.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-shrink-0 w-20 h-8 border rounded-md overflow-hidden">
                                        {field.value ? (
                                          <img 
                                            src={field.value} 
                                            alt="Brand banner" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">Upload or enter URL</div>
                                        <div className="text-xs text-gray-500">Banner image (1440x448px)</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="url"
                                        placeholder="https://example.com/banner.png"
                                        {...field}
                                        value={field.value || ''}
                                        className="flex-1"
                                      />
                                      <div className="relative">
                                        <input
                                          type="file"
                                          id="banner-upload"
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const objectUrl = URL.createObjectURL(file);
                                              field.onChange(objectUrl);
                                            }
                                          }}
                                        />
                                        <Button type="button" size="sm" variant="outline">
                                          <Upload className="w-4 h-4 mr-1" />
                                          Browse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsNewCustomerDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={createCustomerMutation.isPending}
                            >
                              {createCustomerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                "Add Brand"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Brand Dialog */}
                  <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Brand</DialogTitle>
                        <DialogDescription>
                          Update brand information
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                          <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brand Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter brand name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={editForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={editForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter company name" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter address" 
                                    {...field} 
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="brandLogoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Brand Logo
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex items-center">
                                          <Info className="ml-1 h-4 w-4 text-gray-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="w-80">
                                        <p>Brand logo displays in RCS message headers. Recommended size: Square, 224x224 pixels.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-shrink-0 w-12 h-12 border rounded-md overflow-hidden">
                                        {field.value ? (
                                          <img 
                                            src={field.value} 
                                            alt="Brand logo" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">Upload or enter URL</div>
                                        <div className="text-xs text-gray-500">Square image recommended (224x224px)</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="url"
                                        placeholder="https://example.com/logo.png"
                                        {...field}
                                        value={field.value || ''}
                                        className="flex-1"
                                      />
                                      <div className="relative">
                                        <input
                                          type="file"
                                          id="edit-logo-upload"
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const objectUrl = URL.createObjectURL(file);
                                              field.onChange(objectUrl);
                                            }
                                          }}
                                        />
                                        <Button type="button" size="sm" variant="outline">
                                          <Upload className="w-4 h-4 mr-1" />
                                          Browse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="brandColor"
                            render={({ field }) => {
                              // Define color palette options
                              const colorPalette = [
                                // Brand colors
                                "#1E88E5", // Blue
                                "#D81B60", // Pink
                                "#43A047", // Green
                                "#E53935", // Red
                                "#5E35B1", // Deep Purple
                                "#FB8C00", // Orange
                                "#00ACC1", // Cyan
                                "#3949AB", // Indigo
                                "#8E24AA", // Purple
                                "#F4511E", // Deep Orange
                                "#039BE5", // Light Blue
                                "#7CB342", // Light Green
                                "#C0CA33", // Lime
                                "#00897B", // Teal
                                "#FDD835", // Yellow
                                "#6D4C41", // Brown
                                "#546E7A", // Blue Grey
                                "#757575", // Grey
                                "#000000", // Black
                                "#E91E63", // Pink
                              ];
                              
                              return (
                                <FormItem>
                                  <FormLabel>
                                    Brand Color
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="inline-flex items-center">
                                            <Info className="ml-1 h-4 w-4 text-gray-400" />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-80">
                                          <p>Brand color used for accents and text color on rich card actions/replies.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="flex flex-col gap-3">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-10 h-10 border rounded-md flex-shrink-0" 
                                          style={{backgroundColor: field.value || '#ffffff'}}
                                        ></div>
                                        <div className="flex-1">
                                          <div className="text-sm font-medium">Selected color</div>
                                          <div className="text-xs text-gray-500">{field.value || 'No color selected'}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-10 gap-1">
                                        {colorPalette.map((color) => (
                                          <button
                                            key={color}
                                            type="button"
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${field.value === color ? 'border-primary scale-110' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                          />
                                        ))}
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="text"
                                          placeholder="#FF5733"
                                          {...field}
                                          value={field.value || ''}
                                          className="flex-1"
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                          }}
                                        />
                                        <div className="relative">
                                          <input
                                            type="color"
                                            id="edit-color-picker"
                                            value={field.value || '#ffffff'}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                              field.onChange(e.target.value);
                                            }}
                                          />
                                          <Button type="button" size="sm" variant="outline">
                                            <Palette className="w-4 h-4 mr-1" />
                                            Custom
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="brandBannerUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Brand Banner
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex items-center">
                                          <Info className="ml-1 h-4 w-4 text-gray-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="w-80">
                                        <p>Brand banner image for large format display. Recommended size: 1440x448 pixels.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-shrink-0 w-20 h-8 border rounded-md overflow-hidden">
                                        {field.value ? (
                                          <img 
                                            src={field.value} 
                                            alt="Brand banner" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">Upload or enter URL</div>
                                        <div className="text-xs text-gray-500">Banner image (1440x448px)</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="url"
                                        placeholder="https://example.com/banner.png"
                                        {...field}
                                        value={field.value || ''}
                                        className="flex-1"
                                      />
                                      <div className="relative">
                                        <input
                                          type="file"
                                          id="edit-banner-upload"
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const objectUrl = URL.createObjectURL(file);
                                              field.onChange(objectUrl);
                                            }
                                          }}
                                        />
                                        <Button type="button" size="sm" variant="outline">
                                          <Upload className="w-4 h-4 mr-1" />
                                          Browse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditCustomerDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={updateCustomerMutation.isPending}
                            >
                              {updateCustomerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Delete Confirmation Dialog */}
                  <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Delete Brand</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this brand?
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-6">
                        <p className="text-sm text-gray-500 mb-4">
                          This action cannot be undone. This will permanently delete the brand
                          <span className="font-medium text-gray-900">
                            {selectedCustomer ? ` "${selectedCustomer.name}"` : ""}
                          </span> and all associated data.
                        </p>
                        
                        {selectedCustomer?.brandLogoUrl && (
                          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-md">
                            <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                              <img 
                                src={selectedCustomer.brandLogoUrl} 
                                alt={`${selectedCustomer.name} logo`} 
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{selectedCustomer.name}</h4>
                              {selectedCustomer.company && (
                                <p className="text-xs text-gray-500">{selectedCustomer.company}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDeleteConfirmOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          variant="destructive"
                          disabled={deleteCustomerMutation.isPending}
                          onClick={() => selectedCustomer && deleteCustomerMutation.mutate(selectedCustomer.id)}
                        >
                          {deleteCustomerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Brand"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              {isLoadingCustomers ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : customers?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((customer) => (
                    <Card key={customer.id} className={`overflow-hidden ${customer.brandColor ? `border-l-4` : ''}`} 
                      style={customer.brandColor ? {borderLeftColor: customer.brandColor} : undefined}>
                      <CardHeader className="pb-2 flex flex-row items-center">
                        {customer.brandLogoUrl && (
                          <div className="mr-3 h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                            <img 
                              src={customer.brandLogoUrl} 
                              alt={`${customer.name} logo`} 
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-xl">{customer.name}</CardTitle>
                          {customer.company && (
                            <CardDescription className="flex items-center text-sm">
                              <Building className="h-4 w-4 mr-1 opacity-70" />
                              {customer.company}
                            </CardDescription>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          {customer.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{customer.address}</span>
                            </div>
                          )}
                          {customer.brandColor && (
                            <div className="flex items-center">
                              <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="flex items-center">
                                <div 
                                  className="h-4 w-4 rounded-full mr-2" 
                                  style={{backgroundColor: customer.brandColor}}
                                ></div>
                                <span>{customer.brandColor}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No brands yet</h3>
                  <p className="text-gray-500 mb-6">Add your first brand to associate with campaigns.</p>
                  <Button onClick={() => setIsNewCustomerDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add First Brand
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}