import { sql } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  discountPrice?: number;
  stock: number;
  category: string;
  image: string;
};

const hasPostgres = !!process.env.POSTGRES_URL;
const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function createTable() {
  if (hasPostgres) {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        cost NUMERIC DEFAULT 0,
        "discountPrice" NUMERIC,
        stock INTEGER NOT NULL,
        category VARCHAR(255),
        image TEXT
      );
    `;
  } else {
    await ensureDataDir();
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.writeFile(dataFilePath, JSON.stringify([]));
    }
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    if (hasPostgres) {
      const { rows } = await sql<Product>`SELECT * FROM products ORDER BY name ASC`;
      return rows;
    } else {
      await ensureDataDir();
      try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const products = JSON.parse(data) as Product[];
        return products.sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        return [];
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function clearProducts() {
  if (hasPostgres) {
    await sql`DELETE FROM products`;
  } else {
    await ensureDataDir();
    await fs.writeFile(dataFilePath, JSON.stringify([]));
  }
}

export async function insertProduct(product: Product) {
  if (hasPostgres) {
    await sql`
      INSERT INTO products (id, name, description, price, cost, "discountPrice", stock, category, image)
      VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, ${product.cost}, ${product.discountPrice}, ${product.stock}, ${product.category}, ${product.image})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        cost = EXCLUDED.cost,
        "discountPrice" = EXCLUDED."discountPrice",
        stock = EXCLUDED.stock,
        category = EXCLUDED.category,
        image = EXCLUDED.image;
    `;
  } else {
    await ensureDataDir();
    let products: Product[] = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      products = JSON.parse(data);
    } catch {}
    
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
  }
}

export async function deleteProduct(id: string) {
  if (hasPostgres) {
    await sql`DELETE FROM products WHERE id = ${id}`;
  } else {
    await ensureDataDir();
    let products: Product[] = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      products = JSON.parse(data);
    } catch {}
    
    products = products.filter(p => p.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
  }
}

export type Category = {
  id: string;
  name: string;
  slug: string;
};

const categoriesFilePath = path.join(process.cwd(), 'data', 'categories.json');

export async function createCategoryTable() {
  if (hasPostgres) {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL
      );
    `;
  } else {
    await ensureDataDir();
    try {
      await fs.access(categoriesFilePath);
    } catch {
      await fs.writeFile(categoriesFilePath, JSON.stringify([
        { id: '1', name: 'Escolar', slug: 'escolar' },
        { id: '2', name: 'Oficina', slug: 'oficina' },
        { id: '3', name: 'Arte y Diseño', slug: 'arte-y-diseno' },
        { id: '4', name: 'Regalos', slug: 'regalos' }
      ]));
    }
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (hasPostgres) {
      const { rows } = await sql<Category>`SELECT * FROM categories ORDER BY name ASC`;
      return rows;
    } else {
      await ensureDataDir();
      try {
        const data = await fs.readFile(categoriesFilePath, 'utf-8');
        return JSON.parse(data) as Category[];
      } catch {
        return [];
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function insertCategory(category: Category) {
  if (hasPostgres) {
    await sql`
      INSERT INTO categories (id, name, slug)
      VALUES (${category.id}, ${category.name}, ${category.slug})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug;
    `;
  } else {
    await ensureDataDir();
    let categories: Category[] = [];
    try {
      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      categories = JSON.parse(data);
    } catch {}
    
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
  }
}

export async function deleteCategory(id: string) {
  if (hasPostgres) {
    await sql`DELETE FROM categories WHERE id = ${id}`;
  } else {
    await ensureDataDir();
    let categories: Category[] = [];
    try {
      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      categories = JSON.parse(data);
    } catch {}
    
    categories = categories.filter(c => c.id !== id);
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
  }
}
