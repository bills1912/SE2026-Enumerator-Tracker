
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const SYSTEM_INSTRUCTION = `You are an expert assistant for field data collection. 
Your purpose is to help field enumerators with issues they might face.
Only answer questions related to field data collection issues, survey methodologies, questionnaire problems, and troubleshooting common problems during fieldwork. 
If asked about anything else, politely decline to answer and state your purpose.`;

export async function getChatbotResponse(prompt: string): Promise<string> {
  if (!API_KEY) {
    return "API Key is not configured. Please contact your administrator.";
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}
