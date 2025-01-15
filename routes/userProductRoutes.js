const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');

// جلب جميع المنتجات للمستخدمين
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

module.exports = router;
