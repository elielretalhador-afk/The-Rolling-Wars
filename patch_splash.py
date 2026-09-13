import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add the state
if "const [minSplashTimeElapsed" not in content:
    content = content.replace(
        "const [authState, setAuthState] = useState<'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR'>('LOADING');",
        "const [authState, setAuthState] = useState<'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR'>('LOADING');\n  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);"
    )

# Add the useEffect for 5 seconds
if "setMinSplashTimeElapsed(true)" not in content:
    content = content.replace(
        "const [isDbReady, setIsDbReady] = useState(false);",
        """const [isDbReady, setIsDbReady] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);"""
    )

# Replace the loading screen
loading_screen = """  if (!isDbReady || !minSplashTimeElapsed) {
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
            
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 w-full origin-left animate-[scale-x_2s_ease-in-out_infinite_alternate]"></div>
            </div>
            
            <p className="text-xs text-slate-400 font-mono-stat uppercase tracking-widest animate-pulse">
              Verificando integridade da conta...
            </p>
          </div>
        </main>
      </div>
    );
  }"""

content = re.sub(r"  if \(!isDbReady\) \{.*?    \);\n  \}", loading_screen, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
