export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  discountPrice?: number;
  stock: number;
  category: string;
  image: string;
}
