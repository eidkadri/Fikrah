const express = require('express');
const app = express();
const port = 3000;

app.get('/endpoint', (req, res) => {
    const message = { greeting: "السلام عليكم" };
    res.json(message);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
