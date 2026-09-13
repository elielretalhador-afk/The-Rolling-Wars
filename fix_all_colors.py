import os
import re

def replace_colors_in_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Base replacements to transform dark blues to pure black and gold accents
    replacements = {
        'bg-[#080B0E]': 'bg-[#000000]',
        'bg-[#111822]': 'bg-[#0a0a0a]',
        'bg-[#1A2332]': 'bg-[#121212]',
        'border-slate-800': 'border-neutral-900',
        'border-slate-700': 'border-neutral-800',
        'text-slate-400': 'text-neutral-400',
        'text-slate-300': 'text-neutral-300',
        'text-emerald-500': 'text-yellow-500',
        'text-emerald-400': 'text-yellow-400',
        'bg-emerald-500': 'bg-yellow-500',
        'bg-emerald-400': 'bg-yellow-400',
        'border-emerald-500': 'border-yellow-500',
        'border-emerald-400': 'border-yellow-400',
        'from-emerald-500': 'from-yellow-500',
        'to-emerald-400': 'to-yellow-400',
        'shadow-emerald-500': 'shadow-yellow-500',
    }
    
    for k, v in replacements.items():
        content = content.replace(k, v)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            replace_colors_in_file(os.path.join(root, file))

