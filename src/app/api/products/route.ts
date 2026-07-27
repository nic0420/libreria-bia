import { NextResponse } from 'next/server';
import { createTable, clearProducts, insertProduct, getProducts, Product } from '@/lib/db';

export function parseFormattedNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  
  let str = String(val).trim().replace(/[$]/g, '');
  
  if (str.includes(',') && str.includes('.')) {
    if (str.indexOf('.') < str.indexOf(',')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    str = str.replace(',', '.');
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

export async function GET() {
  try {
    await createTable();
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawProducts: Record<string, any>[] = await request.json();
    
    await createTable();
    await clearProducts();
    
    for (let i = 0; i < rawProducts.length; i++) {
      const raw = rawProducts[i];
      
      const priceVal = parseFormattedNumber(raw.price ?? raw.Price ?? raw.precio ?? raw.Precio ?? raw['PRECIO VENTA'] ?? raw['Precio Venta'] ?? 0);
      const costVal = parseFormattedNumber(raw.cost ?? raw.Cost ?? raw.costo ?? raw.Costo ?? raw['PRECIO COSTO'] ?? raw['Precio Costo'] ?? 0);
      const discountVal = raw.discountPrice || raw.precioOferta || raw['Precio Oferta'] ? parseFormattedNumber(raw.discountPrice || raw.precioOferta || raw['Precio Oferta']) : undefined;
      const stockVal = Math.floor(parseFormattedNumber(raw.stock ?? raw.Stock ?? raw.cantidad ?? raw.Cantidad ?? raw.STOCK ?? raw.Stock ?? 0));

      const product: Product = {
        id: String(raw.id || raw.Id || raw.ID || raw.codigo || raw.Codigo || raw.CODIGO || (i + 1)),
        name: String(raw.name || raw.Name || raw.nombre || raw.Nombre || raw.Producto || raw.PRODUCTO || "Sin Nombre"),
        description: String(raw.description || raw.Description || raw.descripcion || raw.Descripcion || raw.DESCRIPCION || ""),
        price: priceVal,
        cost: costVal,
        discountPrice: discountVal && discountVal > 0 ? discountVal : undefined,
        stock: stockVal,
        category: String(raw.category || raw.Category || raw.categoria || raw.Categoria || raw.CATEGORIA || "General"),
        image: String(raw.image || raw.Image || raw.imagen || raw.Imagen || raw.IMAGEN || raw['URL Imagen'] || "https://via.placeholder.com/300")
      };

      await insertProduct(product);
    }
    
    return NextResponse.json({ message: 'Products synced successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to sync products', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
