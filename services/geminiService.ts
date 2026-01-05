
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCaption = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, trendy Instagram caption for a post about: ${topic}. Include 2-3 emojis and relevant hashtags.`,
    });
    return response.text || "Just another day in paradise! ✨ #blessed";
  } catch (error) {
    console.error("Gemini Caption Error:", error);
    return "Exploring new horizons. 🌍✨ #Adventure";
  }
};

export const generateComment = async (caption: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an active Instagram user. Write a friendly, 1-sentence comment for this post: "${caption}". Keep it realistic.`,
    });
    return response.text || "This looks amazing! 🔥";
  } catch (error) {
    console.error("Gemini Comment Error:", error);
    return "So beautiful! 😍";
  }
};

export const getAiResponse = async (message: string, userName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are simulating a conversation on Instagram. You are talking to ${userName}. Respond to their message: "${message}" in a friendly, concise social media style.`,
    });
    return response.text || "That's cool! 🙌";
  } catch (error) {
    console.error("Gemini AI Chat Error:", error);
    return "Nice! 👍";
  }
};

export const getFastAiResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: prompt,
    });
    return response.text || "Ok!";
  } catch (error) {
    return "Sounds good.";
  }
};
