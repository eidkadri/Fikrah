const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    tamimahVerificationCode: { type: String }, // إضافة رمز التحقق من شركة تميمة
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] }, // إضافة حقل الدور
});

module.exports = mongoose.model("User", userSchema);
