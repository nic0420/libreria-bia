import { NextResponse } from 'next/server';
import { getCategories, insertCategory, createCategoryTable, Category } from '@/lib/db';

export async function GET() {
  try {
    await createCategoryTable();
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawCategory = await request.json();
    
    await createCategoryTable();
    
    const category: Category = {
      id: rawCategory.id || Date.now().toString(),
      name: rawCategory.name,
      slug: rawCategory.slug || rawCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    if (!category.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await insertCategory(category);
    return NextResponse.json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create category', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
