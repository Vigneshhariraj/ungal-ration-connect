// Types
export type UserRole = 'citizen' | 'authority' | 'volunteer';
export type CardType = 'APL' | 'BPL' | 'AAY' | 'PHH';

export interface User {
  id: string;
  name: string;
  nameTamil: string;
  phone: string;
  email: string;
  role: UserRole;
  rationCardNumber?: string;
  cardType?: CardType;
  wardNumber?: string;
  taluk?: string;
  area?: string;
  familyMembers?: FamilyMember[];
  isElderly?: boolean;
  profilePhoto?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  nameTamil: string;
  age: number;
  relation: string;
  isElderly: boolean;
  requiresHomeDelivery: boolean;
}

export interface FoodItem {
  id: string;
  itemNumber: number;
  name: string;
  nameTamil: string;
  unit: 'kg' | 'L' | 'pcs';
  specification: string;
  totalQuantity: number;
  distributedQuantity: number;
  availableQuantity: number;
  distributionPerFamily: number;
  pricePerUnit: number;
  isVotingEnabled: boolean;
  totalVotes: number;
  maxVotes: number;
  votePercentage: number;
}

export interface RationSchedule {
  id: string;
  date: string;
  timeSlot: string;
  slotNumber: number;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  items: RationItem[];
  totalCost: number;
  status: 'upcoming' | 'ready' | 'collected';
  qrCode: string;
}

export interface RationItem {
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface Notification {
  id: string;
  title: string;
  titleTamil: string;
  message: string;
  messageTamil: string;
  type: 'voting' | 'ration' | 'delivery' | 'system';
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  userId: string;
  userName: string;
  address: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  volunteerId?: string;
  volunteerName?: string;
  items: RationItem[];
  notes?: string;
  createdAt: string;
}

export interface Vote {
  userId: string;
  itemId: string;
  votedAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
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
      { id: 'fm1', name: 'Lakshmi', nameTamil: 'லட்சுமி', age: 45, relation: 'Wife', isElderly: false, requiresHomeDelivery: false },
      { id: 'fm2', name: 'Arun', nameTamil: 'அருண்', age: 22, relation: 'Son', isElderly: false, requiresHomeDelivery: false },
      { id: 'fm3', name: 'Priya', nameTamil: 'பிரியா', age: 18, relation: 'Daughter', isElderly: false, requiresHomeDelivery: false },
    ],
    isElderly: false,
  },
  {
    id: 'user2',
    name: 'Saraswathi',
    nameTamil: 'சரஸ்வதி',
    phone: '9876543211',
    email: 'saras@email.com',
    role: 'citizen',
    rationCardNumber: 'TN123456789013',
    cardType: 'BPL',
    wardNumber: '12',
    taluk: 'Chennai North',
    area: 'Tondiarpet',
    familyMembers: [
      { id: 'fm4', name: 'Murugan', nameTamil: 'முருகன்', age: 72, relation: 'Husband', isElderly: true, requiresHomeDelivery: true },
    ],
    isElderly: true,
  },
  {
    id: 'user3',
    name: 'Karthik Vel',
    nameTamil: 'கார்த்திக் வேல்',
    phone: '9876543212',
    email: 'karthik@email.com',
    role: 'citizen',
    rationCardNumber: 'TN123456789014',
    cardType: 'APL',
    wardNumber: '8',
    taluk: 'Tambaram',
    area: 'Chromepet',
    familyMembers: [
      { id: 'fm5', name: 'Divya', nameTamil: 'திவ்யா', age: 30, relation: 'Wife', isElderly: false, requiresHomeDelivery: false },
    ],
    isElderly: false,
  },
  {
    id: 'user4',
    name: 'Meenakshi Ammal',
    nameTamil: 'மீனாட்சி அம்மாள்',
    phone: '9876543213',
    email: 'meena@email.com',
    role: 'citizen',
    rationCardNumber: 'TN123456789015',
    cardType: 'BPL',
    wardNumber: '20',
    taluk: 'Adyar',
    area: 'Besant Nagar',
    familyMembers: [],
    isElderly: true,
  },
  {
    id: 'user5',
    name: 'Senthil Raja',
    nameTamil: 'செந்தில் ராஜா',
    phone: '9876543214',
    email: 'senthil@email.com',
    role: 'citizen',
    rationCardNumber: 'TN123456789016',
    cardType: 'AAY',
    wardNumber: '5',
    taluk: 'Guindy',
    area: 'Saidapet',
    familyMembers: [
      { id: 'fm6', name: 'Geetha', nameTamil: 'கீதா', age: 38, relation: 'Wife', isElderly: false, requiresHomeDelivery: false },
      { id: 'fm7', name: 'Kumar', nameTamil: 'குமார்', age: 65, relation: 'Father', isElderly: true, requiresHomeDelivery: true },
      { id: 'fm8', name: 'Valli', nameTamil: 'வள்ளி', age: 60, relation: 'Mother', isElderly: true, requiresHomeDelivery: true },
    ],
    isElderly: false,
  },
];

