with open('src/components/AuthScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-[#080B0E]', 'bg-[#000000]')
content = content.replace('bg-[#05070a]', 'bg-[#000000]')
content = content.replace('bg-[#111822]', 'bg-[#050505]')
content = content.replace('bg-[#0c131c]', 'bg-[#050505]')
content = content.replace('bg-slate-900', 'bg-[#0a0a0a]')
content = content.replace('emerald-', 'yellow-') # Change emerald to neon yellow or orange where applicable
content = content.replace('border-emerald-500', 'border-[#fce803]')
content = content.replace('text-emerald-400', 'text-[#fce803]')

with open('src/components/AuthScreen.tsx', 'w') as f:
    f.write(content)
