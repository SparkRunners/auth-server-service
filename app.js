require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
// Require databse constant
const { connectDB } = require('./db/database');

// Require util constants
const setupSwagger = require("./utils/swagger");

// Redefine predefined routes
const authRoutes = require('./routes/authRoutes');


connectDB().catch(err => console.error("DB connect error", err));
setupSwagger(app, PORT);



// Define routes centraly
app.use('/auth', authRoutes);

// GET / - fetch astring as a swager docs example
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *         - GEt basic data string
 *     summary: Get basic string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get('/', (req, res) => {
    res.send('Hello from the auth-server-service express app!\n Try /api-docs/v1 to retrive all docs.')
})
app.get('/docker', (req, res) => {
    res.send('docker route with noemon volume updated!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
