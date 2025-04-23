import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { insertCustomerSchema, insertCampaignSchema, insertRcsFormatSchema, rcsFormatValidationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { saveFile } from "./file-storage";

// Setup multer for in-memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

// Whitelist of allowed image file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Check if user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Customers API
  app.get("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getCustomersByUserId(req.user!.id);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", isAuthenticated, upload.fields([
    { name: 'brandLogo', maxCount: 1 },
    { name: 'brandBanner', maxCount: 1 }
  ]), async (req, res) => {
    try {
      console.log("Creating customer with data:", req.body);
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const customerData = { ...req.body, userId: req.user!.id };
      
      // Process brand logo if provided
      if (files && files.brandLogo && files.brandLogo.length > 0) {
        const logoFile = files.brandLogo[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(logoFile.mimetype)) {
          return res.status(400).json({ 
            message: `Logo must be a valid image file (${ALLOWED_IMAGE_TYPES.join(', ')})` 
          });
        }
        
        // Save the file and get the URL
        const logoUrl = saveFile(logoFile.buffer, logoFile.originalname);
        customerData.brandLogoUrl = logoUrl;
      }
      
      // Process brand banner if provided
      if (files && files.brandBanner && files.brandBanner.length > 0) {
        const bannerFile = files.brandBanner[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(bannerFile.mimetype)) {
          return res.status(400).json({ 
            message: `Banner must be a valid image file (${ALLOWED_IMAGE_TYPES.join(', ')})` 
          });
        }
        
        // Save the file and get the URL
        const bannerUrl = saveFile(bannerFile.buffer, bannerFile.originalname);
        customerData.brandBannerUrl = bannerUrl;
      }
      
      const validatedData = insertCustomerSchema.parse(customerData);
      
      console.log("Validated data:", validatedData);
      
      const customer = await storage.createCustomer(validatedData);
      console.log("Customer created:", customer);
      
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  
  app.get("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomer(customerId);
      
      if (!customer || customer.userId !== req.user!.id) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  app.patch("/api/customers/:id", isAuthenticated, upload.fields([
    { name: 'brandLogo', maxCount: 1 },
    { name: 'brandBanner', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      
      // First check if the customer exists and belongs to this user
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer || existingCustomer.userId !== req.user!.id) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const customerData = { ...req.body };
      
      // Process brand logo if provided
      if (files && files.brandLogo && files.brandLogo.length > 0) {
        const logoFile = files.brandLogo[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(logoFile.mimetype)) {
          return res.status(400).json({ 
            message: `Logo must be a valid image file (${ALLOWED_IMAGE_TYPES.join(', ')})` 
          });
        }
        
        // Save the file and get the URL
        const logoUrl = saveFile(logoFile.buffer, logoFile.originalname);
        customerData.brandLogoUrl = logoUrl;
      }
      
      // Process brand banner if provided
      if (files && files.brandBanner && files.brandBanner.length > 0) {
        const bannerFile = files.brandBanner[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(bannerFile.mimetype)) {
          return res.status(400).json({ 
            message: `Banner must be a valid image file (${ALLOWED_IMAGE_TYPES.join(', ')})` 
          });
        }
        
        // Save the file and get the URL
        const bannerUrl = saveFile(bannerFile.buffer, bannerFile.originalname);
        customerData.brandBannerUrl = bannerUrl;
      }
      
      // Validate the update data
      const validatedData = insertCustomerSchema.partial().parse(customerData);
      
      // Update the customer
      const updatedCustomer = await storage.updateCustomer(customerId, validatedData);
      
      res.json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update brand" });
    }
  });
  
  app.delete("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      
      // First check if the customer exists and belongs to this user
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer || existingCustomer.userId !== req.user!.id) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      // Delete the customer
      const success = await storage.deleteCustomer(customerId);
      
      if (success) {
        res.status(200).json({ message: "Brand deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete brand" });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Campaigns API
  app.get("/api/campaigns", isAuthenticated, async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUserId(req.user!.id);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.get("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.patch("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const updatedCampaign = await storage.updateCampaign(campaignId, req.body);
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // RCS Formats API
  app.get("/api/rcs-formats", isAuthenticated, async (req, res) => {
    try {
      const formats = await storage.getRcsFormatsByUserId(req.user!.id);
      res.json(formats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch RCS formats" });
    }
  });

  app.post("/api/rcs-formats", isAuthenticated, upload.array('images', 10), async (req, res) => {
    try {
      const formatData = JSON.parse(req.body.formatData || '{}');
      
      // Add userId to the data
      formatData.userId = req.user!.id;
      
      // Handle image uploads
      if (req.files && Array.isArray(req.files)) {
        const imageUrls: string[] = [];
        
        for (const file of req.files as Express.Multer.File[]) {
          // Validate file type
          if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            return res.status(400).json({ 
              message: `Images must be valid formats (${ALLOWED_IMAGE_TYPES.join(', ')})` 
            });
          }
          
          // Save the file and get the URL
          const imageUrl = saveFile(file.buffer, file.originalname);
          imageUrls.push(imageUrl);
        }
        
        if (imageUrls.length > 0) {
          formatData.imageUrls = imageUrls;
        }
      }
      
      // Ensure we have at least an empty array if no images provided
      formatData.imageUrls = formatData.imageUrls || [];
      
      // If we have processed images but Multer didn't capture them, use them
      if (formatData.imageUrls.length === 0 && Array.isArray(formatData.processedImageUrls)) {
        formatData.imageUrls = formatData.processedImageUrls;
      }
      
      // Make sure we have valid data for required fields
      if (!formatData.formatType) formatData.formatType = "richCard";
      if (!formatData.cardOrientation) formatData.cardOrientation = "vertical";
      if (!formatData.mediaHeight) formatData.mediaHeight = "medium";
      
      // Add campaign and brand related fields
      if (!formatData.campaignName) {
        formatData.campaignName = formatData.title || "Untitled Campaign";
      }
      
      console.log("Saving RCS format with data:", formatData);
      
      const validatedData = rcsFormatValidationSchema.parse(formatData);
      const rcsFormat = await storage.createRcsFormat(validatedData);
      
      res.status(201).json(rcsFormat);
    } catch (error) {
      console.error("Error saving RCS format:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create RCS format" });
    }
  });

  app.get("/api/rcs-formats/:id", isAuthenticated, async (req, res) => {
    try {
      const format = await storage.getRcsFormat(parseInt(req.params.id));
      
      if (!format || format.userId !== req.user!.id) {
        return res.status(404).json({ message: "RCS format not found" });
      }
      
      res.json(format);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch RCS format" });
    }
  });

  app.get("/api/campaign/:campaignId/formats", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const formats = await storage.getRcsFormatsByCampaignId(campaignId);
      res.json(formats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch RCS formats" });
    }
  });

  // Statistics API
  app.get("/api/statistics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      const totalFormats = await storage.countRcsFormatsByUserId(userId);
      const activeCampaigns = await storage.countCampaignsByUserIdAndStatus(userId, "active");
      const totalCustomers = await storage.countCustomersByUserId(userId);
      
      res.json({
        totalFormats,
        activeCampaigns,
        totalCustomers
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
