# Auth Service - Web Builder SaaS

Microservicio de autenticación y gestión de usuarios para la plataforma Web Builder SaaS.

## Descripción

Este microservicio maneja toda la autenticación, autorización y gestión de usuarios de la plataforma. Incluye registro, login, gestión de perfiles, control de acceso basado en roles y gestión de suscripciones.

## Características Principales

- 🔐 Autenticación JWT
- 👥 Gestión de usuarios y roles
- 📧 Verificación por email
- 🔒 Seguridad y rate limiting
- 📊 Monitoreo de actividad
- 💳 Control de suscripciones

## Requisitos Previos

- Node.js >= 18
- Docker y Docker Compose
- PostgreSQL
- Redis

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd auth-service
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar servicios con Docker**

```bash
docker-compose up -d
```

5. **Ejecutar migraciones**

```bash
npm run migration:run
```

## Desarrollo

```bash
# Modo desarrollo
npm run start:dev

# Tests
npm run test

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── auth/           # Autenticación
├── users/          # Gestión de usuarios
├── common/         # Utilidades compartidas
├── config/         # Configuraciones
└── main.ts         # Punto de entrada
```

## API Endpoints

### Auth

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login
- `POST /auth/refresh-token` - Refrescar token
- `POST /auth/verify-email` - Verificar email
- `POST /auth/forgot-password` - Recuperar contraseña

### Users

- `GET /users/me` - Obtener perfil
- `PATCH /users/me` - Actualizar perfil
- `GET /users/me/subscription` - Info de suscripción
- `GET /users` - Listar usuarios (Admin)

## Configuración

Principales variables de entorno:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=auth_db
DATABASE_USER=admin
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Despliegue

1. **Construir imagen Docker**

```bash
docker build -t auth-service .
```

2. **Desplegar con Docker Compose**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Documentación API

La documentación Swagger está disponible en `/api` cuando el servidor está corriendo.

## Monitoreo

- Logs centralizados
- Métricas de rendimiento
- Alertas configurables
- Tracking de errores

## Seguridad

- Rate limiting
- JWT authentication
- CORS configurado
- Protección XSS
- Validación de datos
- Encriptación de contraseñas

## Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Soporte

Para reportar problemas o solicitar ayuda, por favor crear un issue en el repositorio.

## Licencia

[MIT](LICENSE)
