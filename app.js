require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const passport = require('passport');
// Require seaprete passports for google and github
require('./oauth/google')(passport);
require('./oauth/github')(passport);
const cookieParser = require('cookie-parser');
// Require database constant
const { connectDB } = require('./db/database');
// Require util constants
const setupSwagger = require("./utils/swagger");
// Redefine predefined routes
const authRoutes = require('./routes/authRoutes');
const gitRoutes = require('./routes/gitRoutes');
const googleRoutes = require('./routes/googleRoutes');
const userRoutes = require('./routes/userRoutes');
const oauthTestRoutes = require('./routes/oauthTestRoutes');
const cors = require("./middleware/corsConfig")


connectDB().catch(err => console.error("DB connect error", err));
setupSwagger(app);


app.use(cors)
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); 


// Define routes centerally
app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/auth/github', gitRoutes);
app.use('/auth/google', googleRoutes);
app.use('/oauth', oauthTestRoutes);

// GET / - fetch astring as a swager docs example
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *         - Get basic data string
 *     summary: Get basic string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success with message
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get('/', (req, res) => {
    res.send('Hello from the auth-server-service express app!\n Try /api-docs/v1 to retrive all docs.')
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
