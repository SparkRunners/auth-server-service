require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const { connectDB } = require('./db/database');
const authRoutes = require('./routes/authRoutes');

connectDB().catch(err => console.error("DB connect error", err));

app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Hello from the auth-server-service express app!')
})
app.get('/docker', (req, res) => {
    res.send('docker route with noemon volume updated!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})