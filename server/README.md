````md
# Agri Receipts Backend

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Git

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd server
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and update it with your PostgreSQL database credentials.

4. **Set up the database**

   ```bash
   npm run db:generate

   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```
