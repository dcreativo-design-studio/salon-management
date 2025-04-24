// utils/dateUtils.js

/**
 * Format a date object to a readable date string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string (e.g. "Monday, January 1, 2023")
 */
const formatDate = (date) => {
    if (!date) return '';

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Date(date).toLocaleDateString('en-US', options);
  };

  /**
   * Format a date object to a readable time string
   * @param {Date} date - The date to format
   * @returns {string} - Formatted time string (e.g. "2:30 PM")
   */
  const formatTime = (date) => {
    if (!date) return '';

    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    return new Date(date).toLocaleTimeString('en-US', options);
  };

  /**
   * Get the time in hours and minutes
   * @param {Date} date - The date to extract time from
   * @returns {Object} - {hours, minutes}
   */
  const getTimeComponents = (date) => {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes()
    };
  };

  /**
   * Check if two date ranges overlap
   * @param {Date} startA - Start of first range
   * @param {Date} endA - End of first range
   * @param {Date} startB - Start of second range
   * @param {Date} endB - End of second range
   * @returns {boolean} - True if ranges overlap
   */
  const doDateRangesOverlap = (startA, endA, startB, endB) => {
    return (startA < endB && endA > startB);
  };

  /**
   * Get the next occurrence of a day of the week from a given date
   * @param {Date} date - The reference date
   * @param {number} dayOfWeek - Day of the week (0 = Sunday, 6 = Saturday)
   * @returns {Date} - Next occurrence of the day of the week
   */
  const getNextDayOfWeek = (date, dayOfWeek) => {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
  };

  /**
   * Check if a date is in the past
   * @param {Date} date - The date to check
   * @returns {boolean} - True if date is in the past
   */
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  /**
   * Check if a date is today
   * @param {Date} date - The date to check
   * @returns {boolean} - True if date is today
   */
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  /**
   * Add days to a date
   * @param {Date} date - The base date
   * @param {number} days - Number of days to add
   * @returns {Date} - New date with days added
   */
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  /**
   * Convert time string (HH:MM) to minutes
   * @param {string} timeString - Time in format "HH:MM"
   * @returns {number} - Minutes since midnight
   */
  const timeStringToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  /**
   * Convert minutes to time object
   * @param {number} minutes - Minutes since midnight
   * @returns {Object} - {hours, minutes}
   */
  const minutesToTimeObject = (minutes) => {
    return {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    };
  };

  module.exports = {
    formatDate,
    formatTime,
    getTimeComponents,
    doDateRangesOverlap,
    getNextDayOfWeek,
    isPastDate,
    isToday,
    addDays,
    timeStringToMinutes,
    minutesToTimeObject
  };
