import React, { createContext, useContext, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'system'
  );
  const [autoTimezone, setAutoTimezone] = useState(() =>
    JSON.parse(localStorage.getItem('autoTimezone') || 'true')
  );
  const [manualTimezone, setManualTimezone] = useState(() =>
    localStorage.getItem('manualTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const getEffectiveTimezone = () => {
    if (autoTimezone) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return manualTimezone;
  };
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('autoTimezone', JSON.stringify(autoTimezone));
    localStorage.setItem('manualTimezone', manualTimezone);
  }, [autoTimezone, manualTimezone]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const formatDate = (timestamp, formatString = 'PPpp') => {
    if (!timestamp) return '';
    
    const timezone = getEffectiveTimezone();
    
    try {
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
      return formatInTimeZone(date, timezone, formatString);
    } catch (error) {
      return 'Invalid date';
    }
  };

   const value = {
    theme,
    setTheme,
    autoTimezone,
    setAutoTimezone,
    manualTimezone,
    setManualTimezone,
    currentTimezone: getEffectiveTimezone(),
    formatDate, 
  };
  
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);