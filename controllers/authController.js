const User = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_auth_key';
const JWT_EXPIRES_IN = '1d';

async function registerUser({ username, email, password }) {
    if (!username || !email || !password) throw new Error('Username, email and password are required');
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) throw new Error('Username or email already exists');
    const user = await User.create({ username, email, password });
    return { id: user._id, username: user.username, email: user.email };
}

async function loginUser({ usernameOrEmail, password }) {
    if (!usernameOrEmail || !password) throw new Error('Username/email and password required');
    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) throw new Error('User not found');
    const match = await user.comparePassword(password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token };
}

module.exports = { registerUser, loginUser };
