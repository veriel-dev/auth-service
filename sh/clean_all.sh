#!/bin/bash 

# Eliminar la carpeta dist
rm -rf dist/
rm -rf node_modules/
rm -rf tsconfig.tsbuildinfo

# Reinstalar dependenciass
pnpm install
npm run build
echo "Proyecto reinstalado!!!"