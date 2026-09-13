import os
import re

def patch_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    if 'localStorage' not in content: return

    # Avoid double patching
    if "import { safeStorage }" not in content and "safeStorage." not in content:
        # We will just replace localStorage with a try/catch inline if it's too risky to import, 
        # or we just import safeStorage.
        # Actually, let's just do a robust inline replacement to avoid import issues.
        pass

    # Actually, inline try/catch is safer so we don't mess up imports.
    content = re.sub(r'localStorage\.getItem\((.*?)\)', r'(() => { try { return localStorage.getItem(\1); } catch(e) { return null; } })()', content)
    content = re.sub(r'localStorage\.setItem\((.*?),\s*(.*?)\)', r'(() => { try { localStorage.setItem(\1, \2); } catch(e) {} })()', content)
    content = re.sub(r'localStorage\.removeItem\((.*?)\)', r'(() => { try { localStorage.removeItem(\1); } catch(e) {} })()', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')) and not file.endswith('.recovered'):
            patch_file(os.path.join(root, file))

