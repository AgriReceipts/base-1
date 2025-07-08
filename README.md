# 🌾 Agri Receipts Backend

A backend service for managing agricultural commodity receipts across different committees and checkposts.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- PostgreSQL database (local, hosted, or AWS RDS)
- Git

---

## 🚀 Installation Steps

### 1. **Clone the repository**

```bash
git clone <your-repo-url>
cd server
```

---

### 2. **Install dependencies**

```bash
npm install
```

---

### 3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the following with your actual database credentials:

```env
DATABASE_URL="postgresql://<username>:<password>@<host>:5432/<database>?schema=public"
```

---

### 4. **Set up the database**

Generate Prisma client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

(Optional,Not needed db is already seeded with data) Seed initial data if you have a seed script:

```bash
npm run db:seed
```

---

### 5. **Start the development server**

```bash
npm run dev
```

---

## 🔐 Default Login Credentials

This project seeds predefined users for development/demo purposes.

### 🔑 Password

All users share the same default password:

```
password123
```

---

### 👤 Usernames

#### 📌 Committee Users (DEO, Supervisor, Secretary)

Username format:

```
<role>_<committeename>
```

- The role is one of: `deo`, `supervisor`, `secretary`
- The committee name is **lowercased** with **spaces removed**

##### ✅ Examples

For `"Kakinada Rural"`:
- `deo_kakinadarural`
- `supervisor_kakinadarural`
- `secretary_kakinadarural`

For `"Pithapuram"`:
- `deo_pithapuram`
- `supervisor_pithapuram`
- `secretary_pithapuram`

---

#### 🧑‍💼 Assistant Director (AD) Users

These users are **not tied to a committee**. Predefined usernames:

- `ad_user1`
- `ad_user2`
- `ad_user3`

---

### 🗂️ Available Committees

You can use any of the following committee names when generating usernames:

- Karapa  
- Kakinada Rural  
- Pithapuram  
- Tuni  
- Prathipadu  
- Jaggampeta  
- Peddapuram  
- Samalkota  
- Kakinada

---

> ℹ️ This backend is designed to be paired with the Agri Receipts frontend. Make sure both services are running and connected to the same database.

