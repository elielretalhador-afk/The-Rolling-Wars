#!/bin/bash
sed -i '/<div className="absolute inset-0 flex items-center justify-between px-1"/,/{error && (/c\
            <div className="absolute inset-0 flex items-center justify-between px-1" style={{ zIndex: 0, opacity: 0.15 }}>\
              <Settings className="w-14 h-14 text-white -scale-x-100 transform rotate-12 animate-spin" strokeWidth={1.5} style={{ animationDuration: '"'"'8s'"'"' }} />\
              <Settings className="w-14 h-14 text-white transform -rotate-12 animate-spin" strokeWidth={1.5} style={{ animationDuration: '"'"'6s'"'"', animationDirection: '"'"'reverse'"'"' }} />\
            </div>\
            {/* Raio removido */}\
            <div className="absolute inset-0 bg-neutral-800 rounded-full blur-[60px] opacity-20 animate-pulse" style={{ transform: '"'"'scale(1.2)'"'"' }}></div>\
            <div className="absolute inset-0 bg-[#fce803] rounded-full blur-[40px] opacity-20 animate-pulse"></div>\
            <img src="/logo.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = '"'"'none'"'"'; }} />\
            <div className="absolute inset-0 flex items-center justify-center border-2 border-[#fce803]/30 rounded-full" style={{ zIndex: 0 }}>\
              <span className="text-[#fce803] font-black text-3xl tracking-widest opacity-50">RW</span>\
            </div>\
          </div>\
        </div>\
\
        {/* FORMS */}\
        <form onSubmit={handleAuth} className="w-full max-w-sm flex flex-col gap-4">\
          {error && (' src/components/AuthScreen.tsx
