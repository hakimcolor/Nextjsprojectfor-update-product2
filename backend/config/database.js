const { MongoClient, ServerApiVersion } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    if (db) {
      return db; // Return existing connection
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB!');

    // Get the database
    db = client.db('JoBTask');

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('📴 MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
