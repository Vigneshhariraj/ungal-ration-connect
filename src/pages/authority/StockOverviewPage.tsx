import { useState } from 'react';
import { Search, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StockItem {
  id: string;
  name: string;
  nameTamil: string;
  votedQuantity: number;
  availableBefore: number;
  distributed: number;
  remaining: number;
  unit: string;
}

const stockData: StockItem[] = [
  { id: '1', name: 'Rice', nameTamil: 'அரிசி', votedQuantity: 5000, availableBefore: 6000, distributed: 4500, remaining: 1500, unit: 'kg' },
  { id: '2', name: 'Wheat', nameTamil: 'கோதுமை', votedQuantity: 3000, availableBefore: 3500, distributed: 2800, remaining: 700, unit: 'kg' },
  { id: '3', name: 'Sugar', nameTamil: 'சர்க்கரை', votedQuantity: 2000, availableBefore: 2200, distributed: 1900, remaining: 300, unit: 'kg' },
  { id: '4', name: 'Toor Dal', nameTamil: 'துவரம் பருப்பு', votedQuantity: 1500, availableBefore: 1800, distributed: 800, remaining: 1000, unit: 'kg' },
  { id: '5', name: 'Cooking Oil', nameTamil: 'சமையல் எண்ணெய்', votedQuantity: 800, availableBefore: 1000, distributed: 750, remaining: 250, unit: 'L' },
  { id: '6', name: 'Salt', nameTamil: 'உப்பு', votedQuantity: 2500, availableBefore: 3000, distributed: 1200, remaining: 1800, unit: 'kg' },
  { id: '7', name: 'Kerosene', nameTamil: 'மண்ணெண்ணெய்', votedQuantity: 2000, availableBefore: 2500, distributed: 1800, remaining: 700, unit: 'L' },
  { id: '8', name: 'Urad Dal', nameTamil: 'உளுந்து பருப்பு', votedQuantity: 500, availableBefore: 600, distributed: 550, remaining: 50, unit: 'kg' },
  { id: '9', name: 'Chana Dal', nameTamil: 'கடலை பருப்பு', votedQuantity: 600, availableBefore: 750, distributed: 400, remaining: 350, unit: 'kg' },
  { id: '10', name: 'Palm Oil', nameTamil: 'பனை எண்ணெய்', votedQuantity: 400, availableBefore: 500, distributed: 200, remaining: 300, unit: 'L' },
];

const StockOverviewPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const getStockStatus = (remaining: number, original: number) => {
    const percentage = (remaining / original) * 100;
    if (percentage > 50) return { status: 'high', color: '#4CAF50', label: language === 'en' ? 'High Stock' : 'அதிக கையிருப்பு' };
    if (percentage >= 20) return { status: 'medium', color: '#FFA726', label: language === 'en' ? 'Medium Stock' : 'நடுத்தர கையிருப்பு' };
    return { status: 'low', color: '#EF5350', label: language === 'en' ? 'Low Stock' : 'குறைந்த கையிருப்பு' };
  };

  const filteredItems = stockData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameTamil.includes(searchQuery)
  );

  const handleExport = () => {
    toast({
      title: language === 'en' ? 'Export Started' : 'ஏற்றுமதி தொடங்கியது',
      description: language === 'en' ? 'Stock data is being exported to Excel' : 'கையிருப்பு தரவு எக்செல்-க்கு ஏற்றுமதி செய்யப்படுகிறது',
    });
  };

  const handleRestockAlert = (itemName: string) => {
    toast({
      title: language === 'en' ? 'Restock Alert Sent' : 'மறு கையிருப்பு எச்சரிக்கை அனுப்பப்பட்டது',
      description: language === 'en' ? `Restock alert for ${itemName} has been sent to the distribution center` : `${itemName} க்கான மறு கையிருப்பு எச்சரிக்கை விநியோக மையத்திற்கு அனுப்பப்பட்டது`,
    });
  };

  return (
    <MainLayout 
      title={language === 'en' ? 'Stock Overview' : 'கையிருப்பு மேலோட்டம்'}
      showBack
    >
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'en' ? 'Search items...' : 'பொருட்களைத் தேடவும்...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'Export' : 'ஏற்றுமதி'}</span>
          </Button>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4CAF50' }} />
                <span>{language === 'en' ? 'High (>50%)' : 'அதிகம் (>50%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA726' }} />
                <span>{language === 'en' ? 'Medium (20-50%)' : 'நடுத்தரம் (20-50%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF5350' }} />
                <span>{language === 'en' ? 'Low (<20%)' : 'குறைவு (<20%)'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Current Stock Levels' : 'தற்போதைய கையிருப்பு நிலைகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">{language === 'en' ? 'Item' : 'பொருள்'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Voted' : 'வாக்களிக்கப்பட்டது'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Available' : 'கிடைக்கும்'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Distributed' : 'விநியோகிக்கப்பட்டது'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Remaining' : 'மீதம்'}</TableHead>
                    <TableHead className="pr-6 text-center">{language === 'en' ? 'Status' : 'நிலை'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item.remaining, item.availableBefore);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: stockStatus.color }}
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.nameTamil}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.votedQuantity} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.availableBefore} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.distributed} {item.unit}</TableCell>
                        <TableCell className="text-right font-medium">{item.remaining} {item.unit}</TableCell>
                        <TableCell className="pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <Badge 
                              variant="outline"
                              className={cn(
                                "text-xs",
                                stockStatus.status === 'high' && "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20",
                                stockStatus.status === 'medium' && "bg-[#FFA726]/10 text-[#FFA726] border-[#FFA726]/20",
                                stockStatus.status === 'low' && "bg-[#EF5350]/10 text-[#EF5350] border-[#EF5350]/20"
                              )}
                            >
                              {stockStatus.label}
                            </Badge>
                            {stockStatus.status === 'low' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleRestockAlert(item.name)}
                              >
                                <AlertTriangle className="w-4 h-4 text-[#EF5350]" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StockOverviewPage;