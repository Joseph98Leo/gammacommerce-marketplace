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

// New interface for itemProduct endpoint response
export interface ProductItemDetailDTO {
  productItemId: number;
  productItemSKU: string;
  productItemQuantityInStock: number;
  productItemImage: string;
  companyName: string;
  companyRuc: string;
  companyImage: string | null;
  companyTradeName: string;
  companyId: number;
  productItemPrice: number;
  responseCategoryy: CategoryDTO;
  variations: Array<{ variationName: string; options: string }>;
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

export interface ProductItemListData {
  responseProductList: ProductItemDetailDTO[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  end: boolean;
}

/**
 * MODELOS "limpios" para tu frontend (manteniendo tus interfaces originales).
 * Ahora company SÍ se incluye gracias al endpoint itemProduct/pageable
 */
export interface Product {
  id: number;
  name: string;
  description: string;

  price: number;
  stock: number;
  imageUrl: string;

  category: Category | null;
  company: Company | null;
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

function mapProductItem(dto: ProductItemDetailDTO): Product {
  return {
    id: dto.productItemId,
    name: dto.productItemSKU,
    description: dto.productItemSKU,
    price: dto.productItemPrice,
    stock: dto.productItemQuantityInStock,
    imageUrl: dto.productItemImage,
    category: mapCategory(dto.responseCategoryy),
    company: {
      id: dto.companyId,
      name: dto.companyTradeName || dto.companyName,
      description: dto.companyName,
      logoUrl: dto.companyImage || "",
    },
  };
}

export const api = {
  /**
   * ✅ GET products (lista) - NOW using itemProduct/pageable with company data
   * Backend: /product-service/itemProduct/pageable
   * Retorna Product[] ya "mapeado" al modelo de tu app CON info de company
   */
  async getProducts(): Promise<Product[]> {
    const json = await fetchJson<ApiResponse<ProductItemListData>>(
      `${BASE_URL}/product-service/itemProduct/pageable`
    );

    const list = json?.data?.responseProductList ?? [];
    return list.map(mapProductItem);
  },

  /**
   * ✅ GET product by id
   * Filtra desde la lista de itemProduct
   */
  async getProduct(id: number): Promise<Product> {
    const products = await this.getProducts();
    const found = products.find((p) => p.id === id);
    if (!found) throw new Error("Product not found");
    return found;
  },

  /**
   * ✅ GET categories
   */
  async getCategories(): Promise<Category[]> {
    const json = await fetchJson<any>(
      `${BASE_URL}/product-service/category/list/pageable`
    );

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
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.category?.id === categoryId);
  },

  /**
   * ✅ GET companies
   */
  async getCompanies(): Promise<Company[]> {
    return [];
  },
};
