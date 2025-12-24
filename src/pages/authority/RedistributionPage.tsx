import { useState } from 'react';
import { RefreshCw, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';

interface UnclaimedStock {
  id: string;
  name: string;
  nameTamil: string;
  quantity: number;
  unit: string;
}

interface Beneficiary {
  id: string;
  rationCardNumber: string;
  name: string;
  category: 'BPL' | 'Elderly';
  votedItems: string[];
  lastCollection: string;
  selected: boolean;
}

const unclaimedStock: UnclaimedStock[] = [
  { id: '1', name: 'Rice', nameTamil: 'அரிசி', quantity: 500, unit: 'kg' },
  { id: '2', name: 'Wheat', nameTamil: 'கோதுமை', quantity: 200, unit: 'kg' },
  { id: '3', name: 'Dal', nameTamil: 'பருப்பு', quantity: 150, unit: 'kg' },
  { id: '4', name: 'Sugar', nameTamil: 'சர்க்கரை', quantity: 100, unit: 'kg' },
  { id: '5', name: 'Oil', nameTamil: 'எண்ணெய்', quantity: 75, unit: 'L' },
];

const initialBeneficiaries: Beneficiary[] = [
  { id: '1', rationCardNumber: 'TN2345678901', name: 'Saraswathi M', category: 'BPL', votedItems: ['Rice', 'Sugar', 'Oil'], lastCollection: '2024-01-10', selected: false },
  { id: '2', rationCardNumber: 'TN2345678902', name: 'Murugan K', category: 'BPL', votedItems: ['Rice', 'Wheat', 'Dal'], lastCollection: '2024-01-08', selected: false },
  { id: '3', rationCardNumber: 'TN3456789001', name: 'Meenakshi Ammal', category: 'Elderly', votedItems: ['Rice', 'Sugar'], lastCollection: '2024-01-12', selected: false },
  { id: '4', rationCardNumber: 'TN2345678903', name: 'Lakshmi Ammal', category: 'BPL', votedItems: ['Rice', 'Oil'], lastCollection: '2024-01-05', selected: false },
  { id: '5', rationCardNumber: 'TN3456789002', name: 'Gopal Rao', category: 'Elderly', votedItems: ['Rice', 'Dal', 'Sugar'], lastCollection: '2024-01-09', selected: false },
  { id: '6', rationCardNumber: 'TN2345678904', name: 'Selvam R', category: 'BPL', votedItems: ['Wheat', 'Dal'], lastCollection: '2024-01-11', selected: false },
  { id: '7', rationCardNumber: 'TN3456789003', name: 'Kamala Devi', category: 'Elderly', votedItems: ['Rice', 'Sugar', 'Oil'], lastCollection: '2024-01-07', selected: false },
  { id: '8', rationCardNumber: 'TN2345678905', name: 'Geetha V', category: 'BPL', votedItems: ['Rice', 'Wheat'], lastCollection: '2024-01-06', selected: false },
  { id: '9', rationCardNumber: 'TN3456789004', name: 'Ramasamy P', category: 'Elderly', votedItems: ['Rice', 'Dal'], lastCollection: '2024-01-10', selected: false },
  { id: '10', rationCardNumber: 'TN2345678906', name: 'Kumar S', category: 'BPL', votedItems: ['Rice', 'Sugar', 'Wheat'], lastCollection: '2024-01-04', selected: false },
  { id: '11', rationCardNumber: 'TN3456789005', name: 'Parvathi A', category: 'Elderly', votedItems: ['Rice', 'Oil'], lastCollection: '2024-01-08', selected: false },
  { id: '12', rationCardNumber: 'TN2345678907', name: 'Valli P', category: 'BPL', votedItems: ['Wheat', 'Sugar'], lastCollection: '2024-01-09', selected: false },
  { id: '13', rationCardNumber: 'TN3456789006', name: 'Subramaniam V', category: 'Elderly', votedItems: ['Rice', 'Dal', 'Oil'], lastCollection: '2024-01-03', selected: false },
  { id: '14', rationCardNumber: 'TN2345678908', name: 'Rajan T', category: 'BPL', votedItems: ['Rice', 'Wheat', 'Sugar'], lastCollection: '2024-01-11', selected: false },
  { id: '15', rationCardNumber: 'TN3456789007', name: 'Janaki M', category: 'Elderly', votedItems: ['Rice', 'Sugar'], lastCollection: '2024-01-07', selected: false },
];

const RedistributionPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [activeTab, setActiveTab] = useState('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const selectedCount = beneficiaries.filter(b => b.selected).length;

  const toggleBeneficiary = (id: string) => {
    setBeneficiaries(prev =>
      prev.map(b => b.id === id ? { ...b, selected: !b.selected } : b)
    );
  };

  const selectAllByCategory = (category: 'BPL' | 'Elderly') => {
    setBeneficiaries(prev =>
      prev.map(b => b.category === category ? { ...b, selected: true } : b)
    );
  };

  const handleAllocate = () => {
    setShowConfirmDialog(false);
    toast({
      title: language === 'en' ? 'Stock Allocated' : 'கையிருப்பு ஒதுக்கப்பட்டது',
      description: language === 'en' 
        ? `Successfully redistributed stock to ${selectedCount} beneficiaries`
        : `${selectedCount} பயனாளிகளுக்கு வெற்றிகரமாக கையிருப்பு மறுவிநியோகம் செய்யப்பட்டது`,
    });
    setBeneficiaries(prev => prev.map(b => ({ ...b, selected: false })));
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bpl') return b.category === 'BPL';
    if (activeTab === 'elderly') return b.category === 'Elderly';
    return true;
  });

  return (
    <MainLayout 
      title={language === 'en' ? 'Redistribution Management' : 'மறுவிநியோக மேலாண்மை'}
      showBack
    >
      <div className="space-y-4">
        {/* Unclaimed Stock Cards */}
        <Card className="gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              {language === 'en' ? 'Available for Redistribution' : 'மறுவிநியோகத்திற்கு கிடைக்கும்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {unclaimedStock.map((item) => (
                <div key={item.id} className="bg-primary-foreground/10 rounded-lg p-3 text-center">
                  <p className="font-bold text-lg">{item.quantity} {item.unit}</p>
                  <p className="text-sm opacity-90">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selection Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectAllByCategory('BPL')}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            {language === 'en' ? 'Select All BPL' : 'அனைத்து BPL தேர்ந்தெடு'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectAllByCategory('Elderly')}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            {language === 'en' ? 'Select All Elderly' : 'அனைத்து மூத்தோர் தேர்ந்தெடு'}
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {selectedCount} {language === 'en' ? 'beneficiaries selected' : 'பயனாளிகள் தேர்ந்தெடுக்கப்பட்டனர்'}
            </span>
          </div>
        </div>

        {/* Beneficiaries Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Eligible Beneficiaries' : 'தகுதியான பயனாளிகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">{language === 'en' ? 'All' : 'அனைத்தும்'}</TabsTrigger>
                <TabsTrigger value="bpl">BPL</TabsTrigger>
                <TabsTrigger value="elderly">{language === 'en' ? 'Elderly' : 'மூத்தோர்'}</TabsTrigger>
              </TabsList>

              <div className="overflow-x-auto -mx-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 pl-6"></TableHead>
                      <TableHead>{language === 'en' ? 'Card No.' : 'கார்டு எண்'}</TableHead>
                      <TableHead>{language === 'en' ? 'Name' : 'பெயர்'}</TableHead>
                      <TableHead>{language === 'en' ? 'Category' : 'வகை'}</TableHead>
                      <TableHead>{language === 'en' ? 'Voted Items' : 'வாக்களிக்கப்பட்ட பொருட்கள்'}</TableHead>
                      <TableHead className="pr-6">{language === 'en' ? 'Last Collection' : 'கடைசி சேகரிப்பு'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiaries.map((beneficiary) => (
                      <TableRow 
                        key={beneficiary.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          beneficiary.selected && "bg-primary/5"
                        )}
                        onClick={() => toggleBeneficiary(beneficiary.id)}
                      >
                        <TableCell className="pl-6">
                          <Checkbox 
                            checked={beneficiary.selected}
                            onCheckedChange={() => toggleBeneficiary(beneficiary.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{beneficiary.rationCardNumber}</TableCell>
                        <TableCell className="font-medium">{beneficiary.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              beneficiary.category === 'BPL' && "bg-success/10 text-success border-success/20",
                              beneficiary.category === 'Elderly' && "bg-accent/10 text-accent border-accent/20"
                            )}
                          >
                            {beneficiary.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {beneficiary.votedItems.map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="pr-6">
                          {new Date(beneficiary.lastCollection).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Allocate Button */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={selectedCount === 0}
          onClick={() => setShowConfirmDialog(true)}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {language === 'en' 
            ? `Allocate Remaining Stock (${selectedCount} selected)`
            : `மீதமுள்ள கையிருப்பை ஒதுக்கு (${selectedCount} தேர்ந்தெடுக்கப்பட்டது)`}
        </Button>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'en' ? 'Confirm Redistribution' : 'மறுவிநியோகத்தை உறுதிப்படுத்து'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'en'
                  ? `You are about to redistribute unclaimed stock to ${selectedCount} beneficiaries. This action will allocate stock proportionally based on their voted items.`
                  : `${selectedCount} பயனாளிகளுக்கு உரிமை கோரப்படாத கையிருப்பை மறுவிநியோகம் செய்ய உள்ளீர்கள். இந்த நடவடிக்கை அவர்களின் வாக்களிக்கப்பட்ட பொருட்களின் அடிப்படையில் கையிருப்பை விகிதாசாரமாக ஒதுக்கும்.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{language === 'en' ? 'Cancel' : 'ரத்து செய்'}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAllocate}>
                {language === 'en' ? 'Confirm Allocation' : 'ஒதுக்கீட்டை உறுதிப்படுத்து'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default RedistributionPage;