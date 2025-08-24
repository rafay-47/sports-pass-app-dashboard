import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { type Sport } from '../App';

interface SportsSelectorProps {
  sports: Sport[];
  selectedSport: string | null;
  ownedSports: string[];
  onSelectSport: (sportId: string) => void;
  isLoading?: boolean;
}

export default function SportsSelector({ 
  sports, 
  selectedSport, 
  ownedSports, 
  onSelectSport,
  isLoading = false
}: SportsSelectorProps) {
  const [touchedSport, setTouchedSport] = useState<string | null>(null);

  const handleSportClick = (sportId: string) => {
    if (isLoading) return;
    
    setTouchedSport(sportId);
    setTimeout(() => setTouchedSport(null), 200);
    onSelectSport(sportId);
  };

  return (
    <div className="mb-6">
      {/* Sports Selection Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-medium">Sports Collection</h3>
        <div className="text-white/60 text-xs">
          {ownedSports.length} purchased • {sports.length - ownedSports.length} available
        </div>
      </div>

      {/* Sports Selection Circles */}
      <div className="flex justify-between items-center">
        {sports.map((sport) => {
          const isOwned = ownedSports.includes(sport.id);
          const isSelected = selectedSport === sport.id;
          const isTouched = touchedSport === sport.id;
          
          return (
            <div key={sport.id} className="flex flex-col items-center group">
              <button
                onClick={() => handleSportClick(sport.id)}
                disabled={isLoading}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                } ${
                  isTouched ? 'scale-95' : ''
                } ${
                  isOwned 
                    ? 'bg-gradient-to-br from-[#FFB948] to-[#FFB948]/80 shadow-lg shadow-[#FFB948]/30' 
                    : isSelected 
                      ? 'bg-gradient-to-br from-[#FFB948]/80 to-[#FFB948]/60 shadow-md shadow-[#FFB948]/20' 
                      : 'bg-gradient-to-br from-[#A148FF]/66 to-[#A148FF]/50 hover:from-[#A148FF]/80 hover:to-[#A148FF]/60'
                }`}
              >
                {/* Sport Icon */}
                <span className={`transition-transform duration-300 ${isSelected || isOwned ? 'scale-110' : ''}`}>
                  {sport.icon}
                </span>
                
                {/* Owned Indicator */}
                {isOwned && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Selected Indicator (for non-owned) */}
                {isSelected && !isOwned && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#A148FF] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
                
                {/* Selection Ring */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-full border-2 animate-pulse ${
                    isOwned ? 'border-green-400' : 'border-[#FFB948]'
                  }`}></div>
                )}
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isLoading ? 'group-hover:opacity-0' : ''}`}></div>
              </button>
              
              {/* Sport Name */}
              <span className={`text-xs mt-2 text-center leading-tight transition-all duration-300 ${
                isSelected && isOwned ? 'font-bold text-green-400' :
                isSelected ? 'font-bold text-[#FFB948]' : 
                isOwned ? 'font-medium text-white' :
                'text-white/80'
              } ${
                isLoading ? 'opacity-50' : 'group-hover:text-white'
              }`}>
                {sport.name === 'Table Tennis' ? (
                  <>
                    <div>Table</div>
                    <div>Tennis</div>
                  </>
                ) : (
                  sport.name
                )}
              </span>
              
              {/* Status Indicators */}
              <div className="mt-1 flex flex-col items-center gap-1">
                {isOwned && (
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                )}
                {isSelected && !isOwned && (
                  <div className="w-2 h-2 rounded-full bg-[#FFB948] animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Selection Helper */}
      {ownedSports.length > 0 && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-white/70 text-xs text-center">
            💡 Tip: Click any sport icon above to view its membership card and services
          </div>
        </div>
      )}
    </div>
  );
}