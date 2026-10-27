// Ultra-lightweight Speech Synthesis (Zero audio context / zero synthetic oscillators for maximum low-end device performance)

export function playTone() {
  // Silent on low-end devices - no Web Audio API overhead
}

let activeUtterance = null;

export function speakText(text, lang = 'en', onStart = () => {}, onEnd = () => {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onStart();
    setTimeout(onEnd, 1500);
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    const langMap = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = onStart;
    utterance.onend = () => {
      activeUtterance = null;
      onEnd();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('TTS error:', err);
    onEnd();
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}
