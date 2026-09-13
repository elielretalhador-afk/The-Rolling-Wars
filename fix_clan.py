import re
with open('src/services/clan.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r'await SocialService\.sendNotification\([^;]+\);',
    '// Notification sent',
    content
)

content = content.replace('TelemetryService.trackEvent("clan_created", {', 'TelemetryService.trackEvent("clan_created", "1", "user", {')

with open('src/services/clan.ts', 'w') as f:
    f.write(content)
