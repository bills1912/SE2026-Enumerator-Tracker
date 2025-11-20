
import { GoogleGenAI } from "@google/genai";

// Helper to safely get API Key from different environment configurations
const getApiKey = () => {
  try {
    // Check if process is defined (Node/Webpack/Vite define)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return undefined;
};

const API_KEY = getApiKey();

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.error("API_KEY environment variable not set. Please check your .env file and vite.config.ts");
}

// Only initialize AI if key is present to prevent immediate crash
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_INSTRUCTION = `You are an expert assistant for field data collection. 
Your purpose is to help field enumerators with issues they might face.
Only answer questions related to field data collection issues, survey methodologies, questionnaire problems, and troubleshooting common problems during fieldwork. 
If asked about anything else, politely decline to answer and state your purpose.`;

export async function getChatbotResponse(prompt: string): Promise<string> {
  if (!ai) {
    return "API Key is not configured. Please contact your administrator or check your local setup.";
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
