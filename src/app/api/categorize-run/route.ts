import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const hasPostgres = !!process.env.POSTGRES_URL;
    if (!hasPostgres) {
      return NextResponse.json({ message: 'No Postgres configured' }, { status: 400 });
    }

    const { rows: products } = await sql`SELECT id, name, description, category FROM products`;

    let updated = 0;
    
    for (const product of products) {
      const pName = product.name.toLowerCase();
      const pDesc = product.description.toLowerCase();
      const pCat = product.category.toLowerCase();
      
      let newCategory = "Librería General";
      
      if (pName.includes("cuaderno") || pName.includes("lápiz") || pName.includes("lapiz") || pName.includes("goma") || pName.includes("sacapuntas") || pName.includes("escolar") || pCat.includes("escolar")) {
        newCategory = "Escolar";
      } else if (pName.includes("resma") || pName.includes("abrochadora") || pName.includes("folio") || pName.includes("carpeta") || pCat.includes("oficina")) {
        newCategory = "Oficina";
      } else if (pName.includes("pincel") || pName.includes("acuarela") || pName.includes("bastidor") || pName.includes("óleo") || pName.includes("oleo") || pName.includes("acrílico") || pCat.includes("arte")) {
        newCategory = "Arte y Diseño";
      } else if (pName.includes("agenda") || pName.includes("taza") || pName.includes("regalo") || pCat.includes("regalo")) {
        newCategory = "Regalos";
      } else {
        newCategory = "Papelería";
      }

      await sql`UPDATE products SET category = ${newCategory} WHERE id = ${product.id}`;
      updated++;
    }

    return NextResponse.json({ message: 'Products auto-categorized successfully', totalUpdated: updated });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to auto-categorize products', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
