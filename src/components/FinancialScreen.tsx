import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet,
  Download,
  Users
} from 'lucide-react';
import { type Club, type FinancialData, type WithdrawalRequest } from '../types';
import { formatCurrency } from '../utils/helpers';
import FinancialOverview from './financial/FinancialOverview';
import RevenueCharts from './financial/RevenueCharts';
import CommissionTable from './financial/CommissionTable';
import AnalyticsTable from './financial/AnalyticsTable';
import WithdrawalHistory from './financial/WithdrawalHistory';
import WithdrawalDialog from './financial/WithdrawalDialog';

interface FinancialScreenProps {
  club: Club | null;
  financialData: FinancialData;
  onWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'requestDate' | 'status'>) => void;
}

export default function FinancialScreen({ club, financialData, onWithdrawal }: FinancialScreenProps) {
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);

  if (!club) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Complete Club Profile First</h2>
            <p className="text-muted-foreground">
              You need to complete your club profile before you can track finances and manage withdrawals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
          <p className="text-muted-foreground">
            Track your revenue, manage commissions, and withdraw earnings
          </p>
        </div>
        
        <Button 
          onClick={() => setShowWithdrawalDialog(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          disabled={financialData.availableBalance <= 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Withdraw Funds
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <FinancialOverview financialData={financialData} />

      {/* Charts Section */}
      <RevenueCharts financialData={financialData} />

      {/* Detailed Tables */}
      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commissions">Service Commissions</TabsTrigger>
          <TabsTrigger value="analytics">Check-in Analytics</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <CommissionTable commissions={financialData.commissions} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTable analytics={financialData.analytics} />
        </TabsContent>

        <TabsContent value="withdrawals">
          <WithdrawalHistory onWithdraw={() => setShowWithdrawalDialog(true)} />
        </TabsContent>
      </Tabs>

      {/* Withdrawal Dialog */}
      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        availableBalance={financialData.availableBalance}
        onWithdrawal={onWithdrawal}
      />
    </div>
  );
}