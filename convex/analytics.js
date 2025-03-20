import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get daily analytics for a date range
export const getDaily = query({
  args: {
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("analytics")
      .filter(q => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();
  },
});

// Query to get summary analytics
export const getSummary = query({
  args: {
    days: v.number(), // Number of days to look back
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - args.days);
    
    const startDate = pastDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const analytics = await ctx.db.query("analytics")
      .filter(q => 
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();
    
    // Calculate summary statistics
    let totalRevenue = 0;
    let totalBookings = 0;
    let activeUsers = new Set();
    let bikesFrequency = {};
    
    for (const day of analytics) {
      totalRevenue += day.revenue;
      totalBookings += day.totalBookings;
      
      // Count unique active users
      if (day.activeUsers > 0) {
        activeUsers.add(day.date);
      }
      
      // Count bike popularity
      for (const bikeId of day.popularBikes) {
        bikesFrequency[bikeId] = (bikesFrequency[bikeId] || 0) + 1;
      }
    }
    
    // Get most popular bikes (sort by frequency)
    const popularBikes = Object.entries(bikesFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    return {
      totalRevenue,
      totalBookings,
      uniqueActiveDays: activeUsers.size,
      popularBikes,
      dateRange: {
        startDate,
        endDate,
      },
    };
  },
});

// Mutation to update daily analytics
export const updateDaily = mutation({
  args: {
    date: v.string(), // YYYY-MM-DD
    totalBookings: v.number(),
    revenue: v.number(),
    activeUsers: v.number(),
    popularBikes: v.array(v.id("bikes")),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Check if analytics for this date already exist
    const existingAnalytics = await ctx.db.query("analytics")
      .filter(q => q.eq(q.field("date"), args.date))
      .collect();
    
    if (existingAnalytics.length > 0) {
      // Update existing analytics
      return await ctx.db.patch(existingAnalytics[0]._id, {
        ...args,
        createdAt: timestamp,
      });
    } else {
      // Create new analytics
      return await ctx.db.insert("analytics", {
        ...args,
        createdAt: timestamp,
      });
    }
  },
});

// Function to calculate and update analytics for a specific date
export const calculateDailyAnalytics = mutation({
  args: {
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const { date } = args;
    
    // Convert date string to timestamps for the start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const endTimestamp = endOfDay.getTime();
    
    // Get all bookings for the day
    const dailyBookings = await ctx.db.query("bookings")
      .filter(q => 
        q.and(
          q.gte(q.field("createdAt"), startTimestamp),
          q.lte(q.field("createdAt"), endTimestamp)
        )
      )
      .collect();
    
    // Calculate metrics
    const totalBookings = dailyBookings.length;
    let revenue = 0;
    const bikeFrequency = {};
    const activeUserIds = new Set();
    
    for (const booking of dailyBookings) {
      // Sum up revenue
      revenue += booking.totalPrice;
      
      // Count bike frequency
      bikeFrequency[booking.bikeId] = (bikeFrequency[booking.bikeId] || 0) + 1;
      
      // Count unique users
      activeUserIds.add(booking.userId);
    }
    
    // Get popular bikes (sort by booking frequency)
    const popularBikes = Object.entries(bikeFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    // Update analytics for the day
    return await ctx.db.query("analytics")
      .filter(q => q.eq(q.field("date"), date))
      .collect()
      .then(async (existingAnalytics) => {
        const analyticsData = {
          date,
          totalBookings,
          revenue,
          activeUsers: activeUserIds.size,
          popularBikes,
          createdAt: Date.now(),
        };
        
        if (existingAnalytics.length > 0) {
          return await ctx.db.patch(existingAnalytics[0]._id, analyticsData);
        } else {
          return await ctx.db.insert("analytics", analyticsData);
        }
      });
  },
});