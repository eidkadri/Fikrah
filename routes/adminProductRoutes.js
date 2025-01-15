const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const Cart = require('../models/cart.js'); // استيراد نموذج عربة التسوق
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// التأكد من أن دليل الرفع موجود
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// إعداد multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// جلب جميع المنتجات
router.get('/', async (req, res) => { 
  try {
    const products = await Product.find();
    res.json(products); // تأكد من إرسال الرد كـ JSON 
  } catch (error) { 
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

// إضافة منتج جديد
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body; // إضافة الحقل price
    const image = req.file ? `/uploads/${req.file.filename}` : null; // تحديد مسار الصورة

    if (!name || !price || !image) { // التحقق من وجود جميع الحقول
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({ name, price, image });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Error saving product', error });
  }
});

// حذف منتج
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تعديل منتج
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
      const { name, price } = req.body; // إضافة الحقل price
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  
      // التحقق من وجود الحقول المطلوبة
      if (!name || !price) {
        return res.status(400).json({ message: 'الاسم والسعر مطلوبان' });
      }
  
      // تحديث المنتج في قاعدة البيانات
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, image }, // تحديث الاسم والسعر والصورة
        { new: true }
      );
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// إضافة منتج إلى عربة التسوق
router.post('/add-to-cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.totalAmount += quantity * product.price;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error });
  }
});

module.exports = router;
