import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Beneficiary {
  rationCardNumber: string;
  name: string;
  lastPurchaseDate: string;
  status: 'Regular' | 'Missed' | 'New';
  hasHomeDelivery?: boolean;
}

const aplBeneficiaries: Beneficiary[] = [
  { rationCardNumber: 'TN1234567801', name: 'Rajesh Kumar', lastPurchaseDate: '2024-01-10', status: 'Regular' },
  { rationCardNumber: 'TN1234567802', name: 'Sundar Raman', lastPurchaseDate: '2024-01-08', status: 'Regular' },
  { rationCardNumber: 'TN1234567803', name: 'Priya Venkat', lastPurchaseDate: '2023-12-05', status: 'Missed' },
  { rationCardNumber: 'TN1234567804', name: 'Karthik Vel', lastPurchaseDate: '2024-01-12', status: 'Regular' },
  { rationCardNumber: 'TN1234567805', name: 'Divya Ramesh', lastPurchaseDate: '2024-01-15', status: 'New' },
  { rationCardNumber: 'TN1234567806', name: 'Anand Kumar', lastPurchaseDate: '2024-01-09', status: 'Regular' },
  { rationCardNumber: 'TN1234567807', name: 'Meera Lakshmi', lastPurchaseDate: '2023-11-28', status: 'Missed' },
  { rationCardNumber: 'TN1234567808', name: 'Vignesh Raja', lastPurchaseDate: '2024-01-11', status: 'Regular' },
  { rationCardNumber: 'TN1234567809', name: 'Kavitha Devi', lastPurchaseDate: '2024-01-07', status: 'Regular' },
  { rationCardNumber: 'TN1234567810', name: 'Ramesh Babu', lastPurchaseDate: '2024-01-14', status: 'Regular' },
];

const bplBeneficiaries: Beneficiary[] = [
  { rationCardNumber: 'TN2345678901', name: 'Saraswathi M', lastPurchaseDate: '2024-01-12', status: 'Regular' },
  { rationCardNumber: 'TN2345678902', name: 'Murugan K', lastPurchaseDate: '2024-01-11', status: 'Regular' },
  { rationCardNumber: 'TN2345678903', name: 'Lakshmi Ammal', lastPurchaseDate: '2024-01-10', status: 'Regular' },
  { rationCardNumber: 'TN2345678904', name: 'Selvam R', lastPurchaseDate: '2024-01-13', status: 'Regular' },
  { rationCardNumber: 'TN2345678905', name: 'Geetha V', lastPurchaseDate: '2024-01-09', status: 'Regular' },
  { rationCardNumber: 'TN2345678906', name: 'Kumar S', lastPurchaseDate: '2023-12-20', status: 'Missed' },
  { rationCardNumber: 'TN2345678907', name: 'Valli P', lastPurchaseDate: '2024-01-14', status: 'Regular' },
  { rationCardNumber: 'TN2345678908', name: 'Rajan T', lastPurchaseDate: '2024-01-08', status: 'Regular' },
  { rationCardNumber: 'TN2345678909', name: 'Mala K', lastPurchaseDate: '2024-01-15', status: 'New' },
  { rationCardNumber: 'TN2345678910', name: 'Senthil M', lastPurchaseDate: '2024-01-10', status: 'Regular' },
];

const elderlyBeneficiaries: Beneficiary[] = [
  { rationCardNumber: 'TN3456789001', name: 'Meenakshi Ammal', lastPurchaseDate: '2024-01-10', status: 'Regular', hasHomeDelivery: true },
  { rationCardNumber: 'TN3456789002', name: 'Gopal Rao', lastPurchaseDate: '2024-01-08', status: 'Regular', hasHomeDelivery: true },
  { rationCardNumber: 'TN3456789003', name: 'Kamala Devi', lastPurchaseDate: '2023-12-15', status: 'Missed' },
  { rationCardNumber: 'TN3456789004', name: 'Ramasamy P', lastPurchaseDate: '2024-01-12', status: 'Regular', hasHomeDelivery: true },
  { rationCardNumber: 'TN3456789005', name: 'Parvathi A', lastPurchaseDate: '2024-01-11', status: 'Regular' },
  { rationCardNumber: 'TN3456789006', name: 'Subramaniam V', lastPurchaseDate: '2023-12-28', status: 'Missed' },
  { rationCardNumber: 'TN3456789007', name: 'Janaki M', lastPurchaseDate: '2024-01-09', status: 'Regular', hasHomeDelivery: true },
  { rationCardNumber: 'TN3456789008', name: 'Krishnamurthy R', lastPurchaseDate: '2024-01-14', status: 'New' },
  { rationCardNumber: 'TN3456789009', name: 'Sarojini T', lastPurchaseDate: '2024-01-07', status: 'Regular' },
  { rationCardNumber: 'TN3456789010', name: 'Venkatesh N', lastPurchaseDate: '2024-01-13', status: 'Regular', hasHomeDelivery: true },
];

