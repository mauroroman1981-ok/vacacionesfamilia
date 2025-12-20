
import { GoogleGenAI, Type } from "@google/genai";
import { ArubaData } from "../types";

export async function fetchArubaInsights(): Promise<ArubaData> {
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

    const parsed = JSON.parse(response.text);
    
    // Extraer fuentes de grounding de forma segura
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = groundingChunks.map((chunk: any) => {
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
      return null;
    }).filter(Boolean);

    return {
      weather: parsed.weather,
      januaryClimate: parsed.januaryClimate,
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
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
