const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");


/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *          - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
 * /login:
 *   post:
 *     tags:
 *         - Users
 *     summary: Login a user and get JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *               - password
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 description: Username or email
 *               password:
 *                 type: string
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
