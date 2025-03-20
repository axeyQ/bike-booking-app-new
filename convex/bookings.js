import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all bookings
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("bookings").collect();
  },
});

// Query to get bookings for a specific user
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookings")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Query to get bookings for a specific bike
export const getByBikeId = query({
  args: { bikeId: v.id("bikes") },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookings")
      .filter(q => q.eq(q.field("bikeId"), args.bikeId))
      .collect();
  },
});

// Query to get a specific booking by ID
export const getById = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bookingId);
  },
});

// Mutation to create a new booking
export const create = mutation({
  args: {
    bikeId: v.id("bikes"),
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    totalPrice: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Ensure the bike exists
    const bike = await ctx.db.get(args.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }
    
    // Check if bike is available
    if (!bike.isAvailable) {
      throw new Error("Bike is not available for booking");
    }
    
    // Check for overlapping bookings
    const overlappingBookings = await ctx.db.query("bookings")
      .filter(q => 
        q.and(
          q.eq(q.field("bikeId"), args.bikeId),
          q.lt(q.field("startTime"), args.endTime),
          q.gt(q.field("endTime"), args.startTime),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .collect();
    
    if (overlappingBookings.length > 0) {
      throw new Error("Bike is already booked for this time period");
    }
    
    const timestamp = Date.now();
    return await ctx.db.insert("bookings", {
      bikeId: args.bikeId,
      userId: args.userId,
      startTime: args.startTime,
      endTime: args.endTime,
      totalPrice: args.totalPrice,
      status: "pending", // Initial status
      notes: args.notes || "",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

// Mutation to update booking status
export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.string(), // pending, confirmed, completed, cancelled
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    return await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to update booking details
export const update = mutation({
  args: {
    bookingId: v.id("bookings"),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    totalPrice: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { bookingId, ...updates } = args;
    const booking = await ctx.db.get(bookingId);
    
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    // If changing times, check for conflicts
    if (updates.startTime || updates.endTime) {
      const startTime = updates.startTime || booking.startTime;
      const endTime = updates.endTime || booking.endTime;
      
      const overlappingBookings = await ctx.db.query("bookings")
        .filter(q => 
          q.and(
            q.eq(q.field("bikeId"), booking.bikeId),
            q.neq(q.field("_id"), bookingId),
            q.lt(q.field("startTime"), endTime),
            q.gt(q.field("endTime"), startTime),
            q.neq(q.field("status"), "cancelled")
          )
        )
        .collect();
      
      if (overlappingBookings.length > 0) {
        throw new Error("Cannot update booking: time conflict with existing booking");
      }
    }
    
    return await ctx.db.patch(bookingId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to cancel a booking
export const cancel = mutation({
  args: {
    bookingId: v.id("bookings"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    return await ctx.db.patch(args.bookingId, {
      status: "cancelled",
      notes: args.reason ? `${booking.notes}\nCancellation reason: ${args.reason}` : booking.notes,
      updatedAt: Date.now(),
    });
  },
});