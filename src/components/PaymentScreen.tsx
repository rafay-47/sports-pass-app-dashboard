import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, CreditCard, Smartphone, Building2, Shield, CheckCircle } from 'lucide-react';
import type { User, Sport } from '../types';

interface PaymentScreenProps {
  user: User;
  pendingPurchase: { sportId: string; tier: 'basic' | 'standard' | 'premium' };
  sport: Sport;
  onPaymentSuccess: (paymentData: { method: string; amount: number; sport: string; tier: string; data: any; }) => void;
  onBack: () => void;
  isLoading: boolean;
}

const PAYMENT_METHODS = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    icon: '📱',
    color: '#00A651',
    description: 'Pay with your EasyPaisa wallet'
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: '💳',
    color: '#F04438',
    description: 'Pay with your JazzCash account'
  },
  {
    id: 'sadapay',
    name: 'SadaPay',
    icon: '🏦',
    color: '#6366F1',
    description: 'Pay with your SadaPay card'
  },
  {
    id: 'bank',
    name: 'Bank Account',
    icon: '🏛️',
    color: '#059669',
    description: 'Direct bank transfer'
  },
  {
    id: 'mastercard',
    name: 'MasterCard',
    icon: '💳',
    color: '#EB001B',
    description: 'Pay with your MasterCard'
  }
];

export default function PaymentScreen({ 
  user, 
  pendingPurchase, 
  sport, 
  onPaymentSuccess, 
  onBack, 
  isLoading 
}: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    accountNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const price = sport.pricing[pendingPurchase.tier];
  const processingFee = Math.round(price * 0.025); // 2.5% processing fee
  const total = price + processingFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentInfo = {
      method: selectedMethod,
      amount: total,
      sport: sport.name,
      tier: pendingPurchase.tier,
      data: paymentData,
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentInfo);
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    if (!method) return null;

    switch (selectedMethod) {
      case 'easypaisa':
      case 'jazzcash':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Mobile Number</Label>
              <Input
                type="tel"
                placeholder="03XX XXXXXXX"
                value={paymentData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-blue-300 text-sm">
                💡 You will receive an SMS with payment instructions
              </div>
            </div>
          </div>
        );

      case 'sadapay':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">SadaPay Card Number</Label>
              <Input
                type="text"
                placeholder="4567 XXXX XXXX XXXX"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Expiry Date</Label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">CVV</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Account Number</Label>
              <Input
                type="text"
                placeholder="Enter your account number"
                value={paymentData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-green-300 text-sm">
                🏦 Transfer to: Sports Club Pakistan - Account: 1234567890
              </div>
            </div>
          </div>
        );

      case 'mastercard':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Cardholder Name</Label>
              <Input
                type="text"
                placeholder="Name on card"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Card Number</Label>
              <Input
                type="text"
                placeholder="5XXX XXXX XXXX XXXX"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Expiry Date</Label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">CVV</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-[#252525] text-white flex flex-col relative overflow-hidden rounded-[19px]">
      {/* Background Elements */}
      <div className="absolute top-[50px] right-8 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[100px] left-6 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
      
      {/* Header */}
      <div className="flex items-center p-6 pt-8 relative z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">Complete Payment</h1>
          <p className="text-white/60 text-sm">Secure & encrypted transaction</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-auto">
        {/* Order Summary */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">{sport.icon}</span>
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{sport.name} Membership</div>
                  <div className="text-white/60 text-sm capitalize">{pendingPurchase.tier} Plan • 365 Days</div>
                </div>
                <div className="text-white font-bold">Rs {price.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Processing Fee (2.5%)</span>
                <span className="text-white/60">Rs {processingFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#FFB948] font-bold text-lg">Rs {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Choose Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id}
                      className="text-[#A148FF] border-white/30"
                      disabled={isLoading}
                    />
                    <label 
                      htmlFor={method.id}
                      className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedMethod === method.id 
                          ? 'border-[#A148FF] bg-[#A148FF]/10' 
                          : 'border-white/20 hover:border-white/40 bg-white/5'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${method.color}20` }}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{method.name}</div>
                        <div className="text-white/60 text-xs">{method.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {selectedMethod && (
          <Card className="bg-white/10 border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment}>
                {renderPaymentForm()}
                
                {/* Security Notice */}
                <div className="mt-6 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="text-green-300 text-sm">
                    Your payment is secured with 256-bit SSL encryption
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-4 mt-6"
                  disabled={!selectedMethod || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Rs {total.toLocaleString()}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Benefits Reminder */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            What You Get
          </h3>
          <div className="space-y-2">
            {sport.services.map((service, index) => (
              <div key={typeof service === 'string' ? `s-${index}` : service.id} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-2 h-2 bg-[#FFB948] rounded-full"></div>
                <span>{typeof service === 'string' ? service : service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}