export const mockAuthority: User = {
  id: 'admin1',
  name: 'District Supply Officer',
  nameTamil: 'மாவட்ட வழங்கல் அதிகாரி',
  phone: '9876543220',
  email: 'dso@tn.gov.in',
  role: 'authority',
};

export const mockVolunteer: User = {
  id: 'vol1',
  name: 'Murugan',
  nameTamil: 'முருகன்',
  phone: '9876543230',
  email: 'volunteer@email.com',
  role: 'volunteer',
};

// Mock Food Items
export const mockFoodItems: FoodItem[] = [
  { id: 'item1', itemNumber: 1, name: 'Rice', nameTamil: 'அரிசி', unit: 'kg', specification: 'Ponni Rice - Grade A', totalQuantity: 5000, distributedQuantity: 3500, availableQuantity: 1500, distributionPerFamily: 5, pricePerUnit: 3, isVotingEnabled: true, totalVotes: 450, maxVotes: 500, votePercentage: 90 },
  { id: 'item2', itemNumber: 2, name: 'Wheat', nameTamil: 'கோதுமை', unit: 'kg', specification: 'Whole Wheat - Standard', totalQuantity: 2000, distributedQuantity: 1200, availableQuantity: 800, distributionPerFamily: 2, pricePerUnit: 2, isVotingEnabled: true, totalVotes: 320, maxVotes: 500, votePercentage: 64 },
  { id: 'item3', itemNumber: 3, name: 'Sugar', nameTamil: 'சர்க்கரை', unit: 'kg', specification: 'Refined Sugar', totalQuantity: 1500, distributedQuantity: 1000, availableQuantity: 500, distributionPerFamily: 1, pricePerUnit: 13.50, isVotingEnabled: true, totalVotes: 480, maxVotes: 500, votePercentage: 96 },
  { id: 'item4', itemNumber: 4, name: 'Toor Dal', nameTamil: 'துவரம் பருப்பு', unit: 'kg', specification: 'Split Pigeon Peas', totalQuantity: 1000, distributedQuantity: 600, availableQuantity: 400, distributionPerFamily: 1, pricePerUnit: 50, isVotingEnabled: true, totalVotes: 390, maxVotes: 500, votePercentage: 78 },
  { id: 'item5', itemNumber: 5, name: 'Cooking Oil', nameTamil: 'சமையல் எண்ணெய்', unit: 'L', specification: 'Sunflower Oil', totalQuantity: 800, distributedQuantity: 500, availableQuantity: 300, distributionPerFamily: 1, pricePerUnit: 25, isVotingEnabled: true, totalVotes: 460, maxVotes: 500, votePercentage: 92 },
  { id: 'item6', itemNumber: 6, name: 'Salt', nameTamil: 'உப்பு', unit: 'kg', specification: 'Iodized Salt', totalQuantity: 2500, distributedQuantity: 1500, availableQuantity: 1000, distributionPerFamily: 1, pricePerUnit: 5, isVotingEnabled: false, totalVotes: 0, maxVotes: 500, votePercentage: 0 },
  { id: 'item7', itemNumber: 7, name: 'Kerosene', nameTamil: 'மண்ணெண்ணெய்', unit: 'L', specification: 'Standard Grade', totalQuantity: 3000, distributedQuantity: 2000, availableQuantity: 1000, distributionPerFamily: 3, pricePerUnit: 15, isVotingEnabled: true, totalVotes: 280, maxVotes: 500, votePercentage: 56 },
  { id: 'item8', itemNumber: 8, name: 'Urad Dal', nameTamil: 'உளுந்து பருப்பு', unit: 'kg', specification: 'Black Gram Dal', totalQuantity: 500, distributedQuantity: 300, availableQuantity: 200, distributionPerFamily: 0.5, pricePerUnit: 55, isVotingEnabled: true, totalVotes: 350, maxVotes: 500, votePercentage: 70 },
  { id: 'item9', itemNumber: 9, name: 'Chana Dal', nameTamil: 'கடலை பருப்பு', unit: 'kg', specification: 'Bengal Gram Dal', totalQuantity: 600, distributedQuantity: 350, availableQuantity: 250, distributionPerFamily: 0.5, pricePerUnit: 45, isVotingEnabled: true, totalVotes: 310, maxVotes: 500, votePercentage: 62 },
  { id: 'item10', itemNumber: 10, name: 'Palm Oil', nameTamil: 'பனை எண்ணெய்', unit: 'L', specification: 'Refined Palm Oil', totalQuantity: 400, distributedQuantity: 200, availableQuantity: 200, distributionPerFamily: 0.5, pricePerUnit: 22, isVotingEnabled: true, totalVotes: 180, maxVotes: 500, votePercentage: 36 },
];

