import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the Loading state UI
loading_pattern = re.compile(r"if \(authState === 'LOADING'\) \{.*?return \(\s*<div className=\"flex justify-center w-full h-full bg-\[\#05070a\]\">\s*<main.*?<\/main>\s*<\/div>\s*\);\s*\}", re.DOTALL)
replacement = '''if (authState === 'LOADING') {
    return (
      <div className="flex justify-center w-full h-full bg-[#000000] relative overflow-hidden">
        <main className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-transparent border-x border-slate-800/40 p-6">
          <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
            <img src="/logo.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#fce803]/20 border-t-[#fce803] animate-spin mb-4" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-wider mb-2">Carregando</h2>
          <p className="text-sm text-slate-400 font-medium">Preparando a sessão...</p>
        </main>
      </div>
    );
  }'''

new_content = loading_pattern.sub(replacement, content)

# Replace all bg-[#080B0E] or bg-[#05070a] with bg-[#000000] and bg-[#050505] in App.tsx
new_content = new_content.replace('bg-[#080B0E]', 'bg-[#000000]')
new_content = new_content.replace('bg-[#05070a]', 'bg-[#000000]')
new_content = new_content.replace('bg-[#111822]', 'bg-[#050505]')
new_content = new_content.replace('bg-[#0c131c]', 'bg-[#050505]')
new_content = new_content.replace('bg-slate-900', 'bg-[#0a0a0a]')

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