const PurchaseAnalyticsPage = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openSections, setOpenSections] = useState<string[]>(['apl', 'bpl', 'elderly']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Regular':
        return 'bg-success/10 text-success border-success/20';
      case 'Missed':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'New':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filterBeneficiaries = (beneficiaries: Beneficiary[]) => {
    return beneficiaries.filter(b => {
      const matchesSearch = b.rationCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  };

  const calculatePercentage = (beneficiaries: Beneficiary[]) => {
    const regular = beneficiaries.filter(b => b.status === 'Regular').length;
    return Math.round((regular / beneficiaries.length) * 100);
  };

  const renderBeneficiaryTable = (beneficiaries: Beneficiary[]) => {
    const filtered = filterBeneficiaries(beneficiaries);
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'en' ? 'Ration Card No.' : 'ரேஷன் கார்டு எண்'}</TableHead>
              <TableHead>{language === 'en' ? 'Name' : 'பெயர்'}</TableHead>
              <TableHead>{language === 'en' ? 'Last Purchase' : 'கடைசி வாங்கிய தேதி'}</TableHead>
              <TableHead>{language === 'en' ? 'Status' : 'நிலை'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((beneficiary, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{beneficiary.rationCardNumber}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {beneficiary.name}
                    {beneficiary.hasHomeDelivery && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Truck className="w-3 h-3" />
                        {language === 'en' ? 'Home Delivery' : 'வீட்டு டெலிவரி'}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(beneficiary.lastPurchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(beneficiary.status)}>
                    {beneficiary.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  {language === 'en' ? 'No beneficiaries found' : 'பயனாளிகள் எவரும் இல்லை'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <MainLayout 
      title={language === 'en' ? 'Ration Purchase Analytics' : 'ரேஷன் வாங்கும் பகுப்பாய்வு'}
      showBack
    >
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{calculatePercentage(aplBeneficiaries)}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'APL Regular Buyers' : 'APL வழக்கமான வாங்குபவர்கள்'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{calculatePercentage(bplBeneficiaries)}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'BPL Regular Buyers' : 'BPL வழக்கமான வாங்குபவர்கள்'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">{calculatePercentage(elderlyBeneficiaries)}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'Elderly Regular' : 'மூத்தோர் வழக்கமான'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'en' ? 'Search by card number or name...' : 'கார்டு எண் அல்லது பெயரால் தேடவும்...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? 'All' : 'அனைத்தும்'}</SelectItem>
              <SelectItem value="regular">{language === 'en' ? 'Regular' : 'வழக்கமான'}</SelectItem>
              <SelectItem value="missed">{language === 'en' ? 'Missed' : 'தவறியது'}</SelectItem>
              <SelectItem value="new">{language === 'en' ? 'New' : 'புதியது'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* APL Section */}
        <Collapsible open={openSections.includes('apl')} onOpenChange={() => toggleSection('apl')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{language === 'en' ? 'APL Beneficiaries' : 'APL பயனாளிகள்'}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{aplBeneficiaries.length}</Badge>
                    {openSections.includes('apl') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {renderBeneficiaryTable(aplBeneficiaries)}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* BPL Section */}
        <Collapsible open={openSections.includes('bpl')} onOpenChange={() => toggleSection('bpl')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{language === 'en' ? 'BPL Beneficiaries' : 'BPL பயனாளிகள்'}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{bplBeneficiaries.length}</Badge>
                    {openSections.includes('bpl') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {renderBeneficiaryTable(bplBeneficiaries)}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Elderly Section */}
        <Collapsible open={openSections.includes('elderly')} onOpenChange={() => toggleSection('elderly')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{language === 'en' ? 'Elderly Beneficiaries' : 'மூத்தோர் பயனாளிகள்'}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{elderlyBeneficiaries.length}</Badge>
                    {openSections.includes('elderly') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {renderBeneficiaryTable(elderlyBeneficiaries)}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </MainLayout>
  );
};

export default PurchaseAnalyticsPage;