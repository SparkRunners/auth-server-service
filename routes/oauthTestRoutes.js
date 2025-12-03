// Test Google OAuth login
const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get('/test/google', (req, res) => {
    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_TEST_CALLBACK_URL)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('profile email')}` +
        `&access_type=offline`;

    res.redirect(redirectUri);
});

// Callback route for test
router.get('/test/google/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('No code returned from Google');

    try {
        // Exchange code for tokens
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', process.env.GOOGLE_CLIENT_ID);
        params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        params.append('redirect_uri', process.env.GOOGLE_TEST_CALLBACK_URL);
        params.append('grant_type', 'authorization_code');

        const tokenResponse = await axios.post(
            'https://oauth2.googleapis.com/token',
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenResponse.data.access_token;

        // Fetch user profile
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Display profile info in browser
        res.send(`
      <h2>Google Profile Info</h2>
      <pre>${JSON.stringify(profileResponse.data, null, 2)}</pre>
    `);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching Google profile');
    }
});


module.exports = router;
