// Why: Unified Text-to-Speech utility with fallback mechanism for reliable Hebrew pronunciation.

let currentAudio: HTMLAudioElement | null = null;
let currentReject: ((reason?: any) => void) | null = null;
let isSpeakingGlobal = false;

export const isSpeaking = () => isSpeakingGlobal;

export const playHebrewText = async (text: string, voices: SpeechSynthesisVoice[] = []) => {
  // First, always stop any current audio/speech and cancel previous promise
  if (typeof window !== "undefined") {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }
    // Si había una promesa pendiente, la rechazamos silenciosamente
    if (currentReject) {
      currentReject({ cancelled: true });
      currentReject = null;
    }
  }

  if (!text || text.trim() === "") {
    isSpeakingGlobal = false;
    return;
  }

  isSpeakingGlobal = true;

  const cleanup = () => {
    isSpeakingGlobal = false;
    currentReject = null;
  };

  const tryExternalTTS = (txt: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      currentReject = reject;
      const proxyUrl = `/api/tts?text=${encodeURIComponent(txt)}`;

      const audio = new Audio();
      currentAudio = audio;

      audio.oncanplaythrough = () => {
        if (currentAudio !== audio) return;
        audio
          .play()
          .then(() => resolve())
          .catch((err) => {
            if (currentAudio === audio) {
              console.warn("Reproducción bloqueada por el navegador:", err);
              cleanup();
              reject(new Error("REPRODUCTION_BLOCKED"));
            } else {
              resolve(); // Fue cancelado por otra petición
            }
          });
      };

      audio.onended = () => {
        if (currentAudio === audio) {
          currentAudio = null;
          cleanup();
          resolve();
        }
      };

      audio.onerror = (e) => {
        if (currentAudio !== audio) {
          resolve();
          return;
        }
        currentAudio = null;
        console.error("Fallo en carga de audio a través de Proxy:", e, "URL:", proxyUrl);
        cleanup();
        reject(new Error("PROXY_LOAD_FAILED"));
      };

      audio.src = proxyUrl;
    });
  };

  if (typeof window === "undefined") return;

  if (!window.speechSynthesis) {
    return tryExternalTTS(text);
  }

  // Try native SpeechSynthesis
  const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
  const hebrewVoice = currentVoices.find((v) => v.lang.includes("he") || v.lang.includes("IL"));

  return new Promise<void>((resolve, reject) => {
    currentReject = reject;
    const speak = (txt: string) => {
      const utterance = new SpeechSynthesisUtterance(txt);
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
        utterance.lang = "he-IL";
        utterance.rate = 0.6;

        utterance.onend = () => {
          cleanup();
          resolve();
        };
        utterance.onerror = (event) => {
          // Si el error es por cancelación, no intentamos el fallback
          if (event.error === "interrupted" || event.error === "canceled") {
            cleanup();
            resolve(); // Resolvemos silenciosamente ya que fue intencional
            return;
          }

          console.warn("SpeechSynthesis falló, usando fallback externo:", event.error);
          tryExternalTTS(text)
            .then(() => resolve())
            .catch((err) => {
              if (err && err.cancelled) {
                resolve();
              } else {
                cleanup();
                reject(err);
              }
            });
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // No native Hebrew voice found, go straight to external
        tryExternalTTS(text)
          .then(() => resolve())
          .catch((err) => {
            if (err && err.cancelled) {
              resolve();
            } else {
              cleanup();
              reject(err);
            }
          });
      }
    };

    speak(text);
  });
};
