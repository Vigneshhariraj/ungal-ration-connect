import express from 'express';
import { getFoodItems, getFoodItemById, createFoodItem, updateStock } from '../controllers/foodController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getFoodItems)
  .post(protect, authorize('authority'), createFoodItem);

router.route('/:id')
  .get(protect, getFoodItemById);

router.route('/:id/stock')
  .put(protect, authorize('authority'), updateStock);

export default router;
