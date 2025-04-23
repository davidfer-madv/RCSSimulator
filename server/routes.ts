import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { insertCustomerSchema, insertCampaignSchema, insertRcsFormatSchema, rcsFormatValidationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";

// Setup multer for in-memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

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

  app.post("/api/customers", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating customer with data:", req.body);
      
      const validatedData = insertCustomerSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
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

  app.patch("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      
      // First check if the customer exists and belongs to this user
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer || existingCustomer.userId !== req.user!.id) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      // Validate the update data
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      
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
          // In a production environment, we would upload to cloud storage
          // For development, we'll use placeholders with timestamped filenames
          const imageUrl = `/uploads/${Date.now()}-${file.originalname}`;
          imageUrls.push(imageUrl);
        }
        
        formatData.imageUrls = imageUrls;
      } else {
        // For development, ensure there's at least something in imageUrls
        formatData.imageUrls = formatData.imageUrls || [];
        
        // If we have processed images but Multer didn't capture them, use placeholders
        if (formatData.imageUrls.length === 0 && Array.isArray(formatData.processedImageUrls)) {
          formatData.imageUrls = formatData.processedImageUrls;
        }
      }
      
      // Make sure we have valid data for required fields
      if (!formatData.formatType) formatData.formatType = "richCard";
      if (!formatData.cardOrientation) formatData.cardOrientation = "vertical";
      if (!formatData.mediaHeight) formatData.mediaHeight = "medium";
      
      // Add campaign-related fields
      if (!formatData.campaignName) {
        formatData.campaignName = formatData.title || "Untitled Campaign";
      }
      
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
