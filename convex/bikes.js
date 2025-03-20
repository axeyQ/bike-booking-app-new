import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all bikes
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("bikes").collect();
  },
});

// Query to get a specific bike by ID
export const getById = query({
  args: { bikeId: v.id("bikes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bikeId);
  },
});

// Query to get available bikes for a specific time period
export const getAvailable = query({
  args: { 
    startTime: v.number(),
    endTime: v.number()
  },
  handler: async (ctx, args) => {
    // Get all bikes
    const allBikes = await ctx.db.query("bikes")
      .filter(q => q.eq(q.field("isAvailable"), true))
      .collect();
    
    // Get all bookings that overlap with the requested time period
    const overlappingBookings = await ctx.db.query("bookings")
      .filter(q => 
        q.and(
          q.lt(q.field("startTime"), args.endTime),
          q.gt(q.field("endTime"), args.startTime),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .collect();
    
    // Get IDs of bikes that are already booked
    const bookedBikeIds = new Set(overlappingBookings.map(booking => booking.bikeId));
    
    // Filter out booked bikes
    return allBikes.filter(bike => !bookedBikeIds.has(bike._id));
  },
});

// Mutation to create a new bike
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("bikes", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

// Mutation to update an existing bike
export const update = mutation({
  args: {
    bikeId: v.id("bikes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    pricePerHour: v.optional(v.number()),
    pricePerDay: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    specifications: v.optional(v.object({
      brand: v.string(),
      model: v.string(),
      frameSize: v.string(),
      wheelSize: v.string(),
      color: v.string(),
      weight: v.optional(v.number()),
      gears: v.optional(v.number()),
    })),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { bikeId, ...updates } = args;
    const bike = await ctx.db.get(bikeId);
    
    if (!bike) {
      throw new Error("Bike not found");
    }
    
    return await ctx.db.patch(bikeId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to delete a bike
export const remove = mutation({
  args: { bikeId: v.id("bikes") },
  handler: async (ctx, args) => {
    // Check if the bike exists
    const bike = await ctx.db.get(args.bikeId);
    
    if (!bike) {
      throw new Error("Bike not found");
    }
    
    // Check if the bike has any bookings
    const bookings = await ctx.db.query("bookings")
      .filter(q => q.eq(q.field("bikeId"), args.bikeId))
      .collect();
    
    if (bookings.length > 0) {
      // Instead of deleting, mark as unavailable
      return await ctx.db.patch(args.bikeId, { 
        isAvailable: false,
        updatedAt: Date.now()
      });
    }
    
    // If no bookings, delete the bike
    return await ctx.db.delete(args.bikeId);
  },
});