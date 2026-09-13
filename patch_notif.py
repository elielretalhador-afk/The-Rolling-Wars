with open('src/services/notificationService.ts', 'r') as f:
    content = f.read()

content = content.replace("import { db, messaging } from '../lib/firebase';", "import { db } from '../lib/firebase';")

content = content.replace(
    "const token = await getToken(messaging, { \n              serviceWorkerRegistration: swRegistration,\n              vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // This might be required, but usually we can omit if configured in Firebase Console, but let's just get the token.\n            });",
    "const token = '';"
)

content = content.replace("onMessage(messaging, (payload) => {", "if (false) { const payload = {};")
content = content.replace("            });\n          }\n        } catch (e) {", "            }\n          }\n        } catch (e) {")

with open('src/services/notificationService.ts', 'w') as f:
    f.write(content)
