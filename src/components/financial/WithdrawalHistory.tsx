import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Wallet } from 'lucide-react';

interface WithdrawalHistoryProps {
  onWithdraw: () => void;
}

export default function WithdrawalHistory({ onWithdraw }: WithdrawalHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>
          Track your withdrawal requests and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No withdrawals yet</h3>
          <p className="text-muted-foreground mb-4">
            Your withdrawal history will appear here once you make your first withdrawal.
          </p>
          <Button onClick={onWithdraw}>
            <Download className="w-4 h-4 mr-2" />
            Make Your First Withdrawal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}