// Mock Ration Schedules
export const mockRationSchedules: RationSchedule[] = [
  {
    id: 'sched1',
    date: '2024-01-15',
    timeSlot: '10:00 AM - 12:00 PM',
    slotNumber: 15,
    shopName: 'Mylapore Fair Price Shop',
    shopAddress: '123 Mada Street, Mylapore, Chennai - 600004',
    shopPhone: '044-24641234',
    items: [
      { itemId: 'item1', name: 'Rice', quantity: 5, unit: 'kg', price: 15 },
      { itemId: 'item3', name: 'Sugar', quantity: 1, unit: 'kg', price: 13.50 },
      { itemId: 'item5', name: 'Cooking Oil', quantity: 1, unit: 'L', price: 25 },
    ],
    totalCost: 53.50,
    status: 'upcoming',
    qrCode: 'QR_RATION_2024_001',
  },
  {
    id: 'sched2',
    date: '2024-02-01',
    timeSlot: '2:00 PM - 4:00 PM',
    slotNumber: 42,
    shopName: 'Mylapore Fair Price Shop',
    shopAddress: '123 Mada Street, Mylapore, Chennai - 600004',
    shopPhone: '044-24641234',
    items: [
      { itemId: 'item2', name: 'Wheat', quantity: 2, unit: 'kg', price: 4 },
      { itemId: 'item4', name: 'Toor Dal', quantity: 1, unit: 'kg', price: 50 },
      { itemId: 'item7', name: 'Kerosene', quantity: 3, unit: 'L', price: 45 },
    ],
    totalCost: 99,
    status: 'upcoming',
    qrCode: 'QR_RATION_2024_002',
  },
  {
    id: 'sched3',
    date: '2024-02-15',
    timeSlot: '10:00 AM - 12:00 PM',
    slotNumber: 15,
    shopName: 'Mylapore Fair Price Shop',
    shopAddress: '123 Mada Street, Mylapore, Chennai - 600004',
    shopPhone: '044-24641234',
    items: [
      { itemId: 'item1', name: 'Rice', quantity: 5, unit: 'kg', price: 15 },
      { itemId: 'item6', name: 'Salt', quantity: 1, unit: 'kg', price: 5 },
    ],
    totalCost: 20,
    status: 'upcoming',
    qrCode: 'QR_RATION_2024_003',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    title: 'Voting Deadline Approaching',
    titleTamil: 'வாக்களிப்பு காலக்கெடு நெருங்குகிறது',
    message: 'Only 2 days left to vote for next month\'s ration items. Cast your vote now!',
    messageTamil: 'அடுத்த மாத ரேஷன் பொருட்களுக்கு வாக்களிக்க 2 நாட்கள் மட்டுமே உள்ளன. இப்போதே வாக்களியுங்கள்!',
    type: 'voting',
    isRead: false,
    isImportant: true,
    createdAt: '2024-01-10T10:30:00',
  },
  {
    id: 'notif2',
    title: 'Ration Available for Collection',
    titleTamil: 'ரேஷன் பெறுவதற்கு தயார்',
    message: 'Your ration for January is ready for collection. Visit your nearest fair price shop.',
    messageTamil: 'ஜனவரி மாத ரேஷன் தயாராக உள்ளது. உங்கள் அருகிலுள்ள நியாய விலைக் கடைக்குச் செல்லவும்.',
    type: 'ration',
    isRead: false,
    isImportant: true,
    createdAt: '2024-01-12T09:00:00',
  },
  {
    id: 'notif3',
    title: 'Delivery Scheduled',
    titleTamil: 'டெலிவரி திட்டமிடப்பட்டது',
    message: 'Your home delivery has been scheduled for January 15, 2024 between 10 AM - 12 PM.',
    messageTamil: 'உங்கள் வீட்டு டெலிவரி ஜனவரி 15, 2024 அன்று காலை 10 - 12 மணிக்கு திட்டமிடப்பட்டுள்ளது.',
    type: 'delivery',
    isRead: true,
    isImportant: false,
    createdAt: '2024-01-08T14:20:00',
  },
  {
    id: 'notif4',
    title: 'New Items Added',
    titleTamil: 'புதிய பொருட்கள் சேர்க்கப்பட்டன',
    message: 'New items have been added to the voting list. Check and vote for your preferred items.',
    messageTamil: 'வாக்களிப்பு பட்டியலில் புதிய பொருட்கள் சேர்க்கப்பட்டுள்ளன. சரிபார்த்து வாக்களியுங்கள்.',
    type: 'system',
    isRead: true,
    isImportant: false,
    createdAt: '2024-01-05T11:45:00',
  },
  {
    id: 'notif5',
    title: 'System Maintenance',
    titleTamil: 'சிஸ்டம் பராமரிப்பு',
    message: 'Scheduled maintenance on January 20, 2024 from 2 AM - 6 AM. Services may be unavailable.',
    messageTamil: 'ஜனவரி 20, 2024 அன்று அதிகாலை 2 - 6 மணி வரை திட்டமிட்ட பராமரிப்பு. சேவைகள் கிடைக்காமல் போகலாம்.',
    type: 'system',
    isRead: true,
    isImportant: false,
    createdAt: '2024-01-03T16:00:00',
  },
];

