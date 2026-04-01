// src/lib/analytics-data.ts

export const RAW_REVENUE_DATA = [
  { name: "Mon", revenue: 4500000 },
  { name: "Tue", revenue: 5200000 },
  { name: "Wed", revenue: 4800000 },
  { name: "Thu", revenue: 7100000 },
  { name: "Fri", revenue: 8500000 },
  { name: "Sat", revenue: 11200000 },
  { name: "Sun", revenue: 9800000 },
];

export const RAW_ORDERS_DATA = [
  { name: "Mon", orders: 120 },
  { name: "Tue", orders: 200 },
  { name: "Wed", orders: 150 },
  { name: "Thu", orders: 280 },
  { name: "Fri", orders: 320 },
  { name: "Sat", orders: 410 },
  { name: "Sun", orders: 390 },
];

export const RAW_VENDOR_DATA = [
  { name: "TechGadgets", sales: 18500000, products: 120, rating: 4.8 },
  { name: "UrbanWear", sales: 12200000, products: 340, rating: 4.5 },
  { name: "SneakerVault", sales: 8800000, products: 85, rating: 4.9 },
  { name: "AudioPro", sales: 6900000, products: 45, rating: 4.7 },
  { name: "HomeAesthetics", sales: 4700000, products: 210, rating: 4.2 },
];

export const CATEGORY_DATA = [
  { name: "Electronics", value: 42 },
  { name: "Apparel", value: 28 },
  { name: "Footwear", value: 18 },
  { name: "Accessories", value: 8 },
  { name: "Home Goods", value: 4 },
];

export const CATEGORY_VENDORS: Record<string, { name: string; itemsSold: number; revenue: number }[]> = {
  All: [], 
  Electronics: [
    { name: "TechGadgets", itemsSold: 4200, revenue: 18500000 },
    { name: "AudioPro", itemsSold: 1150, revenue: 6900000 },
    { name: "ElectroWorld", itemsSold: 890, revenue: 3200000 },
  ],
  Apparel: [
    { name: "UrbanWear", itemsSold: 5600, revenue: 12200000 },
    { name: "ChicStyle", itemsSold: 3200, revenue: 4500000 },
  ],
  Footwear: [
    { name: "SneakerVault", itemsSold: 2100, revenue: 8800000 },
    { name: "SoleMates", itemsSold: 950, revenue: 3100000 },
  ],
  Accessories: [
    { name: "WristCandy", itemsSold: 1400, revenue: 2100000 },
    { name: "BagItUp", itemsSold: 800, revenue: 1500000 },
  ],
  "Home Goods": [
    { name: "HomeAesthetics", itemsSold: 1800, revenue: 4700000 },
    { name: "CozySpaces", itemsSold: 650, revenue: 1200000 },
  ],
};

export const RECENT_ORDERS = [
  { id: 1, customer: "John Doe", product: "iPhone 15 Pro Max", baseAmount: 1200000, date: "Oct 24" },
  { id: 2, customer: "Sarah Smith", product: "MacBook Air M2", baseAmount: 1850000, date: "Oct 24" },
  { id: 3, customer: "Michael K.", product: "Sony PlayStation 5", baseAmount: 650000, date: "Oct 23" },
  { id: 4, customer: "Amaka Ndidi", product: "Samsung 65\" TV", baseAmount: 840000, date: "Oct 23" },
  { id: 5, customer: "David Chen", product: "AirPods Pro 2", baseAmount: 250000, date: "Oct 22" },
];

export const MOCK_STOCK = [
  { id: 1, name: "MacBook Pro 16\" M3 Max", sku: "MAC-16-M3", status: "In stock", stock: "24" },
  { id: 2, name: "Men's Heavyweight Oversized Tee", sku: "APP-TS-092", status: "Low stock", stock: "5" },
  { id: 3, name: "Sony WH-1000XM5 Headphones", sku: "AUD-SNY-XM5", status: "In stock", stock: "42" },
  { id: 4, name: "Nike Air Jordan 4 Retro", sku: "FTW-NK-AJ4", status: "Out of stock", stock: "0" },
  { id: 5, name: "Samsung Galaxy S24 Ultra", sku: "MOB-SAM-S24U", status: "In stock", stock: "18" },
  { id: 6, name: "Women's High-Waisted Cargo", sku: "APP-CP-014", status: "In stock", stock: "56" },
];