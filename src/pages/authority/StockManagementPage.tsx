import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit2, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockFoodItems, simulateApiCall, FoodItem } from '@/data/mockData';
import { cn } from '@/lib/utils';

const StockManagementPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    totalQuantity: 0,
    distributedQuantity: 0,
    distributionPerFamily: 0,
    isVotingEnabled: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockFoodItems);
    setFoodItems(data);
    setIsLoading(false);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setEditForm({
      totalQuantity: item.totalQuantity,
      distributedQuantity: item.distributedQuantity,
      distributionPerFamily: item.distributionPerFamily,
      isVotingEnabled: item.isVotingEnabled,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    setIsLoading(true);
    await simulateApiCall(null, 800);

    setFoodItems(prev =>
      prev.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              totalQuantity: editForm.totalQuantity,
              distributedQuantity: editForm.distributedQuantity,
              availableQuantity: editForm.totalQuantity - editForm.distributedQuantity,
              distributionPerFamily: editForm.distributionPerFamily,
              isVotingEnabled: editForm.isVotingEnabled,
            }
          : item
      )
    );

    toast({
      title: language === 'en' ? 'Stock Updated' : 'கையிருப்பு புதுப்பிக்கப்பட்டது',
      description: language === 'en' 
        ? `${editingItem.name} has been updated successfully.`
        : `${editingItem.nameTamil} வெற்றிகரமாக புதுப்பிக்கப்பட்டது.`,
    });

    setIsEditing(false);
    setEditingItem(null);
    setIsLoading(false);
  };

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameTamil.includes(searchQuery)
  );

  const lowStockItems = foodItems.filter(item => {
    const percentage = (item.availableQuantity / item.totalQuantity) * 100;
    return percentage < 30;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">{t('authority.stockManagement')}</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-4">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-warning bg-warning/10 animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium">
                    {language === 'en' ? 'Low Stock Alert' : 'குறைந்த கையிருப்பு எச்சரிக்கை'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lowStockItems.map(i => i.name).join(', ')} {language === 'en' ? 'are running low' : 'குறைவாக உள்ளன'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`${t('common.search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Add' : 'சேர்'}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton variant="card" count={5} />}

        {/* Stock Items */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const percentage = (item.availableQuantity / item.totalQuantity) * 100;
              const isLowStock = percentage < 30;

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "animate-slide-up",
                    isLowStock && "border-warning"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {item.itemNumber}
                          </span>
                          <h3 className="font-semibold">{item.name}</h3>
                          {isLowStock && (
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.nameTamil}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'Edit' : 'திருத்து'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('stocks.total')}</p>
                        <p className="font-semibold">{item.totalQuantity} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('stocks.distributed')}</p>
                        <p className="font-semibold">{item.distributedQuantity} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('stocks.available')}</p>
                        <p className={cn("font-semibold", isLowStock && "text-warning")}>
                          {item.availableQuantity} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className={cn("h-2", isLowStock && "[&>div]:bg-warning")}
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {language === 'en' ? 'Per family:' : 'ஒரு குடும்பத்திற்கு:'} {item.distributionPerFamily} {item.unit}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1",
                          item.isVotingEnabled ? "text-success" : "text-muted-foreground"
                        )}>
                          {item.isVotingEnabled ? (
                            <>
                              <Check className="w-3 h-3" />
                              {language === 'en' ? 'Voting enabled' : 'வாக்களிப்பு இயக்கப்பட்டது'}
                            </>
                          ) : (
                            language === 'en' ? 'Voting disabled' : 'வாக்களிப்பு முடக்கப்பட்டது'
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Edit Stock' : 'கையிருப்பை திருத்து'} - {editingItem?.name}
              </DialogTitle>
              <DialogDescription>
                {language === 'en' 
                  ? 'Update stock levels and distribution settings.'
                  : 'கையிருப்பு நிலைகள் மற்றும் விநியோக அமைப்புகளைப் புதுப்பிக்கவும்.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('stocks.total')}</Label>
                  <Input
                    type="number"
                    value={editForm.totalQuantity}
                    onChange={(e) => setEditForm({ ...editForm, totalQuantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('stocks.distributed')}</Label>
                  <Input
                    type="number"
                    value={editForm.distributedQuantity}
                    onChange={(e) => setEditForm({ ...editForm, distributedQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{language === 'en' ? 'Per Family Distribution' : 'ஒரு குடும்ப விநியோகம்'}</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={editForm.distributionPerFamily}
                  onChange={(e) => setEditForm({ ...editForm, distributionPerFamily: Number(e.target.value) })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <Label>{language === 'en' ? 'Enable Voting' : 'வாக்களிப்பை இயக்கு'}</Label>
                <Switch
                  checked={editForm.isVotingEnabled}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isVotingEnabled: checked })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default StockManagementPage;
