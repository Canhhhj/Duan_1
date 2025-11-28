const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];

const products = [
  {
    _id: uuidv4(),
    name: 'Áo thun nam',
    description: 'Áo thun cotton mềm mại, thoáng mát',
    price: 149000,
    stock: 120,
    image: 'https://example.com/images/ao-thun-nam.jpg',
    category: { _id: uuidv4(), name: 'Thời trang' }
  },
  {
    _id: uuidv4(),
    name: 'Giày thể thao',
    description: 'Giày nhẹ, êm chân, phù hợp chạy bộ',
    price: 699000,
    stock: 50,
    image: 'https://example.com/images/giay-the-thao.jpg',
    category: { _id: uuidv4(), name: 'Giày dép' }
  },
  {
    _id: uuidv4(),
    name: 'Tai nghe Bluetooth',
    description: 'Âm thanh rõ, pin lâu, kết nối ổn định',
    price: 399000,
    stock: 200,
    image: 'https://example.com/images/tai-nghe.jpg',
    category: { _id: uuidv4(), name: 'Phụ kiện' }
  }
];

function baseResponse(success, message, data) {
  return { success, message, data };
}

app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || String(password).length < 6) {
    return res.status(400).json(baseResponse(false, 'Dữ liệu không hợp lệ', null));
  }
  const existing = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(409).json(baseResponse(false, 'Email đã tồn tại', null));
  }
  const id = uuidv4();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(String(password), 10);
  const userRecord = {
    id,
    name: String(name),
    email: String(email).toLowerCase(),
    role: 'user',
    createdAt: now,
    updatedAt: now,
    passwordHash
  };
  users.push(userRecord);
  const token = uuidv4();
  const user = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt
  };
  return res.json(baseResponse(true, 'Đăng ký thành công', { token, user }));
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json(baseResponse(false, 'Thiếu email hoặc mật khẩu', null));
  }
  const userRecord = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!userRecord) {
    return res.status(401).json(baseResponse(false, 'Email hoặc mật khẩu không đúng', null));
  }
  const ok = await bcrypt.compare(String(password), userRecord.passwordHash);
  if (!ok) {
    return res.status(401).json(baseResponse(false, 'Email hoặc mật khẩu không đúng', null));
  }
  const token = uuidv4();
  const user = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
    updatedAt: new Date().toISOString()
  };
  userRecord.updatedAt = user.updatedAt;
  return res.json(baseResponse(true, 'Đăng nhập thành công', { token, user }));
});

app.get('/api/products', (req, res) => {
  return res.json(baseResponse(true, 'Tải sản phẩm thành công', products));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