// Mock Delivery Requests
export const mockDeliveryRequests: DeliveryRequest[] = [
  {
    id: 'del1',
    userId: 'user2',
    userName: 'Saraswathi',
    address: '45 North Beach Road, Tondiarpet, Chennai - 600081',
    phone: '9876543211',
    preferredDate: '2024-01-15',
    preferredTime: '10:00 AM - 12:00 PM',
    status: 'pending',
    items: [
      { itemId: 'item1', name: 'Rice', quantity: 5, unit: 'kg', price: 15 },
      { itemId: 'item3', name: 'Sugar', quantity: 1, unit: 'kg', price: 13.50 },
    ],
    notes: 'Please call before arriving. Building has no lift.',
    createdAt: '2024-01-10T08:30:00',
  },
  {
    id: 'del2',
    userId: 'user5',
    userName: 'Senthil Raja',
    address: '78 Gandhi Road, Saidapet, Chennai - 600015',
    phone: '9876543214',
    preferredDate: '2024-01-16',
    preferredTime: '2:00 PM - 4:00 PM',
    status: 'approved',
    volunteerId: 'vol1',
    volunteerName: 'Murugan',
    items: [
      { itemId: 'item1', name: 'Rice', quantity: 5, unit: 'kg', price: 15 },
      { itemId: 'item5', name: 'Cooking Oil', quantity: 1, unit: 'L', price: 25 },
      { itemId: 'item7', name: 'Kerosene', quantity: 3, unit: 'L', price: 45 },
    ],
    notes: 'Elderly parents at home. Ring the bell twice.',
    createdAt: '2024-01-09T15:45:00',
  },
];

// Mock User Votes
export const mockUserVotes: Vote[] = [
  { userId: 'user1', itemId: 'item1', votedAt: '2024-01-05T10:00:00' },
  { userId: 'user1', itemId: 'item3', votedAt: '2024-01-05T10:01:00' },
  { userId: 'user1', itemId: 'item5', votedAt: '2024-01-05T10:02:00' },
];

// Voting deadline
export const votingDeadline = new Date('2024-01-20T23:59:59');

// Helper functions
export const simulateApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const formatDate = (dateString: string, locale: 'en' | 'ta' = 'en'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};
