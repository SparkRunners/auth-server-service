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
const cors = require("./middleware/corsConfig")
const fileLogger = require("./middleware/fileLogger");


// connectDB().catch(err => console.error("DB connect error", err));

// Only connect automatically if not testing
if (process.env.NODE_ENV !== "test") {
  connectDB().catch(err => console.error("DB connect error", err));
}


setupSwagger(app);


app.use(cors)
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); 
// use file logger to log api req/res
app.use(fileLogger);


// Define routes centerally
app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/auth/github', gitRoutes);
app.use('/auth/google', googleRoutes);

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
    res.send('Hello from the auth-server-service express app!\n Try /api-docs/v3 to retrive all docs.')
})

// show coverage status/code health in production at /coverage route
if (process.env.NODE_ENV !== "production") {
  app.use("/coverage", express.static("coverage/lcov-report"));
}

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
