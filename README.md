# Drops

Aplicación web para el seguimiento de hábitos diarios. Proyecto TFM — Máster Universitario de Desarrollo de Sitios y Aplicaciones Web (UOC).

## Requisitos previos

- Node.js >= 18
- npm >= 9
- Base de datos PostgreSQL (local o en Render)

## Instalación en local

### 1. Backend

```bash
cd drops-backend
npm install
cp .env.example .env
```

Edita `.env` con tu URL de PostgreSQL:

```
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/drops?schema=public"
JWT_SECRET="una-clave-larga-y-secreta"
JWT_EXPIRES_IN="24h"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

Crea las tablas y carga los datos de demo:

```bash
npx prisma db push
npm run seed
```

Inicia el servidor (puerto 3001):

```bash
npm run dev
```

### 2. Frontend

En otra terminal:

```bash
cd drops-frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Credenciales de prueba

| Rol   | Email           | Contraseña |
|-------|-----------------|------------|
| Admin | admin@drops.com | Admin1234  |
| Demo  | demo@drops.com  | Demo1234   |

## Despliegue en producción

- **Backend + PostgreSQL:** [Render](https://render.com)
- **Frontend:** [Vercel](https://vercel.com)

Variable de entorno necesaria en Vercel:

```
VITE_API_URL=https://TU-BACKEND.onrender.com
```

## Estructura del proyecto

```
drops/
├── drops-backend/               # Backend: Node.js + Express + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos: User, Habit, HabitEntry, Category
│   │   └── seed.js              # Datos de demo
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── middleware/          # Auth JWT, admin, errores
│   │   ├── routes/              # Endpoints de la API
│   │   └── validators/          # Validación de entradas
│   └── server.js
│
├── drops-frontend/              # Frontend: React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/          # Componentes reutilizables (Modal, HabitHeatmap...)
│   │   ├── context/             # AuthContext (estado global)
│   │   ├── pages/               # Dashboard, Habits, Categories, Admin...
│   │   └── services/            # Llamadas a la API REST
│   └── index.html
│
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Inicio de sesión
- `GET /api/auth/profile` — Perfil del usuario autenticado

### Hábitos (requiere autenticación)
- `GET /api/habits` — Listar hábitos del usuario
- `GET /api/habits/:id` — Detalle de un hábito
- `POST /api/habits` — Crear hábito
- `PUT /api/habits/:id` — Actualizar hábito
- `DELETE /api/habits/:id` — Eliminar hábito
- `POST /api/habits/:id/toggle` — Marcar/desmarcar día
- `GET /api/habits/:id/stats` — Estadísticas del hábito

### Categorías (requiere autenticación)
- `GET /api/categories` — Listar categorías con conteo de hábitos del usuario
- `POST /api/categories` — Crear categoría
- `PUT /api/categories/:id` — Actualizar categoría
- `DELETE /api/categories/:id` — Eliminar categoría

### Administración (requiere rol admin)
- `GET /api/admin/users` — Listar usuarios
- `DELETE /api/admin/users/:id` — Eliminar usuario
- `GET /api/admin/dashboard` — Estadísticas generales

### Utilidad
- `GET /api/health` — Estado del servidor

## Tecnologías

### Backend
- **Node.js** + **Express** — Servidor web
- **Prisma** — ORM para base de datos
- **PostgreSQL** — Base de datos
- **JWT** — Autenticación
- **bcryptjs** — Hash de contraseñas

### Frontend
- **React 19** — Librería UI
- **Vite** — Build tool
- **Tailwind CSS** — Estilos
- **React Router 7** — Enrutamiento

## Licencia

Proyecto académico — UOC 2025/2026. Ana Alba Burgués.
