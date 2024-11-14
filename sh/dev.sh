#!/bin/bash 

function ctrl_c(){
    echo -e "\n\n[!] Saliendo...\n"
    exit 1
}


# dev.sh 

# Asegurarse de qué docker está corriendo 
# Esperar a que la base de datos esté lista 
echo "Esperando a que la base de datos esté lista..."
sleep 5

# Ejecutar migraciones
# pnpm run migration:run

# Iniciar la aplicación en modo desarrollo
pnpm run start:dev

# Ctr + C
trap ctrl_c INT