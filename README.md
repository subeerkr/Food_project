# Swagat Foods - React + Vite Project

Swagat Foods is a modern, responsive web application for an Indian restaurant. It provides users with an exceptional dining experience by showcasing the restaurant's menu, allowing users to place orders, and offering features like a chatbot assistant and a cart system.

## Features

- **Home Page**: A visually appealing landing page with a video background, featured menu items, and restaurant locations.
- **Menu**: Dynamic menu categories (Starters, Main Course, Desserts, Beverages) with the ability to add items to the cart.
- **Cart System**: A fully functional cart system to manage items, update quantities, and calculate totals.
- **Checkout**: A multi-step checkout process including order summary, delivery details, and payment options.
- **Authentication**: Signup and login functionality for users.
- **ChatBot**: An interactive chatbot assistant to help users with queries.
- **Responsive Design**: Fully responsive design for seamless use across devices.
- **Theming**: Custom Material-UI theme for consistent styling.

## Project Structure

swagat_foods_vite/
├── public/
│ ├── images/ # Static images (e.g., /menu-item-1.jpg)
│ └── favicon.ico
├── src/
│ ├── api/ # (+) For handling API calls (e.g., fetching menu, user auth)
│ │ ├── authService.js
│ │ └── menuService.js
│ ├── assets/ # Assets imported in components (logos, icons)
│ ├── components/ # (_) Reusable components used across multiple pages
│ │ ├── ui/ # (++) Generic, reusable UI elements (Button, Card, Input)
│ │ │ ├── Button.jsx
│ │ │ └── Card.jsx
│ │ ├── layout/ # (++) Components that define the page structure
│ │ │ ├── Navbar.jsx
│ │ │ └── Footer.jsx
│ │ ├── cart/ # (++) Components related to the cart feature
│ │ │ ├── Cart.jsx
│ │ │ └── CartIcon.jsx
│ │ └── chatbot/ # (++) Components for the chatbot feature
│ │ └── ChatBot.jsx
│ ├── context/ # Global state with React Context
│ │ ├── AuthContext.jsx
│ │ └── CartContext.jsx
│ ├── hooks/ # (+) Custom React hooks (e.g., useApi, useAuth)
│ │ └── useCart.js
│ ├── pages/ # (_) Top-level components for each route/page
│ │ ├── HomePage.jsx
│ │ ├── MenuPage.jsx
│ │ ├── LoginPage.jsx
│ │ ├── SignupPage.jsx
│ │ └── CheckoutPage.jsx
│ ├── routes/ # Routing configuration
│ │ └── AppRoutes.jsx
│ ├── styles/ # Global styles
│ │ ├── \_theme.css # (~) CSS variables for theme (colors, fonts)
│ │ └── global.css
│ ├── utils/ # (+) Helper functions (e.g., formatCurrency, validators)
│ ├── App.jsx # Main application component (layout and routing)
│ └── main.jsx # Application entry point
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.me

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd swagat_foods_vite
   ```

# npm install

# npm run dev

Scripts
npm run dev: Start the development server.
npm run build: Build the project for production.
npm run preview: Preview the production build.
npm run lint: Run ESLint to check for code quality issues.
Technologies Used
Frontend: React, React Router, Material-UI
Build Tool: Vite
State Management: React Context API
Styling: CSS, Material-UI Theming
Linting: ESLint

The production-ready files will be available in the dist directory. You can deploy these files to any static hosting service like Netlify, Vercel, or AWS S3.

Future Enhancements
Integration with a backend API for user authentication and order management.
Persistent cart using local storage or a database.
Real-time chatbot powered by AI.
Improved accessibility features.
License
This project is licensed under the MIT License.

Enjoy using Swagat Foods! If you have any questions or feedback, feel free to reach out.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

I just removed the link
