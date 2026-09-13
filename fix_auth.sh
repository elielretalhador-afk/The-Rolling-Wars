#!/bin/bash
cat << 'INNER' > patch.txt
    <div className="flex justify-center w-full min-h-screen bg-black relative overflow-hidden">
      <div className="sparks-container">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="spark" style={{
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 50}%`,
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-screen max-w-md md:max-w-lg bg-transparent border-x border-slate-800/40 p-6">
        {/* LOGO */}
        <div className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            {/* NOVO: Engrenagens no fundo */}
            <div className="absolute inset-0 flex items-center justify-between px-1" style={{ zIndex: 0, opacity: 0.15 }}>
              <Settings className="w-14 h-14 text-white -scale-x-100 transform rotate-12 animate-spin" strokeWidth={1.5} style={{ animationDuration: '8s' }} />
              <Settings className="w-14 h-14 text-white transform -rotate-12 animate-spin" strokeWidth={1.5} style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            </div>

            <div className="absolute inset-0 bg-neutral-800 rounded-full blur-[60px] opacity-20 animate-pulse" style={{ transform: 'scale(1.2)' }}></div>
            <div className="absolute inset-0 bg-[#fce803] rounded-full blur-[40px] opacity-20 animate-pulse"></div>
            <img src="/logo.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className="absolute inset-0 flex items-center justify-center border-2 border-[#fce803]/30 rounded-full" style={{ zIndex: 0 }}>
              <span className="text-[#fce803] font-black text-3xl tracking-widest opacity-50">RW</span>
            </div>
          </div>
        </div>

        {/* FORMS */}
        <form onSubmit={handleAuth} className="w-full max-w-sm flex flex-col gap-4">
INNER
sed -i '/<div className="flex justify-center w-full min-h-screen/,/        <form onSubmit={handleAuth}/c\
'"$(cat patch.txt | awk '{printf "%s\\n", $0}')"'' src/components/AuthScreen.tsx
