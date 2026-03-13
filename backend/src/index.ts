import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('Ungal Ration Connect API is running...');
});

// Import and use routes
import userRoutes from './routes/userRoutes';
import foodRoutes from './routes/foodRoutes';

app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
