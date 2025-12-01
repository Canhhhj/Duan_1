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
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(buildResponse(true, 'Danh sách sản phẩm', products));
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
