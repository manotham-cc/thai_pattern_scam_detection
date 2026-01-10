export enum CallState {
  IDLE = 'IDLE',
  INCOMING = 'INCOMING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED'
}

export enum Speaker {
  CALLER = 'Caller',
  ME = 'Me'
}

export interface TranscriptLine {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
}

export interface Scenario {
  id: string;
  name: string;
  callerName: string;
  callerNumber: string;
  riskLevel: string;
  Indicator?: string;
  Reason?: string;
  script: Array<{ speaker: Speaker; text: string; delay: number }>;
}

export interface ScamAnalysisResult {
  score: number;
  reasons: string[];
  isScam: boolean;
}