# Local Database Setup Guide

This guide helps you set up a local database server for the chatbot application.

## Option 1: PostgreSQL (Recommended)

### Installation

#### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Windows
1. Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE chatbot;

# Create user (optional, or use default postgres user)
CREATE USER chatbot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chatbot TO chatbot_user;

# Exit
\q
```

### Update .env File

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatbot?schema=public"
```

Or if you created a custom user:
```env
DATABASE_URL="postgresql://chatbot_user:your_password@localhost:5432/chatbot?schema=public"
```

### Run Prisma Setup

```bash
npm run db:generate
npm run db:push
```

---

## Option 2: MySQL

### Installation

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Windows
1. Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Run the installer
3. Set a root password

#### Linux
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE chatbot;
USE chatbot;

# Create user (optional)
CREATE USER 'chatbot_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON chatbot.* TO 'chatbot_user'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### Update Prisma Schema

Change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Update .env File

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/chatbot"
```

---

## Option 3: Microsoft SQL Server

### Installation

#### macOS/Linux
Use Docker:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

#### Windows
1. Download [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Install with default settings
3. Remember the SA password

### Create Database

```bash
# Connect using sqlcmd (Windows) or Docker exec
sqlcmd -S localhost -U sa -P YourStrong@Password123

# Create database
CREATE DATABASE chatbot;
GO
USE chatbot;
GO
EXIT
```

### Update Prisma Schema

Change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

### Update .env File

```env
DATABASE_URL="sqlserver://localhost:1433;database=chatbot;user=sa;password=YourStrong@Password123;encrypt=true"
```

---

## Quick Start (PostgreSQL)

1. **Install PostgreSQL** (see above)

2. **Create database**:
   ```bash
   createdb chatbot
   ```

3. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatbot?schema=public"
   ```

4. **Run setup**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start app**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### PostgreSQL Connection Error
- Make sure PostgreSQL is running: `brew services list` (macOS) or check services
- Verify credentials in `.env`
- Check if port 5432 is correct
- Try: `psql -U postgres -d chatbot` to test connection

### Permission Denied
- Make sure the database user has proper permissions
- Try using the `postgres` superuser for development

### Port Already in Use
- Check if another PostgreSQL instance is running
- Change port in connection string if needed

## Default Connection Strings

- **PostgreSQL**: `postgresql://postgres:password@localhost:5432/chatbot?schema=public`
- **MySQL**: `mysql://root:password@localhost:3306/chatbot`
- **SQL Server**: `sqlserver://localhost:1433;database=chatbot;user=sa;password=password;encrypt=true`

