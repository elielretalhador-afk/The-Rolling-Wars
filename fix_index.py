import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('bg-[#080B0E]', 'bg-[#000000]')
content = content.replace('theme-color" content="#080B0E"', 'theme-color" content="#000000"')
content = content.replace('<title>Urbanozeiro — Patine. Conquiste. Desafie.</title>', '<title>The Rolling Wars</title>')

force_unregister = """
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            (err) => {
              console.log('ServiceWorker registration failed: ', err);
            }
          );
        });
      }
    </script>
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
            console.log('Unregistered old SW');
          }
        });
      }
    </script>
"""

if "unregister old SW" not in content:
    content = content.replace("</body>", force_unregister + "\n  </body>")

with open('index.html', 'w') as f:
    f.write(content)

