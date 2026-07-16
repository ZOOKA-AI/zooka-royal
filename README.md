# 🚀 Zooka Royal

> A modern, high-performance React + TypeScript application powered by Gemini AI

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue)
![React](https://img.shields.io/badge/React-19.2+-61DAFB?logo=react)

## Overview

Zooka Royal is a cutting-edge AI-powered frontend application built with React, TypeScript, and Vite. It leverages Google's Gemini API for intelligent features and uses Heroicons for a polished UI.

## ✨ Features

- ⚡ **Lightning Fast** - Built with Vite for instant development and optimized builds
- 🤖 **AI-Powered** - Integrated with Google Gemini API
- 🎨 **Beautiful UI** - Heroicons for consistent, professional design
- 📦 **Modern Stack** - React 19 + TypeScript + Vite
- 🔧 **Type Safe** - Full TypeScript support
- 🎯 **Production Ready** - Security best practices included

## 🛠️ Prerequisites

- Node.js 18 or higher
- npm or yarn

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ZOOKA-AI/zooka-royal.git
cd zooka-royal

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open browser and navigate to http://localhost:5173
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from [Google AI Studio](https://ai.studio)

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
zooka-royal/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📚 Technology Stack

| Tool | Version | Purpose |
|------|---------|----------|
| React | ^19.2.3 | UI Framework |
| TypeScript | ^5.5.4 | Type Safety |
| Vite | ^7.3.1 | Build Tool |
| @google/genai | ^1.38.0 | Gemini API |
| @heroicons/react | ^2.2.0 | Icons |

## 🔐 Security

- Never commit `.env.local` or `.env.production`
- Keep dependencies updated
- Use environment variables for sensitive data
- Review [SECURITY.md](./SECURITY.md) for security policy

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 📧 Support

For security issues, please email: **security@zooka-ai.com**

For questions and issues, use [GitHub Issues](https://github.com/ZOOKA-AI/zooka-royal/issues)

## 🔗 Resources

- [Gemini API Documentation](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

---

Made with ❤️ by [ZOOKA-AI](https://github.com/ZOOKA-AI)