import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return
    
    # Replace blueish backgrounds
    old_content = content
    content = re.sub(r'bg-\[#080B0E\]', 'bg-[#000000]', content)
    content = re.sub(r'bg-\[#05070a\]', 'bg-[#000000]', content)
    content = re.sub(r'bg-\[#111822\]', 'bg-[#050505]', content)
    content = re.sub(r'bg-\[#0c131c\]', 'bg-[#050505]', content)
    content = re.sub(r'bg-slate-900', 'bg-[#0a0a0a]', content)
    content = re.sub(r'bg-\[#0d141d\]', 'bg-[#050505]', content)
    content = re.sub(r'bg-\[#0a0f15\]', 'bg-[#050505]', content)
    
    if content != old_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            replace_in_file(os.path.join(root, file))
