#!/bin/bash
sed -i '/NOVO: Raio pulsando/,/bg-neutral-800/c\            {/* Raio removido */}\n            <div className="absolute inset-0 bg-neutral-800 rounded-full blur-[60px] opacity-20 animate-pulse" style={{ transform: '"'"'scale(1.2)'"'"' }}></div>' src/components/AuthScreen.tsx
sed -i '/NOVO: Raio pulsando/,/bg-neutral-800/c\            {/* Raio removido */}\n            <div className="absolute inset-0 bg-neutral-800 rounded-full blur-[60px] opacity-20 animate-pulse" style={{ transform: '"'"'scale(1.2)'"'"' }}></div>' src/App.tsx
