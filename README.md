# Autorythm Landing Page

A modern, responsive landing page for Autorythm - an AI-powered automation services company.

## Features

- 🎨 Modern, clean design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast loading and optimized performance
- 🎯 Clear call-to-actions and user-friendly navigation
- ✨ Interactive elements and smooth scrolling
- 🎭 Beautiful gradient effects and hover animations

## Sections

1. **Hero Section** - Eye-catching introduction with key statistics
2. **Services** - Web development, app development, software solutions, and AI automation
3. **Benefits** - Why choose Autorythm (save money, time, increase efficiency, etc.)
4. **About** - Company information and values
5. **Contact** - Contact form and information
6. **Footer** - Links and company information

## Getting Started

Simply open `index.html` in your web browser to view the landing page.

### Files Structure

```
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

- Update contact information in the contact section
- Modify colors in the `:root` CSS variables in `styles.css`
- Adjust content and messaging to match your brand
- Add your logo image if needed
- Connect the contact form to your backend/email service

## Backend API (Vercel)

The contact form now targets a serverless function at `/api/contact`, so the entire project can live in a single Vercel deployment.

1. Duplicate `.env.example` to `.env` locally (or add the same values in the Vercel dashboard). You only need SMTP-related variables now.
2. Install dependencies with `npm install`.
3. For local testing, install the [Vercel CLI](https://vercel.com/docs/cli) and run `vercel dev` to spin up both the static site and the `/api/contact` function.
4. Deploy with `vercel --prod` (or connect the repo in the dashboard). The live form will POST to `https://your-domain.vercel.app/api/contact`.

Submissions are emailed via the SMTP settings you provide. If you need persistent storage, plug the function into an external database or service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Autorythm. All rights reserved.



