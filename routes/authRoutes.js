const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // temp fallback

const { registerUser, loginUser } = require("../controllers/authController");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - REST-Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username       # Required
 *               - email          # Required
 *               - password       # Required
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *                 description: Required. Unique username for the user.
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *                 description: Required. User email, must be unique.
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *                 description: Required. User password.
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [user, admin]
 *                 example: ["user"]
 *                 description: Optional. Default role is ["user"] if not provided.
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error (user exists or missing fields)
 *       500:
 *         description: Server error
 */

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - REST-Auth
 *     summary: Login a user with email and get JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: Registered user email
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Initiate Google OAuth login
 *     description: Redirects the user to Google to authenticate and authorize the app.
 *     NOTE: This route cannot be executed from Swagger UI due to cross-origin redirect.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth callback, issues JWT and redirects to frontend with token.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned by Google
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT token
 *       400:
 *         description: Missing or invalid authorization code
 *       401:
 *         description: OAuth authentication failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth`);
    }

    // Create JWT
    const payload = { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role  };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}`);
  }
);

module.exports = router;
