const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

// Danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const search = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const sortBy = (req.query.sortBy || 'createdAt');
    const order = (req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(buildResponse(true, 'Danh sách sản phẩm', {
      items: products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      filter: { q: search || undefined, category: category || undefined, minPrice, maxPrice },
      sort: { by: sortBy, order: order === 1 ? 'asc' : 'desc' }
    }));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Chi tiết sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy sản phẩm'));
    }
    res.json(buildResponse(true, 'Chi tiết sản phẩm', product));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const total = await Product.countDocuments({ category: categoryId });
    const products = await Product.find({ category: categoryId })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(buildResponse(true, 'Sản phẩm theo danh mục', {
      items: products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

router.get('/latest', async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(buildResponse(true, 'Sản phẩm mới nhất', products));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Thêm sản phẩm
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(buildResponse(true, 'Thêm sản phẩm thành công', product));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Cập nhật sản phẩm
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy sản phẩm'));
    }

    res.json(buildResponse(true, 'Cập nhật sản phẩm thành công', product));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy sản phẩm'));
    }
    res.json(buildResponse(true, 'Xóa sản phẩm thành công', product));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;
