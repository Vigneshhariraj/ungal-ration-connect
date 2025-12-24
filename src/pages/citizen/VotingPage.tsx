import { useState, useEffect } from 'react';
import { Vote, Clock, Check, AlertCircle, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockFoodItems, mockUserVotes, votingDeadline, simulateApiCall, FoodItem, Vote as VoteType } from '@/data/mockData';
import { cn } from '@/lib/utils';

type DialogType = 'vote' | 'unvote' | 'resetAll' | null;

const VotingPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [votingItems, setVotingItems] = useState<FoodItem[]>([]);
  const [userVotes, setUserVotes] = useState<VoteType[]>(mockUserVotes);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockFoodItems.filter(item => item.isVotingEnabled));
    setVotingItems(data);
    setIsLoading(false);
  };

  const updateCountdown = () => {
    const now = new Date();
    const diff = votingDeadline.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown({ days, hours, minutes, seconds });
  };

  const handleVote = async () => {
    if (!selectedItem) return;

    setIsProcessing(true);
    await simulateApiCall(null, 800);

    const newVote: VoteType = {
      userId: 'user1',
      itemId: selectedItem.id,
      votedAt: new Date().toISOString(),
    };

    setUserVotes([...userVotes, newVote]);
    setVotingItems(items =>
      items.map(item =>
        item.id === selectedItem.id
          ? { ...item, totalVotes: item.totalVotes + 1, votePercentage: ((item.totalVotes + 1) / item.maxVotes) * 100 }
          : item
      )
    );

    toast({
      title: language === 'en' ? 'Vote Recorded!' : 'வாக்கு பதிவு செய்யப்பட்டது!',
      description: language === 'en' 
        ? `Your vote for ${selectedItem.name} has been recorded.`
        : `${selectedItem.nameTamil} க்கான உங்கள் வாக்கு பதிவு செய்யப்பட்டது.`,
    });

    setSelectedItem(null);
    setDialogType(null);
    setIsProcessing(false);
  };

  const handleUnvote = async () => {
    if (!selectedItem) return;

    setIsProcessing(true);
    await simulateApiCall(null, 800);

    setUserVotes(votes => votes.filter(v => v.itemId !== selectedItem.id));
    setVotingItems(items =>
      items.map(item =>
        item.id === selectedItem.id
          ? { ...item, totalVotes: Math.max(0, item.totalVotes - 1), votePercentage: Math.max(0, ((item.totalVotes - 1) / item.maxVotes) * 100) }
          : item
      )
    );

    toast({
      title: language === 'en' ? 'Vote Removed' : 'வாக்கு நீக்கப்பட்டது',
      description: language === 'en' 
        ? `Your vote for ${selectedItem.name} has been removed.`
        : `${selectedItem.nameTamil} க்கான உங்கள் வாக்கு நீக்கப்பட்டது.`,
    });

    setSelectedItem(null);
    setDialogType(null);
    setIsProcessing(false);
  };

  const handleResetAllVotes = async () => {
    setIsProcessing(true);
    await simulateApiCall(null, 1000);

    const votedItemIds = userVotes.map(v => v.itemId);
    setVotingItems(items =>
      items.map(item =>
        votedItemIds.includes(item.id)
          ? { ...item, totalVotes: Math.max(0, item.totalVotes - 1), votePercentage: Math.max(0, ((item.totalVotes - 1) / item.maxVotes) * 100) }
          : item
      )
    );
    setUserVotes([]);

    toast({
      title: language === 'en' ? 'All Votes Reset' : 'அனைத்து வாக்குகளும் மீட்டமைக்கப்பட்டன',
      description: language === 'en' 
        ? 'All your votes have been removed.'
        : 'உங்கள் அனைத்து வாக்குகளும் நீக்கப்பட்டன.',
    });

    setDialogType(null);
    setIsProcessing(false);
  };

  const openVoteDialog = (item: FoodItem) => {
    setSelectedItem(item);
    setDialogType('vote');
  };

  const openUnvoteDialog = (item: FoodItem) => {
    setSelectedItem(item);
    setDialogType('unvote');
  };

  const isItemVoted = (itemId: string) => userVotes.some(v => v.itemId === itemId);
  const votedItems = votingItems.filter(item => isItemVoted(item.id));

  return (
    <MainLayout title={t('voting.title')} showBack>
      <div className="space-y-4">
        {/* Countdown Timer */}
        <Card className="gradient-accent text-accent-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{t('voting.deadline')}</span>
              </div>
              <p className="text-xs opacity-80">
                {language === 'en' ? 'Votes can be changed until deadline' : 'வாக்குகள் காலக்கெடுவரை மாற்றப்படலாம்'}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {Object.entries(countdown).map(([key, value]) => (
                <div key={key} className="bg-background/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{value.toString().padStart(2, '0')}</p>
                  <p className="text-xs capitalize">{key}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Votes Section with Reset Button */}
        {votedItems.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  {t('voting.myVotes')} ({votedItems.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogType('resetAll')}
                  className="text-destructive hover:text-destructive"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'Reset All' : 'அனைத்தையும் மீட்டமை'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {votedItems.map(item => (
                  <span
                    key={item.id}
                    className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium"
                  >
                    {language === 'en' ? item.name : item.nameTamil}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton variant="card" count={5} />}

        {/* Voting Items */}
        {!isLoading && (
          <div className="space-y-3">
            {votingItems.map((item, index) => {
              const voted = isItemVoted(item.id);
              
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "animate-slide-up transition-all",
                    voted && "border-success bg-success/5"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {item.itemNumber}
                          </span>
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.nameTamil}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.specification}</p>
                      </div>
                      {voted ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUnvoteDialog(item)}
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {language === 'en' ? 'Unvote' : 'வாக்கை நீக்கு'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openVoteDialog(item)}
                        >
                          <Vote className="w-4 h-4 mr-1" />
                          {t('voting.vote')}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('voting.totalVotes')}</span>
                        <span className="font-medium">{item.totalVotes} / {item.maxVotes}</span>
                      </div>
                      <Progress value={item.votePercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {item.distributionPerFamily} {item.unit} per family
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Vote Confirmation Dialog */}
        <AlertDialog open={dialogType === 'vote'} onOpenChange={() => { setDialogType(null); setSelectedItem(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                {t('voting.confirmVote')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('voting.confirmMessage')}
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground">{selectedItem?.name}</p>
                  <p className="text-sm">{selectedItem?.nameTamil}</p>
                  <p className="text-xs mt-1">{selectedItem?.specification}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleVote} disabled={isProcessing}>
                {isProcessing ? t('common.loading') : t('common.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Unvote Confirmation Dialog */}
        <AlertDialog open={dialogType === 'unvote'} onOpenChange={() => { setDialogType(null); setSelectedItem(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <X className="w-5 h-5 text-accent" />
                {language === 'en' ? 'Remove Vote' : 'வாக்கை நீக்கு'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'en' 
                  ? `Are you sure you want to remove your vote for "${selectedItem?.name}"?`
                  : `"${selectedItem?.nameTamil}" க்கான உங்கள் வாக்கை நீக்க விரும்புகிறீர்களா?`}
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground">{selectedItem?.name}</p>
                  <p className="text-sm">{selectedItem?.nameTamil}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleUnvote} 
                disabled={isProcessing}
                className="bg-accent hover:bg-accent/90"
              >
                {isProcessing ? t('common.loading') : (language === 'en' ? 'Remove Vote' : 'நீக்கு')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reset All Votes Confirmation Dialog */}
        <AlertDialog open={dialogType === 'resetAll'} onOpenChange={() => setDialogType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-destructive" />
                {language === 'en' ? 'Reset All Votes' : 'அனைத்து வாக்குகளையும் மீட்டமை'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'en' 
                  ? `Are you sure you want to reset all ${votedItems.length} votes? This action cannot be undone.`
                  : `${votedItems.length} வாக்குகளையும் மீட்டமைக்க விரும்புகிறீர்களா? இந்த செயலை மாற்ற முடியாது.`}
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'en' ? 'Votes to be removed:' : 'நீக்கப்படும் வாக்குகள்:'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {votedItems.map(item => (
                      <span key={item.id} className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                        {language === 'en' ? item.name : item.nameTamil}
                      </span>
                    ))}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetAllVotes} 
                disabled={isProcessing}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isProcessing ? t('common.loading') : (language === 'en' ? 'Reset All' : 'மீட்டமை')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default VotingPage;