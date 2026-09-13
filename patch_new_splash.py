import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_splash = """  if (!isDbReady || !minSplashTimeElapsed) {
    return (
      <div className="flex justify-center w-full h-full bg-[#05070a]">
        <main className="relative flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-[#080B0E] border-x border-slate-800/40 overflow-hidden">
          {/* Cyberpunk grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
          
          {/* Glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fce803] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-600 rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500 rounded-full blur-[80px] opacity-20"></div>

          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
            <div className="w-48 h-48 mb-8 relative">
              <img src="/logo-rw-dark.png" alt="THE ROLLING WARS" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(252,232,3,0.6)] animate-pulse" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              {/* Fallback if image not found */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <span className="text-4xl">⚡</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-fuchsia-500 to-cyan-400 font-display uppercase tracking-widest mb-4 filter drop-shadow-[0_0_10px_rgba(252,232,3,0.3)]">
              THE ROLLING WARS
            </h1>
            
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 transition-all ease-linear"
                style={{ width: `${splashProgress}%`, transitionDuration: '4900ms' }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-400 font-mono-stat uppercase tracking-widest animate-pulse">
              Verificando integridade da conta...
            </p>
          </div>
        </main>
      </div>
    );
  }"""

new_splash = """  if (!isDbReady || !minSplashTimeElapsed) {
    return (
      <div className="flex justify-center w-full h-full bg-[#05070a]">
        <main 
          className="relative flex flex-col items-center justify-end w-full h-full max-w-md md:max-w-lg bg-[#080B0E] border-x border-slate-800/40 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/splash-bg.png')" }}
        >
          {/* Fallback overlay in case image takes a moment to load */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>

          {/* Bottom Bar Section */}
          <div className="relative z-10 w-full px-6 pb-12 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
            
            {/* Main Loading Pill */}
            <div className="w-full max-w-[320px] h-12 rounded-full border-2 border-yellow-500 bg-black/60 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center px-1.5 relative overflow-hidden mb-4">
              {/* Progress Fill */}
              <div 
                className="h-[34px] bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(253,224,71,0.8)] transition-all ease-linear"
                style={{ width: `${Math.max(5, splashProgress * 0.55)}%`, transitionDuration: '4900ms' }}
              ></div>

              {/* Text & Spinner */}
              <div className="absolute right-4 flex items-center gap-3">
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Carregando...</span>
                <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="flex items-center gap-3 opacity-80">
              <span className="text-yellow-500 text-sm">⚡</span>
              <span className="text-white text-[11px] font-bold tracking-[0.3em] uppercase">The Rolling Wars</span>
              <span className="text-yellow-500 text-sm">⚡</span>
            </div>
            
          </div>
        </main>
      </div>
    );
  }"""

if old_splash in content:
    content = content.replace(old_splash, new_splash)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patch applied successfully.")
else:
    print("Old splash not found. Attempting regex...")
    # fallback if whitespace differs
