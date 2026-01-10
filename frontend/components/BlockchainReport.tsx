import React, { useState } from 'react';
import { Share2, ShieldAlert, CheckCircle2, Lock, Database } from 'lucide-react';
import { ScamAnalysisResult, TranscriptLine } from '../types';

interface Props {
  result: ScamAnalysisResult;
  transcript: TranscriptLine[];
  onComplete: () => void;
}

const BlockchainReport: React.FC<Props> = ({ scenario, onComplete }) => {
  const [step, setStep] = useState<'prompt' | 'sending' | 'success'>('prompt');

  const handleShare = () => {
    setStep('sending');
    setTimeout(() => {
      setStep('success');
    }, 4000);
  };

  if (step === 'success') {
    return (
      <div className="w-full animate-fade-in flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Scam Pattern Shared</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The conversation pattern has been hashed and uploaded to the blockchain.
        </p>
        <button 
          onClick={onComplete}
          className="w-full bg-white text-black text-sm py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Finish
        </button>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="w-full animate-fade-in flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <Database className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-xl font-bold mb-2">Hashing Patterns...</h3>
        <p className="text-gray-400 text-sm">Anonymizing and securing data with advanced privacy protection.</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-slide-up flex flex-col h-full pt-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-lg font-bold text-white">Help Protect Others</h2>
        <p className="text-gray-400 text-sm mt-2 px-4">
          Would you like to share the detected scam patterns with Galaxy Call Sense network?
        </p>
      </div>

      {scenario && (scenario.Indicator || scenario.Reason) && (
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 px-2 mb-6">
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
           <h4 className="text-[12px] font-bold text-gray-400 mb-2 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Anonymous Scam Patterns
           </h4>
           <p className="text-sm text-white leading-[1.5]">{scenario.Indicator}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
           <h4 className="text-[12px] font-bold text-gray-400 mb-2">Reason from AI</h4>
           <p className="text-sm text-white leading-[1.5]">{scenario.Reason}</p>
        </div>
      </div>
      )}

      <div className="space-y-1 mt-auto">
        <button 
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-5 h-5" />
          Share to Blockchain
        </button>
        <button 
          onClick={onComplete}
          className="w-full py-4 text-gray-400 font-medium text-sm hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default BlockchainReport;