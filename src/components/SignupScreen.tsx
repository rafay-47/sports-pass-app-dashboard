import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Eye, EyeOff, Mail, User, Phone, Lock } from 'lucide-react';
import { SPORTS } from '../constants';

interface SignupScreenProps {
  onSignup: (userData: { name: string; email: string; phone: string; password: string; user_role: string }) => void;
  onLogin: (userData: { email: string; password: string }) => void;
  onBack: () => void;
  isLoading: boolean;
  pendingPurchase: { sportId: string; tier: 'basic' | 'standard' | 'premium' } | null;
}

export default function SignupScreen({ onSignup, onLogin, onBack, isLoading, pendingPurchase }: SignupScreenProps) {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const sport = pendingPurchase ? SPORTS.find(s => s.id === pendingPurchase.sportId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      onSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        user_role: 'owner'
      });
    } else {
      onLogin({
        email: formData.email,
        password: formData.password
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-white/60 text-sm">
            {isSignup ? 'Join our sports community' : 'Sign in to continue'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        {/* Pending Purchase Info */}
        {pendingPurchase && sport && (
          <Card className="bg-white/10 border-white/20 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${sport.color}30` }}
                >
                  {sport.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{sport.name} Membership</div>
                  <div className="text-white/60 text-sm capitalize">{pendingPurchase.tier} Plan</div>
                </div>
                <Badge 
                  className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30"
                >
                  Pending
                </Badge>
              </div>
              <div className="mt-3 text-center text-white/70 text-sm">
                {isSignup ? 'Create an account' : 'Sign in'} to complete your purchase
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sign Up / Sign In Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF]"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignup ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Toggle between Sign Up and Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                className="text-[#FFB948] hover:text-[#FFB948]/80 text-sm font-medium"
                disabled={isLoading}
              >
                {isSignup 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>

            {/* Terms and Privacy */}
            {isSignup && (
              <div className="mt-4 text-center text-xs text-white/60">
                By signing up, you agree to our{' '}
                <span className="text-[#A148FF] hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#A148FF] hover:underline cursor-pointer">Privacy Policy</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-3 text-center">Why Join Us?</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-2 h-2 bg-[#A148FF] rounded-full"></div>
              <span>Access to premium sports facilities</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-2 h-2 bg-[#FFB948] rounded-full"></div>
              <span>Exclusive member discounts and offers</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Community events and tournaments</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}