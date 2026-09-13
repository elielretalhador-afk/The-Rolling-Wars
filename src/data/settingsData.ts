import { PlayerSettings } from '../types';

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  account: {
    email: 'lucas.rocha@urbanozeiro.app',
    phone: '+55 (11) 98765-4321',
    registeredSince: 'Junho de 2026',
    isEmailVerified: true,
    twoFactorEnabled: false,
  },
  privacy: {
    isProfilePublic: true,
    showActivityInFeed: true,
    showStatsOnProfile: true,
    appearInNearbyRadar: true,
    allowFriendRequests: true,
    challengePermission: 'EVERYONE',
  },
  notifications: {
    enablePushNotifications: true,
    notifyZoneConquest: true,
    notifyDirectChallenges: true,
    notifyAchievements: true,
    notifyEvents: true,
    notifyMissions: true,
    notifySocialActivities: true,
  },
  gameplay: {
    confirmBeforeZoneCapture: true,
    showProximityAlerts: true,
    showInGameTutorialTips: true,
    enableInterfaceEffects: true,
    autoRecenterMap: true,
  },
  map: {
    mapTheme: 'DARK',
    defaultZoom: 15,
    showZonesOnMap: true,
    showRoutesOnMap: true,
    showOtherSkatersOnMap: true,
    showHeatmapTrails: false,
  },
  appearance: {
    appTheme: 'DARK',
    accentColor: 'NEON_GREEN',
    compactMode: false,
  },
  audioHaptics: {
    soundEffectsEnabled: true,
    soundVolume: 80,
    vibrationEnabled: true,
    vibrateOnZoneEntry: true,
    vibrateOnAchievement: true,
  },
  security: {
    biometricLock: false,
    autoLockTimeoutMin: 15,
    dataCollectionConsent: true,
  },
  about: {
    appVersion: '1.4.2 Cyber Edition',
    buildNumber: '2026.08.19-rc4',
    releaseDate: 'Agosto de 2026',
    engineVersion: 'UrbanoEngine v2.1.0',
    supportEmail: 'suporte@urbanozeiro.com.br',
    termsUrl: 'https://urbanozeiro.com.br/termos',
    privacyPolicyUrl: 'https://urbanozeiro.com.br/privacidade',
  },
};
