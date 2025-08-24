import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { ArrowLeft, CreditCard, Calendar, Clock, Users, Trophy, MapPin, Shield, CheckCircle, Star } from 'lucide-react';
import { type User, type Event } from '../types';

interface EventRegistrationScreenProps {
  user: User;
  event: Event;
  onPaymentSuccess: (paymentData: { method: string; amount: number; event: string; timestamp: string; data: any; }) => void;
  onBack: () => void;
  isLoading: boolean;
}

const PAYMENT_METHODS = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: '📱', color: '#00A651' },
  { id: 'jazzcash', name: 'JazzCash', icon: '💳', color: '#F04438' },
  { id: 'sadapay', name: 'SadaPay', icon: '🏦', color: '#6366F1' },
  { id: 'mastercard', name: 'MasterCard', icon: '💳', color: '#EB001B' }
];

export default function EventRegistrationScreen({ 
  user, 
  event, 
  onPaymentSuccess, 
  onBack, 
  isLoading 
}: EventRegistrationScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [tshirtSize, setTshirtSize] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const processingFee = Math.round(event.fee * 0.025);
  const total = event.fee + processingFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentInfo = {
      method: selectedMethod,
      amount: total,
      event: event.title,
      emergencyContact,
      medicalConditions,
      tshirtSize,
      dietaryRestrictions,
      data: paymentData,
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentInfo);
  };

  const getEventTypeIcon = () => {
    switch (event.type.toLowerCase()) {
      case 'tournament': return <Trophy className="w-6 h-6" />;
      case 'workshop': return <Star className="w-6 h-6" />;
      case 'league': return <Users className="w-6 h-6" />;
      case 'competition': return <Trophy className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
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
          <h1 className="text-xl font-bold text-white">Event Registration</h1>
          <p className="text-white/60 text-sm">Complete your registration</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-auto">
        {/* Event Details */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getEventTypeIcon()}
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#A148FF]" />
                  <div>
                    <div className="text-white/60 text-xs">Date</div>
                    <div className="text-white text-sm">{event.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFB948]" />
                  <div>
                    <div className="text-white/60 text-xs">Time</div>
                    <div className="text-white text-sm">{event.time}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-white/60 text-xs">Location</div>
                  <div className="text-white text-sm">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-white/60 text-xs">Participants</div>
                  <div className="text-white text-sm">
                    {event.participants}/{event.maxParticipants} registered
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-white/80 text-sm mb-2">Event Description</div>
                <p className="text-white/70 text-sm">{event.description}</p>
              </div>

              {event.requirements.length > 0 && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="text-orange-300 font-medium text-sm mb-2">Requirements</div>
                  <ul className="space-y-1">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="text-orange-300/80 text-sm flex items-start gap-2">
                        <span>•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.prizes.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="text-yellow-300 font-medium text-sm mb-2">🏆 Prizes</div>
                  <ul className="space-y-1">
                    {event.prizes.map((prize, index) => (
                      <li key={index} className="text-yellow-300/80 text-sm flex items-start gap-2">
                        <span>•</span>
                        <span>{prize}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Details */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Registration Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Emergency Contact *</Label>
              <Input
                type="tel"
                placeholder="Emergency contact number"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">T-Shirt Size *</Label>
              <select
                value={tshirtSize}
                onChange={(e) => setTshirtSize(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring-2 focus:ring-[#A148FF] focus:border-[#A148FF]"
                required
                disabled={isLoading}
              >
                <option value="" className="bg-[#252525]">Select size</option>
                <option value="XS" className="bg-[#252525]">XS</option>
                <option value="S" className="bg-[#252525]">S</option>
                <option value="M" className="bg-[#252525]">M</option>
                <option value="L" className="bg-[#252525]">L</option>
                <option value="XL" className="bg-[#252525]">XL</option>
                <option value="XXL" className="bg-[#252525]">XXL</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Medical Conditions (Optional)</Label>
              <Textarea
                placeholder="Any medical conditions we should know about..."
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none h-20"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Dietary Restrictions (Optional)</Label>
              <Input
                type="text"
                placeholder="e.g., Vegetarian, Allergies, etc."
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Registration Fee */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Registration Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Event Registration Fee</span>
                <span className="text-white font-bold">Rs {event.fee.toLocaleString()}</span>
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

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-4 mt-6"
                  disabled={!selectedMethod || !emergencyContact || !tshirtSize || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Register & Pay Rs {total.toLocaleString()}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Terms & Conditions */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Terms & Conditions
          </h3>
          <div className="space-y-2 text-xs text-white/60">
            <div>• Registration fee is non-refundable after 48 hours before event</div>
            <div>• Participants must arrive 30 minutes before event time</div>
            <div>• Event may be canceled due to weather or unforeseen circumstances</div>
            <div>• Medical fitness certificate may be required for some events</div>
            <div>• By registering, you accept all terms and conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
}