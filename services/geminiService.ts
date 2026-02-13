import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client strictly following guidelines using process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFollowUpMessage = async (name: string, church: string, time: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Genera un mensaje corto y amable para WhatsApp/Facebook dirigido a ${name}. 
    Confirma su visita a la iglesia "${church}" a las ${time}. 
    Sé cálido y acogedor.`,
  });
  return response.text;
};