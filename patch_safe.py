import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make color fixes
content = content.replace('bg-[#080B0E]', 'bg-[#000000]')
content = content.replace('bg-[#05070a]', 'bg-[#000000]')
content = content.replace('bg-[#111822]', 'bg-[#050505]')
content = content.replace('bg-[#0c131c]', 'bg-[#050505]')
content = content.replace('bg-slate-900', 'bg-[#0a0a0a]')

# Replace logo
content = content.replace('logo-rw-dark.png', 'logo.png')

with open('src/App.tsx', 'w') as f:
    f.write(content)
