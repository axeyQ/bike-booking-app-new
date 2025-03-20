import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Helper function to get date ranges (outside of component)
const getDateRange = (days) => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);
  
  return {
    startDate: pastDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

// Custom hook for daily analytics
export function useDailyAnalytics(startDate, endDate) {
  return useQuery(
    api.analytics.getDaily, 
    startDate && endDate ? { startDate, endDate } : null
  );
}

// Custom hook for last week analytics
export function useLastWeekAnalytics() {
  const { startDate, endDate } = getDateRange(7);
  return useDailyAnalytics(startDate, endDate);
}

// Custom hook for last month analytics
export function useLastMonthAnalytics() {
  const { startDate, endDate } = getDateRange(30);
  return useDailyAnalytics(startDate, endDate);
}

// Custom hook for summary data
export function useSummary(days) {
  return useQuery(api.analytics.getSummary, days ? { days } : null);
}

// Convenience hooks for common summary periods
export function useWeekSummary() {
  return useSummary(7);
}

export function useMonthSummary() {
  return useSummary(30);
}

export function useYearSummary() {
  return useSummary(365);
}

// Main analytics hook
export function useAnalytics() {
  // Mutations
  const updateDailyAnalytics = useMutation(api.analytics.updateDaily);
  const calculateDailyAnalytics = useMutation(api.analytics.calculateDailyAnalytics);
  
  return {
    // Mutation functions
    updateDailyAnalytics,
    calculateDailyAnalytics,
  };
}