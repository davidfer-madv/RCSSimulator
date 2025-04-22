import { 
  User, InsertUser, 
  Customer, InsertCustomer, 
  Campaign, InsertCampaign, 
  RcsFormat, InsertRcsFormat,
  users, customers, campaigns, rcsFormats
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async getCustomersByUserId(userId: number): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.userId, userId));
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(insertCustomer).returning();
    return result[0];
  }

  async updateCustomer(id: number, customerUpdate: Partial<Customer>): Promise<Customer> {
    const result = await db
      .update(customers)
      .set(customerUpdate)
      .where(eq(customers.id, id))
      .returning();
    return result[0];
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });
    return result.length > 0;
  }

  async countCustomersByUserId(userId: number): Promise<number> {
    const result = await db
      .select({ count: customers })
      .from(customers)
      .where(eq(customers.userId, userId));
    return Number(result[0]?.count || 0);
  }

  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async getCampaignsByUserId(userId: number): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async getCampaignsByCustomerId(customerId: number): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.customerId, customerId));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(insertCampaign).returning();
    return result[0];
  }

  async updateCampaign(id: number, campaignUpdate: Partial<Campaign>): Promise<Campaign> {
    const result = await db
      .update(campaigns)
      .set(campaignUpdate)
      .where(eq(campaigns.id, id))
      .returning();
    return result[0];
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db
      .delete(campaigns)
      .where(eq(campaigns.id, id))
      .returning({ id: campaigns.id });
    return result.length > 0;
  }

  async countCampaignsByUserIdAndStatus(userId: number, status: string): Promise<number> {
    const result = await db
      .select({ count: campaigns })
      .from(campaigns)
      .where(and(eq(campaigns.userId, userId), eq(campaigns.status, status)));
    return Number(result[0]?.count || 0);
  }

  // RCS Format methods
  async getRcsFormat(id: number): Promise<RcsFormat | undefined> {
    const result = await db.select().from(rcsFormats).where(eq(rcsFormats.id, id));
    return result[0];
  }

  async getRcsFormatsByUserId(userId: number): Promise<RcsFormat[]> {
    return await db.select().from(rcsFormats).where(eq(rcsFormats.userId, userId));
  }

  async getRcsFormatsByCampaignId(campaignId: number): Promise<RcsFormat[]> {
    return await db.select().from(rcsFormats).where(eq(rcsFormats.campaignId, campaignId));
  }

  async createRcsFormat(insertFormat: InsertRcsFormat): Promise<RcsFormat> {
    const result = await db.insert(rcsFormats).values(insertFormat).returning();
    return result[0];
  }

  async updateRcsFormat(id: number, formatUpdate: Partial<RcsFormat>): Promise<RcsFormat> {
    const result = await db
      .update(rcsFormats)
      .set(formatUpdate)
      .where(eq(rcsFormats.id, id))
      .returning();
    return result[0];
  }

  async deleteRcsFormat(id: number): Promise<boolean> {
    const result = await db
      .delete(rcsFormats)
      .where(eq(rcsFormats.id, id))
      .returning({ id: rcsFormats.id });
    return result.length > 0;
  }

  async countRcsFormatsByUserId(userId: number): Promise<number> {
    const result = await db
      .select({ count: rcsFormats })
      .from(rcsFormats)
      .where(eq(rcsFormats.userId, userId));
    return Number(result[0]?.count || 0);
  }
}