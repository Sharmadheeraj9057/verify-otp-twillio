require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const twilio = require('twilio');

const app = express();
const PORT = 3000;

// Twilio Client Setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (CSS, images, etc.)
app.set('views', path.join(__dirname, 'views'));  // Views folder where HTML files are
app.set('view engine', 'html');  // View engine setup
app.engine('html', require('ejs').renderFile);  // Using ejs to render HTML

// Session Configuration
app.use(session({
    secret: 'insta login',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    res.render('login.html');  // Render login page
});

app.post('/send-otp', (req, res) => {
    const { phone } = req.body;  // Get phone number from the form
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // Generate random OTP

    // Save OTP and phone number to session, also set OTP expiration time
    req.session.otp = otp;
    req.session.phone = phone;
    req.session.otpExpires = Date.now() + 60000;  // OTP valid for 1 minute

    // Send OTP to phone using Twilio
    client.messages.create({
        body: `Your OTP for insta login is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,  // Twilio phone number
        to: phone  // User's phone number
    }).then(() => {
        res.render('verify.html', { phone });  // Render OTP verification page
    }).catch(err => {
        res.send('Error sending OTP. Check number and try again.');
    });
});

app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;  // Get OTP entered by user
    const valid = (Date.now() <= req.session.otpExpires);  // Check if OTP is still valid (not expired)

    if (otp === req.session.otp && valid) {
        res.redirect('https://www.instagram.com/');  
    } else {
        res.send('<h2>Invalid or expired OTP. Please try again.</h2>');  // Show error message if OTP is incorrect or expired
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
