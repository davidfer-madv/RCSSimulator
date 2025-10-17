import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { 
  insertCustomerSchema, insertCampaignSchema, insertRcsFormatSchema, 
  rcsFormatValidationSchema, insertWebhookConfigSchema, WebhookConfig,
  Campaign, RcsFormat
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { saveFile } from "./file-storage";
import { z } from "zod";

// Setup multer for in-memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

// Whitelist of allowed image file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Check if user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log("Auth check - isAuthenticated:", !!req.isAuthenticated?.());
    console.log("Auth check - user present:", !!req.user?.id);
  }
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Test endpoint to see users (remove in production)
  app.get("/api/test/users", async (req, res) => {
    try {
      // Get all users (for debugging only)
      const allUsers = Array.from((storage as any).users.values()).map((user: any) => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password
      }));
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Statistics API
  app.get("/api/statistics", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get counts for the current user
      const customers = await storage.getCustomersByUserId(userId);
      const campaigns = await storage.getCampaignsByUserId(userId);
      const formats = await storage.getRcsFormatsByUserId(userId);
      
      res.json({
        totalCustomers: customers.length,
        totalCampaigns: campaigns.length,
        totalFormats: formats.length,
        activeCampaigns: campaigns.filter((c: Campaign) => c.status === 'active').length,
      });
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

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

  app.post("/api/rcs-formats", isAuthenticated, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'brandLogo', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const formatData = JSON.parse(req.body.formatData || '{}');
      
      // Add userId to the data
      formatData.userId = req.user!.id;
      
      // Handle image uploads
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Process main images
        if (files.images && files.images.length > 0) {
          const imageUrls: string[] = [];
          
          for (const file of files.images) {
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
        
        // Process brand logo if present
        if (files.brandLogo && files.brandLogo.length > 0) {
          const brandLogoFile = files.brandLogo[0];
          
          // Validate file type
          if (!ALLOWED_IMAGE_TYPES.includes(brandLogoFile.mimetype)) {
            return res.status(400).json({ 
              message: `Brand logo must be a valid format (${ALLOWED_IMAGE_TYPES.join(', ')})` 
            });
          }
          
          // Save the brand logo and get the URL
          const brandLogoUrl = saveFile(brandLogoFile.buffer, brandLogoFile.originalname);
          
          // Check if the brand ID exists and update the customer record with the new logo URL
          if (formatData.customerId) {
            try {
              const customerId = parseInt(formatData.customerId);
              const customer = await storage.getCustomer(customerId);
              
              if (customer && customer.userId === req.user!.id) {
                // Update the customer with the new brand logo URL if it exists
                await storage.updateCustomer(customerId, { brandLogoUrl });
                console.log(`Updated customer ${customerId} with brand logo URL: ${brandLogoUrl}`);
              }
            } catch (error) {
              console.error("Error updating customer brand logo:", error);
              // Continue even if customer update fails
            }
          }
          
          // Update the format data with the brand logo URL
          formatData.brandLogoUrl = brandLogoUrl;
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
      
      // First check if we need to create a new campaign
      let campaignId = formatData.campaignId;
      if (!campaignId && formatData.campaignName) {
        try {
          // Get customer ID if provided
          let customerId = null;
          if (formatData.customerId) {
            // Parse customerId from string to number
            try {
              customerId = parseInt(formatData.customerId);
              console.log("Using customer ID:", customerId);
              
              // Verify the customer exists and belongs to this user
              const customer = await storage.getCustomer(customerId);
              if (!customer || customer.userId !== req.user!.id) {
                console.log("Invalid customer ID or not owned by user");
                customerId = null;
              }
            } catch (error) {
              console.error("Error parsing customerId:", error);
              customerId = null;
            }
          }
          
          // Create a new campaign with active/scheduled settings
          const campaignData: any = {
            name: formatData.campaignName,
            userId: req.user!.id,
            formatType: formatData.formatType,
            customerId: customerId,
            description: formatData.description || null,
          };

          // Set active campaign status if specified
          if (formatData.isActive) {
            campaignData.isActive = true;
            
            // If there are target phone numbers, store them
            if (formatData.targetPhoneNumbers && Array.isArray(formatData.targetPhoneNumbers)) {
              campaignData.targetPhoneNumbers = formatData.targetPhoneNumbers;
            }
            
            // Handle scheduled date
            if (formatData.scheduledDate) {
              campaignData.scheduledDate = new Date(formatData.scheduledDate);
              campaignData.status = 'scheduled';
            } else {
              campaignData.status = 'active';
              campaignData.activatedAt = new Date();
            }
          } else {
            campaignData.status = 'draft';
            campaignData.isActive = false;
          }
          
          const campaign = await storage.createCampaign(campaignData);
          
          console.log("Created new campaign:", campaign);
          campaignId = campaign.id;
          
          // Update formatData with the new campaign ID
          formatData.campaignId = campaignId;
        } catch (campaignError) {
          console.error("Error creating campaign:", campaignError);
          // Continue with RCS format creation even if campaign creation fails
        }
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

  // Webhook API
  app.get("/api/webhooks", isAuthenticated, async (req, res) => {
    try {
      const webhooks = await storage.getWebhookConfigsByUserId(req.user!.id);
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webhook configurations" });
    }
  });

  app.post("/api/webhooks", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertWebhookConfigSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const webhook = await storage.createWebhookConfig(validatedData);
      res.status(201).json(webhook);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create webhook configuration" });
    }
  });

  app.patch("/api/webhooks/:id", isAuthenticated, async (req, res) => {
    try {
      const webhookId = parseInt(req.params.id);
      const webhook = await storage.getWebhookConfig(webhookId);
      
      if (!webhook || webhook.userId !== req.user!.id) {
        return res.status(404).json({ message: "Webhook configuration not found" });
      }
      
      const updatedWebhook = await storage.updateWebhookConfig(webhookId, req.body);
      res.json(updatedWebhook);
    } catch (error) {
      res.status(500).json({ message: "Failed to update webhook configuration" });
    }
  });

  app.delete("/api/webhooks/:id", isAuthenticated, async (req, res) => {
    try {
      const webhookId = parseInt(req.params.id);
      const webhook = await storage.getWebhookConfig(webhookId);
      
      if (!webhook || webhook.userId !== req.user!.id) {
        return res.status(404).json({ message: "Webhook configuration not found" });
      }
      
      const success = await storage.deleteWebhookConfig(webhookId);
      
      if (success) {
        res.status(200).json({ message: "Webhook configuration deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete webhook configuration" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete webhook configuration" });
    }
  });
  
  // Test webhook with a campaign
  app.post("/api/webhooks/:id/test", isAuthenticated, async (req, res) => {
    try {
      const webhookId = parseInt(req.params.id);
      const webhook = await storage.getWebhookConfig(webhookId);
      
      if (!webhook || webhook.userId !== req.user!.id) {
        return res.status(404).json({ message: "Webhook configuration not found" });
      }
      
      if (!webhook.isActive) {
        return res.status(400).json({ message: "Webhook is not active" });
      }
      
      // Validate request body
      const testSchema = z.object({
        campaignId: z.number(),
        phoneNumbers: z.array(z.string())
      });
      
      const validatedData = testSchema.parse(req.body);
      
      // Get campaign and formats
      const campaign = await storage.getCampaign(validatedData.campaignId);
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (!campaign.isActive) {
        return res.status(400).json({ message: "Campaign is not active" });
      }
      
      const formats = await storage.getRcsFormatsByCampaignId(campaign.id);
      if (!formats || formats.length === 0) {
        return res.status(400).json({ message: "Campaign has no RCS formats" });
      }
      
      // Prepare phone numbers to send to
      const phoneNumbers = validatedData.phoneNumbers;
      if (phoneNumbers.length === 0) {
        return res.status(400).json({ message: "No phone numbers provided" });
      }
      
      // Log the webhook test
      await storage.updateWebhookConfig(webhookId, { lastUsed: new Date() });
      
      // Send to each phone number
      const results = await Promise.all(phoneNumbers.map(async (phoneNumber) => {
        try {
          // Process formats for this phone number
          const formatPromises = formats.map(async (format) => {
            // Prepare RCS message payload
            const rcsPayload = {
              formatType: format.formatType,
              orientation: format.cardOrientation,
              mediaHeight: format.mediaHeight,
              title: format.title,
              description: format.description,
              imageUrls: format.imageUrls,
              brandLogoUrl: format.brandLogoUrl,
              actions: format.actions,
              verificationSymbol: format.verificationSymbol,
              phone: phoneNumber,
              campaign: campaign.name
            };
            
            // Make request to webhook
            const response = await fetch(webhook.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(webhook.token ? { 'Authorization': `Bearer ${webhook.token}` } : {})
              },
              body: JSON.stringify(rcsPayload)
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Webhook request failed (${response.status}): ${errorText}`);
            }
            
            return { success: true, format: format.id };
          });
          
          const formatResults = await Promise.all(formatPromises);
          return { phoneNumber, success: true, formats: formatResults };
        } catch (error: any) {
          return { phoneNumber, success: false, error: error.message };
        }
      }));
      
      // Notify websocket clients of the test
      const connections = activeConnections.get(req.user!.id);
      if (connections) {
        const message = JSON.stringify({
          type: 'WEBHOOK_TEST',
          data: {
            campaign: campaign.id,
            webhook: webhook.id,
            results
          }
        });
        
        connections.forEach(connection => {
          if (connection.readyState === WebSocket.OPEN) {
            connection.send(message);
          }
        });
      }
      
      res.json({ success: true, results });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error('Webhook test error:', error);
      res.status(500).json({ message: `Failed to test webhook: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  // Campaign Activation API
  app.post("/api/campaigns/:id/activate", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Update campaign status to active
      const activatedCampaign = await storage.updateCampaign(campaignId, {
        isActive: true,
        activatedAt: new Date()
      });
      
      res.json(activatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to activate campaign" });
    }
  });

  app.post("/api/campaigns/:id/deactivate", isAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Update campaign status to inactive
      const deactivatedCampaign = await storage.updateCampaign(campaignId, {
        isActive: false
      });
      
      res.json(deactivatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to deactivate campaign" });
    }
  });

  // Send RCS message via webhook
  app.post("/api/rcs/send", isAuthenticated, async (req, res) => {
    try {
      const sendSchema = z.object({
        campaignId: z.number(),
        formatId: z.number(),
        webhookId: z.number(),
        phoneNumbers: z.array(z.string()).optional(),
      });
      
      const validatedData = sendSchema.parse(req.body);
      
      // Get campaign, format and webhook configuration
      const campaign = await storage.getCampaign(validatedData.campaignId);
      const format = await storage.getRcsFormat(validatedData.formatId);
      const webhook = await storage.getWebhookConfig(validatedData.webhookId);
      
      if (!campaign || campaign.userId !== req.user!.id) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (!format || format.userId !== req.user!.id) {
        return res.status(404).json({ message: "RCS format not found" });
      }
      
      if (!webhook || webhook.userId !== req.user!.id) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      // Prepare phone numbers to send to
      const phoneNumbers = validatedData.phoneNumbers || campaign.targetPhoneNumbers as string[];
      
      // Prepare RCS message payload
      const rcsPayload = {
        formatType: format.formatType,
        orientation: format.cardOrientation,
        mediaHeight: format.mediaHeight,
        title: format.title,
        description: format.description,
        images: format.imageUrls,
        actions: format.actions,
        brand: {
          name: format.brandName,
          logoUrl: format.brandLogoUrl,
          verified: format.verificationSymbol,
        },
        recipients: phoneNumbers,
      };
      
      // Call webhook to send RCS message
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': webhook.token ? `Bearer ${webhook.token}` : '',
        },
        body: JSON.stringify(rcsPayload),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      // Update webhook last used timestamp
      await storage.updateWebhookConfig(webhook.id, {
        lastUsed: new Date()
      });
      
      // Return success response
      res.json({
        message: "RCS message sent successfully",
        recipients: phoneNumbers.length,
      });
    } catch (error) {
      console.error("Error sending RCS message:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      
      res.status(500).json({ message: "Failed to send RCS message" });
    }
  });

  // Setup WebSocket server for real-time updates
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active WebSocket connections
  const activeConnections: Map<number, Set<WebSocket>> = new Map();
  
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    let userId: number | null = null;
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Authentication message
        if (data.type === 'auth' && data.userId) {
          userId = parseInt(data.userId);
          
          // Add this connection to the user's set of connections
          if (!activeConnections.has(userId)) {
            activeConnections.set(userId, new Set());
          }
          activeConnections.get(userId)?.add(ws);
          
          console.log(`WebSocket authenticated for user ${userId}`);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      
      // Remove from active connections
      if (userId) {
        const connections = activeConnections.get(userId);
        if (connections) {
          connections.delete(ws);
          if (connections.size === 0) {
            activeConnections.delete(userId);
          }
        }
      }
    });
  });
  
  // Helper function to send updates to a specific user
  function notifyUser(userId: number, data: any) {
    const connections = activeConnections.get(userId);
    if (connections) {
      const message = JSON.stringify(data);
      connections.forEach((connection) => {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(message);
        }
      });
    }
  }

  return httpServer;
}
