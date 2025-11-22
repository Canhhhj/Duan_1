const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

const calculateTotalAmount = (items = []) =>
  items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

const populateOrder = (query) =>
  query
    .populate('user', 'name email')
    .populate('items.product', 'name price image');

// Danh sách đơn hàng
router.get('/', async (req, res) => {
  try {
    const orders = await populateOrder(
      Order.find().sort({ createdAt: -1 })
    );
    res.json(buildResponse(true, 'Danh sách đơn hàng', orders));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Đơn hàng theo người dùng
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await populateOrder(
      Order.find({ user: req.params.userId }).sort({ createdAt: -1 })
    );
    res.json(buildResponse(true, 'Danh sách đơn hàng của người dùng', orders));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Chi tiết đơn hàng
router.get('/:id', async (req, res) => {
  try {
    const order = await populateOrder(Order.findById(req.params.id));
    if (!order) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đơn hàng'));
    }
    res.json(buildResponse(true, 'Chi tiết đơn hàng', order));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Tạo đơn hàng
router.post('/', async (req, res) => {
  try {
    const { user, items, shippingAddress, status } = req.body;

    if (!user || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json(buildResponse(false, 'Thiếu thông tin đơn hàng'));
    }

    const order = await Order.create({
      user,
      items,
      shippingAddress,
      status: status || 'pending',
      totalAmount: calculateTotalAmount(items)
    });

    const populatedOrder = await populateOrder(Order.findById(order._id));
    res.status(201).json(buildResponse(true, 'Tạo đơn hàng thành công', populatedOrder));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Cập nhật đơn hàng
router.put('/:id', async (req, res) => {
  try {
    const updatePayload = { ...req.body, updatedAt: new Date() };
    if (req.body.items) {
      updatePayload.totalAmount = calculateTotalAmount(req.body.items);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đơn hàng'));
    }

    const populatedOrder = await populateOrder(Order.findById(order._id));
    res.json(buildResponse(true, 'Cập nhật đơn hàng thành công', populatedOrder));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa đơn hàng
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy đơn hàng'));
    }
    res.json(buildResponse(true, 'Xóa đơn hàng thành công', order));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;
