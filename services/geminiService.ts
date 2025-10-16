import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-pro';

const contentSchema = {
  type: Type.OBJECT,
  properties: {
    script: {
      type: Type.STRING,
      description: "The complete narrative script of approximately 10,500 characters, containing only the narration text and ending with a call to action.",
    },
    titles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5 SEO-optimized YouTube titles, where at least one includes a CTA.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 10 to 15 relevant YouTube tags.",
    },
    description: {
      type: Type.STRING,
      description: "An SEO-optimized description for the YouTube video, ending with a strong call to action. It should be well-structured with paragraphs for readability.",
    },
    thumbnailPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 creative prompts for the video thumbnail, written in Portuguese (Brazil).",
    },
  },
  required: ['script', 'titles', 'tags', 'description', 'thumbnailPrompts'],
};

export const generateYouTubeContent = async (
  theme: string,
  tone: string,
  audience: string,
  creativeIdea: string,
  titleIdeas: string,
  descriptionIdeas: string,
  thumbnailIdeas: string,
): Promise<GeneratedContent> => {
  const prompt = `
    You are a theologian with ancient wisdom and a deep knowledge of the Christian Bible. Your mission is to transform the received theme or passage into a complete, YouTube-optimized content package, acting as an expert in Christian communication and SEO.

    Based on the following details:
    - Theme/Passage: "${theme}"
    - Tone/Style: "${tone}"
    - Target Audience: "${audience}"
    - Additional Creative Idea: "${creativeIdea || 'No specific idea provided, use your theological creativity.'}"

    Also consider these SEO ideas and keywords provided by the user when generating the corresponding content:
    - Ideas for Titles: "${titleIdeas || 'None, use your creativity.'}"
    - Ideas for Description: "${descriptionIdeas || 'None, use your creativity.'}"
    - Ideas for Thumbnails: "${thumbnailIdeas || 'None, use your creativity.'}"

    Generate the following content strictly in the requested JSON format:

    1. Narrative Script:
      - VERY IMPORTANT: The script must be extensive, with approximately 10,500 characters. This is crucial for a long-form video.
      - Generate ONLY the narrative text for a voice-over. Do NOT include any timestamps, section headers (like "Introduction", "Hook", etc.), or scene directions.
      - Language: Must be fluid, devotional, spiritual, and theologically consistent with the Christian faith.
      - Content: Create a fictional story or a deep narrative inspired by the passage, exploring characters, context, and spiritual lessons in a captivating way.
      - Final CTA: Conclude the script with a powerful and inspiring call to action, inviting the viewer to subscribe to the channel, share the video, and leave a comment about their reflections.

    2. YouTube Titles:
      - Quantity: Exactly 5 suggestions.
      - Style: Creative, emotional, and optimized with biblical SEO keywords. Use the user's ideas as inspiration.
      - CTA Requirement: At least one of the five titles must include a direct call to action, such as "Inscreva-se" or "Mensagem Urgente".

    3. YouTube Tags:
      - Quantity: Between 10 and 15 tags.
      - Content: Use words and phrases relevant to the theme, Christian faith, spirituality, and terms the target audience would search for.

    4. Video Description:
      - Length: Up to 2,000 characters.
      - Structure: VERY IMPORTANT: The description must be well-organized and easy to read. Use paragraphs and line breaks to separate ideas. Start with a hook, summarize the video's spiritual value, and then provide more context.
      - Final CTA: It is MANDATORY to end the description with a strong and clear call to action, encouraging viewers to subscribe, like, and share.

    5. Thumbnail Prompts:
      - Quantity: Exactly 3 creative prompts.
      - IMPORTANT: The text for these prompts MUST be in Portuguese (Brazil).
      - Format: Each prompt should describe a visually impactful and symbolic scene that captures the essence of the video. Use the user's ideas as inspiration. Example: "um homem olhando o mar se abrir diante dele, simbolizando libertação".
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: contentSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedContent = JSON.parse(jsonText) as GeneratedContent;
    return parsedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Falha ao gerar conteúdo. Por favor, verifique sua chave de API e tente novamente.");
  }
};
