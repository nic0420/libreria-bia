# Librería BIA

E-commerce de librería y papelería: catálogo por categorías, carrito, checkout y un panel de administración con carga masiva de productos.

**Demo:** https://libreria-bia.vercel.app

## Qué hace

- **Catálogo** navegable por categorías, con buscador y fichas de producto.
- **Carrito y checkout** con estado persistente.
- **Panel de administración** protegido por middleware de autenticación.
- **Carga masiva**: subida de archivos Excel con categorización automática de productos.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand |
| Base de datos | Vercel Postgres |
| Importación | `xlsx`, `fflate` |
| Iconos | lucide-react |
| Deploy | Vercel |

## Cómo correrlo

```bash
git clone https://github.com/nic0420/libreria-bia.git
cd libreria-bia
npm install
cp .env.example .env.local   # completar la conexión a Postgres
npm run dev
```

Abrir http://localhost:3000.
