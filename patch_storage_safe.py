import os

replacements = {
    "localStorage.getItem(ACTIVITIES_DB_KEY)": "(() => { try { return localStorage.getItem(ACTIVITIES_DB_KEY); } catch(e) { return null; } })()",
    "localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(db));": "try { localStorage.setItem(ACTIVITIES_DB_KEY, JSON.stringify(db)); } catch(e) {}",
    
    "localStorage.getItem(AUTH_TOKEN_KEY)": "(() => { try { return localStorage.getItem(AUTH_TOKEN_KEY); } catch(e) { return null; } })()",
    "localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionUser));": "try { localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionUser)); } catch(e) {}",
    "localStorage.removeItem(AUTH_TOKEN_KEY);": "try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch(e) {}",
    
    "localStorage.getItem(key)": "(() => { try { return localStorage.getItem(key); } catch(e) { return null; } })()",
    "localStorage.setItem(key, JSON.stringify(data));": "try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}",
    
    "localStorage.getItem('urbanozeiro_player_settings')": "(() => { try { return localStorage.getItem('urbanozeiro_player_settings'); } catch(e) { return null; } })()",
    "localStorage.getItem('urbanozeiro_user')": "(() => { try { return localStorage.getItem('urbanozeiro_user'); } catch(e) { return null; } })()",
    "localStorage.setItem('urbanozeiro_user', JSON.stringify(updated));": "try { localStorage.setItem('urbanozeiro_user', JSON.stringify(updated)); } catch(e) {}",
    "localStorage.getItem('urbanozeiro_auth_token')": "(() => { try { return localStorage.getItem('urbanozeiro_auth_token'); } catch(e) { return null; } })()",
    "localStorage.removeItem('urbanozeiro_auth_token');": "try { localStorage.removeItem('urbanozeiro_auth_token'); } catch(e) {}",
    "localStorage.setItem('urbanozeiro_user', JSON.stringify(user));": "try { localStorage.setItem('urbanozeiro_user', JSON.stringify(user)); } catch(e) {}",
    "localStorage.removeItem('urbanozeiro_user');": "try { localStorage.removeItem('urbanozeiro_user'); } catch(e) {}"
}

files_to_patch = [
    'src/services/feed.ts',
    'src/services/auth.ts',
    'src/services/db.ts',
    'src/App.tsx'
]

for filepath in files_to_patch:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        for k, v in replacements.items():
            content = content.replace(k, v)
        with open(filepath, 'w') as f:
            f.write(content)
