export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};