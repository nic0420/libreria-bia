import { NextResponse } from 'next/server';
import { insertProduct, deleteProduct, Product } from '@/lib/db';
import { parseFormattedNumber } from '../route';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const raw = await request.json();
    const resolvedParams = await params;

    const discountVal = raw.discountPrice ? parseFormattedNumber(raw.discountPrice) : undefined;
    
    const product: Product = {
      id: resolvedParams.id,
      name: String(raw.name || "Sin Nombre"),
      description: String(raw.description || ""),
      price: parseFormattedNumber(raw.price),
      cost: parseFormattedNumber(raw.cost),
      discountPrice: discountVal && discountVal > 0 ? discountVal : undefined,
      stock: Math.floor(parseFormattedNumber(raw.stock)),
      category: String(raw.category || "General"),
      image: String(raw.image || "https://via.placeholder.com/300")
    };

    await insertProduct(product);
    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await deleteProduct(resolvedParams.id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
