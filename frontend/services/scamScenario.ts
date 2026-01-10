import { ScamAnalysisResult, TranscriptLine, Speaker, Scenario } from '../types';

export const SUSPICIOUS_KEYWORDS = [
  { word: 'ร้อยโท', weight: 8 },
  { word: 'สภ.', weight: 10 },
  { word: 'คดี', weight: 5 },
  { word: 'ฟอกเงิน', weight: 25 },
  { word: 'ตรวจสอบบัญชี', weight: 11 },
  { word: 'อายัด', weight: 10 },
  { word: 'ปปง.', weight: 15 },
  { word: 'แอดไลน์', weight: 10 },
  { word: 'ผิดกฎหมาย', weight: 20 },
  { word: 'โอนเงิน', weight: 20 },
  { word: 'บัญชีกองกลาง', weight: 10 },
  { word: 'เลขบัญชี', weight: 10 }
];

export const analyzeConversation = (transcript: TranscriptLine[]): ScamAnalysisResult => {
  let score = 0;
  const reasons: Set<string> = new Set();
  
  const callerLines = transcript.filter(line => line.speaker === Speaker.CALLER);
  
  const fullText = callerLines.map(line => line.text.toLowerCase()).join(' ');

  SUSPICIOUS_KEYWORDS.forEach(({ word, weight }) => {
    if (fullText.includes(word)) {
      score += weight;
      reasons.add(word);
    }
  });

  score = Math.min(score, 100);
  const isScam = score >= 70;

  return {
    score,
    reasons: Array.from(reasons),
    isScam
  };
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'scam-police',
    name: 'Scammer',
    callerName: 'เบอร์ที่ไม่รู้จัก',
    callerNumber: '+697 02 123 4567',
    riskLevel: 'High risk',
    Indicator: 'คุณเป็นผู้ต้องหาคดีฟอกเงิน, เรายึดพัสดุผิดกฎหมายได้, คนรับเขาสารภาพว่าโอนเงินเข้าบัญชีกสิกรของคุณ เลขบัญชี xxx-x-xxxxx-x, โอนเงินเข้าบัญชีกองกลางมาตรวจสอบ',
    Reason: 'การแอบอ้างเป็นเจ้าหน้าที่รัฐ พร้อมใช้การข่มขู่ด้วยคดีอาญาร้ายแรง และอ้างอิงข้อมูลส่วนบุคคล เช่น เลขบัญชีธนาคารของผู้เสียหาย เพื่อสร้างความน่าเชื่อถือและหลอกลวงให้โอนเงิน',
    script: [
      { 
        speaker: Speaker.CALLER, 
        text: "สวัสดีครับ ผมร้อยโทภาคภูมิ โทรจาก สภ.เมืองเชียงใหม่ครับ", 
        delay: 1500 
      },
      { 
        speaker: Speaker.ME, 
        text: "สวัสดีครับ มีอะไรหรือเปล่าครับ", 
        delay: 4000 
      },
      { 
        speaker: Speaker.CALLER, 
        text: "คือตอนนี้ชื่อคุณตกเป็นผู้ต้องหาคดีฟอกเงินครับ", 
        delay: 7000 
      },
      { 
        speaker: Speaker.ME, 
        text: "ห้ะ คดีอะไรครับ ผมไม่รู้เรื่องเลย", 
        delay: 11000 
      },
      { 
        speaker: Speaker.CALLER, 
        text: "เรายึดพัสดุผิดกฎหมายได้ คนรับเขาสารภาพว่าโอนเงินเข้าบัญชีกสิกรของคุณ เลขบัญชี 213-3-84576-9 ครับ", 
        delay: 14000 
      },
      { 
        speaker: Speaker.ME, 
        text: "เฮ้ย นั่นบัญชีธนาคารของผม จะไปเกี่ยวได้ไง", 
        delay: 18000 
      },
      { 
        speaker: Speaker.CALLER, 
        text: "ถ้าคุณบริสุทธิ์ใจ ทาง ปปง. เขาต้องตรวจสอบเส้นทางการเงิน เดี๋ยวให้คุณโอนเงินเข้าบัญชีกองกลางมาตรวจสอบก่อนเลย ภายใน 15 นาทีนี้", 
        delay: 22000 
      },
      { 
        speaker: Speaker.CALLER, 
        text: "แอดไลน์ไอดี Police_CM มาเลยครับ เดี๋ยวผมส่งเลขบัญชีของกองกลางให้", 
        delay: 26000 
      }
    ]
  },
  {
    id: 'safe-friend',
    name: 'Friend',
    callerName: 'ตั้ม',
    callerNumber: '081-999-0451',
    riskLevel: 'Low risk',
    Indicator: '',
    Reason: '',
    script: [
      { speaker: Speaker.CALLER, text: "เฮ้ยเพื่อน! เย็นนี้ว่างป่าว?", delay: 1000 },
      { speaker: Speaker.ME, text: "ว่างดิ มีไรเปล่า", delay: 3000 },
      { speaker: Speaker.CALLER, text: "จะชวนไปกินหมูกระทะร้านเดิม แถวลาดพร้าว หิวว่ะ", delay: 5000 },
      { speaker: Speaker.ME, text: "ได้เลย กี่โมงดีวะ", delay: 8000 },
      { speaker: Speaker.CALLER, text: "สักทุ่มนึง เจอกันหน้าร้าน เดี๋ยวจองโต๊ะไว้ให้", delay: 10000 },
    ]
  },
];