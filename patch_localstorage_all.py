import re
import os

def process_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception:
        return

    # A simple regex to replace direct localStorage.getItem / setItem / removeItem with safe wrappers?
    # Actually, it's safer to just inject a wrapper at the top and replace localStorage with safeStorage.
    if 'const safeStorage =' not in content:
        safe_storage = """
const safeStorage = {
  getItem: (key) => { try { return localStorage.getItem(key); } catch(e) { return null; } },
  setItem: (key, val) => { try { localStorage.setItem(key, val); } catch(e) {} },
  removeItem: (key) => { try { localStorage.removeItem(key); } catch(e) {} }
};
"""
        # find the last import and insert safeStorage after it
        last_import = content.rfind('import ')
        if last_import != -1:
            end_of_import = content.find('\n', last_import)
            content = content[:end_of_import+1] + safe_storage + content[end_of_import+1:]
        else:
            content = safe_storage + content

    content = re.sub(r'\blocalStorage\.getItem', 'safeStorage.getItem', content)
    content = re.sub(r'\blocalStorage\.setItem', 'safeStorage.setItem', content)
    content = re.sub(r'\blocalStorage\.removeItem', 'safeStorage.removeItem', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

