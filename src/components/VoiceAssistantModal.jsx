import React, { useState } from 'react';
import { X, Mic, Send, Volume2, ArrowUpRight, Check, AlertTriangle } from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { speakText, stopSpeaking } from '../utils/audio';

export default function VoiceAssistantModal({ isOpen, onClose, currentLang = 'en', currentWorkerId = 'usr_w1' }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'assistant',
      text:
        currentLang === 'hi'
          ? 'नमस्ते! मैं फेयरशिफ्ट वॉयस असिस्टेंट हूँ। आप अपनी कमाई, शिफ्ट, सुरक्षा खतरा रिपोर्ट या शिकायत स्टेटस के बारे में पूछ सकते हैं।'
          : currentLang === 'ta'
          ? 'வணக்கம்! நான் ஃபேர்ஷிப்ட் குரல் உதவியாளர். உங்கள் சம்பளம், பணி நேரம், அல்லது பாதுகாப்பு புகார் குறித்து கேட்கலாம்.'
          : 'Hello! I am your FairShift Voice Assistant. You can ask about your earnings, shift attendance, safety hazards, or check complaint status.'
    }
  ]);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleMicClick = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
      setStatusMessage('');
      return;
    }

    setIsListening(true);
    setStatusMessage(currentLang === 'hi' ? 'सुन रहा हूँ... बोलिए' : currentLang === 'ta' ? 'கேட்கிறது... பேசவும்' : 'Listening... Speak now');

    voiceAssistant.startListening(
      currentLang,
      (transcript) => {
        setIsListening(false);
        setStatusMessage('');
        setInputText(transcript);
        handleSendQuery(transcript);
      },
      (err) => {
        setIsListening(false);
        setStatusMessage(err);
      }
    );
  };

  const handleSendQuery = async (queryToProcess) => {
    const q = queryToProcess || inputText;
    if (!q.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: q };
    setConversation((prev) => [...prev, userMsg]);
    setInputText('');
    setStatusMessage('Processing query with verified records...');

    try {
      const result = await voiceAssistant.processQuery(q, currentLang, currentWorkerId);

      const assistantMsg = {
        sender: 'assistant',
        text: result.response,
        intent: result.intent,
        data: result.data
      };

      setConversation((prev) => [...prev, assistantMsg]);
      setStatusMessage('');

      // Speak response aloud automatically
      setIsSpeaking(true);
      speakText(
        result.response,
        currentLang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } catch (e) {
      console.error('Voice query error:', e);
      setStatusMessage('Error processing request.');
    }
  };

  const sampleChips = {
    en: [
      "How much have I earned this month?",
      "Check my active shift",
      "Report electrical wire hazard",
      "Check my complaint status"
    ],
    hi: [
      "मेरी कमाई कितनी है?",
      "मेरी शिफ्ट चेक करें",
      "मशीन के पास तार खुला है",
      "मेरी शिकायत का स्टेटस"
    ],
    ta: [
      "என் சம்பளம் எவ்வளவு?",
      "என் பணி விவரம் என்ன?",
      "மின்சார கம்பி ஆபத்து அறிக்கை",
      "என் புகாரின் நிலை"
    ]
  };

  const currentChips = sampleChips[currentLang] || sampleChips.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-md w-full overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#111111] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-[#FF4D2D] animate-ping' : isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">FairShift Voice Assistant</h3>
              <p className="text-[10px] font-mono text-slate-400">
                {currentLang === 'hi' ? 'हिंदी समर्थित • सुरक्षित आवाज सहायक' : currentLang === 'ta' ? 'தமிழ் ஆதரவு • குரல் வழி வழிகாட்டி' : 'Multilingual • Verified Records Only'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsSpeaking(false);
                }}
                className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-slate-300 hover:bg-white/20"
              >
                Mute
              </button>
            )}
            <button
              onClick={() => {
                stopSpeaking();
                voiceAssistant.stopListening();
                onClose();
              }}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[260px] text-xs">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-3xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#FF4D2D] text-white font-medium rounded-br-xs'
                    : 'bg-[#2A2A2A] text-slate-200 border border-white/10 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                {msg.intent === 'hazard_report_created' && msg.data && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Case Registered: {msg.data.caseId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {statusMessage && (
            <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#141414] overflow-x-auto flex gap-1.5">
          {currentChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Voice Input & Text Box Controls */}
        <div className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2">
          <button
            onClick={handleMicClick}
            title={isListening ? 'Stop listening' : 'Start microphone'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-[#FF4D2D] text-white animate-pulse'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder={currentLang === 'hi' ? 'यहाँ लिखें या माइक दबाएं...' : currentLang === 'ta' ? 'இங்கே தட்டச்சு செய்க அல்லது மைக் அழுத்தவும்...' : 'Type request or speak via mic...'}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-white text-black disabled:opacity-40 flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
