import React, { useState, useEffect, useRef } from 'react';
import S25Frame from './components/SmartphoneFrame';
import IncomingCall from './components/IncomingCall';
import ActiveCall from './components/ActiveCall';
import ScamAlert from './components/ScamAlert';
import BlockchainReport from './components/BlockchainReport';
import { CallState, Scenario, TranscriptLine, ScamAnalysisResult } from './types';
import { SCENARIOS, analyzeConversation } from './services/scamScenario';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult>({ score: 0, reasons: [], isScam: false });
  const [showPopup, setShowPopup] = useState(false);
  const [showBlockchainReport, setShowBlockchainReport] = useState(false);

  const alertShownRef = useRef(false);
  
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCallState(CallState.INCOMING);
    setTranscript([]);
    setAnalysisResult({ score: 0, reasons: [], isScam: false });
    setShowPopup(false);
    alertShownRef.current = false;
    setShowBlockchainReport(false);
    clearTimeouts();
  };

  const handleAnswer = () => {
    if (selectedScenario) {
      setCallState(CallState.ACTIVE);
      runSimulation(selectedScenario);
    }
  };

  const handleHangup = () => {
    const wasScam = analysisResult.isScam || analysisResult.score >= 70;
    setCallState(CallState.ENDED);
    clearTimeouts();
    
    if (wasScam) {
      setTimeout(() => {
        setShowBlockchainReport(true);
      }, 1000);
    } else {
      setTimeout(() => {
          setCallState(CallState.IDLE);
          setSelectedScenario(null);
      }, 2000);
    }
  };

  const clearTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const runSimulation = (scenario: Scenario) => {
    const startTime = Date.now();
    
    scenario.script.forEach((line, index) => {
      const timeout = setTimeout(() => {
        const newLine: TranscriptLine = {
            id: `msg-${index}`,
            speaker: line.speaker,
            text: line.text,
            timestamp: Date.now()
        };
        
        setTranscript(prev => {
            const newTranscript = [...prev, newLine];
            const result = analyzeConversation(newTranscript);
            setAnalysisResult(result);
            
            if (result.isScam && !alertShownRef.current) {
                setShowPopup(true);
                alertShownRef.current = true;
            }
            
            return newTranscript;
        });

      }, line.delay);
      
      timeoutRefs.current.push(timeout);
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 p-8">
      
      <div className="w-[80%] md:w-[30rem] space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Demo: Galaxy Call Sense</h1>
            <p className="text-gray-600 text-sm mb-6">
                Real-time AI-powered call risk detection with intelligent scam alerts displayed as a non-intrusive system overlay during live calls without interrupting the call experience.
            </p>

            <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Select Scenario</p>
                {SCENARIOS.map(scenario => (
                    <button
                        key={scenario.id}
                        onClick={() => startScenario(scenario)}
                        disabled={callState !== CallState.IDLE}
                        className={`w-full p-4 rounded-xl text-left transition-all border-2
                            ${selectedScenario?.id === scenario.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}
                            ${callState !== CallState.IDLE ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-800">{scenario.name}</span>
                            <span className={`text-[12px] px-3 py-1 rounded-full font-bold
                                ${scenario.riskLevel === 'High risk' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
                            `}>
                                {scenario.riskLevel}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{scenario.script[0].text}</p>
                    </button>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-500 mt-[3px] flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-700">How it works</h4>
                        <div className="text-sm text-gray-500 mt-1">
                            <p className="leading-[2]">1. Transcribes the call and separates both voices.</p>
                            <p className="leading-[2]">2. Flags suspicious keywords.</p>
                            <p className="leading-[2]">3. Detects risky call patterns.</p>
                            <p className="leading-[2]">4. Alerts if a scam risk is found.</p>
                            <p className="leading-[2]">5. Share live transcript to your friends.</p>
                            <p className="leading-[2]">6. Share anonymous scam patterns to blockchain.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <S25Frame>
        {callState === CallState.IDLE && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8 text-center">
                <p className="text-lg">Waiting for incoming call...</p>
                <p className="text-sm mt-2 opacity-60">Select a scenario from the control panel</p>
            </div>
        )}

        {callState === CallState.INCOMING && selectedScenario && (
            <IncomingCall 
                scenario={selectedScenario} 
                onAnswer={handleAnswer}
                onDecline={handleHangup}
            />
        )}

        {callState === CallState.ACTIVE && selectedScenario && (
            <>
                <ActiveCall 
                    scenario={selectedScenario} 
                    transcript={transcript}
                    onHangup={handleHangup}
                    scamScore={analysisResult.score}
                />
                
                
                {showPopup && (
                    <ScamAlert 
                        result={analysisResult}
                        onBlock={handleHangup}
                        onHangup={handleHangup}
                        onDismiss={() => setShowPopup(false)}
                    />
                )}
            </>
        )}

        {callState === CallState.ENDED && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 relative">
                {!showBlockchainReport ? (
                  <p className="text-lg font-light tracking-wide animate-pulse">Call Ended</p>
                ) : (
                  <BlockchainReport 
                    scenario={selectedScenario}
                    onComplete={() => {
                      setCallState(CallState.IDLE);
                      setSelectedScenario(null);
                      setShowBlockchainReport(false);
                    }}
                  />
                )}
            </div>
        )}
      </S25Frame>

    </div>
  );
};

export default App;