import { NextResponse } from 'next/server';
import { createTable, clearProducts, insertProduct, getProducts, Product } from '@/lib/db';

export async function GET() {
  try {
    await createTable(); // Ensure table exists
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawProducts: Record<string, string | number>[] = await request.json();
    
    await createTable(); // Ensure table exists
    
    // Clear existing products to sync with the new Excel state
    await clearProducts();
    
    // Insert new products
    for (let i = 0; i < rawProducts.length; i++) {
      const raw = rawProducts[i];
      
      // Flexible mapping for Spanish or different column names
      const product: Product = {
        id: String(raw.id || raw.Id || raw.ID || raw.codigo || raw.Codigo || (i + 1)),
        name: String(raw.name || raw.Name || raw.nombre || raw.Nombre || raw.Producto || "Sin Nombre"),
        description: String(raw.description || raw.Description || raw.descripcion || raw.Descripcion || ""),
        price: parseFloat(raw.price || raw.Price || raw.precio || raw.Precio || 0) || 0,
        cost: parseFloat(raw.cost || raw.Cost || raw.costo || raw.Costo || 0) || 0,
        discountPrice: raw.discountPrice || raw.precioOferta ? parseFloat(raw.discountPrice || raw.precioOferta) : undefined,
        stock: parseInt(raw.stock || raw.Stock || raw.cantidad || raw.Cantidad || 0) || 0,
        category: String(raw.category || raw.Category || raw.categoria || raw.Categoria || ""),
        image: String(raw.image || raw.Image || raw.imagen || raw.Imagen || raw.foto || "https://via.placeholder.com/300")
      };

      await insertProduct(product);
    }
    
    return NextResponse.json({ message: 'Products synced successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to sync products', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

