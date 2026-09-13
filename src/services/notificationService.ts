import { db, messaging } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { NotificationPreferences } from '../types';

export class NotificationService {
  static async initPushNotifications(userId: string) {
    if (Capacitor.isNativePlatform()) {
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied push notifications');
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        await this.registerDevice(userId, token.value, Capacitor.getPlatform());
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received in foreground: ' + JSON.stringify(notification));
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        this.handleNotificationPayload(notification.notification.data);
      });
    } else {
      // PWA FCM
      if (messaging && 'serviceWorker' in navigator) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const swRegistration = await navigator.serviceWorker.ready;
            const token = await getToken(messaging, { 
              serviceWorkerRegistration: swRegistration,
              vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // This might be required, but usually we can omit if configured in Firebase Console, but let's just get the token.
            });
            if (token) {
              await this.registerDevice(userId, token, 'web');
            }
            
            onMessage(messaging, (payload) => {
              console.log('Message received. ', payload);
              // Podemo exibir Local Notification no PWA? Sim, mas o PWA pode apenas usar a UI in-app (Toasts)
              const event = new CustomEvent('app_push_received', { detail: payload });
              window.dispatchEvent(event);
            });
          }
        } catch (e) {
          console.log('PWA Push Error:', e);
        }
      }
    }
  }

  static async registerDevice(userId: string, pushToken: string, platform: string) {
    try {
      const deviceId = (await Device.getId()).identifier;
      const deviceRef = doc(db, 'users', userId, 'devices', deviceId);
      
      await setDoc(deviceRef, {
        deviceId,
        pushToken,
        platform,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enabled: true
      }, { merge: true });
    } catch (e) {
      console.error('Error registering device:', e);
    }
  }

  static async getPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const prefRef = doc(db, 'users', userId, 'notificationPrefs', 'main');
      const snap = await getDoc(prefRef);
      if (snap.exists()) {
        return snap.data() as NotificationPreferences;
      }
    } catch(e) {}
    
    return {
      enablePushNotifications: true,
      notifyZoneConquest: true,
      notifyDirectChallenges: true,
      notifyAchievements: true,
      notifyEvents: true,
      notifyMissions: true,
      notifySocialActivities: true,
    };
  }

  static async updatePreferences(userId: string, prefs: NotificationPreferences) {
    try {
      const prefRef = doc(db, 'users', userId, 'notificationPrefs', 'main');
      await setDoc(prefRef, prefs, { merge: true });
    } catch(e) {
      console.error('Error updating preferences:', e);
    }
  }

  static handleNotificationPayload(data: any) {
    const event = new CustomEvent('app_notification_action', { detail: data });
    window.dispatchEvent(event);
  }
}
