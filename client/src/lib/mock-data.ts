// Mock data for demo purposes
import { Campaign, Customer, RcsFormat } from "@shared/schema";

export const mockCampaigns: Partial<Campaign>[] = [
  {
    id: 1,
    name: "Summer Promotion",
    description: "Summer promotional campaign for retail customers",
    status: "active",
    customerId: 1,
    userId: 1,
    formatType: "richCard",
    provider: "Google Messages"
  },
  {
    id: 2,
    name: "New Product Launch",
    description: "Campaign for new product line introduction",
    status: "active",
    customerId: 2,
    userId: 1,
    formatType: "carousel",
    provider: "Apple Business Chat"
  },
  {
    id: 3,
    name: "Holiday Special",
    description: "Special holiday messaging campaign",
    status: "scheduled",
    customerId: 1,
    userId: 1,
    formatType: "richCard",
    provider: "Google Messages"
  }
];

export const mockCustomers: Partial<Customer>[] = [
  {
    id: 1,
    name: "ABC Corporation",
    company: "ABC Corp",
    email: "contact@abccorp.com",
    phone: "+1 (555) 123-4567",
    description: "Global retail chain with over 500 locations"
  },
  {
    id: 2,
    name: "Tech Innovations",
    company: "Tech Innovations LLC",
    email: "info@techinnovations.io",
    phone: "+1 (555) 987-6543",
    description: "Technology startup focused on IoT solutions"
  }
];

export const mockStats = {
  totalFormats: 5,
  activeCampaigns: 3,
  totalCustomers: 10
};