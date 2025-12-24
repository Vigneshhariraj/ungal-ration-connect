import { useState } from 'react';
import { ShoppingCart, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  name: string;
  nameTamil: string;
  totalVotes: number;
  currentStock: number;
  recommendedOrder: number;
  orderQuantity: number;
  unit: string;
  pricePerUnit: number;
}

const initialOrderItems: OrderItem[] = [
  { id: '1', name: 'Rice', nameTamil: 'அரிசி', totalVotes: 450, currentStock: 1500, recommendedOrder: 5500, orderQuantity: 5500, unit: 'kg', pricePerUnit: 25 },
  { id: '2', name: 'Wheat', nameTamil: 'கோதுமை', totalVotes: 320, currentStock: 700, recommendedOrder: 3500, orderQuantity: 3500, unit: 'kg', pricePerUnit: 22 },
  { id: '3', name: 'Sugar', nameTamil: 'சர்க்கரை', totalVotes: 480, currentStock: 300, recommendedOrder: 2200, orderQuantity: 2200, unit: 'kg', pricePerUnit: 40 },
  { id: '4', name: 'Toor Dal', nameTamil: 'துவரம் பருப்பு', totalVotes: 390, currentStock: 400, recommendedOrder: 1800, orderQuantity: 1800, unit: 'kg', pricePerUnit: 95 },
  { id: '5', name: 'Cooking Oil', nameTamil: 'சமையல் எண்ணெய்', totalVotes: 460, currentStock: 250, recommendedOrder: 1000, orderQuantity: 1000, unit: 'L', pricePerUnit: 150 },
  { id: '6', name: 'Salt', nameTamil: 'உப்பு', totalVotes: 200, currentStock: 1000, recommendedOrder: 800, orderQuantity: 800, unit: 'kg', pricePerUnit: 15 },
  { id: '7', name: 'Kerosene', nameTamil: 'மண்ணெண்ணெய்', totalVotes: 280, currentStock: 700, recommendedOrder: 2000, orderQuantity: 2000, unit: 'L', pricePerUnit: 35 },
  { id: '8', name: 'Urad Dal', nameTamil: 'உளுந்து பருப்பு', totalVotes: 350, currentStock: 50, recommendedOrder: 600, orderQuantity: 600, unit: 'kg', pricePerUnit: 110 },
  { id: '9', name: 'Chana Dal', nameTamil: 'கடலை பருப்பு', totalVotes: 310, currentStock: 350, recommendedOrder: 750, orderQuantity: 750, unit: 'kg', pricePerUnit: 85 },
  { id: '10', name: 'Palm Oil', nameTamil: 'பனை எண்ணெய்', totalVotes: 180, currentStock: 300, recommendedOrder: 400, orderQuantity: 400, unit: 'L', pricePerUnit: 120 },
];

const OrderAnalysisPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const updateOrderQuantity = (id: string, quantity: number) => {
    setOrderItems(prev =>
      prev.map(item => item.id === id ? { ...item, orderQuantity: Math.max(0, quantity) } : item)
    );
  };

  const totalOrderValue = orderItems.reduce((sum, item) => sum + (item.orderQuantity * item.pricePerUnit), 0);

  const handlePlaceOrder = () => {
    const newOrderId = `ORD${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setShowConfirmDialog(false);
    toast({
      title: language === 'en' ? 'Order Placed Successfully!' : 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!',
      description: language === 'en' ? `Reference ID: ${newOrderId}` : `குறிப்பு ஐடி: ${newOrderId}`,
    });
  };

  const handleExport = () => {
    toast({
      title: language === 'en' ? 'Export Started' : 'ஏற்றுமதி தொடங்கியது',
      description: language === 'en' ? 'Order details are being exported to PDF' : 'ஆர்டர் விவரங்கள் PDF ஆக ஏற்றுமதி செய்யப்படுகின்றன',
    });
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
  };

  return (
    <MainLayout 
      title={language === 'en' ? 'Order Analysis & Placement' : 'ஆர்டர் பகுப்பாய்வு & வைப்பு'}
      showBack
    >
      <div className="space-y-4">
        {/* Order Success Message */}
        {orderPlaced && (
          <Card className="bg-success/10 border-success/20 animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-success">
                    {language === 'en' ? 'Order Placed Successfully!' : 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? `Reference ID: ${orderId}` : `குறிப்பு ஐடி: ${orderId}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? `Estimated Delivery: ${getEstimatedDelivery()}` : `மதிப்பிடப்பட்ட டெலிவரி: ${getEstimatedDelivery()}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voting Results Summary */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {language === 'en' ? 'Voting Results Summary' : 'வாக்கெடுப்பு முடிவுகள் சுருக்கம்'}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                {language === 'en' ? 'Export' : 'ஏற்றுமதி'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderItems.slice(0, 5).map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.totalVotes} votes</span>
                  </div>
                  <Progress value={(item.totalVotes / 500) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Adjust Order Quantities' : 'ஆர்டர் அளவுகளை சரிசெய்யவும்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">{language === 'en' ? 'Item' : 'பொருள்'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Votes' : 'வாக்குகள்'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Current Stock' : 'தற்போதைய கையிருப்பு'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Recommended' : 'பரிந்துரைக்கப்பட்டது'}</TableHead>
                    <TableHead className="text-center">{language === 'en' ? 'Order Qty' : 'ஆர்டர் அளவு'}</TableHead>
                    <TableHead className="pr-6 text-right">{language === 'en' ? 'Value (₹)' : 'மதிப்பு (₹)'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.nameTamil}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.totalVotes}</TableCell>
                      <TableCell className="text-right">{item.currentStock} {item.unit}</TableCell>
                      <TableCell className="text-right">{item.recommendedOrder} {item.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Input
                            type="number"
                            value={item.orderQuantity}
                            onChange={(e) => updateOrderQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-24 text-center"
                            min={0}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right font-medium">
                        ₹{(item.orderQuantity * item.pricePerUnit).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{language === 'en' ? 'Total Order Value' : 'மொத்த ஆர்டர் மதிப்பு'}</p>
                <p className="text-2xl font-bold">₹{totalOrderValue.toLocaleString()}</p>
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setShowConfirmDialog(true)}
                disabled={orderPlaced}
                className="gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {language === 'en' ? 'Place Order' : 'ஆர்டர் செய்'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'en' ? 'Confirm Order Placement' : 'ஆர்டர் வைப்பதை உறுதிப்படுத்து'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-3 mt-3">
                  <p>
                    {language === 'en'
                      ? 'You are about to place an order to the Main Distribution Centre.'
                      : 'முதன்மை விநியோக மையத்திற்கு ஆர்டர் செய்ய உள்ளீர்கள்.'}
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>{language === 'en' ? 'Total Items:' : 'மொத்த பொருட்கள்:'}</span>
                      <span className="font-medium">{orderItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Total Value:' : 'மொத்த மதிப்பு:'}</span>
                      <span className="font-bold text-primary">₹{totalOrderValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Estimated delivery: 5-7 business days'
                      : 'மதிப்பிடப்பட்ட டெலிவரி: 5-7 வணிக நாட்கள்'}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{language === 'en' ? 'Cancel' : 'ரத்து செய்'}</AlertDialogCancel>
              <AlertDialogAction onClick={handlePlaceOrder}>
                {language === 'en' ? 'Confirm Order' : 'ஆர்டரை உறுதிப்படுத்து'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default OrderAnalysisPage;