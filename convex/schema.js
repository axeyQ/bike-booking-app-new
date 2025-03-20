import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Bikes table to store all bike information
  bikes: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.string(), // mountain, road, city, etc.
    pricePerHour: v.number(),
    pricePerDay: v.number(),
    images: v.array(v.string()), // URLs to images
    specifications: v.object({
      brand: v.string(),
      model: v.string(),
      frameSize: v.string(),
      wheelSize: v.string(),
      color: v.string(),
      weight: v.optional(v.number()),
      gears: v.optional(v.number()),
    }),
    isAvailable: v.boolean(),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  }),

  // Bookings table for all reservations
  bookings: defineTable({
    bikeId: v.id("bikes"),
    userId: v.string(), // Clerk user ID
    startTime: v.number(), // timestamp
    endTime: v.number(), // timestamp
    totalPrice: v.number(),
    status: v.string(), // pending, confirmed, completed, cancelled
    notes: v.optional(v.string()),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  }),

  // User profile table (extending Clerk profiles)
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    isAdmin: v.boolean(),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  }),

  // Table for storing analytics data
  analytics: defineTable({
    date: v.string(), // YYYY-MM-DD
    totalBookings: v.number(),
    revenue: v.number(),
    activeUsers: v.number(),
    popularBikes: v.array(v.id("bikes")),
    createdAt: v.number(), // timestamp
  }),
});