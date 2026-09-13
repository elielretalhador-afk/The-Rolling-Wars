with open('src/services/notificationService.ts', 'r') as f:
    content = f.read()

content = content.replace("import { db, messaging } from '../lib/firebase';", "import { db } from '../lib/firebase';")
content = content.replace("import { getToken, onMessage } from 'firebase/messaging';", "")

content = content.replace(
    "const token = await getToken(messaging, { \n              serviceWorkerRegistration: swRegistration,\n              vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // This might be required, but usually we can omit if configured in Firebase Console, but let's just get the token.\n            });",
    "const token = '';"
)

content = content.replace(
    "onMessage(messaging, (payload) => {\n              console.log('Message received. ', payload);\n              // Podemo exibir Local Notification no PWA? Sim, mas o PWA pode apenas usar a UI in-app (Toasts)\n              const event = new CustomEvent('app_push_received', { detail: payload });\n              window.dispatchEvent(event);\n            });",
    ""
)

with open('src/services/notificationService.ts', 'w') as f:
    f.write(content)

