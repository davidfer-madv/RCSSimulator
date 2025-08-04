import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Filter, Copy, Trash2, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import type { Template, InsertTemplate } from "@shared/schema";

const categoryColors = {
  promotional: "bg-green-100 text-green-800",
  announcement: "bg-blue-100 text-blue-800", 
  customer_service: "bg-purple-100 text-purple-800",
  retail: "bg-orange-100 text-orange-800",
  hospitality: "bg-pink-100 text-pink-800",
  healthcare: "bg-red-100 text-red-800"
};

const categoryLabels = {
  promotional: "Promotional",
  announcement: "Announcement",
  customer_service: "Customer Service",
  retail: "Retail",
  hospitality: "Hospitality", 
  healthcare: "Healthcare"
};

export default function TemplatesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    queryFn: getQueryFn(),
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: InsertTemplate) => {
      const response = await apiRequest("POST", "/api/templates", template);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setShowCreateDialog(false);
      toast({ title: "Template created successfully" });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template deleted successfully" });
    }
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest("POST", `/api/templates/${templateId}/use`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Template applied to new campaign" });
    }
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const publicTemplates = filteredTemplates.filter(t => t.isPublic);
  const myTemplates = filteredTemplates.filter(t => !t.isPublic);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-gray-600">Reusable templates for faster campaign creation</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <TemplateForm onSubmit={(data) => createTemplateMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Tabs */}
      <Tabs defaultValue="public" className="space-y-4">
        <TabsList>
          <TabsTrigger value="public">Public Templates ({publicTemplates.length})</TabsTrigger>
          <TabsTrigger value="mine">My Templates ({myTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="space-y-4">
          <TemplateGrid 
            templates={publicTemplates}
            isLoading={isLoading}
            onUse={(id) => useTemplateMutation.mutate(id)}
            onDelete={(id) => deleteTemplateMutation.mutate(id)}
            onPreview={setSelectedTemplate}
            showDelete={false}
          />
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          <TemplateGrid 
            templates={myTemplates}
            isLoading={isLoading}
            onUse={(id) => useTemplateMutation.mutate(id)}
            onDelete={(id) => deleteTemplateMutation.mutate(id)}
            onPreview={setSelectedTemplate}
            showDelete={true}
          />
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          {selectedTemplate && <TemplatePreview template={selectedTemplate} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateGrid({ 
  templates, 
  isLoading, 
  onUse, 
  onDelete, 
  onPreview, 
  showDelete 
}: {
  templates: Template[];
  isLoading: boolean;
  onUse: (id: number) => void;
  onDelete: (id: number) => void;
  onPreview: (template: Template) => void;
  showDelete: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No templates found</div>
        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="mt-1">{template.description}</CardDescription>
              </div>
              <Badge className={categoryColors[template.category as keyof typeof categoryColors]}>
                {categoryLabels[template.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{template.formatType === "richCard" ? "Rich Card" : "Carousel"}</span>
                <span>Used {template.usageCount} times</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onPreview(template)}
                  className="flex-1"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onUse(template.id)}
                  className="flex-1"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Use
                </Button>
                {showDelete && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDelete(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TemplateForm({ onSubmit }: { onSubmit: (data: InsertTemplate) => void }) {
  const [formData, setFormData] = useState<Partial<InsertTemplate>>({
    formatType: "richCard",
    category: "promotional",
    cardOrientation: "vertical",
    mediaHeight: "medium",
    lockAspectRatio: true,
    isPublic: false,
    actions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.formatType) {
      onSubmit(formData as InsertTemplate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={formData.name || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Summer Sale Promotion"
            required
          />
        </div>
        <div>
          <Label htmlFor="template-category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="template-description">Description</Label>
        <Textarea
          id="template-description"
          value={formData.description || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe when to use this template..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="format-type">Format Type</Label>
          <Select 
            value={formData.formatType} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, formatType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="richCard">Rich Card</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="card-orientation">Card Orientation</Label>
          <Select 
            value={formData.cardOrientation} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, cardOrientation: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public-template"
          checked={formData.isPublic}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
        />
        <Label htmlFor="public-template">Make this template public (available to all users)</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Template</Button>
      </div>
    </form>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Format:</span> {template.formatType === "richCard" ? "Rich Card" : "Carousel"}
        </div>
        <div>
          <span className="font-medium">Orientation:</span> {template.cardOrientation}
        </div>
        <div>
          <span className="font-medium">Media Height:</span> {template.mediaHeight}
        </div>
        <div>
          <span className="font-medium">Usage Count:</span> {template.usageCount}
        </div>
      </div>
      
      {template.title && (
        <div>
          <span className="font-medium">Title:</span> {template.title}
        </div>
      )}
      
      {template.description && (
        <div>
          <span className="font-medium">Description:</span> {template.description}
        </div>
      )}
      
      {template.actions && template.actions.length > 0 && (
        <div>
          <span className="font-medium">Actions:</span>
          <div className="mt-2 space-y-1">
            {(template.actions as any[]).map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-sm bg-gray-100 px-2 py-1 rounded">
                <Badge variant="outline">{action.type.toUpperCase()}</Badge>
                <span>{action.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}