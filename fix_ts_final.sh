#!/bin/bash
sed -i 's/await SocialService.acceptFriendRequest(requestId, notification.id);/await SocialService.acceptFriendRequest(requestId);/g' src/components/SocialHub.tsx
sed -i 's/TelemetryService.trackEvent("clan_created", {/TelemetryService.trackEvent("clan_created", "1", "user", {/g' src/services/clan.ts
sed -i 's/if (false) {/const isPWA = false;\n            if (isPWA) {/g' src/services/notificationService.ts
