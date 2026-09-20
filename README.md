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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
