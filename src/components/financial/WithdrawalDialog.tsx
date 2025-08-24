import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Download, CheckCircle, Banknote, Wallet, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { type WithdrawalRequest } from '../../types';

// Define payment methods locally to avoid import issues
const PAYMENT_METHODS = [
  { id: 'bank', label: 'Bank Account', icon: Banknote, color: 'bg-blue-100 text-blue-800' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: Wallet, color: 'bg-green-100 text-green-800' },
  { id: 'jazzcash', label: 'JazzCash', icon: Wallet, color: 'bg-orange-100 text-orange-800' },
  { id: 'sadapay', label: 'SadaPay', icon: CreditCard, color: 'bg-purple-100 text-purple-800' }
];

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'requestDate' | 'status'>) => void;
}

export default function WithdrawalDialog({ 
  open, 
  onOpenChange, 
  availableBalance, 
  onWithdrawal 
}: WithdrawalDialogProps) {
  const [form, setForm] = useState({
    amount: '',
    method: 'bank',
    accountDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onWithdrawal({
      amount: parseFloat(form.amount),
      method: form.method as 'bank' | 'easypaisa' | 'jazzcash' | 'sadapay',
      accountDetails: form.accountDetails
    });
    
    onOpenChange(false);
    setForm({ amount: '', method: 'bank', accountDetails: '' });
  };

  const getMethodInfo = (method: string) => {
    return PAYMENT_METHODS.find(m => m.id === method) || PAYMENT_METHODS[0];
  };

  const selectedMethod = getMethodInfo(form.method);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Transfer your earnings to your preferred payment method
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Withdrawal Amount (PKR) *</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
              max={availableBalance}
              min="100"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: Rs 100
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-method">Payment Method *</Label>
            <Select 
              value={form.method} 
              onValueChange={(value) => setForm(prev => ({ ...prev, method: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      <method.icon className="w-4 h-4" />
                      <span>{method.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-details">
              {form.method === 'bank' ? 'Account Number & Bank Name' : 
               `${selectedMethod.label} Account Number`} *
            </Label>
            <Input
              id="account-details"
              placeholder={
                form.method === 'bank' ? 'Account: 1234567890, Bank: HBL' :
                'Enter your account number'
              }
              value={form.accountDetails}
              onChange={(e) => setForm(prev => ({ ...prev, accountDetails: e.target.value }))}
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Processing Information</div>
              <div>• Withdrawals are processed within 1-3 business days</div>
              <div>• A 2% processing fee will be deducted</div>
              <div>• You will receive a confirmation email once processed</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1"
              disabled={!form.amount || !form.accountDetails || parseFloat(form.amount) > availableBalance}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Request Withdrawal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}