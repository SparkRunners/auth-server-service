const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // temp fallback



/**
 * @swagger
 * /auth/github:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Initiate Github OAuth login
 *     description: Redirects the user to Github to authenticate and authorize the app.
 *     NOTE: This route cannot be executed from Swagger UI due to cross-origin redirect.
 *     responses:
 *       302:
 *         description: Redirect to Github OAuth consent screen
 */
router.get(
  '/',
  passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Github OAuth callback
 *     description: Handles github OAuth callback, issues JWT and redirects to frontend with token.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned by github
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
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=oauth`
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth`);
    }

    const payload = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      roles: req.user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.redirect(
      `${FRONTEND_URL}/oauth-callback?token=${token}`
    );
  }
);


module.exports = router;