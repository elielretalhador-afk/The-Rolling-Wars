#!/bin/bash
find src -type f -name "*.tsx" | xargs sed -i 's/logo-rw-dark.png/logo.png/g'
