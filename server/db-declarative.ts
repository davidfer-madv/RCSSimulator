import { relations } from 'drizzle-orm';
import { 
  users, customers, campaigns, rcsFormats
} from "@shared/schema";

// Define relationships (this doesn't modify the database, just sets up the ORM relations)
export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  campaigns: many(campaigns),
  rcsFormats: many(rcsFormats),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  campaigns: many(campaigns),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [campaigns.customerId],
    references: [customers.id],
  }),
  rcsFormats: many(rcsFormats),
}));

export const rcsFormatsRelations = relations(rcsFormats, ({ one }) => ({
  user: one(users, {
    fields: [rcsFormats.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [rcsFormats.campaignId],
    references: [campaigns.id],
  }),
}));