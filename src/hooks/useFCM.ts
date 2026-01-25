import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { messaging } from '@/utils/firebase';
import { useApiContext } from '@/contexts/ApiContext';

/**
 * VAPID Key for FCM Web Push
 * This should be obtained from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
 * TODO: Replace with your actual VAPID key from Firebase Console
 */
const VAPID_KEY = ' BKFcSPG4h0WTfkz1F5siTwfoHHaBsT-MjwVP1OcRvNjWGYY5ywTG0BARQpTmrprsfus4O8xHBc1Wlo8fIpC4eAQ ';

/**
 * useFCM Hook - Manages Firebase Cloud Messaging token lifecycle
 *
 * Features:
 * - Requests notification permission
 * - Gets FCM token
 * - Registers token with backend
 * - Listens to foreground messages
 * - Handles token refresh
 */
export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string | null>(null);
  const { api } = useApiContext();

  /**
   * Request notification permission from user
   */
  const requestPermission = useCallback(async () => {
    try {
      if (!messaging) {
        console.warn('[FCM] Messaging not supported in this browser');
        return;
      }

      // Check current permission
      if (Notification.permission === 'granted') {
        console.log('[FCM] Permission already granted');
        setPermission('granted');
        await getFCMToken();
        return;
      }

      if (Notification.permission === 'denied') {
        console.warn('[FCM] Permission denied by user');
        setPermission('denied');
        setError('Notification permission denied. Please enable it in browser settings.');
        return;
      }

      // Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        console.log('[FCM] Permission granted');
        await getFCMToken();
      } else {
        console.warn('[FCM] Permission not granted:', result);
        setError('Notification permission not granted');
      }
    } catch (err) {
      console.error('[FCM] Error requesting permission:', err);
      setError('Failed to request notification permission');
    }
  }, []);

  /**
   * Get FCM token from Firebase
   */
  const getFCMToken = useCallback(async () => {
    try {
      if (!messaging) {
        console.warn('[FCM] Messaging not initialized');
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('[FCM] Token obtained:', token.substring(0, 20) + '...');
        setFcmToken(token);
        await registerToken(token);
      } else {
        console.warn('[FCM] No token obtained');
        setError('Failed to get FCM token');
      }
    } catch (err) {
      console.error('[FCM] Error getting token:', err);
      setError('Failed to get FCM token. Make sure VAPID key is configured.');
    }
  }, []);

  /**
   * Register FCM token with backend
   */
  const registerToken = useCallback(async (token: string) => {
    try {
      await api.app.notification.registerDeviceToken(token);
      console.log('[FCM] Token registered with backend');
    } catch (err) {
      console.error('[FCM] Error registering token with backend:', err);
      // Don't throw - token can still be used for foreground notifications
    }
  }, [api]);

  /**
   * Unregister FCM token from backend
   */
  const unregisterToken = useCallback(async () => {
    if (!fcmToken) return;

    try {
      await api.app.notification.unregisterDeviceToken(fcmToken);
      console.log('[FCM] Token unregistered from backend');
      setFcmToken(null);
    } catch (err) {
      console.error('[FCM] Error unregistering token:', err);
    }
  }, [api, fcmToken]);

  /**
   * Listen to foreground messages
   */
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      console.log('[FCM] Foreground message received:', payload);

      // Show browser notification
      if (Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions: NotificationOptions = {
          body: payload.notification?.body || '',
          icon: payload.notification?.icon || '/vite.svg',
          badge: '/vite.svg',
          data: payload.data,
          tag: payload.data?.notificationId || 'default'
        };

        new Notification(notificationTitle, notificationOptions);
      }

      // You can also dispatch a custom event here to update notification center
      window.dispatchEvent(new CustomEvent('fcm-notification-received', { detail: payload }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Initialize FCM on mount if permission already granted
   */
  useEffect(() => {
    if (Notification.permission === 'granted' && !fcmToken) {
      getFCMToken();
    }
  }, []);

  return {
    fcmToken,
    permission,
    error,
    requestPermission,
    unregisterToken
  };
};
