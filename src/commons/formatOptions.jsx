import { parseISO, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { usePreferences } from '../features/administration/authContext/preferencesProvider';

export const formatOptions = {
  FULL_DATE_TIME: 'PPpp', // "Apr 29, 2025, 1:25:00 PM GMT+2"
  DATE_TIME: 'Pp',        // "Apr 29, 2025, 1:25 PM"
  DATE_ONLY: 'P',        // "Apr 29, 2025"
  TIME_ONLY: 'p',        // "1:25:00 PM"
};

export const formatWithTimezone = (timestamp, formatString, timezone) => {
  if (!timestamp) return '';
  
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    return formatInTimeZone(date, timezone, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    // return formatDistanceToNow(date, { addSuffix: true });
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });
    return relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1);
  } catch (error) {
    return 'Invalid date';
  }
};