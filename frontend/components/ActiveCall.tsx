import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Grid, Volume2, Video, Bluetooth, Plus, Phone, Activity, ChevronDown, ChevronUp, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Scenario, TranscriptLine, Speaker } from '../types';
import { SUSPICIOUS_KEYWORDS } from '../services/scamScenario';

interface Props {
  scenario: Scenario;
  transcript: TranscriptLine[];
  onHangup: () => void;
  scamScore: number;
}

const ActiveCall: React.FC<Props> = ({ scenario, transcript, onHangup, scamScore }) => {
  const [duration, setDuration] = useState(0);
  const [isShieldOpen, setIsShieldOpen] = useState(true);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, isShieldOpen]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const highlightRiskyWords = (text: string) => {
    const parts = text.split(new RegExp(`(${SUSPICIOUS_KEYWORDS.map(k => k.word).join('|')})`, 'gi'));
    return parts.map((part, i) => {
        const isRisky = SUSPICIOUS_KEYWORDS.some(k => k.word.toLowerCase() === part.toLowerCase());
        return isRisky ? (
            <span key={i} className="text-orange-400 font-bold bg-orange-900/30 rounded px-1 border border-orange-500/30">
                {part}
            </span>
        ) : (
            <span key={i}>{part}</span>
        );
    });
  };

  return (
    <div className="w-full h-full flex flex-col pt-12 pb-12 relative bg-gray-900">
       <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black z-0"></div>

       <div className="absolute top-16 left-4 right-4 z-20 transition-all duration-300 ease-in-out">
            <div className={`
                bg-gray-800/80 backdrop-blur-xl rounded-2xl border shadow-lg overflow-hidden transition-all duration-300
                border-white/10 shadow-black/50
            `}>
                <button 
                    onClick={() => setIsShieldOpen(!isShieldOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center">
                        <div className="flex flex-col items-start">
                            <span className="text-[12px] font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                                Galaxy Call Sense
                            </span>
                            <span className={`text-[14px] tracking-wide font-bold ${scamScore > 70 ? 'text-red-400' : 'text-gray-100'}`}>
                                {scamScore > 70 ? 'Scam Detected' : 'Monitoring Call'} (Risk: {scamScore}%)
                            </span>
                        </div>
                    </div>
                    
                    {isShieldOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                <div className={`
                    border-t border-white/5 bg-black/20
                    transition-all duration-300 ease-in-out
                    ${isShieldOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div ref={transcriptRef} className="p-4 overflow-y-auto max-h-60 no-scrollbar space-y-3">
                        {transcript.length === 0 && (
                            <p className="text-center text-gray-500 text-xs italic py-4">Listening for conversation...</p>
                        )}
                        {transcript.map((line) => (
                            <div key={line.id} className="flex flex-col gap-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${line.speaker === Speaker.ME ? 'text-blue-400 self-end' : 'text-gray-400'}`}>
                                    {line.speaker}
                                </span>
                                <p className={`text-[12px] leading-relaxed ${line.speaker === Speaker.ME ? 'text-gray-300 text-right' : 'text-white'}`}>
                                    {line.speaker === Speaker.CALLER ? highlightRiskyWords(line.text) : line.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
       </div>

       <div className={`z-10 flex flex-col items-center mt-auto mb-16 transition-all duration-300 ${isShieldOpen ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
        <h2 className="text-2xl font-semibold text-white mb-2 mt-10">{scenario.callerName}</h2>
        <p className="text-gray-400 text-sm mb-4">{scenario.callerNumber}</p>
        <p className="text-white text-lg font-light tracking-wider">{formatTime(duration)}</p>
      </div>

      <div className="z-10 grid grid-cols-3 gap-y-8 gap-x-4 px-8 mb-12 place-items-center mt-auto">
        <ActionButton icon={<Video className="w-6 h-6" />} label="Video call" />
        <ActionButton icon={<Bluetooth className="w-6 h-6" />} label="Bluetooth" />
        <ActionButton icon={<Volume2 className="w-6 h-6" />} label="Speaker" />
        <ActionButton icon={<MicOff className="w-6 h-6" />} label="Mute" />
        <ActionButton icon={<Grid className="w-6 h-6" />} label="Keypad" />
        <ActionButton icon={<Plus className="w-6 h-6" />} label="Add call" />
      </div>

      <div className="z-10 flex justify-center mb-4">
        <button 
            onClick={onHangup}
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors active:scale-95"
        >
            <Phone className="w-6 h-6 text-white fill-white rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <div className="flex flex-col items-center gap-2">
        <button className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all
            ${active ? 'bg-green-500 text-white' : 'bg-gray-700/40 text-white hover:bg-gray-600/50'}
        `}>
            {icon}
        </button>
        <span className="text-xs text-gray-400">{label}</span>
    </div>
);

export default ActiveCall;