import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.GEMINI_API_KEY is injected by Vite via define in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generatePanda(description: string): Promise<string> {
  const prompt = `kawaii-style illustration of a cute panda character, chibi style (big head, small body), simple clean lines, soft pastel colors, ${description}, sticker style, minimal background, soft lighting.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
    });
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the model.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image found in the response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
