# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please email us at **security@zooka-ai.com** instead of posting it publicly.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

We will acknowledge your report within 48 hours and work on a fix.

## Supported Versions

We actively maintain and patch security vulnerabilities for:
- Current stable release
- Previous stable release

## Security Best Practices

- Keep dependencies updated
- Enable branch protection on main
- Use environment variables for secrets
- Do not commit `.env.local` or `.env.production`
- Review code changes before merging

## Security Scanning

This repository uses:
- GitHub Secret Scanning
- Dependabot alerts
- CodeQL analysis

All critical vulnerabilities are addressed within 48 hours.