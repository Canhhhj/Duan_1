const mongoose = require('mongoose');

const gioHangSchema = new mongoose.Schema(
  {
    idKH: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tongGia: { type: Number, min: 0, default: 0 }
  },
  { timestamps: { createdAt: 'ngayTao', updatedAt: 'ngayCapNhat' } }
);

module.exports = mongoose.model('GioHang', gioHangSchema);

