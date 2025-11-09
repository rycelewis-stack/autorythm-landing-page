const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function readSubmissions() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(DATA_FILE, '[]', 'utf-8');
            return [];
        }
        throw error;
    }
}

async function saveSubmission(submission) {
    const submissions = await readSubmissions();
    submissions.push(submission);
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
    const { name, email, company, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const submission = {
        id: Date.now().toString(),
        name,
        email,
        company: company || '',
        message,
        receivedAt: new Date().toISOString()
    };

    try {
        await saveSubmission(submission);

        const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
        if (!notifyEmail) {
            throw new Error('Notification email is not configured.');
        }

        await transporter.sendMail({
            from: `"Autorythm Website" <${process.env.SMTP_USER}>`,
            to: notifyEmail,
            subject: `New contact form submission from ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Company: ${company || 'N/A'}`,
                '',
                'Message:',
                message
            ].join('\n'),
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        res.json({ success: true, message: 'Submission received.' });
    } catch (error) {
        console.error('Contact submission failed:', error);
        res.status(500).json({
            error: 'Unable to process your request right now. Please try again later.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
