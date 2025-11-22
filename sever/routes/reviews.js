const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

const populateReview = (query) =>
  query
    .populate('user', 'name email')
    .populate('product', 'name price image');

// Danh sách đánh giá
router.get('/', async (req, res) => {
  try {
    const reviews = await populateReview(Review.find().sort({ createdAt: -1 }));
    res.json(buildResponse(true, 'Danh sách đánh giá', reviews));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Đánh giá theo sản phẩm
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find({ product: req.params.productId }).sort({ createdAt: -1 })
    );
    res.json(buildResponse(true, 'Đánh giá sản phẩm', reviews));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Chi tiết đánh giá
router.get('/:id', async (req, res) => {
  try {
    const review = await populateReview(Review.findById(req.params.id));
    if (!review) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đánh giá'));
    }
    res.json(buildResponse(true, 'Chi tiết đánh giá', review));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Thêm đánh giá
router.post('/', async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;

    if (!user || !product || !rating) {
      return res.status(400).json(buildResponse(false, 'Thiếu thông tin đánh giá'));
    }

    const review = await Review.create({
      user,
      product,
      rating,
      comment
    });

    const populatedReview = await populateReview(Review.findById(review._id));
    res.status(201).json(buildResponse(true, 'Thêm đánh giá thành công', populatedReview));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Cập nhật đánh giá
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đánh giá'));
    }

    const populatedReview = await populateReview(Review.findById(review._id));
    res.json(buildResponse(true, 'Cập nhật đánh giá thành công', populatedReview));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa đánh giá
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đánh giá'));
    }
    res.json(buildResponse(true, 'Xóa đánh giá thành công', review));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;