import re

with open('src/components/AuthScreen.tsx', 'r') as f:
    content = f.read()

# Make sure buttons are black/yellow instead of green
content = content.replace('bg-emerald-500', 'bg-yellow-500')
content = content.replace('border-emerald-500', 'border-yellow-500')
content = content.replace('text-emerald-500', 'text-yellow-500')

with open('src/components/AuthScreen.tsx', 'w') as f:
    f.write(content)
