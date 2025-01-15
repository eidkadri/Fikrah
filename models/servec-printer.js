const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    colorMode: String,
    size: String,
    face: String,
    slides: String,
    paperType: String,
    copies: Number,
    rangeOption: String,
    rangeFrom: Number,
    rangeTo: Number,
    services: [String],
    price: Number, // سعر الطباعة لكل ملف
    pageCount: Number // عدد صفحات الملف
});

const servicePrinterSchema = new mongoose.Schema({
    files: [fileSchema], // بيانات الملفات وخصائص الطباعة
    notes: String,
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

const ServicePrinter = mongoose.model('ServicePrinter', servicePrinterSchema);
module.exports = ServicePrinter;
