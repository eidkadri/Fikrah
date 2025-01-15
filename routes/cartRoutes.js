const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.js');

// جلب محتويات عربة التسوق
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
});

// إتمام عملية الشراء
router.post('/checkout', async (req, res) => {
  const { userId, compound, gate, address, paymentProof } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // هنا يمكنك إضافة منطق التحميل للصورة وحفظ الطلب
    cart.compound = compound;
    cart.gate = gate;
    cart.address = address;
    cart.paymentProof = paymentProof;
    cart.status = 'قيد التنفيذ';

    await cart.save();
    res.status(200).json({ message: 'Order placed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to checkout.', error });
  }
});

module.exports = router;
