// Why: Unified Text-to-Speech utility with fallback mechanism for reliable Hebrew pronunciation.

let currentAudio: HTMLAudioElement | null = null;

export const playHebrewText = async (text: string, voices: SpeechSynthesisVoice[] = []) => {
  // Strategy: 
  // 1. Try SpeechSynthesis (Native, faster, free)
  // 2. Fallback to External TTS (More reliable, high quality)

  // First, always stop any current audio/speech
  if (typeof window !== "undefined") {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }
  }

  if (!text || text.trim() === "") return;

  const tryExternalTTS = (txt: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Usamos nuestra propia API Proxy para saltar CORS y bloqueos de Google
      const proxyUrl = `/api/tts?text=${encodeURIComponent(txt)}`;

      const audio = new Audio();
      currentAudio = audio;

      audio.oncanplaythrough = () => {
        audio.play().then(() => resolve()).catch(err => {
          console.warn("Reproducción bloqueada por el navegador:", err);
          reject(new Error("REPRODUCTION_BLOCKED"));
        });
      };

      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };

      audio.onerror = (e) => {
        if (currentAudio === audio) currentAudio = null;
        console.error("Fallo en carga de audio a través de Proxy:", e);
        reject(new Error("PROXY_LOAD_FAILED"));
      };

      audio.src = proxyUrl;
      audio.load();
    });
  };

  if (typeof window === "undefined") return;

  if (!window.speechSynthesis) {
    return tryExternalTTS(text);
  }

  // Try native SpeechSynthesis
  const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
  const hebrewVoice = currentVoices.find(v => v.lang.includes('he') || v.lang.includes('IL'));

  return new Promise<void>((resolve, reject) => {
    const speak = (txt: string) => {
      const utterance = new SpeechSynthesisUtterance(txt);
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
        utterance.lang = 'he-IL';
        utterance.rate = 0.6;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          console.warn("SpeechSynthesis falló, usando fallback externo:", event.error);
          tryExternalTTS(text).then(() => resolve()).catch((err) => reject(err));
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // No native Hebrew voice found, go straight to external
        tryExternalTTS(text).then(() => resolve()).catch((err) => reject(err));
      }
    };

    speak(text);
  });
};
