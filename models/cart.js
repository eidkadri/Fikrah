const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    compound: String, // إضافة الحقل
    gate: String, // إضافة الحقل
    status: { type: String, enum: ["قيد التنفيذ", "مكتمل", "ملغى"], default: "قيد التنفيذ" }, // إضافة الحقل
    totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Cart', cartSchema);
