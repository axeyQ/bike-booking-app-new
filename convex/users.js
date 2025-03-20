import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get a user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users")
      .filter(q => q.eq(q.field("clerkId"), args.clerkId))
      .collect();
    
    return users[0];
  },
});

// Query to get all users
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Query to check if a user is an admin
export const isAdmin = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users")
      .filter(q => q.eq(q.field("clerkId"), args.clerkId))
      .collect();
    
    if (users.length === 0) {
      return false;
    }
    
    return users[0].isAdmin;
  },
});

// Mutation to create or update a user profile
export const createOrUpdate = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const { clerkId, ...userData } = args;
    
    // Check if user already exists
    const existingUsers = await ctx.db.query("users")
      .filter(q => q.eq(q.field("clerkId"), clerkId))
      .collect();
    
    if (existingUsers.length > 0) {
      // Update existing user
      return await ctx.db.patch(existingUsers[0]._id, {
        ...userData,
        updatedAt: timestamp,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId,
        ...userData,
        isAdmin: userData.isAdmin || false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  },
});

// Mutation to promote a user to admin
export const setAdminStatus = mutation({
  args: {
    userId: v.id("users"),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return await ctx.db.patch(args.userId, {
      isAdmin: args.isAdmin,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to update user profile
export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...updates } = args;
    
    const existingUsers = await ctx.db.query("users")
      .filter(q => q.eq(q.field("clerkId"), clerkId))
      .collect();
    
    if (existingUsers.length === 0) {
      throw new Error("User not found");
    }
    
    return await ctx.db.patch(existingUsers[0]._id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});