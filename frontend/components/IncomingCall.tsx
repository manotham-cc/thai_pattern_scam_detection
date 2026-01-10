import React from 'react';
import { Phone } from 'lucide-react';
import { Scenario } from '../types';

interface Props {
  scenario: Scenario;
  onAnswer: () => void;
  onDecline: () => void;
}

const IncomingCall: React.FC<Props> = ({ scenario, onAnswer, onDecline }) => {
  return (
    <div className="w-full h-full flex flex-col pt-32 pb-20 px-8 relative bg-gradient-to-b from-gray-900 via-gray-800 to-black animate-fade-in">
      <div className="absolute inset-0 overflow-hidden z-0">
         <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-blue-900/20 blur-[100px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[50%] bg-purple-900/20 blur-[80px] rounded-full"></div>
      </div>

      <div className="z-10 flex flex-col items-center flex-grow">
        <p className="text-white text-sm font-medium -mt-16 mb-12">Incoming call</p>
        <h2 className="text-3xl font-light mb-2 text-center">{scenario.callerName}</h2>
        <p className="text-gray-400 text-lg font-light">{scenario.callerNumber}</p>
      </div>

      <div className="z-10 w-full flex justify-between items-center px-10 mt-auto">
         <div className="flex flex-col items-center gap-4">
            <button 
                onClick={onAnswer}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-400 transition-colors active:scale-95"
            >
                <Phone className="w-6 h-6 text-white fill-white" />
            </button>
            <span className="text-sm font-medium text-gray-300">Accept</span>
         </div>

         <div className="flex flex-col items-center gap-2">
            <button 
                onClick={onDecline}
                className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors active:scale-95"
            >
                <Phone className="w-6 h-6 text-white fill-white rotate-[135deg]" />
            </button>
            <span className="text-sm font-medium text-gray-300">Decline</span>
         </div>
      </div>
    </div>
  );
};

export default IncomingCall;