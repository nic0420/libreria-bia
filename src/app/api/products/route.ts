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
    const products: Product[] = await request.json();
    
    await createTable(); // Ensure table exists
    
    // Clear existing products to sync with the new Excel state
    await clearProducts();
    
    // Insert new products
    for (const product of products) {
      await insertProduct(product);
    }
    
    return NextResponse.json({ message: 'Products synced successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to sync products' }, { status: 500 });
  }
}
