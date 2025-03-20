import { clsx } from 'clsx';
import { format, differenceInHours, differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';

/**
 * Combines multiple class names using clsx library
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Formats a date to a specified format
 * @param {Date|number} date - The date to format
 * @param {string} formatString - The format string
 * @returns {string} - The formatted date
 */
export function formatDate(date, formatString = 'PPP') {
  if (!date) return '';
  return format(new Date(date), formatString);
}

/**
 * Formats a time to a specified format
 * @param {Date|number} date - The date to format
 * @param {string} formatString - The format string
 * @returns {string} - The formatted time
 */
export function formatTime(date, formatString = 'p') {
  if (!date) return '';
  return format(new Date(date), formatString);
}

/**
 * Formats a date and time to a specified format
 * @param {Date|number} date - The date to format
 * @param {string} formatString - The format string
 * @returns {string} - The formatted date and time
 */
export function formatDateTime(date, formatString = 'PPp') {
  if (!date) return '';
  return format(new Date(date), formatString);
}

/**
 * Calculates the booking duration in hours and days
 * @param {number} startTime - The start timestamp
 * @param {number} endTime - The end timestamp
 * @returns {Object} - The duration in hours and days
 */
export function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const hours = differenceInHours(end, start);
  const days = differenceInDays(end, start);
  
  return { hours, days };
}

/**
 * Calculates the price based on duration and rates
 * @param {number} startTime - The start timestamp
 * @param {number} endTime - The end timestamp
 * @param {number} hourlyRate - The hourly rate
 * @param {number} dailyRate - The daily rate
 * @returns {number} - The calculated price
 */
export function calculatePrice(startTime, endTime, hourlyRate, dailyRate) {
  const { hours, days } = calculateDuration(startTime, endTime);
  
  // If booking is less than a day, charge by the hour
  if (days < 1) {
    return hours * hourlyRate;
  }
  
  // If booking is at least a day, calculate mixed pricing
  const fullDays = Math.floor(days);
  const remainingHours = hours - (fullDays * 24);
  
  // Calculate day rate for full days
  const dayRate = fullDays * dailyRate;
  
  // Calculate hourly rate for remaining hours (capped at daily rate)
  const hourRate = Math.min(remainingHours * hourlyRate, dailyRate);
  
  return dayRate + hourRate;
}

/**
 * Shows a success toast notification
 * @param {string} message - The message to display
 */
export function showSuccess(message) {
  toast.success(message);
}

/**
 * Shows an error toast notification
 * @param {string|Error} error - The error message or Error object
 */
export function showError(error) {
  const message = error instanceof Error ? error.message : error;
  toast.error(message);
}

/**
 * Shows an info toast notification
 * @param {string} message - The message to display
 */
export function showInfo(message) {
  toast.info(message);
}

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated text
 */
export function truncateText(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Formats a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - The currency code
 * @returns {string} - The formatted price
 */
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Converts an image file to a base64 data URL
 * @param {File} file - The image file
 * @returns {Promise<string>} - A promise that resolves to the data URL
 */
export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Gets the initials from a name
 * @param {string} name - The full name
 * @returns {string} - The initials
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Handles API errors by showing toast notifications
 * @param {Error} error - The error object
 * @returns {void}
 */
export function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.message) {
    showError(error.message);
  } else {
    showError('An unexpected error occurred. Please try again later.');
  }
}