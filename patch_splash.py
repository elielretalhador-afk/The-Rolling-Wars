import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_splash = """  if (authState === 'LOADING') {
    return (
      <div className="flex justify-center w-full h-full bg-[#05070a]">
        <main className="relative flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-[#000000] border-x border-neutral-900/40">
          <div className="w-16 h-16 rounded-full border-4 border-yellow-400/20 border-t-emerald-400 animate-spin mb-4" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-wider mb-2">Autenticando</h2>
          <p className="text-sm text-neutral-400 font-medium">Verificando identidade...</p>
        </main>
      </div>
    );
  }"""

new_splash = """  if (authState === 'LOADING') {
    return (
      <div className="flex justify-center w-full h-full bg-black">
        <main className="relative flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-[#000000] border-x border-neutral-900/40 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[#fce803] opacity-[0.02] bg-[radial-gradient(#fce803_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <img src="/logo.png" alt="The Rolling Wars" className="w-32 h-32 rounded-3xl mb-6 shadow-[0_0_50px_rgba(255,215,0,0.4)] animate-pulse" />
            
            <h1 className="text-3xl font-black text-white font-display tracking-tight uppercase text-center mb-1">
              The Rolling <span className="text-yellow-400">Wars</span>
            </h1>
            
            <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase font-mono-stat mb-12">
              Iniciando Sistema...
            </p>

            <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-yellow-400 w-1/2 animate-[bounce_1.5s_infinite]"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }"""

if old_splash in content:
    content = content.replace(old_splash, new_splash)
else:
    print("Could not find old splash exact block")

with open('src/App.tsx', 'w') as f:
    f.write(content)

