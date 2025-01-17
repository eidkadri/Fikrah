const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // استيراد الموديل
const router = express.Router();

// تسجيل مستخدم جديد
// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
    const { password, phone, role } = req.body; // إزالة اسم المستخدم

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ password: hashedPassword, phone, isVerified: true, role }); // تعيين الدور وإضافة الهاتف
        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        res.status(500).json({ error: "Failed to register user.", details: err.message });
    }
});


// تسجيل الدخول
router.post("/login", async (req, res) => {
    const { phone, password } = req.body; // استخدام الهاتف بدلاً من اسم المستخدم

    try {
        const user = await User.findOne({ phone }); // البحث باستخدام الهاتف
        if (!user) return res.status(404).json({ error: "User not found." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials." });

        // حفظ بيانات المستخدم في الجلسة
        req.session.user = { 
            phone: user.phone, 
            id: user._id,
            role: user.role // تحميل الدور في الجلسة
        };

        res.status(200).json({ message: "Login successful.", user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: "Login failed.", details: err.message });
    }
});


// التحقق من حالة تسجيل الدخول
router.get('/status', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isLoggedIn: true, username: req.session.user.username, role: req.session.user.role }); // تضمين الدور في الرد
    } else {
        res.json({ isLoggedIn: false });
    }
});

// تسجيل الخروج
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Failed to logout." });
            }
            res.status(200).json({ message: "Logout successful." });
        });
    }
});

// وظيفة لإنشاء مستخدم Admin
async function createAdminUser() {
    try {
        const hashedPassword = await bcrypt.hash('adminpassword', 10); // تأكد من تعديل كلمة المرور حسب الحاجة
        const adminUser = new User({
            username: "admin",
            password: hashedPassword,
            phone: "1234567890",
            chatId: "adminChatId",
            isVerified: true,
            role: "admin"
        });

        await adminUser.save();
        console.log("Admin user created successfully.");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}



module.exports = router;
