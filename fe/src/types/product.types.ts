export interface Thumbnail {
  id: number;
  url: string;
  publicId: string;
}

export interface Property {
  name: string;
  tags: string[];
}

export interface Product {
  name: string;
  description: string;
  provider: string;
  category: string;
  baseUnit: string;
  sku: string;
  barcode: string;
  deletedAt: string | null;
  thumbnails: Thumbnail[];
  properties: Property[];
  salePrice: number;
  comparedPrice: number;
}

export interface ProductDTO extends Omit<Product, 'thumbnails'> {
  thumbnails?: Thumbnail[];
}
