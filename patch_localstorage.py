import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "localStorage.getItem('urbanozeiro_player_settings')",
    "(() => { try { return localStorage.getItem('urbanozeiro_player_settings'); } catch(e) { return null; } })()"
)

content = content.replace(
    "localStorage.getItem('urbanozeiro_user')",
    "(() => { try { return localStorage.getItem('urbanozeiro_user'); } catch(e) { return null; } })()"
)

content = content.replace(
    "localStorage.setItem('urbanozeiro_user', JSON.stringify(updated));",
    "try { localStorage.setItem('urbanozeiro_user', JSON.stringify(updated)); } catch(e) {}"
)

content = content.replace(
    "localStorage.setItem('urbanozeiro_user', JSON.stringify(user));",
    "try { localStorage.setItem('urbanozeiro_user', JSON.stringify(user)); } catch(e) {}"
)

content = content.replace(
    "localStorage.removeItem('urbanozeiro_user');",
    "try { localStorage.removeItem('urbanozeiro_user'); } catch(e) {}"
)

content = content.replace(
    "localStorage.getItem('urbanozeiro_onboardingCompleted')",
    "(() => { try { return localStorage.getItem('urbanozeiro_onboardingCompleted'); } catch(e) { return null; } })()"
)

content = content.replace(
    "localStorage.setItem('urbanozeiro_onboardingCompleted', 'true');",
    "try { localStorage.setItem('urbanozeiro_onboardingCompleted', 'true'); } catch(e) {}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

