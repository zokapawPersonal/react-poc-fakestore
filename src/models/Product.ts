export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface NewProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}