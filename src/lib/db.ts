import { sql } from '@vercel/postgres';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export async function createTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      stock INTEGER NOT NULL,
      category VARCHAR(255),
      image TEXT
    );
  `;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { rows } = await sql<Product>`SELECT * FROM products ORDER BY name ASC`;
    return rows;
  } catch (error) {
    console.error('Error fetching products from Postgres:', error);
    return [];
  }
}

export async function clearProducts() {
  await sql`DELETE FROM products`;
}

export async function insertProduct(product: Product) {
  await sql`
    INSERT INTO products (id, name, description, price, stock, category, image)
    VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, ${product.stock}, ${product.category}, ${product.image})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      stock = EXCLUDED.stock,
      category = EXCLUDED.category,
      image = EXCLUDED.image;
  `;
}
