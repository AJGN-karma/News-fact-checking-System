
import { GoogleGenAI } from "@google/genai";
import { FactCheckResponse } from "../types";

const SYSTEM_PROMPT = `You are a Real-Time News Fact-Checking AI.

Your task is to VERIFY factual claims in a given news headline, article, or image (screenshot of a post/article) using REAL-TIME WEB SEARCH grounding.

STRICT INSTRUCTIONS:
1. Analyze the input carefully. If it's an image, perform OCR and visual analysis first.
2. Break the input into ONE or MORE clear factual claims.
3. For EACH factual claim:
   a. Search the live internet using Google Search grounding.
   b. Cross-check against established news organizations, government data, and specialized fact-checking sites.
4. For EACH claim, produce:
   - Claim: [Claim text]
   - Verdict: TRUE / FALSE / MISLEADING / UNVERIFIABLE
   - Confidence: [0-100]%
   - Explanation: [Detailed reasoning with context]
   - Sources: [Key entities or specific context found]

5. Overall Assessment:
   - Summary: Final credibility verdict.
   - Misinformation Risk: Low / Medium / High

TONE: Objective, forensic, and detailed.

FINAL OUTPUT FORMAT:
# Verification Report
<brief summary of what was analyzed>

## Extracted Claims
1. ...

## Analysis Results
### Claim 1: [Short Claim Description]
- **Verdict**: [VERDICT]
- **Confidence**: [Confidence Score]%
- **Explanation**: [Text]
- **Sources**: [Text]

...

## Final Verdict
- **Summary**: [Text]
- **Risk Level**: [Low/Medium/High]
`;

export const verifyNews = async (text: string, imageData?: string): Promise<FactCheckResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing from the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex reasoning and fact-checking
  const model = "gemini-3-pro-preview";

  const parts: any[] = [{ text: text || "Analyze this news content." }];
  
  if (imageData) {
    parts.push({
      inlineData: {
        data: imageData.split(',')[1], // Remove prefix
        mimeType: "image/jpeg"
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for higher factual accuracy
      },
    });

    const reportText = response.text || "Verification failed to generate text.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      reportText,
      sources,
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "An error occurred during verification.");
  }
};
