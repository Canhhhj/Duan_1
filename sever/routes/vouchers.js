const express = require('express');
const Voucher = require('../models/Voucher');

const router = express.Router();

const buildResponse = (success, message, data = null) => ({
  success,
  message,
  data
});

const calculateDiscount = (voucher, amount) => {
  if (!voucher || !amount) return 0;

  let discount = 0;
  if (voucher.discountType === 'percentage') {
    discount = (amount * voucher.discountValue) / 100;
    if (voucher.maxDiscountAmount) {
      discount = Math.min(discount, voucher.maxDiscountAmount);
    }
  } else {
    discount = voucher.discountValue;
  }

  if (voucher.minPurchaseAmount && amount < voucher.minPurchaseAmount) {
    return 0;
  }

  return discount;
};

const isVoucherActive = (voucher) => {
  const now = new Date();
  return (
    voucher.isActive &&
    voucher.startDate <= now &&
    voucher.endDate >= now &&
    (typeof voucher.usageLimit !== 'number' || voucher.usedCount < voucher.usageLimit)
  );
};

// Danh sách voucher
router.get('/', async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    res.json(buildResponse(true, 'Danh sách voucher', vouchers));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Voucher đang hoạt động
router.get('/active', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    const activeVouchers = vouchers.filter(isVoucherActive);
    res.json(buildResponse(true, 'Voucher đang hoạt động', activeVouchers));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Lấy voucher theo mã
router.get('/code/:code', async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });
    if (!voucher) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy voucher'));
    }
    res.json(buildResponse(true, 'Chi tiết voucher', voucher));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Tạo voucher
router.post('/', async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json(buildResponse(true, 'Tạo voucher thành công', voucher));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Cập nhật voucher
router.put('/:id', async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!voucher) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy voucher'));
    }

    res.json(buildResponse(true, 'Cập nhật voucher thành công', voucher));
  } catch (error) {
    res.status(400).json(buildResponse(false, error.message));
  }
});

// Xóa voucher
router.delete('/:id', async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).json(buildResponse(false, 'Không tìm thấy voucher'));
    }
    res.json(buildResponse(true, 'Xóa voucher thành công', voucher));
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

// Kiểm tra voucher
router.post('/validate', async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code) {
      return res.status(400).json(buildResponse(false, 'Vui lòng nhập mã voucher'));
    }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (!voucher || !isVoucherActive(voucher)) {
      return res.status(400).json(buildResponse(false, 'Voucher không hợp lệ hoặc đã hết hạn'));
    }

    const discount = calculateDiscount(voucher, totalAmount || 0);
    if (discount === 0) {
      return res
        .status(400)
        .json(buildResponse(false, 'Đơn hàng không đáp ứng điều kiện sử dụng voucher'));
    }

    res.json(
      buildResponse(true, 'Voucher hợp lệ', {
        voucher,
        discount,
        finalAmount: Math.max((totalAmount || 0) - discount, 0)
      })
    );
  } catch (error) {
    res.status(500).json(buildResponse(false, error.message));
  }
});

module.exports = router;