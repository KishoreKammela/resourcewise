'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_DURATION = 60 * 1000; // 60 seconds

export function useInactivityTimeout() {
  const { logout } = useAuth();
  const [isIdle, setIsIdle] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION / 1000);

  const resetTimers = useCallback(() => {
    setIsIdle(false);
    setCountdown(COUNTDOWN_DURATION / 1000);
    // Clear existing timers
    if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
    if (window.warningTimer) {clearTimeout(window.warningTimer);}
    if (window.countdownInterval) {clearInterval(window.countdownInterval);}

    // Set new timers
    window.warningTimer = setTimeout(() => {
      setIsIdle(true);
    }, INACTIVITY_TIMEOUT);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    clearTimeout(window.logoutTimer);
    clearTimeout(window.warningTimer);
    clearInterval(window.countdownInterval);
  }, [logout]);

  useEffect(() => {
    if (isIdle) {
      // Start the final countdown to logout
      window.logoutTimer = setTimeout(handleLogout, COUNTDOWN_DURATION);

      // Start the visual countdown timer
      setCountdown(COUNTDOWN_DURATION / 1000);
      window.countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(window.countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // If user becomes active, clear the timers
      clearTimeout(window.logoutTimer);
      clearInterval(window.countdownInterval);
    }

    return () => {
      clearTimeout(window.logoutTimer);
      clearInterval(window.countdownInterval);
    };
  }, [isIdle, handleLogout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const eventListener = () => resetTimers();

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, eventListener);
    });

    // Initial setup
    resetTimers();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
      clearTimeout(window.warningTimer);
      clearTimeout(window.logoutTimer);
      clearInterval(window.countdownInterval);
    };
  }, [resetTimers]);

  return {
    isIdle,
    countdown,
    reset: resetTimers,
    logout: handleLogout,
  };
}

// Augment the Window interface to avoid TypeScript errors
declare global {
  interface Window {
    warningTimer: NodeJS.Timeout;
    logoutTimer: NodeJS.Timeout;
    countdownInterval: NodeJS.Timeout;
  }
}
