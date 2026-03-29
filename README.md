# Drops — Aplicación web de seguimiento de hábitos personales

**Trabajo Final de Máster** — Máster Universitario en Desarrollo de Sitios y Aplicaciones Web (UOC)

**Autora:** Ana Alba Burgués

---

## Descripción

Drops es una aplicación web para el seguimiento de hábitos personales. Permite crear, gestionar y visualizar hábitos diarios con diferentes tipos de seguimiento (binario, cuantificable y tiempo), organizarlos por categorías con colores personalizados y consultar el progreso a lo largo del tiempo.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Front-end** | React 18 + Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons |
| **Back-end** | Node.js + Express, JWT + bcrypt, express-validator |
| **Base de datos** | PostgreSQL + Prisma ORM |
| **Despliegue** | Vercel (front) + Railway (back + BD) |

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior
- npm v9 o superior

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone 
cd drops
```

### 2. Configurar el back-end

```bash
cd drops-backend
npm install
```

Crea un archivo `.env` basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tu configuración de base de datos:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/drops?schema=public"
JWT_SECRET="tu-clave-secreta"
JWT_EXPIRES_IN="24h"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

Ejecuta las migraciones y el seed:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3001`.

### 3. Configurar el front-end

```bash
cd ../drops-frontend
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@drops.app | Admin123! |
| Usuario | ana@drops.app | User1234! |

## Estructura del proyecto

```
drops/
├── drops-frontend/          # Aplicación React (SPA)
│   ├── src/
│   │   ├── components/      # Componentes (Atomic Design)
│   │   │   ├── atoms/       # Botones, inputs, badges
│   │   │   ├── molecules/   # Combinaciones de átomos
│   │   │   └── organisms/   # Navbar, HabitCard, modales
│   │   ├── context/         # AuthContext (gestión de sesión)
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # MainLayout
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios API (axios)
│   │   └── utils/           # Utilidades
│   └── ...
├── drops-backend/           # API REST (Express)
│   ├── prisma/
│   │   ├── schema.prisma    # Esquema de base de datos
│   │   └── seed.js          # Datos de prueba
│   └── src/
│       ├── config/          # Configuración (Prisma client)
│       ├── controllers/     # Lógica de negocio
│       ├── middlewares/      # Auth, validación, errores
│       ├── routes/          # Definición de rutas API
│       └── server.js        # Punto de entrada
└── README.md
```

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/auth/me` | Obtener usuario autenticado |

### Hábitos (requiere autenticación)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/habits` | Listar hábitos del usuario |
| GET | `/api/habits/:id` | Detalle de un hábito |
| POST | `/api/habits` | Crear hábito |
| PUT | `/api/habits/:id` | Editar hábito |
| DELETE | `/api/habits/:id` | Archivar hábito |

### Categorías (requiere autenticación)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Editar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |

### Administración (requiere rol ADMIN)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| PATCH | `/api/users/:id/toggle-active` | Activar/desactivar usuario |

## Licencia

CC BY-NC-ND 4.0 — Ana Alba Burgués, 2026
