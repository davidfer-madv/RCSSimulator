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
  status: text("status").notNull(), // pending, delivered, read, failed, clicked
  response: text("response"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  clickedAt: timestamp("clicked_at"),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Template schema for reusable message templates
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // promotional, announcement, customer_service, retail, hospitality, healthcare
  formatType: text("format_type").notNull(), // richCard, carousel
  cardOrientation: text("card_orientation").default("vertical"),
  mediaHeight: text("media_height").default("medium"),
  lockAspectRatio: boolean("lock_aspect_ratio").default(true),
  title: text("title"),
  description: text("template_description"),
  actions: json("actions").default([]),
  imageUrls: json("image_urls").default([]),
  isPublic: boolean("is_public").default(false), // Whether template is available to all users
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

// Analytics schema for tracking campaign performance
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  formatId: integer("format_id").references(() => rcsFormats.id),
  date: timestamp("date").defaultNow(),
  messagesSent: integer("messages_sent").default(0),
  messagesDelivered: integer("messages_delivered").default(0),
  messagesRead: integer("messages_read").default(0),
  messagesClicked: integer("messages_clicked").default(0),
  messagesFailed: integer("messages_failed").default(0),
  engagementRate: integer("engagement_rate").default(0), // Percentage * 100
  clickThroughRate: integer("click_through_rate").default(0), // Percentage * 100
});

// A/B Testing schema for comparing different message variants
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"), // draft, running, completed
  variantA: json("variant_a").notNull(), // RCS format configuration
  variantB: json("variant_b").notNull(), // RCS format configuration
  trafficSplit: integer("traffic_split").default(50), // Percentage for variant A (0-100)
  winnerVariant: text("winner_variant"), // A or B
  confidenceLevel: integer("confidence_level").default(95),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
});

// Team workspace schema for collaboration
export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  brandGuidelinesUrl: text("brand_guidelines_url"),
  approvalRequired: boolean("approval_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
});

// Workspace members schema
export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").notNull().references(() => workspaces.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"), // owner, admin, editor, viewer
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Brand guidelines schema for enforcing consistency
export const brandGuidelines = pgTable("brand_guidelines", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id),
  customerId: integer("customer_id").references(() => customers.id),
  primaryColor: text("primary_color").notNull(),
  secondaryColor: text("secondary_color"),
  fontFamily: text("font_family"),
  logoUsageRules: text("logo_usage_rules"),
  toneOfVoice: text("tone_of_voice"),
  messagingGuidelines: text("messaging_guidelines"),
  prohibitedWords: json("prohibited_words").default([]),
  requiredDisclaimer: text("required_disclaimer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBrandGuidelinesSchema = createInsertSchema(brandGuidelines).omit({
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

export type InsertWebhookConfig = z.infer<typeof insertWebhookConfigSchema>;
export type WebhookConfig = typeof webhookConfigs.$inferSelect;

export type WebhookLog = typeof webhookLogs.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type Analytics = typeof analytics.$inferSelect;

export type InsertAbTest = z.infer<typeof insertAbTestSchema>;
export type AbTest = typeof abTests.$inferSelect;

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;

export type InsertBrandGuidelines = z.infer<typeof insertBrandGuidelinesSchema>;
export type BrandGuidelines = typeof brandGuidelines.$inferSelect;

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
  brandLogoUrl: z.string().optional().nullable(), // Allow any string value for now
  verificationSymbol: z.boolean().optional().default(false).nullable(),
  actions: z.array(actionSchema).max(4, "Maximum of 4 actions allowed").optional().default([]),
  imageUrls: z.array(z.string())
    .min(1, "At least one image is required")
    .max(10, "Maximum of 10 images for carousel"),
  brandName: z.string().optional().nullable(),    // Added for storing brand name
  campaignName: z.string().optional().nullable(), // Added for storing campaign name
});
