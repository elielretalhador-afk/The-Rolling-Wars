with open('src/App.tsx', 'r') as f:
    content = f.read()

old_loading = """  if (authState === 'LOADING') {
    return (
      <div className="flex justify-center w-full h-full bg-[#000000]">
        <main className="relative flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-[#000000] border-x border-slate-800/40">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-400/20 border-t-emerald-400 animate-spin mb-4" />
          <h2 className="text-xl font-black text-white font-display uppercase tracking-wider mb-2">Autenticando</h2>
          <p className="text-sm text-slate-400 font-medium">Verificando identidade...</p>
        </main>
      </div>
    );
  }"""

new_loading = """  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    if (authState === 'LOADING') {
      const interval = setInterval(() => {
        setSplashProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 2;
        });
      }, 140);
      return () => clearInterval(interval);
    }
  }, [authState]);

  if (authState === 'LOADING') {
    return (
      <div className="flex justify-center w-full h-full bg-[#000000] relative overflow-hidden">
        <main className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-transparent border-x border-slate-800/40 p-6">
          <div className="relative w-56 h-56 mx-auto mb-16 flex items-center justify-center animate-pulse" style={{ animationDuration: '3s' }}>
            <img src="/logo.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          
          <div className="w-full max-w-xs mt-8">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ea580c] to-[#fce803] transition-all ease-linear"
                style={{ width: `${Math.max(5, splashProgress)}%`, transitionDuration: '150ms' }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-3 opacity-80">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">Iniciando sistema...</span>
              <span className="text-[#fce803] text-[10px] font-black font-mono-stat">{Math.floor(splashProgress)}%</span>
            </div>
          </div>
        </main>
      </div>
    );
  }"""

if old_loading in content:
    content = content.replace(old_loading, new_loading)
else:
    print("WARNING: Old loading block not found exact match!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
