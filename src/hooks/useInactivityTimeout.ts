'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_INACTIVITY_TIMEOUT_MINUTES = 15;
const DEFAULT_WARNING_COUNTDOWN_SECONDS = 60;

export function useInactivityTimeout() {
  const { logout, platformConfig } = useAuth();
  const [isIdle, setIsIdle] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { inactivityTimeoutMs, warningCountdownMs } = useMemo(() => {
    const minutes =
      platformConfig?.sessionTimeout?.timeoutDurationMinutes ??
      DEFAULT_INACTIVITY_TIMEOUT_MINUTES;
    const seconds =
      platformConfig?.sessionTimeout?.warningCountdownSeconds ??
      DEFAULT_WARNING_COUNTDOWN_SECONDS;
    return {
      inactivityTimeoutMs: minutes * 60 * 1000,
      warningCountdownMs: seconds * 1000,
    };
  }, [platformConfig]);

  const resetTimers = useCallback(() => {
    setIsIdle(false);
    setCountdown(warningCountdownMs / 1000);

    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
    }
    if (window.warningTimer) {
      clearTimeout(window.warningTimer);
    }
    if (window.countdownInterval) {
      clearInterval(window.countdownInterval);
    }

    window.warningTimer = setTimeout(() => {
      setIsIdle(true);
    }, inactivityTimeoutMs);
  }, [inactivityTimeoutMs, warningCountdownMs]);

  const handleLogout = useCallback(() => {
    logout();
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
    }
    if (window.warningTimer) {
      clearTimeout(window.warningTimer);
    }
    if (window.countdownInterval) {
      clearInterval(window.countdownInterval);
    }
  }, [logout]);

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;

    if (isIdle) {
      logoutTimer = setTimeout(handleLogout, warningCountdownMs);
      setCountdown(warningCountdownMs / 1000);

      countdownInterval = setInterval(() => {
        setCountdown((prev: number) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Store in window for access from other effects
      window.logoutTimer = logoutTimer;
      window.countdownInterval = countdownInterval;
    }

    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [isIdle, handleLogout, warningCountdownMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    let timeoutId: number;

    const eventListener = () => {
      // Debounce high-frequency events
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      timeoutId = window.requestAnimationFrame(() => resetTimers());
    };

    events.forEach((event) => {
      window.addEventListener(event, eventListener, { passive: true });
    });

    resetTimers();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      if (window.warningTimer) {
        clearTimeout(window.warningTimer);
      }
      if (window.logoutTimer) {
        clearTimeout(window.logoutTimer);
      }
      if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
      }
    };
  }, [resetTimers]);

  return {
    isIdle,
    countdown,
    reset: resetTimers,
    logout: handleLogout,
  };
}

declare global {
  interface Window {
    warningTimer: NodeJS.Timeout;
    logoutTimer: NodeJS.Timeout;
    countdownInterval: NodeJS.Timeout;
  }
}
