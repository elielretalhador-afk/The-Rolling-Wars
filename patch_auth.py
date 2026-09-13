import re

with open('src/components/AuthScreen.tsx', 'r') as f:
    content = f.read()

# Replace the LOGO block
logo_block_pattern = re.compile(r'\{\/\*\s*LOGO\s*\*\/\}.*?\{\/\*\s*FORMS\s*\*\/\}', re.DOTALL)
replacement = '''{/* LOGO */}
        <div className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 mx-auto mb-2 flex items-center justify-center">
            {/* Raio e pulsing removidos conforme solicitado */}
            <img src="/logo.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(252,232,3,0.4)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>

        {/* FORMS */}'''

new_content = logo_block_pattern.sub(replacement, content)

with open('src/components/AuthScreen.tsx', 'w') as f:
    f.write(new_content)
