import {
    format,
    addDays,
    addMonths,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isSameDay,
    isBefore,
    isAfter,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    parseISO,
  } from 'date-fns';
  
  /**
   * Gets the start of day timestamp
   * @param {Date|number} date - The date
   * @returns {number} - The start of day timestamp
   */
  export function getStartOfDay(date) {
    return startOfDay(new Date(date)).getTime();
  }
  
  /**
   * Gets the end of day timestamp
   * @param {Date|number} date - The date
   * @returns {number} - The end of day timestamp
   */
  export function getEndOfDay(date) {
    return endOfDay(new Date(date)).getTime();
  }
  
  /**
   * Gets the date range for a week
   * @param {Date|number} date - A date in the week
   * @returns {Object} - The start and end date of the week
   */
  export function getWeekRange(date) {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
    return {
      start: start.getTime(),
      end: end.getTime(),
    };
  }
  
  /**
   * Gets the date range for a month
   * @param {Date|number} date - A date in the month
   * @returns {Object} - The start and end date of the month
   */
  export function getMonthRange(date) {
    const start = startOfMonth(new Date(date));
    const end = endOfMonth(new Date(date));
    return {
      start: start.getTime(),
      end: end.getTime(),
    };
  }
  
  /**
   * Checks if a date is today
   * @param {Date|number} date - The date to check
   * @returns {boolean} - True if the date is today
   */
  export function isToday(date) {
    return isSameDay(new Date(date), new Date());
  }
  
  /**
   * Checks if a date is in the past
   * @param {Date|number} date - The date to check
   * @returns {boolean} - True if the date is in the past
   */
  export function isPast(date) {
    return isBefore(new Date(date), new Date());
  }
  
  /**
   * Checks if a date is in the future
   * @param {Date|number} date - The date to check
   * @returns {boolean} - True if the date is in the future
   */
  export function isFuture(date) {
    return isAfter(new Date(date), new Date());
  }
  
  /**
   * Gets a range of dates for a calendar
   * @param {number} year - The year
   * @param {number} month - The month (0-11)
   * @returns {Array<Date>} - Array of dates for the calendar
   */
  export function getCalendarDates(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = endOfMonth(firstDay);
    
    // Get the first day of the week for this month
    const startDate = startOfWeek(firstDay, { weekStartsOn: 1 });
    
    // Get the last day of the week for the last day of the month
    const endDate = endOfWeek(lastDay, { weekStartsOn: 1 });
    
    const dates = [];
    let currentDate = startDate;
    
    // Generate all dates between start and end dates
    while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  }
  
  /**
   * Gets date ranges for reporting periods
   * @param {string} period - The period type ('week', 'month', 'quarter', 'year')
   * @returns {Object} - The start and end date for the period
   */
  export function getReportDateRange(period) {
    const now = new Date();
    let start;
    
    switch (period) {
      case 'week':
        start = addDays(now, -7);
        break;
      case 'month':
        start = addDays(now, -30);
        break;
      case 'quarter':
        start = addDays(now, -90);
        break;
      case 'year':
        start = addDays(now, -365);
        break;
      default:
        start = addDays(now, -30); // Default to a month
    }
    
    return {
      start: startOfDay(start).getTime(),
      end: endOfDay(now).getTime(),
    };
  }
  
  /**
   * Formats a timestamp to ISO date string (YYYY-MM-DD)
   * @param {number} timestamp - The timestamp
   * @returns {string} - The ISO date string
   */
  export function formatToISODate(timestamp) {
    return format(new Date(timestamp), 'yyyy-MM-dd');
  }
  
  /**
   * Parses an ISO date string to a timestamp
   * @param {string} dateString - The ISO date string
   * @returns {number} - The timestamp
   */
  export function parseISODateToTimestamp(dateString) {
    return parseISO(dateString).getTime();
  }
  
  /**
   * Checks if a date range overlaps with another date range
   * @param {number} start1 - Start of first range
   * @param {number} end1 - End of first range
   * @param {number} start2 - Start of second range
   * @param {number} end2 - End of second range
   * @returns {boolean} - True if the ranges overlap
   */
  export function doDateRangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }
  
  /**
   * Gets an array of months for a dropdown
   * @returns {Array<Object>} - Array of month objects with id and name
   */
  export function getMonthOptions() {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      name: format(new Date(2000, i, 1), 'MMMM'),
    }));
  }
  
  /**
   * Gets an array of years for a dropdown
   * @param {number} startYear - The start year
   * @param {number} endYear - The end year
   * @returns {Array<Object>} - Array of year objects with id and name
   */
  export function getYearOptions(startYear = 2020, endYear = new Date().getFullYear() + 2) {
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => ({
        id: startYear + i,
        name: (startYear + i).toString(),
      })
    );
  }
  
  /**
   * Gets the human-readable duration between two dates
   * @param {number} start - Start timestamp
   * @param {number} end - End timestamp
   * @returns {string} - Human-readable duration
   */
  export function getHumanReadableDuration(start, end) {
    const days = differenceInDays(end, start);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    
    const hours = differenceInHours(end, start);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    const minutes = differenceInMinutes(end, start);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }