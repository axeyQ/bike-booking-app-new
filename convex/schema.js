import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    isAdmin: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  // Bikes table
  bikes: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.string(),
    pricePerHour: v.number(),
    pricePerDay: v.number(),
    images: v.array(v.string()),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Bookings table
  bookings: defineTable({
    bikeId: v.id("bikes"),
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    totalPrice: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Analytics table
  analytics: defineTable({
    date: v.string(),
    totalBookings: v.number(),
    revenue: v.number(),
    activeUsers: v.number(),
    popularBikes: v.array(v.id("bikes")),
    createdAt: v.number(),
  }),
});