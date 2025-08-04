import { 
  User, InsertUser, 
  Customer, InsertCustomer, 
  Campaign, InsertCampaign, 
  RcsFormat, InsertRcsFormat,
  WebhookConfig, InsertWebhookConfig,
  WebhookLog,
  Template, InsertTemplate,
  Analytics
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Enhanced storage interface with CRUD operations for all entities
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomersByUserId(userId: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<boolean>;
  countCustomersByUserId(userId: number): Promise<number>;
  
  // Campaigns
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignsByUserId(userId: number): Promise<Campaign[]>;
  getCampaignsByCustomerId(customerId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<boolean>;
  countCampaignsByUserIdAndStatus(userId: number, status: string): Promise<number>;
  
  // RCS Formats
  getRcsFormat(id: number): Promise<RcsFormat | undefined>;
  getRcsFormatsByUserId(userId: number): Promise<RcsFormat[]>;
  getRcsFormatsByCampaignId(campaignId: number): Promise<RcsFormat[]>;
  createRcsFormat(format: InsertRcsFormat): Promise<RcsFormat>;
  updateRcsFormat(id: number, format: Partial<RcsFormat>): Promise<RcsFormat>;
  deleteRcsFormat(id: number): Promise<boolean>;
  countRcsFormatsByUserId(userId: number): Promise<number>;
  
  // Webhook Configurations
  getWebhookConfig(id: number): Promise<WebhookConfig | undefined>;
  getWebhookConfigsByUserId(userId: number): Promise<WebhookConfig[]>;
  createWebhookConfig(webhookConfig: InsertWebhookConfig): Promise<WebhookConfig>;
  updateWebhookConfig(id: number, webhookConfig: Partial<WebhookConfig>): Promise<WebhookConfig>;
  deleteWebhookConfig(id: number): Promise<boolean>;
  
  // Webhook Logs
  getWebhookLogsByUserId(userId: number): Promise<WebhookLog[]>;
  createWebhookLog(log: Omit<WebhookLog, 'id'>): Promise<WebhookLog>;
  updateWebhookLog(id: number, log: Partial<WebhookLog>): Promise<WebhookLog>;
  
  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplatesByUserId(userId: number): Promise<Template[]>;
  getPublicTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<Template>): Promise<Template>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Analytics
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  createAnalytics(analytics: Omit<Analytics, 'id'>): Promise<Analytics>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private campaigns: Map<number, Campaign>;
  private rcsFormats: Map<number, RcsFormat>;
  private webhookConfigs: Map<number, WebhookConfig>;
  private webhookLogs: Map<number, WebhookLog>;
  private templates: Map<number, Template>;
  private analytics: Map<number, Analytics>;
  
  // Counters for IDs
  private userIdCounter: number;
  private customerIdCounter: number;
  private campaignIdCounter: number;
  private rcsFormatIdCounter: number;
  private webhookConfigIdCounter: number;
  private webhookLogIdCounter: number;
  private templateIdCounter: number;
  private analyticsIdCounter: number;
  
  // Session store
  sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.campaigns = new Map();
    this.rcsFormats = new Map();
    this.webhookConfigs = new Map();
    this.webhookLogs = new Map();
    this.templates = new Map();
    this.analytics = new Map();
    
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.campaignIdCounter = 1;
    this.rcsFormatIdCounter = 1;
    this.webhookConfigIdCounter = 1;
    this.webhookLogIdCounter = 1;
    this.templateIdCounter = 1;
    this.analyticsIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with a default test user for development
    this.initializeTestUsers();
  }

  // Initialize test users for development
  private async initializeTestUsers() {
    try {
      // Create a test user with hashed password
      const scrypt = (await import("crypto")).scrypt;
      const randomBytes = (await import("crypto")).randomBytes;
      const { promisify } = await import("util");
      
      const scryptAsync = promisify(scrypt);
      
      // Hash password "test" for test user
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync("test", salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      // Create test user
      const testUser: User = {
        id: this.userIdCounter++,
        username: "test",
        password: hashedPassword,
        email: "test@example.com",
        fullName: "Test User",
        createdAt: new Date()
      };
      
      this.users.set(testUser.id, testUser);
      
      // Create another test user "David"
      const salt2 = randomBytes(16).toString("hex");
      const buf2 = (await scryptAsync("password", salt2, 64)) as Buffer;
      const hashedPassword2 = `${buf2.toString("hex")}.${salt2}`;
      
      const davidUser: User = {
        id: this.userIdCounter++,
        username: "David",
        password: hashedPassword2,
        email: "david@example.com",
        fullName: "David Johnson",
        createdAt: new Date()
      };
      
      this.users.set(davidUser.id, davidUser);
      
      console.log("✓ Initialized test users: 'test' (password: test), 'David' (password: password)");
    } catch (error) {
      console.error("Failed to initialize test users:", error);
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    // Ensure null values for optional fields
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      name: insertUser.name ?? null,
      email: insertUser.email ?? null 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }
  
  async getCustomersByUserId(userId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId
    );
  }
  
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const createdAt = new Date();
    const customer: Customer = { 
      ...insertCustomer, 
      id, 
      createdAt,
      email: insertCustomer.email || null,
      phone: insertCustomer.phone || null,
      company: insertCustomer.company || null,
      address: insertCustomer.address || null,
      brandLogoUrl: insertCustomer.brandLogoUrl || null,
      brandColor: insertCustomer.brandColor || null,
      brandBannerUrl: insertCustomer.brandBannerUrl || null
    };
    this.customers.set(id, customer);
    return customer;
  }
  
  async updateCustomer(id: number, customerUpdate: Partial<Customer>): Promise<Customer> {
    const customer = this.customers.get(id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    const updatedCustomer = { ...customer, ...customerUpdate };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  
  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }
  
  async countCustomersByUserId(userId: number): Promise<number> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId
    ).length;
  }
  
  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async getCampaignsByUserId(userId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      (campaign) => campaign.userId === userId
    );
  }
  
  async getCampaignsByCustomerId(customerId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      (campaign) => campaign.customerId === customerId
    );
  }
  
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignIdCounter++;
    const createdAt = new Date();
    const campaign: Campaign = { ...insertCampaign, id, createdAt };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async updateCampaign(id: number, campaignUpdate: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error(`Campaign with ID ${id} not found`);
    }
    
    const updatedCampaign = { ...campaign, ...campaignUpdate };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
  
  async countCampaignsByUserIdAndStatus(userId: number, status: string): Promise<number> {
    return Array.from(this.campaigns.values()).filter(
      (campaign) => campaign.userId === userId && campaign.status === status
    ).length;
  }
  
  // RCS Format methods
  async getRcsFormat(id: number): Promise<RcsFormat | undefined> {
    return this.rcsFormats.get(id);
  }
  
  async getRcsFormatsByUserId(userId: number): Promise<RcsFormat[]> {
    return Array.from(this.rcsFormats.values()).filter(
      (format) => format.userId === userId
    );
  }
  
  async getRcsFormatsByCampaignId(campaignId: number): Promise<RcsFormat[]> {
    return Array.from(this.rcsFormats.values()).filter(
      (format) => format.campaignId === campaignId
    );
  }
  
  async createRcsFormat(insertFormat: InsertRcsFormat): Promise<RcsFormat> {
    const id = this.rcsFormatIdCounter++;
    const createdAt = new Date();
    const format: RcsFormat = { ...insertFormat, id, createdAt };
    this.rcsFormats.set(id, format);
    return format;
  }
  
  async updateRcsFormat(id: number, formatUpdate: Partial<RcsFormat>): Promise<RcsFormat> {
    const format = this.rcsFormats.get(id);
    if (!format) {
      throw new Error(`RCS Format with ID ${id} not found`);
    }
    
    const updatedFormat = { ...format, ...formatUpdate };
    this.rcsFormats.set(id, updatedFormat);
    return updatedFormat;
  }
  
  async deleteRcsFormat(id: number): Promise<boolean> {
    return this.rcsFormats.delete(id);
  }
  
  async countRcsFormatsByUserId(userId: number): Promise<number> {
    return Array.from(this.rcsFormats.values()).filter(
      (format) => format.userId === userId
    ).length;
  }
  
  // Webhook Configuration methods
  async getWebhookConfig(id: number): Promise<WebhookConfig | undefined> {
    return this.webhookConfigs.get(id);
  }
  
  async getWebhookConfigsByUserId(userId: number): Promise<WebhookConfig[]> {
    return Array.from(this.webhookConfigs.values()).filter(
      (config) => config.userId === userId
    );
  }
  
  async createWebhookConfig(insertConfig: InsertWebhookConfig): Promise<WebhookConfig> {
    const id = this.webhookConfigIdCounter++;
    const createdAt = new Date();
    const config: WebhookConfig = { 
      ...insertConfig, 
      id, 
      createdAt,
      token: insertConfig.token || null,
      lastUsed: null,
      isActive: insertConfig.isActive !== undefined ? insertConfig.isActive : true
    };
    this.webhookConfigs.set(id, config);
    return config;
  }
  
  async updateWebhookConfig(id: number, configUpdate: Partial<WebhookConfig>): Promise<WebhookConfig> {
    const config = this.webhookConfigs.get(id);
    if (!config) {
      throw new Error(`Webhook Configuration with ID ${id} not found`);
    }
    
    const updatedConfig = { ...config, ...configUpdate };
    this.webhookConfigs.set(id, updatedConfig);
    return updatedConfig;
  }
  
  async deleteWebhookConfig(id: number): Promise<boolean> {
    return this.webhookConfigs.delete(id);
  }

  // Webhook Logs
  async getWebhookLogsByUserId(userId: number): Promise<WebhookLog[]> {
    return Array.from(this.webhookLogs.values()).filter(log => {
      // Find campaign for this log and check if it belongs to the user
      const campaign = this.campaigns.get(log.campaignId || 0);
      return campaign?.userId === userId;
    });
  }

  async createWebhookLog(log: Omit<WebhookLog, 'id'>): Promise<WebhookLog> {
    const id = this.webhookLogIdCounter++;
    const newLog: WebhookLog = {
      id,
      webhookId: log.webhookId,
      campaignId: log.campaignId,
      formatId: log.formatId,
      phoneNumber: log.phoneNumber,
      status: log.status,
      response: log.response,
      deliveredAt: log.deliveredAt || null,
      readAt: log.readAt || null,
      clickedAt: log.clickedAt || null,
      sentAt: log.sentAt || new Date()
    };
    this.webhookLogs.set(id, newLog);
    return newLog;
  }

  async updateWebhookLog(id: number, log: Partial<WebhookLog>): Promise<WebhookLog> {
    const existing = this.webhookLogs.get(id);
    if (!existing) throw new Error("Webhook log not found");
    
    const updated = { ...existing, ...log };
    this.webhookLogs.set(id, updated);
    return updated;
  }

  // Templates
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplatesByUserId(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.userId === userId);
  }

  async getPublicTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.isPublic);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const newTemplate: Template = {
      id,
      ...template,
      usageCount: 0,
      createdAt: new Date()
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: number, template: Partial<Template>): Promise<Template> {
    const existing = this.templates.get(id);
    if (!existing) throw new Error("Template not found");
    
    const updated = { ...existing, ...template };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Analytics
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.userId === userId);
  }

  async createAnalytics(analytics: Omit<Analytics, 'id'>): Promise<Analytics> {
    const id = this.analyticsIdCounter++;
    const newAnalytics: Analytics = {
      id,
      ...analytics,
      date: analytics.date || new Date()
    };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }
}

// For this project, we're using MemStorage for development
export const storage = new MemStorage();
