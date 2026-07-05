/**
 * Date formatting utilities
 * Handles timezone conversions and date formatting
 */

/**
 * Format UTC datetime to Philippine time (PHT is UTC+8)
 * Format: "YYYY-MM-DD HH:mm:ss" in 24-hour format
 * @param {string} utcDatetime - UTC datetime string (e.g., "2026-07-03T07:25:02.000000Z")
 * @returns {string} Formatted Philippine datetime
 * 
 * @example
 * formatToPhilippineTime("2026-07-03T07:25:02.000000Z")
 * // Returns: "2026-07-03 15:25:02"
 */
export const formatToPhilippineTime = (utcDatetime) => {
    if (!utcDatetime) return '';
    
    try {
        const date = new Date(utcDatetime);
        
        // Create formatter for Philippine timezone (UTC+8)
        const formatter = new Intl.DateTimeFormat('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
            timeZone: 'Asia/Manila'
        });
        
        const parts = formatter.formatToParts(date);
        const result = {};
        
        parts.forEach(part => {
            result[part.type] = part.value;
        });
        
        // Return in format: YYYY-MM-DD HH:mm:ss
        return `${result.year}-${result.month}-${result.day} ${result.hour}:${result.minute}:${result.second}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return utcDatetime;
    }
}

/**
 * Format UTC datetime to Philippine date only
 * Format: "YYYY-MM-DD"
 * @param {string} utcDatetime - UTC datetime string
 * @returns {string} Formatted date in YYYY-MM-DD format
 * 
 * @example
 * formatToPhilippineDate("2026-07-03T07:25:02.000000Z")
 * // Returns: "2026-07-03"
 */
export const formatToPhilippineDate = (utcDatetime) => {
    if (!utcDatetime) return '';
    
    try {
        const date = new Date(utcDatetime);
        
        const formatter = new Intl.DateTimeFormat('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Manila'
        });
        
        const parts = formatter.formatToParts(date);
        const result = {};
        
        parts.forEach(part => {
            result[part.type] = part.value;
        });
        
        return `${result.year}-${result.month}-${result.day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return utcDatetime;
    }
}

/**
 * Format UTC datetime to Philippine time only
 * Format: "HH:mm:ss" in 24-hour format
 * @param {string} utcDatetime - UTC datetime string
 * @returns {string} Formatted time in HH:mm:ss format
 * 
 * @example
 * formatToPhilippineTimeOnly("2026-07-03T07:25:02.000000Z")
 * // Returns: "15:25:02"
 */
export const formatToPhilippineTimeOnly = (utcDatetime) => {
    if (!utcDatetime) return '';
    
    try {
        const date = new Date(utcDatetime);
        
        const formatter = new Intl.DateTimeFormat('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
            timeZone: 'Asia/Manila'
        });
        
        const parts = formatter.formatToParts(date);
        const result = {};
        
        parts.forEach(part => {
            result[part.type] = part.value;
        });
        
        return `${result.hour}:${result.minute}:${result.second}`;
    } catch (error) {
        console.error('Error formatting time:', error);
        return utcDatetime;
    }
}

/**
 * Format UTC datetime to human-readable Philippine format
 * Format: "MMM DD, YYYY HH:mm:ss" (e.g., "Jul 03, 2026 15:25:02")
 * @param {string} utcDatetime - UTC datetime string
 * @returns {string} Human-readable formatted datetime
 * 
 * @example
 * formatToHumanReadable("2026-07-03T07:25:02.000000Z")
 * // Returns: "Jul 03, 2026 15:25:02"
 */
export const formatToHumanReadable = (utcDatetime) => {
    if (!utcDatetime) return '';
    
    try {
        const date = new Date(utcDatetime);
        
        const formatter = new Intl.DateTimeFormat('en-PH', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Manila'
        });
        
        return formatter.format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return utcDatetime;
    }
}
