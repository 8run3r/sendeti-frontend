export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  shortDescription: string;
  badge?: "sale" | "new" | "popular" | "bestseller";
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  variants?: {
    sizes?: string[];
    colors?: { name: string; hex: string }[];
  };
  viewCount: number;
  soldCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  accentColor: string;
  image: string;
  productCount: number;
  subcategories: { id: string; name: string; productCount: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}
