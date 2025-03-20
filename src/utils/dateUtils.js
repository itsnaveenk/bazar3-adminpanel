/**
 * Date utility functions for the admin panel
 * All functions consider Indian Standard Time (IST/UTC+5:30)
 */

// Format a date to YYYY-MM-DD format
export const formatDate = (date) => {
  const options = { timeZone: 'Asia/Kolkata' };
  const dateObj = date ? new Date(date) : new Date();
  const year = dateObj.toLocaleString('en-US', { year: 'numeric', ...options });
  const month = dateObj.toLocaleString('en-US', { month: '2-digit', ...options });
  const day = dateObj.toLocaleString('en-US', { day: '2-digit', ...options });
  return `${year}-${month}-${day}`;
};

// Format date and time to display friendly format
export const formatDateTimeDisplay = (dateTimeStr) => {
  const options = { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const date = new Date(dateTimeStr);
  return date.toLocaleString('en-US', options);
};

// Update format to ensure proper MySQL datetime format (YYYY-MM-DD HH:MM:SS)
export const formatMySQLDateTime = (date) => {
  // Create a date object in IST timezone
  const dateObj = date ? new Date(date) : new Date();
  
  // Get the India time string from the date
  const options = { timeZone: 'Asia/Kolkata' };
  const indianTime = dateObj.toLocaleString('en-US', options);
  
  // Parse the Indian time string into a new Date object
  const istDate = new Date(indianTime);
  
  // Format with leading zeros
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const seconds = String(istDate.getSeconds()).padStart(2, '0');
  
  // Return in MySQL format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Get current date in IST
export const getCurrentIndianDate = () => {
  return formatDate();
};

// Check if a given time is in the future (IST)
export const isTimeInFuture = (dateTime) => {
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata' };
  const nowInIST = new Date(now.toLocaleString('en-US', options));
  const checkTime = new Date(dateTime);
  
  return checkTime > nowInIST;
};
