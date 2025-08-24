import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  QrCode, 
  Camera, 
  Scan, 
  AlertCircle, 
  CheckCircle,
  MapPin,
  Clock,
  Building,
  Zap,
  Target
} from 'lucide-react';
import { MOCK_FACILITIES } from '../constants';

interface QRScannerScreenProps {
  onScan: (qrCode: string) => void;
  onClose: () => void;
}

export default function QRScannerScreen({ onScan, onClose }: QRScannerScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate scanning animation
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 0;
          }
          return prev + 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleManualScan = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  const handleQuickScan = (facilityQR: string) => {
    setIsScanning(true);
    setTimeout(() => {
      onScan(facilityQR);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Camera View */}
      <Card className="bg-gradient-to-br from-[#A148FF]/10 to-[#FFB948]/10 border-white/20">
        <CardContent className="p-6">
          <div className="relative bg-black/60 rounded-xl h-56 flex items-center justify-center overflow-hidden border border-white/10">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A148FF]/20 to-[#FFB948]/20 animate-pulse"></div>
            
            {/* Enhanced Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-2 border-[#A148FF] rounded-2xl relative shadow-2xl">
                {/* Corner Indicators */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#FFB948] rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#FFB948] rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#FFB948] rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#FFB948] rounded-br-lg"></div>
                
                {/* Target Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#FFB948] rounded-full animate-ping opacity-50"></div>
                  <div className="absolute w-4 h-4 bg-[#FFB948] rounded-full animate-pulse"></div>
                </div>
                
                {/* Enhanced Scanning Line */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFB948] to-transparent shadow-lg transition-all duration-100"
                      style={{ 
                        top: `${scanProgress}%`,
                        boxShadow: '0 0 20px #FFB948, 0 0 40px #FFB948'
                      }}
                    >
                      <div className="h-full bg-[#FFB948] animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Icon or Status */}
            {!isScanning ? (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <Camera className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm">Position QR code in frame</span>
              </div>
            ) : (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <Scan className="w-5 h-5 text-[#FFB948] animate-pulse" />
                <span className="text-[#FFB948] text-sm font-medium">Scanning... {scanProgress}%</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Camera className="w-3 h-3 mr-1" />
                Camera Active
              </Badge>
              <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30">
                <Target className="w-3 h-3 mr-1" />
                Ready to Scan
              </Badge>
            </div>
            <div className="text-white/60 text-sm">
              Hold your device steady and align the QR code within the frame
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Manual Entry */}
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-[#FFB948]" />
            <Label className="text-white/80 font-medium">Manual QR Code Entry</Label>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Enter facility QR code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#A148FF] focus:ring-[#A148FF]"
            />
            <Button 
              onClick={handleManualScan}
              disabled={!manualCode.trim() || isScanning}
              className="bg-[#A148FF] hover:bg-[#A148FF]/90 px-6"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Demo Section */}
      <Card className="bg-gradient-to-r from-[#A148FF]/10 to-[#FFB948]/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#FFB948]" />
            <Label className="text-white font-medium">Quick Demo Facilities</Label>
            <Badge className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30 text-xs">
              Try Now
            </Badge>
          </div>
          <div className="space-y-3">
            {MOCK_FACILITIES.slice(0, 3).map((facility) => (
              <button
                key={facility.id}
                onClick={() => handleQuickScan(facility.qrCode)}
                disabled={isScanning}
                className="w-full group"
              >
                <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group-hover:border-[#A148FF]/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-lg flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium group-hover:text-[#FFB948] transition-colors">
                      {facility.name}
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{facility.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30 text-xs">
                      {facility.type}
                    </Badge>
                    <QrCode className="w-5 h-5 text-white/40 group-hover:text-[#FFB948] transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Instructions */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-blue-300 font-medium mb-2">
                Check-in Instructions
              </div>
              <div className="text-blue-200/80 text-sm space-y-1">
                <div>• Scan the QR code displayed at your sports facility</div>
                <div>• You must have an active membership for that specific sport</div>
                <div>• Maximum 30 check-ins allowed per month per membership</div>
                <div>• All check-ins are recorded in your membership history</div>
                <div>• Check-ins help track your facility usage and progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleQuickScan('QR_GYM_DHA_001')}
          disabled={isScanning}
          className="flex-1 bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 shadow-lg"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              <span>Quick Demo</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}