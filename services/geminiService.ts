import { GoogleGenAI, Type } from "@google/genai";
import { ArubaData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchArubaInsights(): Promise<ArubaData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Proporciona el clima actual en Oranjestad, Aruba. También incluye promedios históricos para el mes de enero (temperatura media, temperatura del agua, días de lluvia) y 3 consejos cortos de viaje para la familia Rubilar. El formato debe ser JSON.",
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
                conditionType: { 
                  type: Type.STRING, 
                  description: "Categoría simple: sunny, cloudy, rainy, windy" 
                }
              },
              required: ["temp", "condition", "description", "conditionType"]
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

    const data = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Fuente",
        uri: chunk.web?.uri
      }))
      .filter((s: any) => s.uri) || [];

    return {
      ...data,
      groundingSources: sources
    };
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return {
      weather: {
        temp: 29,
        condition: "Soleado",
        description: "Clima perfecto para la playa",
        humidity: 70,
        windSpeed: 20,
        conditionType: 'sunny'
      },
      januaryClimate: {
        avgTemp: "27°C - 30°C",
        waterTemp: "26°C",
        rainDays: "8 días"
      },
      tips: [
        "No olvides visitar Eagle Beach al atardecer.",
        "Prueben el Papiamento, el idioma local.",
        "Alquilen un 4x4 para explorar el Parque Nacional Arikok."
      ],
      groundingSources: []
    };
  }
}
