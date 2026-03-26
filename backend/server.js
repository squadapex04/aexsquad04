require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for OTPs (In production, use Redis or a database)
const activeOtps = new Map();

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a secure 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory valid for 10 minutes
    activeOtps.set(email, { code: otpCode, expires: Date.now() + 10 * 60 * 1000 });

    try {
        const mailOptions = {
            from: process.env.GMAIL_ADDRESS,
            to: email,
            subject: 'Ecologix Action Required: Your Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 40px; text-align: center;">
                    <div style="background-color: white; border-radius: 12px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #16a34a; margin-bottom: 20px;">Ecologix Authentication</h2>
                        <p style="color: #4b5563; font-size: 16px;">Here is your secure verification code:</p>
                        <h1 style="color: #1f2937; letter-spacing: 5px; font-size: 36px; background: #f3f4f6; padding: 15px; border-radius: 8px;">${otpCode}</h1>
                        <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent securely to ${email}`);
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send OTP via email. Check your SMTP credentials.' });
    }
});

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedData = activeOtps.get(email);
    
    if (!storedData) {
        return res.status(400).json({ error: 'No OTP requested for this email' });
    }
    
    if (Date.now() > storedData.expires) {
        activeOtps.delete(email);
        return res.status(400).json({ error: 'OTP has expired' });
    }

    if (storedData.code === otp) {
        activeOtps.delete(email); // Clear once verified securely
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Ecologix Secure Backend running on port ${PORT}`);
});
