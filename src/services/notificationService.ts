import { db, messaging } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { NotificationPreferences } from '../types';

export const SESSION_NOTIFICATION_ID = 8888;
export const FOREGROUND_SERVICE_ID = 111;

export class NotificationService {
  private static actionsRegistered = false;

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
              vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE'
            });
            if (token) {
              await this.registerDevice(userId, token, 'web');
            }
            
            onMessage(messaging, (payload) => {
              console.log('Message received. ', payload);
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

  /**
   * Registra os tipos de ações interativas da notificação de sessão (Android Local Notifications & Foreground)
   */
  static async registerSessionNotificationActionTypes() {
    if (!Capacitor.isNativePlatform() || this.actionsRegistered) return;
    try {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'SESSION_ACTIVE_ACTIONS',
            actions: [
              { id: 'PAUSE', title: 'PAUSAR' },
              { id: 'FINISH', title: 'ENCERRAR', destructive: true },
            ],
          },
          {
            id: 'SESSION_PAUSED_ACTIONS',
            actions: [
              { id: 'RESUME', title: 'CONTINUAR' },
              { id: 'FINISH', title: 'ENCERRAR', destructive: true },
            ],
          },
        ],
      });
      this.actionsRegistered = true;
    } catch (err) {
      console.warn('Erro ao registrar action types de notificação:', err);
    }
  }

  /**
   * Sincroniza a notificação persistente da sessão oficial (ACTIVE ou PAUSED)
   */
  static async syncSessionNotification(params: {
    sessionStatus: 'ACTIVE' | 'PAUSED' | 'IDLE' | 'COMPLETED';
    durationSeconds: number;
    distanceKm: number;
    energyPercent: number;
  }) {
    if (!Capacitor.isNativePlatform()) return;
    const { sessionStatus, durationSeconds, distanceKm, energyPercent } = params;

    if (sessionStatus === 'IDLE' || sessionStatus === 'COMPLETED') {
      await this.clearSessionNotification();
      return;
    }

    const formatTime = (secs: number) => {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const distStr = distanceKm.toFixed(2).replace('.', ',');
    const timeStr = formatTime(durationSeconds);

    if (sessionStatus === 'ACTIVE') {
      const body = energyPercent <= 0
        ? `🛼 Patinação em andamento\nEnergia: 0%\nTempo: ${timeStr}\nDistância: ${distStr} km`
        : `🛼 Patinação em andamento\nTempo: ${timeStr}\nDistância: ${distStr} km`;

      try {
        await ForegroundService.updateForegroundService({
          id: FOREGROUND_SERVICE_ID,
          title: 'THE ROLLING WARS',
          body,
          smallIcon: 'ic_stat_name',
          buttons: [
            { id: 1, title: 'PAUSAR' },
            { id: 2, title: 'ENCERRAR' },
          ],
        });
      } catch (_) {}
    } else if (sessionStatus === 'PAUSED') {
      const body = `⏸️ Patinação pausada\nTempo: ${timeStr}\nDistância: ${distStr} km`;

      try {
        await ForegroundService.updateForegroundService({
          id: FOREGROUND_SERVICE_ID,
          title: 'THE ROLLING WARS',
          body,
          smallIcon: 'ic_stat_name',
          buttons: [
            { id: 3, title: 'CONTINUAR' },
            { id: 2, title: 'ENCERRAR' },
          ],
        });
      } catch (_) {}
    }
  }

  /**
   * Limpa as notificações persistentes e encerra o serviço foreground ao finalizar sessão
   */
  static async clearSessionNotification() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await ForegroundService.stopForegroundService();
    } catch (_) {}
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: SESSION_NOTIFICATION_ID }],
      });
    } catch (_) {}
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
