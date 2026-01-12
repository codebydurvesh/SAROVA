# SAVORA Frontend

A modern, responsive React application for the SAVORA Recipe Management & Meal Planner.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Global navigation bar
│   │   ├── ProtectedRoute.jsx # Auth guard component
│   │   └── LoadingSpinner.jsx # Loading indicator
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication state management
│   │   └── CartContext.jsx    # Shopping cart state management
│   ├── hooks/
│   │   ├── useDebounce.js     # Debounce custom hook
│   │   └── useLocalStorage.js # LocalStorage persistence hook
│   ├── layouts/
│   │   ├── MainLayout.jsx     # Layout with navbar
│   │   └── AuthLayout.jsx     # Layout for auth pages
│   ├── pages/
│   │   ├── Home.jsx           # Landing/welcome page
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Recipes.jsx        # Recipe listing page
│   │   ├── RecipeDetail.jsx   # Single recipe view
│   │   ├── MealPlanner.jsx    # Meal planning page
│   │   ├── Shopping.jsx       # Ingredient shopping page
│   │   ├── Cart.jsx           # Shopping cart page
│   │   ├── Favorites.jsx      # Saved recipes page
│   │   └── Account.jsx        # User account page
│   ├── services/
│   │   ├── api.js             # Axios instance configuration
│   │   ├── authService.js     # Auth API calls
│   │   ├── recipeService.js   # Recipe API calls
│   │   └── ingredientService.js # Ingredient API calls
│   ├── utils/
│   │   └── helpers.js         # Utility functions
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + Tailwind
├── index.html
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js
├── vite.config.js             # Vite configuration
├── package.json
├── .env                       # Environment variables
└── .gitignore
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SAROVA/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Pages & Routes

| Route           | Component    | Description          | Auth Required |
| --------------- | ------------ | -------------------- | ------------- |
| `/`             | Home         | Welcome/landing page | No            |
| `/login`        | Login        | User login           | No            |
| `/signup`       | Signup       | User registration    | No            |
| `/recipes`      | Recipes      | Browse all recipes   | No            |
| `/recipes/:id`  | RecipeDetail | View single recipe   | No            |
| `/meal-planner` | MealPlanner  | Weekly meal planner  | No            |
| `/shopping`     | Shopping     | Browse ingredients   | No            |
| `/cart`         | Cart         | Shopping cart        | No            |
| `/favorites`    | Favorites    | Saved recipes        | Yes           |
| `/account`      | Account      | User profile         | Yes           |

## Features

### 🏠 Home Page

- Welcome message with "cook · plan · eat" tagline
- Subtle grid background pattern
- Feature highlights
- Call-to-action buttons

### 🍳 Recipes

- Browse all recipes with filters
- Search by title/description
- Filter by category and diet type
- Recipe cards with image, title, description
- Like/comment/share actions
- Full recipe detail view with:
  - Ingredients list
  - Step-by-step instructions
  - Comments section

### 📅 Meal Planner

- Weekly meal planning view
- Diet type selector:
  - Balanced
  - Keto
  - Vegan
  - Intermittent Fasting
  - Fasting
- Pre-populated meal suggestions

### 🛒 Shopping

- Browse ingredients with images
- Category filtering
- Quantity selector
- Add to cart functionality
- Price per unit display

### 🛍️ Cart

- View all cart items
- Increment/decrement quantity
- Remove items
- Price calculation with GST (18%)
- Order confirmation with animation
- Clear cart after order

### ❤️ Favorites

- View saved recipes
- Quick access to favorite recipes
- Remove from favorites

### 👤 Account

- User profile information
- Statistics (favorites, orders, meal plans)
- Logout functionality

## Design System

### Color Palette

```css
/* Brown Tones */
--savora-brown-50: #faf8f5
--savora-brown-500: #a98e6d
--savora-brown-800: #5f4c3b

/* Beige Tones */
--savora-beige-50: #fdfcfa
--savora-beige-200: #f3ece1
--savora-beige-300: #e8dcc8

/* Green Tones (Accent) */
--savora-green-50: #f4f7f4
--savora-green-500: #5c7f5c
--savora-green-600: #476647

/* Base Colors */
--savora-cream: #faf8f5
--savora-sand: #e8dcc8
```

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Component Classes

```css
/* Buttons */
.btn-primary    /* Green background */
/* Green background */
.btn-secondary  /* Beige background */
.btn-outline    /* Brown border */

/* Cards */
.card           /* White bg, rounded, shadow */

/* Form Elements */
.input          /* Styled input field */
.label          /* Form label */

/* Links */
.link           /* Green hover state */
.nav-link; /* Navigation link */
```

## State Management

### AuthContext

Manages user authentication state:

- `user` - Current user object
- `loading` - Auth loading state
- `isAuthenticated` - Boolean auth status
- `login(credentials)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `toggleFavorite(recipeId)` - Toggle favorite
- `isFavorite(recipeId)` - Check if favorited

### CartContext

Manages shopping cart state:

- `cartItems` - Array of cart items
- `itemCount` - Total item count
- `subtotal` - Subtotal amount
- `gstAmount` - GST amount (18%)
- `total` - Total with GST
- `addToCart(item, quantity)` - Add item
- `removeFromCart(itemId)` - Remove item
- `incrementQuantity(itemId)` - Increase qty
- `decrementQuantity(itemId)` - Decrease qty
- `clearCart()` - Empty cart

## API Integration

### Axios Configuration

- Base URL from environment variable
- Automatic token attachment via interceptors
- Token refresh on 401 errors
- Credentials included for cookies

### Services

**authService.js**

```javascript
authService.register(userData);
authService.login(credentials);
authService.logout();
authService.getMe();
authService.toggleFavorite(recipeId);
```

**recipeService.js**

```javascript
recipeService.getRecipes(params);
recipeService.getRecipeById(id);
recipeService.createRecipe(formData);
recipeService.toggleLike(id);
recipeService.addComment(id, text);
recipeService.deleteRecipe(id);
```

**ingredientService.js**

```javascript
ingredientService.getIngredients(params);
ingredientService.getIngredientById(id);
ingredientService.seedIngredients();
```

## Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive features:

- Collapsible mobile navigation
- Grid layouts that adapt to screen size
- Touch-friendly buttons and interactions
- Optimized images

## Animations

Using Framer Motion for:

- Page transitions
- Card hover effects
- Modal animations
- Loading states
- Button interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

| Variable       | Description     | Default                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Build

```bash
npm run preview
```

## Folder Conventions

- **components/**: Reusable UI components
- **pages/**: Route-level components
- **layouts/**: Page wrapper components
- **context/**: React Context providers
- **hooks/**: Custom React hooks
- **services/**: API service functions
- **utils/**: Helper functions

## License

MIT
