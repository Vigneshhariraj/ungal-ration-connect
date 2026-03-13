import { Request, Response } from 'express';
import FoodItem from '../models/FoodItem';

// @desc    Get all food items
// @route   GET /api/food
// @access  Private
export const getFoodItems = async (req: Request, res: Response) => {
  const items = await FoodItem.find({});
  res.json(items);
};

// @desc    Get single food item
// @route   GET /api/food/:id
// @access  Private
export const getFoodItemById = async (req: Request, res: Response) => {
  const item = await FoodItem.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

// @desc    Create a food item
// @route   POST /api/food
// @access  Private/Authority
export const createFoodItem = async (req: Request, res: Response) => {
  const { itemNumber, name, nameTamil, unit, specification, totalQuantity, distributionPerFamily, pricePerUnit, isVotingEnabled } = req.body;

  const item = new FoodItem({
    itemNumber,
    name,
    nameTamil,
    unit,
    specification,
    totalQuantity,
    availableQuantity: totalQuantity,
    distributionPerFamily,
    pricePerUnit,
    isVotingEnabled,
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
};

// @desc    Update stock
// @route   PUT /api/food/:id/stock
// @access  Private/Authority
export const updateStock = async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const item = await FoodItem.findById(req.params.id);

  if (item) {
    item.totalQuantity += quantity;
    item.availableQuantity += quantity;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};
