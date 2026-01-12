# SAVORA Backend API

A robust REST API for the SAVORA Recipe Management & Meal Planner application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (Access + Refresh Tokens)
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcrypt

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication handlers
│   │   ├── recipeController.js # Recipe CRUD operations
│   │   └── ingredientController.js # Ingredient operations
│   ├── middlewares/
│   │   ├── authenticate.js    # JWT verification middleware
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Recipe.js          # Recipe schema
│   │   └── Ingredient.js      # Ingredient schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── recipeRoutes.js    # Recipe endpoints
│   │   └── ingredientRoutes.js # Ingredient endpoints
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── asyncHandler.js    # Async wrapper utility
│   │   └── tokenUtils.js      # JWT utilities
│   └── app.js                 # Express app configuration
├── server.js                  # Entry point
├── package.json
├── .env                       # Environment variables (not in git)
└── .gitignore
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SAROVA/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the backend directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

   # JWT Secrets (generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

---

### Health Check

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | Check API status |

**Response:**

```json
{
  "success": true,
  "message": "SAVORA API is running",
  "timestamp": "2026-01-12T00:00:00.000Z"
}
```

---

### Authentication Routes

| Method | Endpoint                    | Description              | Auth Required                |
| ------ | --------------------------- | ------------------------ | ---------------------------- |
| POST   | `/auth/register`            | Register new user        | No                           |
| POST   | `/auth/login`               | Login user               | No                           |
| POST   | `/auth/logout`              | Logout user              | Yes                          |
| GET    | `/auth/me`                  | Get current user profile | Yes                          |
| POST   | `/auth/refresh`             | Refresh access token     | No (requires refresh cookie) |
| POST   | `/auth/favorites/:recipeId` | Toggle favorite recipe   | Yes                          |

#### POST `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "favorites": []
    },
    "accessToken": "jwt_access_token"
  }
}
```

#### POST `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "favorites": []
    },
    "accessToken": "jwt_access_token"
  }
}
```

#### GET `/auth/me`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "favorites": [],
      "createdAt": "2026-01-12T00:00:00.000Z"
    }
  }
}
```

---

### Recipe Routes

| Method | Endpoint               | Description        | Auth Required    |
| ------ | ---------------------- | ------------------ | ---------------- |
| GET    | `/recipes`             | Get all recipes    | No               |
| GET    | `/recipes/:id`         | Get recipe by ID   | No               |
| POST   | `/recipes`             | Create new recipe  | Yes              |
| POST   | `/recipes/:id/like`    | Like/unlike recipe | Yes              |
| POST   | `/recipes/:id/comment` | Add comment        | Yes              |
| DELETE | `/recipes/:id`         | Delete recipe      | Yes (owner only) |

#### GET `/recipes`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (Breakfast, Lunch, Dinner, Snack, Dessert, Beverage) |
| `dietType` | string | Filter by diet (Balanced, Keto, Vegan, Intermittent, Fasting) |
| `search` | string | Search in title and description |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "_id": "recipe_id",
        "title": "Mediterranean Quinoa Bowl",
        "description": "A healthy bowl...",
        "image": {
          "url": "https://cloudinary.com/...",
          "publicId": "savora/image_id"
        },
        "ingredients": [{ "name": "Quinoa", "quantity": "1 cup" }],
        "steps": [{ "stepNumber": 1, "instruction": "Cook quinoa..." }],
        "prepTime": 15,
        "cookTime": 20,
        "servings": 2,
        "difficulty": "Easy",
        "category": "Lunch",
        "dietType": "Balanced",
        "likes": [],
        "comments": [],
        "author": { "_id": "user_id", "name": "John" },
        "createdAt": "2026-01-12T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### POST `/recipes`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Recipe title (required) |
| `description` | string | Recipe description (required) |
| `image` | file | Recipe image (required) |
| `ingredients` | JSON string | Array of ingredients |
| `steps` | JSON string | Array of steps |
| `prepTime` | number | Prep time in minutes |
| `cookTime` | number | Cook time in minutes |
| `servings` | number | Number of servings |
| `difficulty` | string | Easy, Medium, Hard |
| `category` | string | Recipe category |
| `dietType` | string | Diet type |

**Response (201):**

```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "recipe": { ... }
  }
}
```

#### POST `/recipes/:id/like`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Recipe liked",
  "data": {
    "likeCount": 5,
    "isLiked": true
  }
}
```

#### POST `/recipes/:id/comment`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "text": "Great recipe!"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Comment added",
  "data": {
    "comments": [...]
  }
}
```

---

### Ingredient Routes

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| GET    | `/ingredients`      | Get all ingredients  | No            |
| GET    | `/ingredients/:id`  | Get ingredient by ID | No            |
| POST   | `/ingredients`      | Create ingredient    | Yes           |
| POST   | `/ingredients/seed` | Seed sample data     | No            |

#### GET `/ingredients`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (Vegetables, Fruits, Dairy, Meat, Seafood, Grains, Spices, Other) |
| `search` | string | Search by name |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "ingredients": [
      {
        "_id": "ingredient_id",
        "name": "Tomatoes",
        "image": {
          "url": "https://images.unsplash.com/..."
        },
        "category": "Vegetables",
        "unit": "kg",
        "pricePerUnit": 40,
        "stock": 100,
        "description": "Fresh red tomatoes"
      }
    ]
  }
}
```

#### POST `/ingredients/seed`

Seeds the database with 12 sample ingredients.

**Response (201):**

```json
{
  "success": true,
  "message": "12 sample ingredients created",
  "data": {
    "ingredients": [...]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "..." // Only in development mode
}
```

### Common HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## Authentication Flow

1. **Register/Login**: Client receives `accessToken` in response body and `refreshToken` in HTTP-only cookie
2. **Access Protected Routes**: Include `Authorization: Bearer <accessToken>` header
3. **Token Refresh**: When access token expires (15 min), call `/auth/refresh` to get new access token
4. **Logout**: Call `/auth/logout` to invalidate refresh token

---

## Data Models

### User Schema

```javascript
{
  name: String,          // Required, 2-50 chars
  email: String,         // Required, unique
  password: String,      // Required, min 6 chars, hashed
  favorites: [ObjectId], // References to Recipe
  refreshToken: String,  // For token refresh
  timestamps: true
}
```

### Recipe Schema

```javascript
{
  title: String,         // Required, max 100 chars
  description: String,   // Required, max 500 chars
  image: {
    url: String,
    publicId: String
  },
  ingredients: [{
    name: String,
    quantity: String
  }],
  steps: [{
    stepNumber: Number,
    instruction: String
  }],
  prepTime: Number,      // Minutes
  cookTime: Number,      // Minutes
  servings: Number,
  difficulty: String,    // Easy, Medium, Hard
  category: String,      // Breakfast, Lunch, etc.
  dietType: String,      // Balanced, Keto, Vegan, etc.
  likes: [ObjectId],     // User references
  comments: [{
    user: ObjectId,
    text: String,
    timestamps: true
  }],
  author: ObjectId,      // User reference
  timestamps: true
}
```

### Ingredient Schema

```javascript
{
  name: String,          // Required, unique
  image: {
    url: String,
    publicId: String
  },
  category: String,      // Vegetables, Fruits, etc.
  unit: String,          // kg, liter, piece, etc.
  pricePerUnit: Number,  // Required
  stock: Number,
  description: String,
  timestamps: true
}
```

---

## Scripts

```bash
npm start     # Start production server
npm run dev   # Start development server with nodemon
```

---

## License

MIT
