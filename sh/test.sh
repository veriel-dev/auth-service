#!/bin/bash
# test.sh

# Iniciar contenedores de test
docker-compose -f docker-compose.test.yml up -d

# Esperar a que la base de datos esté lista
sleep 5

# Ejecutar tests
npm run test