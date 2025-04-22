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

// Customer schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
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
  title: text("title"),
  description: text("description"),
  actions: json("actions").default([]),
  imageUrls: json("image_urls").default([]),
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

// Extended schema for RCS format with validations
export const rcsFormatValidationSchema = insertRcsFormatSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title cannot exceed 50 characters"),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
  formatType: z.enum(["richCard", "carousel"], {
    errorMap: () => ({ message: "Format type must be either Rich Card or Carousel" }),
  }),
  actions: z.array(z.object({
    text: z.string().min(1, "Action text is required"),
    type: z.enum(["url", "phone", "calendar"], {
      errorMap: () => ({ message: "Action type must be URL, Phone, or Calendar" }),
    }),
    value: z.string().min(1, "Action value is required"),
  })).optional(),
  imageUrls: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
});

// Schema for action items
export const actionSchema = z.object({
  text: z.string().min(1, "Action text is required"),
  type: z.enum(["url", "phone", "calendar"]),
  value: z.string().min(1, "Action value is required"),
});

export type Action = z.infer<typeof actionSchema>;
