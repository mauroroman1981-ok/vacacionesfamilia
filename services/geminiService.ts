// Fix Gemini initialization and API key access
import { GoogleGenAI, Type } from "@google/genai";
import { ArubaData } from "../types";

export async function fetchArubaInsights(): Promise<ArubaData> {
  // Always use process.env.API_KEY directly as a named parameter in the constructor
  // Do not ask the user for the key or use UI elements to manage it.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Proporciona datos climáticos detallados para hoy en Aruba y consejos de viaje para enero de 2026.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                description: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER },
                conditionType: { type: Type.STRING }
              },
              required: ["temp", "condition", "description", "humidity", "windSpeed", "conditionType"]
            },
            januaryClimate: {
              type: Type.OBJECT,
              properties: {
                avgTemp: { type: Type.STRING },
                waterTemp: { type: Type.STRING },
                rainDays: { type: Type.STRING }
              },
              required: ["avgTemp", "waterTemp", "rainDays"]
            },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["weather", "januaryClimate", "tips"]
        }
      }
    });

    // Extract text using the .text property (not a method)
    const jsonStr = response.text || '{}';
    const parsed = JSON.parse(jsonStr);
    
    // Extract grounding sources as required when using googleSearch
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = groundingChunks.map((chunk: any) => {
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
      return null;
    }).filter(Boolean);

    return {
      weather: parsed.weather || getFallbackData().weather,
      januaryClimate: parsed.januaryClimate || getFallbackData().januaryClimate,
      tips: Array.isArray(parsed.tips) ? parsed.tips : getFallbackData().tips,
      groundingSources: groundingSources as any[]
    };
  } catch (error) {
    console.error("Error fetching Aruba insights:", error);
    return getFallbackData();
  }
}

function getFallbackData(): ArubaData {
  return {
    weather: {
      temp: 29,
      condition: "Soleado",
      description: "Cielo despejado en Oranjestad",
      humidity: 72,
      windSpeed: 18,
      conditionType: 'sunny'
    },
    januaryClimate: {
      avgTemp: "28°C",
      waterTemp: "26°C",
      rainDays: "7 días"
    },
    tips: [
      "Visiten Baby Beach para aguas tranquilas.",
      "Lleven protector solar biodegradable.",
      "Cenen en Zeerover para pescado fresco."
    ],
    groundingSources: []
  };
}
