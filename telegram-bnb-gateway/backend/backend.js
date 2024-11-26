const express = require('express');
const app = express();
const dotenv = require('dotenv');
const crypto = require('crypto');
const { getBalance } = require('./bnbService');
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('BNBLink Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/auth/telegram', (req, res) => {
    const { hash, ...data } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN; // Renamed to botToken
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    const checkString = Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    if (hmac !== hash) {
        return res.status(403).send('Authentication failed');
    }

    // Generate JWT token after successful verification
    const jwt = require('jsonwebtoken');
    const jwtToken = jwt.sign({ id: data.id, username: data.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    }); // Renamed to jwtToken

    res.json({ token: jwtToken }); // Return the JWT token
});

app.get('/balance/:address', async (req, res) => {
    const address = req.params.address;
    try {
        const balance = await getBalance(address);
        res.json({ balance });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
