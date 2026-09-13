#!/bin/bash

sed -i 's/const attempts = /const attempts: any[] = /g' src/components/SegmentDetailsModal.tsx
sed -i 's/const segs = /const segs: any[] = /g' src/components/SegmentsHub.tsx

sed -i 's/await SocialService.acceptFriendRequest(requestId, /await SocialService.acceptFriendRequest(requestId); \/\//g' src/components/SocialHub.tsx
sed -i 's/TelemetryService.trackEvent("clan_created", "1", {/TelemetryService.trackEvent("clan_created", {/g' src/services/clan.ts
sed -i 's/TelemetryService.trackEvent("clan_created", currentUser.id, {/TelemetryService.trackEvent("clan_created", {/g' src/services/clan.ts

sed -i 's/import { db, functions/import { db/g' src/services/economyService.ts
sed -i 's/Chest,//g' src/services/economyService.ts
sed -i 's/ShopItem,//g' src/services/economyService.ts
sed -i 's/InventoryItem,//g' src/services/economyService.ts
sed -i 's/ProfileCosmetics//g' src/services/economyService.ts

sed -i 's/if ("") {/if (false) {/g' src/services/notificationService.ts
