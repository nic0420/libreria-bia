export interface ProductAttributeValue {
  value: string;
  stock: number;
  price: number;
}

export interface ProductAttribute {
  name: string;
  values: ProductAttributeValue[];
}

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
  attributes?: ProductAttribute[];
}
