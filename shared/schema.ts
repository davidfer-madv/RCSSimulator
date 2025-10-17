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
  formatType: text("format_type").notNull(), // message, richCard, carousel
  provider: text("provider"),
  scheduledDate: timestamp("scheduled_date"),
  isActive: boolean("is_active").default(false), // Whether campaign is currently active
  activatedAt: timestamp("activated_at"), // When the campaign was last activated
  targetPhoneNumbers: json("target_phone_numbers").default([]), // List of phone numbers to send to
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
  formatType: text("format_type").notNull(), // message, richCard, carousel
  cardOrientation: text("card_orientation").default("vertical"), // vertical, horizontal
  mediaHeight: text("media_height").default("medium"), // short, medium, tall
  lockAspectRatio: boolean("lock_aspect_ratio").default(true),
  brandLogoUrl: text("brand_logo_url"),
  verificationSymbol: boolean("verification_symbol").default(false),
  title: text("title"),
  description: text("description"),
  messageText: text("message_text"), // For simple text messages
  actions: json("actions").default([]), // Suggested actions (URL, Dial, Calendar, Location)
  replies: json("replies").default([]), // Suggested replies (quick text responses)
  imageUrls: json("image_urls").default([]),
  brandName: text("brand_name"), // Added to store brand name
  campaignName: text("campaign_name"), // Added to store campaign name 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRcsFormatSchema = createInsertSchema(rcsFormats).omit({
  id: true,
  createdAt: true,
});

// Webhook configuration schema
export const webhookConfigs = pgTable("webhook_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  token: text("token"), // Authentication token if needed
  provider: text("provider").notNull(), // google, apple, etc.
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebhookConfigSchema = createInsertSchema(webhookConfigs).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

// Webhook log schema to track sent messages
export const webhookLogs = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id").references(() => webhookConfigs.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  formatId: integer("format_id").references(() => rcsFormats.id),
  phoneNumber: text("phone_number"),
  status: text("status").notNull(), // success, failed
  response: text("response"),
  sentAt: timestamp("sent_at").defaultNow(),
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

export type InsertWebhookConfig = z.infer<typeof insertWebhookConfigSchema>;
export type WebhookConfig = typeof webhookConfigs.$inferSelect;

export type WebhookLog = typeof webhookLogs.$inferSelect;

// Suggested Reply schema (quick text responses)
export const suggestedReplySchema = z.object({
  text: z.string().min(1, "Reply text is required").max(25, "Reply text cannot exceed 25 characters"),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

export type SuggestedReply = z.infer<typeof suggestedReplySchema>;

// Action type schemas for Suggested Actions
const actionUrlSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("url"),
  url: z.string().url("Must be a valid URL"),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionDialSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("dial"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionCalendarSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("calendar"),
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"), // ISO 8601 format
  endTime: z.string().min(1, "End time is required"), // ISO 8601 format
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionViewLocationSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("viewLocation"),
  latitude: z.number(),
  longitude: z.number(),
  label: z.string().optional(),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionShareLocationSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("shareLocation"),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionOpenAppSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("openApp"),
  packageName: z.string().min(1, "Package name is required"),
  appData: z.string().optional(),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionWalletSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("wallet"),
  walletPassUrl: z.string().url("Must be a valid URL"),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

const actionMapsSchema = z.object({
  text: z.string().min(1, "Action text is required").max(25, "Action text cannot exceed 25 characters"),
  type: z.literal("maps"),
  query: z.string().min(1, "Map query or address is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  postbackData: z.string().max(2048, "Postback data cannot exceed 2048 characters").optional(),
});

// Schema for action items (Suggested Actions)
export const actionSchema = z.discriminatedUnion("type", [
  actionUrlSchema,
  actionDialSchema,
  actionCalendarSchema,
  actionViewLocationSchema,
  actionShareLocationSchema,
  actionOpenAppSchema,
  actionWalletSchema,
  actionMapsSchema,
]);

export type Action = z.infer<typeof actionSchema>;

// Extended schema for RCS format with validations
export const rcsFormatValidationSchema = insertRcsFormatSchema.extend({
  title: z.string().max(200, "Title cannot exceed 200 characters").optional().nullable(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
  messageText: z.string().max(2000, "Message text cannot exceed 2000 characters").optional().nullable(),
  formatType: z.enum(["message", "richCard", "carousel", "chip"], {
    errorMap: () => ({ message: "Format type must be Message, Rich Card, Carousel, or Chip List" }),
  }),
  cardOrientation: z.enum(["vertical", "horizontal"], {
    errorMap: () => ({ message: "Card orientation must be either Vertical or Horizontal" }),
  }).optional().default("vertical").nullable(),
  mediaHeight: z.enum(["short", "medium", "tall"], {
    errorMap: () => ({ message: "Media height must be Short, Medium, or Tall" }),
  }).optional().default("medium").nullable(),
  lockAspectRatio: z.boolean().optional().default(true).nullable(),
  brandLogoUrl: z.string().optional().nullable(),
  verificationSymbol: z.boolean().optional().default(false).nullable(),
  actions: z.array(actionSchema).max(4, "Maximum of 4 suggested actions allowed per card").optional().default([]),
  replies: z.array(suggestedReplySchema).max(11, "Maximum of 11 suggested replies allowed").optional().default([]),
  imageUrls: z.array(z.string())
    .max(10, "Maximum of 10 images for carousel")
    .optional()
    .default([]),
  brandName: z.string().optional().nullable(),
  campaignName: z.string().optional().nullable(),
}).refine((data) => {
  // Format-specific validation
  if (data.formatType === "message" || data.formatType === "chip") {
    // Message and Chip formats: messageText is required
    return data.messageText && data.messageText.trim().length > 0;
  } else {
    // Rich Card and Carousel formats: title is required
    return data.title && data.title.trim().length > 0;
  }
}, (data) => ({
  message: data.formatType === "message" || data.formatType === "chip"
    ? "Message text is required for message and chip list formats" 
    : "Title is required for richCard and carousel formats",
  path: data.formatType === "message" || data.formatType === "chip" ? ["messageText"] : ["title"],
}));
