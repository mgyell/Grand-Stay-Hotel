import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSystemResponse = async (
  prompt: string,
  role: UserRole,
  context: string
): Promise<string> => {
  try {
    const systemInstruction = `
      You are the core logic engine and intelligent assistant for "Grand Stay Hotel Management System".
      Your current user role is: ${role}.
      
      System Context:
      ${context}

      Guidelines:
      - Be professional, concise, and helpful.
      - If the user is a GUEST, act as a concierge (friendly, welcoming).
      - If the user is STAFF, act as an operations assistant (efficient, formal).
      - If the user is ADMIN, act as a business analyst (strategic, data-driven).
      - If the user is VENDOR, act as a supply chain coordinator (clear, transactional).
      - If asked to perform an action (e.g., "Draft email", "Analyze data"), provide the text output clearly.
      - Do not make up fake URLs or external calls; simulate the response text only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I apologize, but I couldn't process that request at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System requires an API Key for intelligent processing. Please check configuration.";
  }
};
