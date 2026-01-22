const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'alldata';

// Sample data to initialize the database if empty
const sampleItems = [
  {
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

// Helper function to ensure database connection
const ensureConnection = async () => {
  const { connectDB } = require('../config/database');
  try {
    return await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
};

// Initialize database with sample data if empty
const initializeDatabase = async () => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(sampleItems);
      console.log('✅ Database initialized with sample data');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

const getAllItems = async () => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    // Initialize if empty
    const count = await collection.countDocuments();
    if (count === 0) {
      await initializeDatabase();
    }

    const items = await collection.find({}).toArray();

    // Convert MongoDB _id to id for frontend compatibility
    return items.map((item) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined,
    }));
  } catch (error) {
    console.error('❌ Error getting all items:', error);
    throw error;
  }
};

const getItemById = async (id) => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const item = await collection.findOne({ _id: new ObjectId(id) });

    if (!item) return null;

    // Convert MongoDB _id to id for frontend compatibility
    return {
      ...item,
      id: item._id.toString(),
      _id: undefined,
    };
  } catch (error) {
    console.error('❌ Error getting item by ID:', error);
    return null;
  }
};

const addItem = async (itemData) => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const newItem = {
      ...itemData,
      image:
        itemData.image ||
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
      category: itemData.category || 'General',
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newItem);

    // Return the item with the new ID
    return {
      ...newItem,
      id: result.insertedId.toString(),
      _id: undefined,
    };
  } catch (error) {
    console.error('❌ Error adding item:', error);
    throw error;
  }
};

const updateItem = async (id, updateData) => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const updateDoc = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    if (!result.value) return null;

    // Convert MongoDB _id to id for frontend compatibility
    return {
      ...result.value,
      id: result.value._id.toString(),
      _id: undefined,
    };
  } catch (error) {
    console.error('❌ Error updating item:', error);
    return null;
  }
};

const deleteItem = async (id) => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('❌ Error deleting item:', error);
    return false;
  }
};

const getItemsCount = async () => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    return await collection.countDocuments();
  } catch (error) {
    console.error('❌ Error getting items count:', error);
    return 0;
  }
};

const getItemsByCategory = async (category) => {
  try {
    const db = await ensureConnection();
    const collection = db.collection(COLLECTION_NAME);

    const items = await collection
      .find({
        category: { $regex: new RegExp(category, 'i') },
      })
      .toArray();

    // Convert MongoDB _id to id for frontend compatibility
    return items.map((item) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined,
    }));
  } catch (error) {
    console.error('❌ Error getting items by category:', error);
    return [];
  }
};

module.exports = {
  initializeDatabase,
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getItemsCount,
  getItemsByCategory,
};
