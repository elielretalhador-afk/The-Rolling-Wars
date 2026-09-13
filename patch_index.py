import re

with open('index.html', 'r') as f:
    content = f.read()

# Add a forced unregister script before sw.js registration
force_unregister = """
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
    content = content.replace("</body>", force_unregister + "</body>")

with open('index.html', 'w') as f:
    f.write(content)
