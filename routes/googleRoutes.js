const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // temp fallback



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
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

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
    '/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
    (req, res) => {
        if (!req.user) {
            return res.redirect(`${FRONTEND_URL}/login?error=oauth`);
        }

        // Create JWT
        const payload = { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}`);
    }
);


module.exports = router;