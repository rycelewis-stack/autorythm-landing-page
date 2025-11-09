const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const payload = typeof req.body === 'string' ? safeParse(req.body) : req.body;
    const { name, email, company = '', message } = payload || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const smtpUser = process.env.SMTP_USER;
    const notifyEmail = process.env.NOTIFY_EMAIL || smtpUser;

    if (!smtpUser || !process.env.SMTP_PASS || !process.env.SMTP_HOST || !notifyEmail) {
        return res.status(500).json({ error: 'Email service is not configured.' });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: smtpUser,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"Autorythm Website" <${smtpUser}>`,
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
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Submission received.' });
    } catch (error) {
        console.error('Failed to send contact email:', error);
        return res.status(500).json({ error: 'Unable to send your message right now.' });
    }
};

function safeParse(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
}

function escapeHtml(str = '') {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
