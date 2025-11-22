const express = require('express');
const Favorite = require('../models/Favorite');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

const populateFavorite = (query) =>
  query
    .populate('user', 'name email')
    .populate('product', 'name price image');

// Danh sách yêu thích
router.get('/', async (req, res) => {
  try {
    const favorites = await populateFavorite(Favorite.find().sort({ createdAt: -1 }));
    res.json(buildResponse(true, 'Danh sách yêu thích', favorites));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Yêu thích theo người dùng
router.get('/user/:userId', async (req, res) => {
  try {
    const favorites = await populateFavorite(
      Favorite.find({ user: req.params.userId }).sort({ createdAt: -1 })
    );
    res.json(buildResponse(true, 'Danh sách yêu thích của người dùng', favorites));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Thêm sản phẩm yêu thích
router.post('/', async (req, res) => {
  try {
    const { user, product } = req.body;

    if (!user || !product) {
      return res.status(400).json(buildResponse(false, 'Thiếu thông tin yêu thích'));
    }

    const favorite = await Favorite.create({ user, product });
    const populatedFavorite = await populateFavorite(Favorite.findById(favorite._id));
    res.status(201).json(buildResponse(true, 'Đã thêm vào yêu thích', populatedFavorite));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(buildResponse(false, 'Sản phẩm đã có trong danh sách yêu thích'));
    }
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa yêu thích theo user & product
router.delete('/user/:userId/product/:productId', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.params.userId,
      product: req.params.productId
    });

    if (!favorite) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy bản ghi yêu thích'));
    }

    res.json(buildResponse(true, 'Đã xóa khỏi yêu thích', favorite));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Xóa yêu thích theo id
router.delete('/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy bản ghi yêu thích'));
    }
    res.json(buildResponse(true, 'Đã xóa khỏi yêu thích', favorite));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;