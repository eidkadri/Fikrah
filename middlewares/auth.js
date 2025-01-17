const express = require('express');
const router = express.Router();

router.get('/endpoint', (req, res) => {
    const message = { greeting: "السلام عليكم" };
    res.json(message);
});
module.exports = router;
