import { 
  User, InsertUser, 
  Customer, InsertCustomer, 
  Campaign, InsertCampaign, 
  RcsFormat, InsertRcsFormat
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
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private campaigns: Map<number, Campaign>;
  private rcsFormats: Map<number, RcsFormat>;
  
  // Counters for IDs
  private userIdCounter: number;
  private customerIdCounter: number;
  private campaignIdCounter: number;
  private rcsFormatIdCounter: number;
  
  // Session store
  sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.campaigns = new Map();
    this.rcsFormats = new Map();
    
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.campaignIdCounter = 1;
    this.rcsFormatIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
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
      address: insertCustomer.address || null 
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
}

import { DatabaseStorage } from "./database-storage";

// Choose either MemStorage or DatabaseStorage based on environment
// For this project, we're using DatabaseStorage
export const storage = new DatabaseStorage();
