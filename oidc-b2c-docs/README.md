# iNextLabs — Azure AD B2C OIDC Documentation

A responsive three-column documentation website built with **React + Vite**. The content covers configuring an external OpenID Connect (OIDC) provider in an existing Azure AD B2C tenant through both built-in user flows and IEF custom policies.

## Features

- Three-column documentation layout: searchable navigation, article content, and “On this page” links.
- iNextLabs-inspired light theme with dark left navigation.
- Separate navigation groups for Overview, User Flow, Custom Flow, and Reference.
- Searchable pages and keyboard shortcut `Ctrl+K` / `Cmd+K`.
- Step-by-step instructions, configuration tables, code blocks with copy buttons, warning callouts, and a session-only setup checklist.
- Previous/Next page navigation and responsive mobile navigation.
- Relative Vite base path configured for static hosting.

## Requirements

- Node.js 20.19+ or 22.12+ recommended for current Vite releases.
- npm.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. In the repository, open **Settings → Pages**.
3. Choose **GitHub Actions** as the build/deployment source, or configure a workflow that runs `npm ci`, `npm run build`, and publishes `dist/`.
4. If deploying from a project repository, keep `base: './'` in `vite.config.js` so generated assets use relative paths.
5. If using a custom workflow, ensure the workflow installs dependencies and uploads the `dist/` directory as the Pages artifact.

For a simple workflow, create `.github/workflows/deploy.yml` with a Node setup step, `npm ci`, `npm run build`, and the official GitHub Pages artifact/deployment actions. Follow GitHub's current Pages documentation for repository permissions and workflow configuration.

## Project structure

```text
oidc-b2c-docs/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── DocContent.jsx
│   │   ├── RightToc.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── data/
│   │   └── docs.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Content and configuration notes

- This is an internal guide template for **existing Azure AD B2C tenants**. Azure AD B2C and Microsoft Entra External ID for external tenants are different experiences; do not mix their instructions.
- XML examples are illustrative templates, not universal drop-in policies. Validate technical-profile metadata, claim definitions, policy inheritance, secret key references, redirect URI behavior, and user-journey orchestration against your actual tenant, provider, and Microsoft documentation before uploading.
- Never commit real client secrets or tokens to the repository.
- The “Client Docs” tab is a preview switch that displays a reminder to sanitize internal content before sharing; it does not automatically redact the content.
- The setup checklist is held in React state only and is not persisted to a server.

## Official Microsoft references

- [Generic OIDC provider for Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/identity-provider-generic-openid-connect)
- [OpenID Connect technical profile](https://learn.microsoft.com/en-us/azure/active-directory-b2c/openid-connect-technical-profile)
- [Get started with custom policies](https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-get-started)
- [Policy keys overview](https://learn.microsoft.com/en-us/azure/active-directory-b2c/policy-keys-overview)
- [Claims providers](https://learn.microsoft.com/en-us/azure/active-directory-b2c/claimsproviders)

## Included deployment workflow

The repository includes `.github/workflows/deploy.yml`. Push the project to a repository's `main` branch, then enable **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow builds the site and deploys `dist/` to GitHub Pages. Confirm repository Actions permissions and Pages settings if deployment is blocked.
