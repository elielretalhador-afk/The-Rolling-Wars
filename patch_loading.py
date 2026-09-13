import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the state and timer
old_timer = """  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);"""

new_timer = """  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  useEffect(() => {
    const pTimer = setTimeout(() => setSplashProgress(100), 100);
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(pTimer);
    };
  }, []);"""

content = content.replace(old_timer, new_timer)

# 2. Update the loading bar div
old_bar = """            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 w-full origin-left animate-pulse"></div>
            </div>"""

new_bar = """            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 transition-all ease-linear"
                style={{ width: `${splashProgress}%`, transitionDuration: '4900ms' }}
              ></div>
            </div>"""

content = content.replace(old_bar, new_bar)

with open('src/App.tsx', 'w') as f:
    f.write(content)
