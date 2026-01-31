import { GoogleGenAI } from "@google/genai";

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