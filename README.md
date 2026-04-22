# Drops

Aplicación web para el seguimiento de hábitos diarios. Proyecto TFM - Máster universitario de Desarrollo de Sitios y Aplicaciones Web (UOC).

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

### 1. Backend (drops-server)

```bash
cd drops-server
npm install
```

Configurar variables de entorno (copiar `.env.example` a `.env`):

```bash
cp .env.example .env
```

Crear la base de datos y generar el cliente Prisma:

```bash
npx prisma generate
npx prisma db push
```

Cargar datos de ejemplo:

```bash
npm run seed
```

Iniciar el servidor (puerto 3001):

```bash
npm run dev
```

### 2. Frontend (drops-client)

En otra terminal:

```bash
cd drops-client
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Credenciales de prueba

| Rol   | Email               | Contraseña |
|-------|---------------------|------------|
| Admin | admin@drops.com | Admin1234  |
| Demo  | demo@drops.com  | Demo1234   |

## Estructura del proyecto

```
drops-app/
├── drops-server/        # Backend: Node.js + Express + Prisma + SQLite
│   ├── prisma/              # Schema y seed
│   ├── src/
│   │   ├── config/          # Configuración de base de datos
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/      # Auth JWT, admin, errores
│   │   ├── routes/          # Definición de endpoints
│   │   └── validators/      # Validación de datos
│   └── server.js            # Punto de entrada
│
├── drops-client/        # Frontend: React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Estado global (AuthContext)
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── services/        # Llamadas a la API
│   └── index.html
│
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario (autenticado)

### Hábitos (autenticado)
- `GET /api/habits` - Listar hábitos del usuario
- `GET /api/habits/:id` - Detalle de un hábito
- `POST /api/habits` - Crear hábito
- `PUT /api/habits/:id` - Actualizar hábito
- `DELETE /api/habits/:id` - Eliminar hábito
- `POST /api/habits/:id/toggle` - Marcar/desmarcar día
- `GET /api/habits/:id/stats` - Estadísticas del hábito

### Categorías (autenticado)
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Administración (admin)
- `GET /api/admin/users` - Listar usuarios
- `DELETE /api/admin/users/:id` - Eliminar usuario
- `GET /api/admin/dashboard` - Estadísticas generales

## Tecnologías

### Backend
- **Node.js** + **Express** - Servidor web
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (desarrollo)
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

### Frontend
- **React 19** - Librería UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router 7** - Enrutamiento

## Licencia

CC BY-NC-ND 4.0 — Ana A, 2026
