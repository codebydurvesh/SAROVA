# 🍽️ SAVORA

> **Cook · Plan · Eat**

A modern, full-stack recipe management and meal planning web application built with the MERN stack.

![SAVORA](https://img.shields.io/badge/SAVORA-Recipe%20Manager-5c7f5c?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 📖 About

**SAVORA** is a premium recipe management and meal planner application designed with a minimal, calm aesthetic. It helps users discover recipes, plan weekly meals based on dietary preferences, and shop for fresh ingredients—all in one seamless experience.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based auth with access & refresh tokens
- 📝 **Recipe Management** - Create, browse, like, comment, and save recipes
- 📅 **Meal Planner** - Weekly meal planning with 5 diet type options
- 🛒 **Shopping Cart** - Add ingredients with quantity controls and GST calculation
- ❤️ **Favorites** - Save and organize your favorite recipes
- 📱 **Responsive Design** - Beautiful on all devices
- 🎨 **Premium UI** - Minimal design with brown, beige, and muted green tones

---

## 🖼️ Screenshots

### Home Page

> Welcome page with "cook · plan · eat" tagline and subtle grid background

### Recipes

> Browse recipes with filters, search, and detailed views with ingredients & steps

### Meal Planner

> Weekly planner with diet selector (Balanced, Keto, Vegan, Intermittent, Fasting)

### Shopping

> Ingredient cards with images, prices, and add-to-cart functionality

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose      |
| --------------- | ------------ |
| React 18        | UI Framework |
| Vite            | Build Tool   |
| Tailwind CSS    | Styling      |
| React Router v6 | Routing      |
| Axios           | HTTP Client  |
| Framer Motion   | Animations   |
| Lucide React    | Icons        |

### Backend

| Technology    | Purpose          |
| ------------- | ---------------- |
| Node.js       | Runtime          |
| Express.js    | Web Framework    |
| MongoDB Atlas | Database         |
| Mongoose      | ODM              |
| JWT           | Authentication   |
| bcrypt        | Password Hashing |
| Cloudinary    | Image Storage    |
| Multer        | File Uploads     |

---

## 📁 Project Structure

```
SAVORA/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── config/         # Database & Cloudinary config
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth & error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper utilities
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── README.md           # Backend documentation
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Route components
│   │   ├── services/       # API service functions
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── README.md           # Frontend documentation
│
├── .gitignore
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/SAVORA.git
   cd SAVORA
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLIENT_URL=http://localhost:5173
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Application**

   Start backend (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Start frontend (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```

5. **Seed Sample Data**

   ```bash
   # In browser or API client
   POST http://localhost:5000/api/ingredients/seed
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

---

## 📚 API Documentation

See [Backend README](./backend/README.md) for complete API documentation including:

- Authentication endpoints
- Recipe CRUD operations
- Ingredient management
- Request/response examples

---

## 🎨 Design Philosophy

SAVORA follows a **minimal, premium, calm** design approach:

- **Colors**: Brown, beige, and muted green tones
- **Typography**: Playfair Display (headings) + Inter (body)
- **UI Elements**: Soft shadows, rounded corners, subtle animations
- **Layout**: Clean spacing, grid backgrounds, responsive design

---

## 📱 Pages Overview

| Page              | Description                            |
| ----------------- | -------------------------------------- |
| **Home**          | Welcome page with features overview    |
| **Recipes**       | Browse, search, and filter recipes     |
| **Recipe Detail** | Full recipe with ingredients & steps   |
| **Meal Planner**  | Weekly meal planning by diet type      |
| **Shopping**      | Browse and purchase ingredients        |
| **Cart**          | Review items, quantities, and checkout |
| **Favorites**     | Saved recipe collection                |
| **Account**       | User profile and settings              |
| **Login/Signup**  | Authentication pages                   |

---

## 🔒 Authentication Flow

1. User registers/logs in → receives access token + refresh token (cookie)
2. Access token included in API requests via Authorization header
3. Access token expires in 15 minutes
4. Refresh token automatically renews access token
5. Refresh token expires in 7 days

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Durvesh**

---

<p align="center">
  <strong>SAVORA</strong> — Cook · Plan · Eat
</p>
