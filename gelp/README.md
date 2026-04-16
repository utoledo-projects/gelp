# Gelp

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js (version 24 or later)
- NPM (version 11 or later)
- MongoDB (version 8 or later)

### Installing Dependencies

First, install the dependencies:

```bash
npm install
```

### Configuring Environment

There are a few environment variables that need to be configured for the application to run properly with all features.

Create a `.env` file in the root of the project and add the following variables with your own values:

```dotenv
# MongoDB connection string
# Example: mongodb://localhost:27017/gelp
MOGNO_URI=your_mongodb_connection_string

# Your IGDB client ID and secret for authentication with IGDB
IGDB_CLIENT_ID=your_igdb_client_id
IGDB_CLIENT_SECRET=your_igdb_client_secret

# Email domain restrictions (optional, prevents users from signing up with email addresses outside of the specified domain)
# Example: example.com
EMAIL_DOMAIN_RESTRICT_DOMAIN=your_email_domain
# Example: true (allows subdomain.example.com to register if example.com is specified as the domain)
EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN=true
```

### Run Application

To run the development server:

```bash
npm run dev
```

To run the production server:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
