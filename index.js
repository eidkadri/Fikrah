const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require("dotenv");
const session = require('express-session');
const productRoutes = require('./routes/userProductRoutes.js');
const adminProductRoutes = require('./routes/adminProductRoutes.js');
const authRoutes = require('./middlewares/auth.js');
const isAdmin = require('./middlewares/admin.js'); // استيراد Middleware للتحقق من دور المسؤول
const printerRoutes = require('./routes/printerRoutes.js'); // استيراد مسارات خدمات الطباعة

dotenv.config(); // تحميل المتغيرات البيئية
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعداد الجلسات
app.use(session({
    secret: 'your_secret_key', // استبدل المفتاح السري بمفتاح قوي
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // إذا كنت تستخدم HTTPS، غيّرها إلى true
}));

// استخدام ملفات ثابتة
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/documents', express.static(path.join(__dirname, 'documents')));

// مسارات المصادقة
app.use("/auth", authRoutes);

// مسارات المنتجات للمستخدمين
app.use('/products', productRoutes);

// مسارات المنتجات للإدمن
app.use('/admin/products', adminProductRoutes);

// مسار تقديم صفحة المنتجات
app.get('/show-products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/products/products.html'));
});

// مسار تقديم صفحة الإدارة مع التحقق من دور المسؤول
app.get('/admin', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
});

// مسارات خدمات الطباعة
app.use('/printers', printerRoutes);

// معالجة المسارات غير المعرفة
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// اتصال بـ MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Bookstore')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// تشغيل الخادم
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
