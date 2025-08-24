import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { ArrowLeft, CreditCard, Calendar, Clock, Shield, CheckCircle, Star, User as UserIcon } from 'lucide-react';
import { type User, type ServicePurchase } from '../types';

interface ServicePurchaseScreenProps {
  user: User;
  service: ServicePurchase;
  onPaymentSuccess: (paymentData: { method: string; amount: number; service: string; timestamp: string; data: any; }) => void;
  onBack: () => void;
  isLoading: boolean;
}

const PAYMENT_METHODS = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: '📱', color: '#00A651' },
  { id: 'jazzcash', name: 'JazzCash', icon: '💳', color: '#F04438' },
  { id: 'sadapay', name: 'SadaPay', icon: '🏦', color: '#6366F1' },
  { id: 'mastercard', name: 'MasterCard', icon: '💳', color: '#EB001B' }
];

export default function ServicePurchaseScreen({ 
  user, 
  service, 
  onPaymentSuccess, 
  onBack, 
  isLoading 
}: ServicePurchaseScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const processingFee = Math.round(service.price * 0.025);
  const total = service.price + processingFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentInfo = {
      method: selectedMethod,
      amount: total,
      service: service.serviceName,
      date: selectedDate,
      time: selectedTime,
      specialRequests,
      data: paymentData,
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentInfo);
  };

  const getServiceIcon = () => {
    switch (service.type) {
      case 'booking': return <Calendar className="w-6 h-6" />;
  case 'session': return <UserIcon className="w-6 h-6" />;
      case 'consultation': return <CheckCircle className="w-6 h-6" />;
      case 'rental': return <Clock className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

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
                onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Card Number</Label>
              <Input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Expiry</Label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
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
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        );
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
          <h1 className="text-xl font-bold text-white">Book Service</h1>
          <p className="text-white/60 text-sm">Complete your booking</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-auto">
        {/* Service Summary */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getServiceIcon()}
              Service Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{service.serviceName}</div>
                  <div className="text-white/60 text-sm">{service.description}</div>
                  <div className="text-white/60 text-sm">Duration: {service.duration}</div>
                </div>
                <div className="text-white font-bold">Rs {service.price.toLocaleString()}</div>
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

        {/* Booking Details */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Preferred Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  required
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Preferred Time</Label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring-2 focus:ring-[#A148FF] focus:border-[#A148FF]"
                  required
                  disabled={isLoading}
                >
                  <option value="" className="bg-[#252525]">Select time</option>
                  <option value="09:00" className="bg-[#252525]">09:00 AM</option>
                  <option value="10:00" className="bg-[#252525]">10:00 AM</option>
                  <option value="11:00" className="bg-[#252525]">11:00 AM</option>
                  <option value="14:00" className="bg-[#252525]">02:00 PM</option>
                  <option value="15:00" className="bg-[#252525]">03:00 PM</option>
                  <option value="16:00" className="bg-[#252525]">04:00 PM</option>
                  <option value="17:00" className="bg-[#252525]">05:00 PM</option>
                  <option value="18:00" className="bg-[#252525]">06:00 PM</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Special Requests (Optional)</Label>
              <Textarea
                placeholder="Any specific requirements or preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none h-20"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Payment Method</CardTitle>
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
                      <div>
                        <div className="text-white font-medium">{method.name}</div>
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
                <div className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="text-green-300 text-sm">
                    Your payment is secured with 256-bit SSL encryption
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-4 mt-6"
                  disabled={!selectedMethod || !selectedDate || !selectedTime || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
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

        {/* Booking Policy */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Booking Policy
          </h3>
          <div className="space-y-2 text-xs text-white/60">
            <div>• Free cancellation up to 24 hours before scheduled time</div>
            <div>• Service provider will contact you to confirm details</div>
            <div>• Rescheduling available subject to availability</div>
            <div>• Full refund for cancellations made 24+ hours in advance</div>
          </div>
        </div>
      </div>
    </div>
  );
}