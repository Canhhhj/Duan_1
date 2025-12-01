const mongoose = require('mongoose');

const gioHangChiTietSchema = new mongoose.Schema(
  {
    idGioHang: { type: mongoose.Schema.Types.ObjectId, ref: 'GioHang', required: true },
    idCTSP: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    soLuong: { type: Number, required: true, min: 1 },
    donGia: { type: Number, required: true, min: 0 }
  },
  { timestamps: { createdAt: 'ngayTao', updatedAt: 'ngayCapNhat' } }
);

module.exports = mongoose.model('GioHangChiTiet', gioHangChiTietSchema);

