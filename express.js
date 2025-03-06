const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = 'your-secret-key'; // Use the same secret key used to sign the token

app.use(express.json());

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded token to request object
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

app.post('/cart', verifyToken, (req, res) => {
    // Token is verified and user info is available in req.user
    const { productName, price } = req.body;
    // Proceed with adding to cart
    res.json({ message: 'Product added to cart' });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});