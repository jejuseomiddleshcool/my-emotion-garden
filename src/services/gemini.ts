import { GoogleGenAI, Type } from "@google/genai";
import { PlantEmotion } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzePlant(base64Image: string) {
  const model = genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analyze this strawberry plant photo. Determine its state (e.g., healthy, wilting, vibrant) and assign it a human-like emotion (happy, vibrant, tired, droopy, growing, healthy, wilting). ALL text output MUST be in Korean. Do NOT use any English words in the values." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          state: { type: Type.STRING, description: "식물의 상태 (예: 건강함, 시듦, 활기참) - 무조건 한국어로 작성" },
          emotion: { type: Type.STRING, description: "One of: happy, vibrant, tired, droopy, growing, healthy, wilting (This key is internal, but the 'state' and 'reason' must be Korean)" },
          reason: { type: Type.STRING, description: "이유 설명 - 무조건 한국어로 작성" },
        },
        required: ["state", "emotion", "reason"],
      },
    },
  });

  const response = await model;
  return JSON.parse(response.text || "{}");
}

export async function reflectMood(plantEmotion: string, userMood: string, moodScore: number) {
  const model = genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The strawberry plant is feeling ${plantEmotion}. The user says their mood is: "${userMood}" (Score: ${moodScore}/100). 
    Analyze the user's mood and provide the following STRICTLY in Korean. NO English allowed in the output values.
    1. Emotion Understanding (0-100%): How accurately and honestly the user expressed their feelings.
    2. Understanding Reason: Why you gave that score (Korean).
    3. Emotion Nutrition Recommendation: Recommend a specific nutrient (e.g., Vitamin C, Magnesium) based on their mood (Korean).
    4. Nutrition Improvement Rate (0-100%): Prediction of how much better they will feel with this nutrient.
    5. Emotion Growth Index (0-100%): Compare current mood with general emotional awareness (assume growth).
    6. Supportive reflection and summary for a 13-year-old (Korean).
    7. A strawberry lemonade recipe based on the mood (Korean).
    
    Return JSON with:
    - emotionUnderstanding (number)
    - understandingReason (string)
    - nutritionRecommendation (string)
    - nutritionImprovementRate (number)
    - growthIndex (number)
    - reflection (string)
    - summary (string)
    - recipe (string)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emotionUnderstanding: { type: Type.NUMBER },
          understandingReason: { type: Type.STRING, description: "한국어로 작성" },
          nutritionRecommendation: { type: Type.STRING, description: "한국어로 작성" },
          nutritionImprovementRate: { type: Type.NUMBER },
          growthIndex: { type: Type.NUMBER },
          reflection: { type: Type.STRING, description: "한국어로 작성" },
          summary: { type: Type.STRING, description: "한국어로 작성" },
          recipe: { type: Type.STRING, description: "한국어로 작성" },
        },
        required: ["emotionUnderstanding", "understandingReason", "nutritionRecommendation", "nutritionImprovementRate", "growthIndex", "reflection", "summary", "recipe"],
      },
    },
  });

  const response = await model;
  return JSON.parse(response.text || "{}");
}
