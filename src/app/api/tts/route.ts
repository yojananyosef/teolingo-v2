import { type NextRequest, NextResponse } from "next/server";

// Why: Server-side proxy for Google TTS to bypass CORS and client-side restrictions.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  const sanitizeTextForTTS = (rawText: string) => {
    return rawText
      .replace(/\[([^\]]+):[prscav]\]/g, "$1")
      .replace(/\[([^\]]+):[^\]]+\]/g, "$1")
      .replace(/[\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const cleanText = text ? sanitizeTextForTTS(text) : "";

  if (!cleanText) {
    return new NextResponse("Text is required", { status: 400 });
  }

  // Google TTS URL
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=he&client=tw-ob`;

  try {
    const response = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Google TTS responded with ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("TTS Proxy Error:", error);
    return new NextResponse("Error generating audio", { status: 500 });
  }
}
