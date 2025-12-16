# Demo Credentials

**IMPORTANT**: This file is for submission purposes only. These credentials are NOT hardcoded in the codebase.

## Demo User Credentials

For accessing the deployed application:

- **Email**: `demo@example.com`
- **Password**: `demo123`

## How to Set Up Demo User

### Option 1: Through the Application
1. Visit the deployed application
2. Click "Sign Up"
3. Use the email and password above
4. Complete registration

### Option 2: Using the Script (Local Development)
```bash
export DEMO_EMAIL="demo@example.com"
export DEMO_PASSWORD="demo123"
npx tsx scripts/create-demo-user.ts
```

### Option 3: Manual Database Insert
If you have database access, you can create the user manually using Prisma Studio or SQL.

## Notes

- These credentials should be created in the production database
- They are not hardcoded anywhere in the source code
- For security, consider changing the password after review
- The demo user can be deleted after evaluation if needed

