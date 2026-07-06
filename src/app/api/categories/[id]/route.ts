import { NextResponse } from 'next/server';
import { deleteCategory, insertCategory, Category } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rawCategory = await request.json();
    const resolvedParams = await params;
    
    const category: Category = {
      id: resolvedParams.id,
      name: rawCategory.name,
      slug: rawCategory.slug || rawCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    if (!category.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await insertCategory(category);
    return NextResponse.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update category', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await deleteCategory(resolvedParams.id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete category', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
