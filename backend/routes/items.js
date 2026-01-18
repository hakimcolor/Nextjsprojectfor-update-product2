const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getItemsCount,
  getItemsByCategory,
} = require('../data/items');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const {
  validateItem,
  validateItemUpdate,
  validateId,
} = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/items - Get all items
router.get(
  '/',
  asyncHandler(async (req, res) => {
    console.log('GET /api/items called');
    console.log('Request headers:', req.headers);

    const { category, limit, offset } = req.query;
    let items = getAllItems();

    console.log('Total items found:', items.length);

    // Filter by category if provided
    if (category) {
      items = getItemsByCategory(category);
      console.log('Filtered by category:', category, 'Items:', items.length);
    }

    // Apply pagination if provided
    if (limit || offset) {
      const limitNum = parseInt(limit) || 10;
      const offsetNum = parseInt(offset) || 0;
      items = items.slice(offsetNum, offsetNum + limitNum);
      console.log('Paginated items:', items.length);
    }

    const response = {
      success: true,
      data: items,
      total: getItemsCount(),
      message: 'Items retrieved successfully',
    };

    console.log('Sending response:', {
      ...response,
      data: `${items.length} items`,
    });
    res.json(response);
  })
);

// GET /api/items/stats - Get items statistics (admin only)
router.get(
  '/stats',
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const items = getAllItems();
    const categories = [...new Set(items.map((item) => item.category))];

    const stats = {
      totalItems: items.length,
      categories: categories.length,
      inStockItems: items.filter((item) => item.inStock).length,
      outOfStockItems: items.filter((item) => !item.inStock).length,
      averagePrice:
        items.reduce((sum, item) => sum + item.price, 0) / items.length,
      categoryBreakdown: categories.map((category) => ({
        category,
        count: items.filter((item) => item.category === category).length,
      })),
    };

    res.json({
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully',
    });
  })
);

// GET /api/items/:id - Get single item
router.get(
  '/:id',
  validateId,
  asyncHandler(async (req, res) => {
    const item = getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      data: item,
      message: 'Item retrieved successfully',
    });
  })
);

// POST /api/items - Create new item (admin only)
router.post(
  '/',
  authenticateUser,
  requireAdmin,
  validateItem,
  asyncHandler(async (req, res) => {
    const newItem = addItem(req.body);

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully',
    });
  })
);

// PUT /api/items/:id - Update item (admin only)
router.put(
  '/:id',
  authenticateUser,
  requireAdmin,
  validateId,
  validateItemUpdate,
  asyncHandler(async (req, res) => {
    const updatedItem = updateItem(req.params.id, req.body);

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully',
    });
  })
);

// DELETE /api/items/:id - Delete item (admin only)
router.delete(
  '/:id',
  authenticateUser,
  requireAdmin,
  validateId,
  asyncHandler(async (req, res) => {
    const deleted = deleteItem(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  })
);

module.exports = router;
