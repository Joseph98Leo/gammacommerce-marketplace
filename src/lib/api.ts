const BASE_URL = 'http://213.136.75.60:8080/v1';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: Category;
  company: Company;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch products by category');
    return response.json();
  },

  async getCompanies(): Promise<Company[]> {
    const response = await fetch(`${BASE_URL}/companies`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
  },
};
