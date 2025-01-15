const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth'); // استيراد ميدل وير التحقق من الجلسة

// Middleware للتحقق من دور المستخدم كمسؤول
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}

// صفحة الإدارة الرئيسية
router.get('/', isAuthenticated, isAdmin, (req, res) => {
    res.json({ message: "Welcome to the admin panel!" });
});

module.exports = router;
