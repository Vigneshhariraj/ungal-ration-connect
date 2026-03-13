import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import FoodItem from './models/FoodItem';
import Notification from './models/Notification';
import connectDB from './config/db';

dotenv.config();

connectDB();

const users = [
  {
    name: 'Rajesh Kumar',
    nameTamil: 'ராஜேஷ் குமார்',
    phone: '9876543210',
    email: 'rajesh@email.com',
    role: 'citizen',
    rationCardNumber: 'TN123456789012',
    cardType: 'APL',
    wardNumber: '15',
    taluk: 'Chennai South',
    area: 'Mylapore',
    familyMembers: [
      { name: 'Lakshmi', nameTamil: 'லட்சுமி', age: 45, relation: 'Wife', isElderly: false, requiresHomeDelivery: false },
      { name: 'Arun', nameTamil: 'அருண்', age: 22, relation: 'Son', isElderly: false, requiresHomeDelivery: false },
      { name: 'Priya', nameTamil: 'பிரியா', age: 18, relation: 'Daughter', isElderly: false, requiresHomeDelivery: false },
    ],
    isElderly: false,
  },
  {
    name: 'District Supply Officer',
    nameTamil: 'மாவட்ட வழங்கல் அதிகாரி',
    phone: '9876543220',
    email: 'dso@tn.gov.in',
    role: 'authority',
  },
];

const foodItems = [
  { itemNumber: 1, name: 'Rice', nameTamil: 'அரிசி', unit: 'kg', specification: 'Ponni Rice - Grade A', totalQuantity: 5000, distributedQuantity: 3500, availableQuantity: 1500, distributionPerFamily: 5, pricePerUnit: 3, isVotingEnabled: true },
  { itemNumber: 2, name: 'Wheat', nameTamil: 'கோதுமை', unit: 'kg', specification: 'Whole Wheat - Standard', totalQuantity: 2000, distributedQuantity: 1200, availableQuantity: 800, distributionPerFamily: 2, pricePerUnit: 2, isVotingEnabled: true },
  { itemNumber: 3, name: 'Sugar', nameTamil: 'சர்க்கரை', unit: 'kg', specification: 'Refined Sugar', totalQuantity: 1500, distributedQuantity: 1000, availableQuantity: 500, distributionPerFamily: 1, pricePerUnit: 13.50, isVotingEnabled: true },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await FoodItem.deleteMany();
    await Notification.deleteMany();

    await User.insertMany(users);
    await FoodItem.insertMany(foodItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await FoodItem.deleteMany();
    await Notification.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
