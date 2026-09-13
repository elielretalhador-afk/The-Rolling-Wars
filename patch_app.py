import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_str = "import { TelemetryService } from './services/telemetry';\n"
if "import { TelemetryService }" not in content:
    content = import_str + content

# Log app start
content = content.replace("export default function App() {",
"""export default function App() {
  React.useEffect(() => {
    TelemetryService.logEvent({ eventName: 'app_started', category: 'APP' });
  }, []);""")

# Log Auth success
content = content.replace("localStorage.setItem('urbanozeiro_user', JSON.stringify(updated));",
"""localStorage.setItem('urbanozeiro_user', JSON.stringify(updated));
          TelemetryService.logEvent({ eventName: 'auth_success', category: 'AUTH', details: { uid: firebaseUser.uid } });""")

# Log GPS status
content = content.replace("alert('O The Rolling Wars precisa de permissão de GPS para funcionar. Acesse as configurações e permita o uso de localização.');",
"""alert('O The Rolling Wars precisa de permissão de GPS para funcionar. Acesse as configurações e permita o uso de localização.');
            TelemetryService.logEvent({ eventName: 'gps_permission_denied', category: 'GPS' });""")

# Log GPS Watch start
content = content.replace("watchIdStr = await Geolocation.watchPosition(",
"""TelemetryService.logEvent({ eventName: 'gps_permission_granted', category: 'GPS' });
        watchIdStr = await Geolocation.watchPosition(""")

# Log GPS recovered / unavailable
content = content.replace("setIsGpsActive(true);",
"""setIsGpsActive(true);
          TelemetryService.logEvent({ eventName: 'gps_recovered', category: 'GPS' });""")


with open('src/App.tsx', 'w') as f:
    f.write(content)
