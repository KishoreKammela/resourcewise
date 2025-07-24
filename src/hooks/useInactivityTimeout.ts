'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_INACTIVITY_TIMEOUT_MINUTES = 15;
const DEFAULT_WARNING_COUNTDOWN_SECONDS = 60;

export function useInactivityTimeout() {
  const { logout, platformConfig } = useAuth();
  const [isIdle, setIsIdle] = useState(false);
  const [countdown, setCountdown] = useState(DEFAULT_WARNING_COUNTDOWN_SECONDS);

  const inactivityTimeoutMs = useMemo(() => {
    const minutes =
      platformConfig?.inactivityTimeoutMinutes ||
      DEFAULT_INACTIVITY_TIMEOUT_MINUTES;
    return minutes * 60 * 1000;
  }, [platformConfig]);

  const warningCountdownMs = useMemo(() => {
    const seconds =
      platformConfig?.warningCountdownSeconds ||
      DEFAULT_WARNING_COUNTDOWN_SECONDS;
    return seconds * 1000;
  }, [platformConfig]);

  const resetTimers = useCallback(() => {
    setIsIdle(false);
    setCountdown(warningCountdownMs / 1000);

    if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
    if (window.warningTimer) {clearTimeout(window.warningTimer);}
    if (window.countdownInterval) {clearInterval(window.countdownInterval);}

    window.warningTimer = setTimeout(() => {
      setIsIdle(true);
    }, inactivityTimeoutMs);
  }, [inactivityTimeoutMs, warningCountdownMs]);

  const handleLogout = useCallback(() => {
    logout();
    if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
    if (window.warningTimer) {clearTimeout(window.warningTimer);}
    if (window.countdownInterval) {clearInterval(window.countdownInterval);}
  }, [logout]);

  useEffect(() => {
    if (isIdle) {
      window.logoutTimer = setTimeout(handleLogout, warningCountdownMs);
      setCountdown(warningCountdownMs / 1000);

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
      if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
      if (window.countdownInterval) {clearInterval(window.countdownInterval);}
    }

    return () => {
      if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
      if (window.countdownInterval) {clearInterval(window.countdownInterval);}
    };
  }, [isIdle, handleLogout, warningCountdownMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const eventListener = () => resetTimers();

    events.forEach((event) => {
      window.addEventListener(event, eventListener);
    });

    resetTimers();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
      if (window.warningTimer) {clearTimeout(window.warningTimer);}
      if (window.logoutTimer) {clearTimeout(window.logoutTimer);}
      if (window.countdownInterval) {clearInterval(window.countdownInterval);}
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
