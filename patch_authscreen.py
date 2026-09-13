import re

with open('src/components/AuthScreen.tsx', 'r') as f:
    content = f.read()

old_logo = """        {/* LOGO */}
        <div className="mb-8 text-center shrink-0">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-cyan-400 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,102,0.3)] transform rotate-3">
            <span className="text-3xl font-black text-black tracking-tighter">U</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display tracking-tight uppercase">
            Urbano<span className="text-yellow-400">zeiro</span>
          </h1>
          <p className="text-xs font-medium text-neutral-400 mt-1 tracking-wide uppercase font-mono-stat">
            Identidade de Jogador
          </p>
        </div>"""

new_logo = """        {/* LOGO */}
        <div className="mb-8 text-center shrink-0 flex flex-col items-center">
          <img src="/logo.png" alt="The Rolling Wars" className="w-24 h-24 rounded-2xl mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)]" />
          <h1 className="text-2xl font-black text-white font-display tracking-tight uppercase">
            The Rolling <span className="text-yellow-400">Wars</span>
          </h1>
          <p className="text-xs font-medium text-neutral-400 mt-1 tracking-wide uppercase font-mono-stat">
            Identidade de Jogador
          </p>
        </div>"""

if old_logo in content:
    content = content.replace(old_logo, new_logo)
else:
    print("Could not find exact old logo block")

with open('src/components/AuthScreen.tsx', 'w') as f:
    f.write(content)

