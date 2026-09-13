import re

with open("src/components/AuthScreen.tsx", "r") as f:
    content = f.read()

# Add useMemo import if needed
if "useMemo" not in content:
    content = content.replace("import React, { useState }", "import React, { useState, useMemo }")
    if "import { useState" in content and "useMemo" not in content:
        content = content.replace("import { useState", "import { useState, useMemo")

# Fix background wrapper
old_bg = '<div className="flex justify-center w-full h-full bg-[#05070a]">'
new_bg = """<div className="flex justify-center w-full h-full bg-black relative overflow-hidden">
      <div className="sparks-container">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="spark" style={{
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 50}%`,
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>"""
content = content.replace(old_bg, new_bg)

# Fix main container
old_main = '<main className="relative flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-[#080B0E] border-x border-slate-800/40 p-6 overflow-y-auto">'
new_main = '<main className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-transparent border-x border-slate-800/40 p-6 overflow-y-auto">'
content = content.replace(old_main, new_main)

# Replace Logo
old_logo = """        {/* LOGO */}
        <div className="mb-8 text-center shrink-0">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,102,0.3)] transform rotate-3">
            <span className="text-3xl font-black text-black tracking-tighter">U</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display tracking-tight uppercase">
            Urbano<span className="text-emerald-400">zeiro</span>
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-1 tracking-wide uppercase font-mono-stat">
            Identidade de Jogador
          </p>
        </div>"""

new_logo = """        {/* LOGO */}
        <div className="mb-8 text-center shrink-0 relative z-10 w-full">
          <div className="relative w-40 h-40 mx-auto mb-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#fce803] rounded-full blur-[50px] opacity-20 animate-pulse"></div>
            <img src="/logo-rw-dark.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className="absolute inset-0 flex items-center justify-center border-2 border-[#fce803]/30 rounded-full" style={{ zIndex: 0 }}>
              <span className="text-[#fce803] font-black text-3xl tracking-widest opacity-50">RW</span>
            </div>
          </div>
        </div>"""
content = content.replace(old_logo, new_logo)

# Replace buttons and emerald colors
content = content.replace("from-emerald-500 to-emerald-400", "from-[#fce803] to-[#eab308]")
content = content.replace("shadow-[0_4px_16px_rgba(0,255,102,0.3)]", "shadow-[0_4px_16px_rgba(252,232,3,0.3)]")
content = content.replace("border-emerald-500", "border-[#fce803]")
content = content.replace("text-emerald-400", "text-[#fce803]")
content = content.replace("hover:text-emerald-400", "hover:text-[#fce803]")
content = content.replace("bg-emerald-500/10", "bg-[#fce803]/10")
content = content.replace("border-emerald-500/30", "border-[#fce803]/30")

with open("src/components/AuthScreen.tsx", "w") as f:
    f.write(content)
