import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, PhoneOff, Ban } from 'lucide-react';
import { ScamAnalysisResult } from '../types';

interface Props {
  result: ScamAnalysisResult;
  onBlock: () => void;
  onHangup: () => void;
  onDismiss: () => void;
}

const ScamAlert: React.FC<Props> = ({ result, onBlock, onHangup, onDismiss }) => {

  const [timeLeft, setTimeLeft] = useState(10);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleConfirm();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onDismiss]);

  const handleConfirm = () => {
    setIsShared(true);
    setTimeout(() => {
      onDismiss();
    }, 8000);
  };

  return (
    <div className="absolute top-16 left-4 right-4 z-50 animate-slide-down">
      <div className={`backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-5 ${
        isShared 
          ? 'bg-green-950/90 border border-green-500/30' 
          : 'bg-red-950/90 border border-red-500/30'
      }`}>
        
        <div className="flex items-start gap-4">
            <div className="flex-1">
                <h3 className="text-white font-semibold leading-tight">
                  {isShared ? 'Live Transcript Shared' : 'Possible Scam Detected'}
                </h3>
                <p className={`text-[14px] mt-2 ${ isShared ? 'text-green-200' : 'text-red-200'}`}>
                  {isShared ? 'Your friends can now view the live transcript of this call.' : 'Share Live Transcript to Your Friends'}
                </p>
            </div>

            {isShared && (
            <button 
              onClick={onDismiss}
              className="text-white/50 hover:text-white p-1 -mt-2"
            >
              ✕
            </button>
            )}
        </div>

        {!isShared && (
        <div className="flex gap-3 mt-5">
            <button 
                onClick={onDismiss}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 px-4 rounded-xl text-[13px] font-medium flex items-center justify-center transition-colors border border-white/10"
            >
                Cancel
            </button>
            <button 
                onClick={handleConfirm}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 px-4 rounded-xl text-[13px] font-medium flex items-center justify-center transition-colors"
            >
                Confirm ({timeLeft}s)
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default ScamAlert;