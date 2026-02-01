
import { GoogleGenAI, Type } from "@google/genai";
import { HoneymoonDestination } from '../types';

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only when needed to prevent crashes if env is missing
const getClient = () => {
  if (!apiKey) {
    console.warn("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askWeddingAdvisor = async (
  prompt: string, 
  contextData: string
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Erro: Chave de API não configurada. Por favor, configure a chave API no ambiente.";
  }

  try {
    const systemInstruction = `Você é um planejador de casamentos experiente e consultor financeiro.
    Seu objetivo é ajudar o usuário a planejar seu casamento, estimar custos e organizar o orçamento.
    Responda em Português do Brasil. Seja conciso, amigável e prático.
    
    Use os dados atuais do orçamento do usuário fornecidos abaixo para dar conselhos personalizados.
    
    Dados do Orçamento Atual:
    ${contextData}
    `;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Desculpe, não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o assistente. Tente novamente mais tarde.";
  }
};

export const generateWeddingImage = async (prompt: string): Promise<string | null> => {
  const client = getClient();
  if (!client) {
    console.error("API Key missing");
    return null;
  }

  try {
    // Usando gemini-2.5-flash-image conforme as diretrizes do sistema para geração de imagens
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Wedding concept art, photorealistic, high quality: ${prompt}`,
          },
        ],
      },
      config: {
        // Image generation parameters if needed, or defaults
      }
    });

    // Iterar pelas partes para encontrar a imagem (inlineData)
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const searchVenuesWithMaps = async (query: string): Promise<{ text: string, chunks: any[] }> => {
  const client = getClient();
  if (!client) {
    return { text: "Erro de configuração de API.", chunks: [] };
  }

  try {
    // Uses Google Maps Grounding
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview", // Maps grounding is supported on 2.5 series
      contents: `Encontre locais para casamento baseados nesta busca: "${query}". 
      Liste as opções com nome, endereço e avaliação se disponível. 
      Foque em encontrar locais reais usando o Google Maps.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "Nenhum local encontrado.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, chunks };
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return { text: "Ocorreu um erro ao buscar locais.", chunks: [] };
  }
};

export const suggestHoneymoonDestinations = async (
  preferences: {
    vibe: string,
    month: string,
    budget: string
  }
): Promise<HoneymoonDestination[]> => {
  const client = getClient();
  if (!client) {
    throw new Error("API Key missing");
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sugira 3 destinos de lua de mel baseados nestas preferências:
        Vibe: ${preferences.vibe}
        Mês da viagem: ${preferences.month}
        Orçamento aproximado: ${preferences.budget}
        
        Responda APENAS com um JSON válido seguindo o esquema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              description: { type: Type.STRING },
              estimatedCost: { type: Type.NUMBER, description: "Estimated cost in BRL" },
              currency: { type: Type.STRING },
              bestTime: { type: Type.STRING },
              activities: { type: Type.ARRAY, items: { type: Type.STRING } },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "name", "country", "description", "estimatedCost", "activities", "pros", "cons"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Honeymoon AI Error:", error);
    return [];
  }
};
