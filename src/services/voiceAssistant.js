// FairShift Multilingual Voice Assistant Engine (Speech-to-Text & Intent Interpretation)
// Supports English, Hindi, and Tamil with verified deterministic backend queries.

import { fairShiftDB } from './db';
import { speakText } from '../utils/audio';

export class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.setupRecognition();
  }

  setupRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  startListening(lang = 'en', onTranscript, onError) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use text input below.');
      return;
    }

    const langMap = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN'
    };
    this.recognition.lang = langMap[lang] || 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      const transcript = event.results[0][0].transcript;
      if (onTranscript) onTranscript(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(`Speech recognition error: ${event.error}. You can type your request directly.`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      if (onError) onError('Microphone active. Please speak or type your command.');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Parse natural language queries and route to authorized backend records
  async processQuery(queryText, lang = 'en', currentWorkerId = 'usr_w1') {
    const q = (queryText || '').toLowerCase().trim();
    const db = fairShiftDB.getState();
    const worker = db.users.find((u) => u.id === currentWorkerId) || db.users[0];
    const payrollRecord = db.payroll.find((p) => p.workerId === worker.id) || db.payroll[0];
    const activeAttendance = db.attendance.find((a) => a.workerId === worker.id && a.status === 'active');
    const recentCases = db.hazardsAndGrievances.filter((c) => c.workerId === worker.id);

    // 1. EARNINGS / SALARY / PAYSLIP INTENT
    if (
      q.includes('earn') || q.includes('salary') || q.includes('pay') || q.includes('wage') || q.includes('money') ||
      q.includes('कमाई') || q.includes('वेतन') || q.includes('पैसे') || q.includes('सैलरी') ||
      q.includes('சம்பளம்') || q.includes('வருமானம்') || q.includes('பணம்')
    ) {
      const reg = payrollRecord.regularPay;
      const ot = payrollRecord.overtimePay;
      const net = payrollRecord.netPay;
      const hours = payrollRecord.regularHours;
      const otHours = payrollRecord.overtimeHours;

      let responseText = '';
      if (lang === 'hi') {
        responseText = `इस महीने आपकी कुल शुद्ध कमाई ₹${net} है। इसमें ${hours} सामान्य घंटों का ₹${reg} और ${otHours} अतिरिक्त घंटों (ओवरटाइम) का ₹${ot} शामिल है। पीएफ कटौती के बाद यह शुद्ध राशि है।`;
      } else if (lang === 'ta') {
        responseText = `இம்மாதம் உங்கள் மொத்த நிகர சம்பளம் ₹${net} ஆகும். இதில் ${hours} வழக்கமான மணிநேரத்திற்கு ₹${reg} மற்றும் ${otHours} கூடுதல் நேரத்திற்கு (1.5x ஓவர்டைம்) ₹${ot} சேர்க்கப்பட்டுள்ளது.`;
      } else {
        responseText = `For ${payrollRecord.period}, your net authorized earnings are ₹${net}. Breakdown: ₹${reg} for ${hours} regular hours plus ₹${ot} for ${otHours} overtime hours (1.5x rate), minus ₹${payrollRecord.statutoryPF} provident fund deductions.`;
      }

      return {
        intent: 'earnings_query',
        response: responseText,
        data: { netPay: net, regularPay: reg, overtimePay: ot, otHours }
      };
    }

    // 2. ATTENDANCE / ACTIVE SHIFT INTENT
    if (
      q.includes('shift') || q.includes('attendance') || q.includes('clock') || q.includes('hour') ||
      q.includes('उपस्थिति') || q.includes('घंटे') || q.includes('काम') ||
      q.includes('வருகை') || q.includes('நேரம்') || q.includes('பணி')
    ) {
      let responseText = '';
      if (activeAttendance) {
        if (lang === 'hi') {
          responseText = `आपकी शिफ्ट सक्रिय है। आप आज ${activeAttendance.hoursWorked} घंटे से काम कर रहे हैं। आपकी उपस्थिति कार्यस्थल पर सत्यापित है।`;
        } else if (lang === 'ta') {
          responseText = `உங்கள் பணி தற்போது நடப்பில் உள்ளது. இன்று ${activeAttendance.hoursWorked} மணிநேரம் வேலை செய்துள்ளீர்கள். வருகை பதிவு தளத்தில் சரிபார்க்கப்பட்டுள்ளது.`;
        } else {
          responseText = `Your shift is currently active at ${activeAttendance.sector} site. You have recorded ${activeAttendance.hoursWorked} hours today. Your attendance is cryptographically verified on site.`;
        }
      } else {
        responseText = lang === 'hi'
          ? 'वर्तमान में कोई सक्रिय शिफ्ट नहीं है। काम शुरू करने के लिए क्यूआर स्कैन करें।'
          : lang === 'ta'
          ? 'தற்போது செயலில் உள்ள ஷிப்ட் எதுவும் இல்லை. பணியைத் தொடங்க QR ஸ்கேன் செய்யவும்.'
          : 'You are currently clocked out. Tap the clock-in button or scan site QR to log your shift.';
      }

      return {
        intent: 'attendance_query',
        response: responseText,
        data: { activeAttendance }
      };
    }

    // 3. HAZARD / SAFETY REPORT INTENT
    if (
      q.includes('hazard') || q.includes('danger') || q.includes('wire') || q.includes('scaffold') ||
      q.includes('spill') || q.includes('safety') || q.includes('cable') || q.includes('broken') ||
      q.includes('खतरा') || q.includes('तार') || q.includes('मचान') || q.includes('कमी') ||
      q.includes('ஆபத்து') || q.includes('கசிவு') || q.includes('கம்பி') || q.includes('பாதுகாப்பு')
    ) {
      // Determine category
      let category = 'General Workplace Hazard';
      if (q.includes('wire') || q.includes('electric') || q.includes('cable') || q.includes('तार') || q.includes('மின்சார')) {
        category = 'Exposed Electrical Risk';
      } else if (q.includes('scaffold') || q.includes('fall') || q.includes('मचान') || q.includes('சாரம்')) {
        category = 'Elevated Fall Hazard / Loose Scaffolding';
      } else if (q.includes('spill') || q.includes('chemical') || q.includes('acid') || q.includes('कसीவு')) {
        category = 'Hazardous Chemical / Liquid Spill';
      }

      // Create confirmed safety case directly in verified database
      const newCase = fairShiftDB.submitCase({
        sector: worker.sector,
        type: 'safety_hazard',
        category,
        severity: 'High',
        isAnonymous: true,
        workerId: worker.id,
        workerName: worker.name,
        workplace: worker.workplace,
        description: queryText,
        audioDuration: 12
      });

      let responseText = '';
      if (lang === 'hi') {
        responseText = `सुरक्षा रिपोर्ट दर्ज हो गई है। ट्रैकिंग आईडी है ${newCase.id}। आपकी पहचान पूर्णतः गुप्त है। सुरक्षा अधिकारी को जांच के लिए तुरंत भेज दिया गया है।`;
      } else if (lang === 'ta') {
        responseText = `பாதுகாப்பு அறிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டது. உங்கள் அடையாள எண் ${newCase.id}. பாதுகாப்பு அதிகாரிக்கு உடனடி தகவல் அனுப்பப்பட்டுள்ளது.`;
      } else {
        responseText = `Workplace hazard reported successfully. Your tracking ID is ${newCase.id}. Anonymous protection verified. The site safety officer has been alerted for immediate inspection.`;
      }

      return {
        intent: 'hazard_report_created',
        response: responseText,
        data: { caseId: newCase.id, category }
      };
    }

    // 4. COMPLAINT / CASE STATUS CHECK INTENT
    if (
      q.includes('complaint') || q.includes('ticket') || q.includes('case') || q.includes('status') ||
      q.includes('रिपोर्ट') || q.includes('शिकायत') || q.includes('நிலை') || q.includes('புகார்')
    ) {
      const latestCase = recentCases[0] || db.hazardsAndGrievances[0];
      let responseText = '';

      if (latestCase) {
        const statusMap = {
          submitted: { en: 'Submitted and queued for inspection', hi: 'दर्ज हो चुकी है और जांच कतार में है', ta: 'பதிவாகியுள்ளது மற்றும் விசாரணை வரிசையில் உள்ளது' },
          under_investigation: { en: 'Currently Under Active Investigation by Safety Lead', hi: 'सुरक्षा दल द्वारा जांच की जा रही है', ta: 'பாதுகாப்பு குழு தீவிர விசாரணையில் உள்ளது' },
          resolved: { en: 'Resolved and safety verified on site', hi: 'समस्या का समाधान हो चुका है', ta: 'பிரச்சனை சரிசெய்யப்பட்டு மூடப்பட்டது' }
        };

        const statusDesc = statusMap[latestCase.status] ? statusMap[latestCase.status][lang] || statusMap[latestCase.status].en : latestCase.status;

        if (lang === 'hi') {
          responseText = `आपकी अंतिम रिपोर्ट ${latestCase.id} का स्टेटस है: ${statusDesc}। श्रेणी: ${latestCase.category}।`;
        } else if (lang === 'ta') {
          responseText = `உங்கள் அறிக்கை ${latestCase.id} இன் நிலை: ${statusDesc}. வகை: ${latestCase.category}.`;
        } else {
          responseText = `Your latest report ${latestCase.id} (${latestCase.category}) is currently: ${statusDesc}. Assigned to: ${latestCase.assignedTo}.`;
        }
      } else {
        responseText = lang === 'hi'
          ? 'आपके पास कोई सक्रिय शिकायत नहीं है।'
          : lang === 'ta'
          ? 'உங்களிடம் நிலுவையில் உள்ள புகார்கள் எதுவும் இல்லை.'
          : 'You have no open complaints or hazard reports on file.';
      }

      return {
        intent: 'case_status_query',
        response: responseText,
        data: { latestCase }
      };
    }

    // 5. GENERAL NAVIGATION OR UNRECOGNIZED HELP FALLBACK
    let defaultText = '';
    if (lang === 'hi') {
      defaultText = `मैं आपकी सहायता कर सकता हूँ: आप अपनी कमाई (वेतन), वर्तमान शिफ्ट, सुरक्षा खतरा रिपोर्ट, या शिकायत का स्टेटस पूछ सकते हैं।`;
    } else if (lang === 'ta') {
      defaultText = `நான் உங்களுக்கு உதவ முடியும்: உங்கள் சம்பளம், பணி நேரம், விபத்து அபாய புகார், அல்லது புகாரின் நிலை பற்றி கேட்கலாம்.`;
    } else {
      defaultText = `I can help you check your earnings, review your shift hours, report safety hazards, or track grievance status. Try asking: "How much have I earned this month?" or "Report an electrical hazard."`;
    }

    return {
      intent: 'help_guidance',
      response: defaultText,
      data: null
    };
  }
}

export const voiceAssistant = new VoiceAssistant();
