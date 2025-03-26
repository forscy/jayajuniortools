import { Product, Brand, Category, Inventory } from "../types";

export const mockBrands: Brand[] = [
  {
    id: 1,
    name: "TechCorp",
    description: "Leading tech manufacturer",
    createdAt: "2024-08-10T00:00:00Z",
    updatedAt: "2024-08-10T00:00:00Z",
  },
  {
    id: 2,
    name: "FitGear",
    description: "Premium fitness equipment",
    createdAt: "2024-09-15T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: 3,
    name: "CompTech",
    description: "Computer hardware specialist",
    createdAt: "2024-10-20T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
  },
  {
    id: 4,
    name: "AudioMax",
    description: "Audio equipment manufacturer",
    createdAt: "2024-11-05T00:00:00Z",
    updatedAt: "2024-11-05T00:00:00Z",
  },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets",
  },
  {
    id: 2,
    name: "Smartphones",
    description: "Mobile phones and accessories",
  },
  {
    id: 3,
    name: "Audio",
    description: "Headphones, earbuds, and speakers",
  },
  {
    id: 4,
    name: "Wearables",
    description: "Smartwatches and fitness trackers",
  },
  {
    id: 5,
    name: "Computers",
    description: "Laptops, desktops, and accessories",
  },
];

export const mockInventory: Inventory[] = [
  {
    id: 1,
    locationName: "Main Warehouse",
    quantityInStock: 156,
    minimumStock: 20,
    lastUpdated: "2025-03-15T09:45:00Z",
  },
  {
    id: 2,
    locationName: "Main Warehouse",
    quantityInStock: 234,
    minimumStock: 30,
    lastUpdated: "2025-03-20T13:15:00Z",
  },
  {
    id: 3,
    locationName: "Electronics Store",
    quantityInStock: 89,
    minimumStock: 15,
    lastUpdated: "2025-03-19T10:30:00Z",
  },
  {
    id: 4,
    locationName: "Main Warehouse",
    quantityInStock: 42,
    minimumStock: 10,
    lastUpdated: "2025-03-21T08:45:00Z",
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone XYZ",
    description: "Latest model with high-end features",
    retailPrice: 799.99,
    wholesalePrice: 599.99,
    minWholesaleQty: 10,
    sku: "PHONE-XYZ-001",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-03-10T14:22:00Z",
    inventoryId: 1,
    brandId: 1,
    brand: mockBrands[0],
    inventory: mockInventory[0],
    categories: [
      { id: 1, productId: 1, categoryId: 1 },
      { id: 2, productId: 1, categoryId: 2 },
    ],
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    description: "Noise cancelling with 24h battery life",
    retailPrice: 149.99,
    wholesalePrice: 99.99,
    minWholesaleQty: 20,
    sku: "AUDIO-EBP-002",
    createdAt: "2025-02-05T08:20:00Z",
    updatedAt: "2025-03-18T11:10:00Z",
    inventoryId: 2,
    brandId: 1,
    brand: mockBrands[0],
    inventory: mockInventory[1],
    categories: [
      { id: 3, productId: 2, categoryId: 1 },
      { id: 4, productId: 2, categoryId: 3 },
    ],
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    description: "Health monitoring and fitness tracking",
    retailPrice: 299.99,
    wholesalePrice: 219.99,
    minWholesaleQty: 15,
    sku: "WATCH-SW5-003",
    createdAt: "2025-01-25T12:40:00Z",
    updatedAt: "2025-03-12T16:35:00Z",
    inventoryId: 3,
    brandId: 2,
    brand: mockBrands[1],
    inventory: mockInventory[2],
    categories: [
      { id: 5, productId: 3, categoryId: 1 },
      { id: 6, productId: 3, categoryId: 4 },
    ],
  },
  {
    id: 4,
    name: 'Laptop Pro 15"',
    description: "High-performance laptop for professionals",
    retailPrice: 1499.99,
    wholesalePrice: 1199.99,
    minWholesaleQty: 5,
    sku: "COMP-LP15-004",
    createdAt: "2025-02-18T09:15:00Z",
    updatedAt: "2025-03-15T15:20:00Z",
    inventoryId: 4,
    brandId: 3,
    brand: mockBrands[2],
    inventory: mockInventory[3],
    categories: [
      { id: 7, productId: 4, categoryId: 1 },
      { id: 8, productId: 4, categoryId: 5 },
    ],
  },
];

// Helper function to get category names by product ID
export const getCategoryNamesByProductId = (productId: number): string[] => {
  const productCategories = mockProducts
    .find(p => p.id === productId)
    ?.categories || [];
  
  return productCategories.map(pc => {
    const category = mockCategories.find(c => c.id === pc.categoryId);
    return category ? category.name : '';
  }).filter(name => name !== '');
};