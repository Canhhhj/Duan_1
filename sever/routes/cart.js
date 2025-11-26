const express = require('express');
const mongoose = require('mongoose');
const GioHang = require('../models/GioHang');
const GioHangChiTiet = require('../models/GioHangChiTiet');
const Product = require('../models/Product');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({ success, message, data });

const computeTotal = async (gioHangId) => {
  const items = await GioHangChiTiet.find({ idGioHang: gioHangId });
  return items.reduce((sum, it) => sum + (it.donGia || 0) * (it.soLuong || 0), 0);
};

const getCartDetail = async (userId) => {
  let cart = await GioHang.findOne({ idKH: userId });
  if (!cart) {
    cart = await GioHang.create({ idKH: userId, tongGia: 0 });
  }
  const items = await GioHangChiTiet.find({ idGioHang: cart._id })
    .populate('idCTSP', 'name price image');
  const formattedItems = items.map((it) => ({
    id: it._id,
    product: it.idCTSP,
    soLuong: it.soLuong,
    donGia: it.donGia,
    thanhTien: (it.donGia || 0) * (it.soLuong || 0),
    ngayTao: it.ngayTao,
    ngayCapNhat: it.ngayCapNhat
  }));
  const tongGia = formattedItems.reduce((sum, it) => sum + it.thanhTien, 0);
  if (tongGia !== cart.tongGia) {
    cart.tongGia = tongGia;
    await cart.save();
  }
  return {
    id: cart._id,
    idKH: cart.idKH,
    tongGia: cart.tongGia,
    ngayTao: cart.ngayTao,
    ngayCapNhat: cart.ngayCapNhat,
    items: formattedItems
  };
};

router.get('/', async (req, res) => {
  try {
    const userId = (req.query.userId || '').trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(buildResponse(false, 'User ID không hợp lệ'));
    }
    const data = await getCartDetail(userId);
    res.json(buildResponse(true, 'Giỏ hàng hiện tại', data));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = (req.query.userId || '').trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(buildResponse(false, 'User ID không hợp lệ'));
    }
    const cart = await GioHang.findOne({ idKH: userId });
    if (!cart) {
      return res.json(buildResponse(true, 'Đã xóa giỏ hàng', null));
    }
    await GioHangChiTiet.deleteMany({ idGioHang: cart._id });
    await GioHang.findByIdAndDelete(cart._id);
    res.json(buildResponse(true, 'Đã xóa giỏ hàng', null));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

router.post('/items', async (req, res) => {
  try {
    const { userId, productId, soLuong } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(buildResponse(false, 'ID không hợp lệ'));
    }
    const qty = Math.max(parseInt(soLuong || '1', 10), 1);
    let cart = await GioHang.findOne({ idKH: userId });
    if (!cart) cart = await GioHang.create({ idKH: userId, tongGia: 0 });
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy sản phẩm'));
    }
    const existing = await GioHangChiTiet.findOne({ idGioHang: cart._id, idCTSP: productId });
    if (existing) {
      existing.soLuong += qty;
      await existing.save();
    } else {
      await GioHangChiTiet.create({ idGioHang: cart._id, idCTSP: productId, soLuong: qty, donGia: product.price });
    }
    cart.tongGia = await computeTotal(cart._id);
    await cart.save();
    const data = await getCartDetail(userId);
    res.status(201).json(buildResponse(true, 'Đã thêm vào giỏ hàng', data));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

router.put('/items/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, soLuong } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(buildResponse(false, 'ID không hợp lệ'));
    }
    const qty = Math.max(parseInt(soLuong || '1', 10), 0);
    const cart = await GioHang.findOne({ idKH: userId });
    if (!cart) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy giỏ hàng'));
    }
    const item = await GioHangChiTiet.findOne({ idGioHang: cart._id, idCTSP: productId });
    if (!item) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy item trong giỏ'));
    }
    if (qty === 0) {
      await GioHangChiTiet.deleteOne({ _id: item._id });
    } else {
      item.soLuong = qty;
      await item.save();
    }
    cart.tongGia = await computeTotal(cart._id);
    await cart.save();
    const data = await getCartDetail(userId);
    res.json(buildResponse(true, 'Đã cập nhật item', data));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

router.delete('/items/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = (req.query.userId || '').trim();
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(buildResponse(false, 'ID không hợp lệ'));
    }
    const cart = await GioHang.findOne({ idKH: userId });
    if (!cart) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy giỏ hàng'));
    }
    await GioHangChiTiet.deleteOne({ idGioHang: cart._id, idCTSP: productId });
    cart.tongGia = await computeTotal(cart._id);
    await cart.save();
    const data = await getCartDetail(userId);
    res.json(buildResponse(true, 'Đã xóa item', data));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

module.exports = router;

