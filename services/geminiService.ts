
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFollowUpMessage = async (name: string, church: string, time: string, notes: string) => {
  const ai = getAI();
  const prompt = `Actúa como un asistente pastoral empático. 
  Genera un mensaje de WhatsApp para ${name}, quien está interesado en asistir a la iglesia "${church}" este próximo día a las ${time}.
  Contexto adicional del contacto (sus problemas o necesidades): ${notes || "No especificado"}.
  
  El mensaje debe:
  1. Ser cálido y acogedor.
  2. Mencionar que estaremos esperándole con alegría.
  3. Si hay notas de problemas, incluir una frase breve de ánimo sin ser invasivo.
  4. Ser corto (máximo 3 párrafos).
  5. Usar un tono de "amigo" pero respetuoso.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error con Gemini API:", error);
    return `Hola ${name}, te escribimos de la Universal para confirmar tu visita a la sede ${church} a las ${time}. ¡Te esperamos!`;
  }
};
