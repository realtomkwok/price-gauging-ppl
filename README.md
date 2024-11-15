# Price Gauging People

## File Structure

```plaintext
.
├── package.json               # Root package.json for project-wide settings
├── turbo.json                 # Turborepo configuration
├── docker-compose.yml         # Development environment setup
├── .env.example              # Example environment variables
├── .gitignore                # Root gitignore
├── .eslintrc.js              # Root ESLint config
├── tsconfig.json             # Base TypeScript config
├── packages/                  # All project packages
│   ├── database/             # Database package
│   │   ├── package.json      # Database-specific dependencies
│   │   ├── tsconfig.json     # Extends root tsconfig
│   │   ├── src/
│   │   │   ├── index.ts      # Main export
│   │   │   ├── schema/       # Database schema definitions
│   │   │   └── migrations/   # SQL migrations
│   │   └── tests/
│   ├── tracker/              # Tracker service
│   │   ├── package.json      # Tracker-specific dependencies
│   │   ├── tsconfig.json     # Extends root tsconfig
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── scrapers/     # Scraping logic
│   │   │   └── services/     # Business logic
│   │   └── tests/
│   ├── api/                  # API service
│   │   ├── package.json      # API-specific dependencies
│   │   ├── tsconfig.json     # Extends root tsconfig
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── controllers/
│   │   └── tests/
│   └── web/                  # Web frontend
│       ├── package.json      # Web-specific dependencies
│       ├── tsconfig.json     # Extends root tsconfig
│       ├── src/
│       │   ├── App.tsx
│       │   └── components/
│       └── tests/
└── scripts/                  # Project-wide scripts
└── setup-dev.sh          # Development setup script

```