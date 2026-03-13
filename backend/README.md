# Ungal Ration Connect Backend

This is the Node.js backend for the Ungal Ration Connect project, built with Express, TypeScript, and MongoDB.

## Tech Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Security**: Helmet, CORS

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or on Atlas)

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory (one has been created for you):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ungal_ration_connect
   JWT_SECRET=your_super_secret_key_123
   NODE_ENV=development
   ```

3. **Seed the Database**
   This will populate your database with initial mock data:
   ```bash
   npm run data:import
   ```

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

## API Routes

### Users
- `POST /api/users` - Register a user
- `POST /api/users/login` - Login with phone number
- `GET /api/users/profile` - Get user profile (Private)

### Food Items
- `GET /api/food` - Get all food items (Private)
- `POST /api/food` - Create a food item (Authority only)
- `PUT /api/food/:id/stock` - Update stock (Authority only)

## Project Structure
```
backend/
├── src/
│   ├── config/      # Database connection
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth & Error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routes
│   └── index.ts     # Entry point
├── .env             # Environment variables
├── tsconfig.json    # TypeScript configuration
└── package.json     # Scripts & dependencies
```
