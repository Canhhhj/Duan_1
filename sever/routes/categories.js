const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

// Danh sách danh mục
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(buildResponse(true, 'Danh sách danh mục', categories));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Chi tiết danh mục
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy danh mục'));
    }
    res.json(buildResponse(true, 'Chi tiết danh mục', category));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Thêm danh mục
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(buildResponse(true, 'Thêm danh mục thành công', category));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Cập nhật danh mục
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy danh mục'));
    }

    res.json(buildResponse(true, 'Cập nhật danh mục thành công', category));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa danh mục
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy danh mục'));
    }
    res.json(buildResponse(true, 'Xóa danh mục thành công', category));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;
