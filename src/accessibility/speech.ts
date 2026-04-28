let utterance: SpeechSynthesisUtterance | null = null;

export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, lang = 'es-ES', rate = 1, pitch = 1): void {
  if (!isSpeechAvailable()) return;
  stopSpeech();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (isSpeechAvailable()) window.speechSynthesis.cancel();
  utterance = null;
}

export function speakElement(element: HTMLElement, lang = 'es-ES'): void {
  const text = element.getAttribute('aria-label') ?? element.textContent ?? '';
  speak(text.trim(), lang);
}

export function isSpeaking(): boolean {
  return isSpeechAvailable() && window.speechSynthesis.speaking;
}
