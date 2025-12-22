const express = require("express");
const router = express.Router();
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

module.exports = router;
