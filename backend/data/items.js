// Mock database for items
let items = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description:
      'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description:
      'Advanced fitness tracker with heart rate monitoring, GPS, and waterproof design. Track your workouts and health metrics.',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    description:
      'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Clothing',
    inStock: true,
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: 4,
    name: 'Professional Camera Lens',
    description:
      '85mm f/1.4 professional camera lens with exceptional image quality. Perfect for portrait and professional photography.',
    price: 899.99,
    image:
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop',
    category: 'Photography',
    inStock: true,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: 5,
    name: 'Ergonomic Office Chair',
    description:
      'Premium ergonomic office chair with lumbar support and adjustable height. Designed for long hours of comfortable work.',
    price: 449.99,
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
    category: 'Furniture',
    inStock: true,
    createdAt: new Date('2024-01-19').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
  },
  {
    id: 6,
    name: 'Stainless Steel Water Bottle',
    description:
      'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    category: 'Lifestyle',
    inStock: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
];

let nextId = 7;

module.exports = {
  getAllItems: () => items,
  getItemById: (id) => items.find((item) => item.id === parseInt(id)),
  addItem: (itemData) => {
    const newItem = {
      id: nextId++,
      ...itemData,
      image:
        itemData.image ||
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
      category: itemData.category || 'General',
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    return newItem;
  },
  updateItem: (id, updateData) => {
    const index = items.findIndex((item) => item.id === parseInt(id));
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return items[index];
  },
  deleteItem: (id) => {
    const index = items.findIndex((item) => item.id === parseInt(id));
    if (index === -1) return false;

    items.splice(index, 1);
    return true;
  },
  getItemsCount: () => items.length,
  getItemsByCategory: (category) =>
    items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    ),
};
