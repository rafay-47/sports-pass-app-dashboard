import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-[19px]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#A148FF] border-r-[#FFB948] rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <div className="text-white font-medium text-base mb-1">Processing...</div>
          <div className="text-white/60 text-sm">Setting up your membership</div>
        </div>
        
        {/* Animated Dots */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#A148FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#FFB948] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#A148FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}