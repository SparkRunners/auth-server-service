const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // temp fallback
const MOBILE_CALLBACK = "sparkapp://app/oauth-callback";
const MOBILE_LOGIN = "sparkapp://app/login";



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
router.get('/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        const isMobile = req.query.client === 'mobile';

        const successRedirect = isMobile
            ? MOBILE_CALLBACK
            : `${FRONTEND_URL}/oauth-callback`;

        const errorRedirect = isMobile
            ? MOBILE_LOGIN
            : `${FRONTEND_URL}/login`;

        if (err || !user) {
            return res.redirect(`${errorRedirect}?error=oauth`);
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.redirect(
            `${successRedirect}?token=${encodeURIComponent(token)}`
        );
    })(req, res, next);
});



module.exports = router;