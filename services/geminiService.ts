import { GoogleGenAI, Type } from "@google/genai";
import { Project, GeneratedScript } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInterviewPitch = async (projects: Project[]): Promise<GeneratedScript> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const successfulProjects = projects.filter(p => p.type === 'success');
  const failedProjects = projects.filter(p => p.type === 'failure');

  const prompt = `
    You are an expert career coach and interview preparation specialist. 
    I need you to generate a compelling, professional interview script answering the question: "Why should we hire you?" (or "Tell me about yourself and your experience").

    Here is my project history:

    ### SUCCESSFUL PROJECTS (Demonstrating competence and results):
    ${successfulProjects.length > 0 
      ? successfulProjects.map(p => `- Project Name: "${p.name}"\n  Description: ${p.description}\n  Key Takeaways/Learnings: ${p.learnings}`).join('\n\n') 
      : "No specific successful projects listed."}

    ### CHALLENGING/UNSUCCESSFUL PROJECTS (Demonstrating resilience, growth mindset, and problem solving):
    ${failedProjects.length > 0
      ? failedProjects.map(p => `- Project Name: "${p.name}"\n  Description: ${p.description}\n  What went wrong & Learnings: ${p.learnings}\n  Recovery/Fix Plan: ${p.fixPlan}`).join('\n\n')
      : "No specific challenging projects listed."}

    ### INSTRUCTIONS:
    1. Analyze the provided projects to identify my key technical and soft skills.
    2. Synthesize a coherent narrative that weaves together my successes to show competence, and my failures to show maturity, resilience, and the ability to improve.
    3. The tone should be confident, honest, and professional.
    4. Provide the output as a JSON object with two fields:
       - "pitch": The full interview script/monologue.
       - "keyStrengths": An array of short bullet points summarizing my main selling points based on this data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pitch: {
              type: Type.STRING,
              description: "The generated interview script."
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key strengths identified."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    return JSON.parse(text) as GeneratedScript;

  } catch (error) {
    console.error("Error generating pitch:", error);
    throw error;
  }
};
