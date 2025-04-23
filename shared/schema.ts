import { pgTable, text, serial, integer, boolean, json, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Customer schema (Brand)
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  brandLogoUrl: text("brand_logo_url"), // Brand logo URL (224x224px)
  brandColor: text("brand_color"), // Brand color in hex format (e.g., #FF5733)
  brandBannerUrl: text("brand_banner_url"), // Brand banner image URL (1440x448px)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

// Campaign schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft, active, scheduled, completed
  formatType: text("format_type").notNull(), // richCard, carousel
  provider: text("provider"),
  scheduledDate: timestamp("scheduled_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

// RCS Format schema
export const rcsFormats = pgTable("rcs_formats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  formatType: text("format_type").notNull(), // richCard, carousel
  cardOrientation: text("card_orientation").default("vertical"), // vertical, horizontal
  mediaHeight: text("media_height").default("medium"), // short, medium, tall
  lockAspectRatio: boolean("lock_aspect_ratio").default(true),
  brandLogoUrl: text("brand_logo_url"),
  verificationSymbol: boolean("verification_symbol").default(false),
  title: text("title"),
  description: text("description"),
  actions: json("actions").default([]),
  imageUrls: json("image_urls").default([]),
  brandName: text("brand_name"), // Added to store brand name
  campaignName: text("campaign_name"), // Added to store campaign name 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRcsFormatSchema = createInsertSchema(rcsFormats).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertRcsFormat = z.infer<typeof insertRcsFormatSchema>;
export type RcsFormat = typeof rcsFormats.$inferSelect;

// Action type schemas
const actionTextSchema = z.object({
  text: z.string().min(1, "Action text is required"),
  type: z.literal("text"),
  value: z.string().optional(),
});

const actionUrlSchema = z.object({
  text: z.string().min(1, "Action text is required"),
  type: z.enum(["url", "phone", "calendar"]),
  value: z.string().min(1, "Action value is required"),
});

// Schema for action items
export const actionSchema = z.discriminatedUnion("type", [
  actionTextSchema,
  actionUrlSchema
]);

export type Action = z.infer<typeof actionSchema>;

// Extended schema for RCS format with validations
export const rcsFormatValidationSchema = insertRcsFormatSchema.extend({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
  formatType: z.enum(["richCard", "carousel"], {
    errorMap: () => ({ message: "Format type must be either Rich Card or Carousel" }),
  }),
  cardOrientation: z.enum(["vertical", "horizontal"], {
    errorMap: () => ({ message: "Card orientation must be either Vertical or Horizontal" }),
  }).optional().default("vertical").nullable(),
  mediaHeight: z.enum(["short", "medium", "tall"], {
    errorMap: () => ({ message: "Media height must be Short, Medium, or Tall" }),
  }).optional().default("medium").nullable(),
  lockAspectRatio: z.boolean().optional().default(true).nullable(),
  brandLogoUrl: z.string().url("Brand logo must be a valid URL").optional().nullable(),
  verificationSymbol: z.boolean().optional().default(false).nullable(),
  actions: z.array(actionSchema).max(4, "Maximum of 4 actions allowed").optional().default([]),
  imageUrls: z.array(z.string())
    .min(1, "At least one image is required")
    .max(10, "Maximum of 10 images for carousel"),
  brandName: z.string().optional().nullable(),    // Added for storing brand name
  campaignName: z.string().optional().nullable(), // Added for storing campaign name
});
