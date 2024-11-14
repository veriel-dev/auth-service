#!/bin/bash 

# Función para verificar si un puerto está en uso 

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            echo "Puerto $port está en uso"
            echo "Proceso usando el puerto:"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                lsof -i :$port
            else
                # Linux
                netstat -tulpn | grep ":$port "
            fi
            return 1
        else
            echo "Puerto $port está libre"
            return 0
        fi
    else
        echo "netstat no encontrado"
        return 2
    fi
}

# Función para verificar contenedores de Docker
check_docker() {
    local port=$1
    if command -v docker &> /dev/null; then
        echo "Contenedores Docker usando puerto $port:"
        docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}" | grep ":$port-"
        
        echo -e "\nTodos los contenedores PostgreSQL:"
        docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "postgres"
    else
        echo "Docker no encontrado"
        return 1
    fi
}


# Verificar puerto PostgreSQL
echo "=== Verificando puerto PostgreSQL (5432) ==="
check_port 5432

echo -e "\n=== Verificando contenedores Docker ==="
check_docker 5432

echo -e "\n=== Estado de Docker ==="
docker info 2>/dev/null || echo "Docker no está corriendo"