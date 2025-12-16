const BASE_URL = "/v1";

/**
 * Respuesta genérica del backend (según tu ejemplo).
 */
export interface ApiResponse<T> {
  error: boolean;
  code: string;
  title: string;
  message: string;
  type: string | null;
  date: string;
  data: T;
}

/**
 * DTOs tal como vienen del backend.
 */
export interface PromotionDTO {
  promotionId: number;
  promotionName: string;
  promotionDescription: string;
  promotionDiscountRate: number;
  promotionStartDate: string;
  promotionEndDate: string;
  companyId: number;
}

export interface CategoryDTO {
  productCategoryId: number | null;
  productCategoryName: string | null;
  promotionDTOList?: PromotionDTO[] | null;
}

export interface ProductItemDTO {
  productItemId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productItemSKU: string;
  productItemQuantityInStock: number;
  productItemImage: string;
  productItemPrice: number;
  variations: Array<{ variationName: string; options: string }>;
  responseCategory?: CategoryDTO;
}

export interface ProductDTO {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  responseCategory: CategoryDTO;
  responseProductItemDetails: ProductItemDTO[];
}

export interface ProductListData {
  responseProductList: ProductDTO[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  end: boolean;
}

/**
 * MODELOS "limpios" para tu frontend (manteniendo tus interfaces originales).
 * Nota: como tu backend no manda company por producto, lo dejamos como null.
 */
export interface Product {
  id: number;
  name: string;
  description: string;

  // Tomamos el primer item como "principal" para price/stock/image.
  // Si no hay items, ponemos defaults.
  price: number;
  stock: number;
  imageUrl: string;

  category: Category | null;
  company: Company | null; // backend no lo envía en este endpoint
}

export interface Category {
  id: number;
  name: string;
  description: string;
  promotions?: PromotionDTO[] | null;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
}

/**
 * Helpers
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed (${response.status}): ${text || url}`);
  }
  return response.json() as Promise<T>;
}

function mapCategory(dto: CategoryDTO | undefined | null): Category | null {
  const id = dto?.productCategoryId ?? null;
  const name = dto?.productCategoryName ?? null;
  if (id == null || name == null) return null;

  return {
    id,
    name,
    description: "",
    promotions: dto?.promotionDTOList ?? null,
  };
}

function mapProduct(dto: ProductDTO): Product {
  const firstItem = dto.responseProductItemDetails?.[0];

  return {
    id: dto.productId,
    name: dto.productName,
    description: dto.productDescription ?? "",
    price: firstItem?.productItemPrice ?? 0,
    stock: firstItem?.productItemQuantityInStock ?? 0,
    imageUrl: firstItem?.productItemImage ?? dto.productImage ?? "",
    category: mapCategory(dto.responseCategory),
    company: null,
  };
}

export const api = {
  /**
   * ✅ GET products (lista)
   * Backend: /product-service/product/list
   * Retorna Product[] ya "mapeado" al modelo de tu app
   */
  async getProducts(): Promise<Product[]> {
    const json = await fetchJson<ApiResponse<ProductListData>>(
      `${BASE_URL}/product-service/product/list`
    );

    const list = json?.data?.responseProductList ?? [];
    return list.map(mapProduct);
  },

  /**
   * ✅ GET product by id
   * Si tu backend NO tiene endpoint directo por id, lo resolvemos filtrando
   * desde la lista (simple y funcional para MVP).
   *
   * Si luego tienes un endpoint tipo:
   * /product-service/product/{id}
   * me lo pasas y lo ajusto.
   */
  async getProduct(id: number): Promise<Product> {
    const products = await this.getProducts();
    const found = products.find((p) => p.id === id);
    if (!found) throw new Error("Product not found");
    return found;
  },

  /**
   * ✅ GET categories
   * OJO: tu backend de categorías (según tu mensaje anterior) suele ser:
   * /product-service/category/list/pageable
   * Aquí lo dejo apuntando a ese. Si tu ruta final cambia, la ajustamos.
   */
  async getCategories(): Promise<Category[]> {
    // Ajusta si tu respuesta de categorías viene con wrapper distinto
    const json = await fetchJson<any>(
      `${BASE_URL}/product-service/category/list/pageable`
    );

    // Intenta leer lista común: data.responseCategoryList
    const list: any[] = json?.data?.responseCategoryList ?? [];

    return list.map((c) => ({
      id: c.productCategoryId,
      name: c.productCategoryName,
      description: c.productCategoryDescription ?? "",
      promotions: c.promotionDTOList ?? null,
    })) as Category[];
  },

  /**
   * ✅ GET products by category
   * Como no nos diste endpoint filtro por categoría,
   * lo resolvemos filtrando desde getProducts().
   *
   * Si tienes endpoint real (mejor), pásamelo y lo cambiamos.
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.category?.id === categoryId);
  },

  /**
   * ✅ GET companies
   * No tenemos tu endpoint real de companies en el backend nuevo,
   * así que lo dejo comentado/placeholder.
   * Pásame tu ruta real (ej: /company-service/company/list) y lo ajusto.
   */
  async getCompanies(): Promise<Company[]> {
    // TODO: reemplaza por tu endpoint real
    // const json = await fetchJson<ApiResponse<{ responseCompanyList: any[] }>>(
    //   `${BASE_URL}/company-service/company/list`
    // );
    // return (json.data.responseCompanyList ?? []).map(mapCompany);

    return [];
  },
};
