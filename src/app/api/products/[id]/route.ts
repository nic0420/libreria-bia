import { NextResponse } from 'next/server';
import { insertProduct, deleteProduct, Product } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const raw = await request.json();
    
    const product: Product = {
      id: params.id,
      name: String(raw.name || "Sin Nombre"),
      description: String(raw.description || ""),
      price: parseFloat(raw.price || 0) || 0,
      cost: parseFloat(raw.cost || 0) || 0,
      discountPrice: raw.discountPrice ? parseFloat(raw.discountPrice) : undefined,
      stock: parseInt(raw.stock || 0) || 0,
      category: String(raw.category || ""),
      image: String(raw.image || "https://via.placeholder.com/300")
    };

    await insertProduct(product);
    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}
