import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent, UserInput } from '../types';

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
  apiKey: string,
  userInput: UserInput,
): Promise<GeneratedContent> => {
  const { theme, tone, audience, creativeIdea, titleIdeas, descriptionIdeas, thumbnailIdeas } = userInput;
  
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
    if (!apiKey) {
      throw new Error("API Key não fornecida. Por favor, configure sua chave de API nas configurações.");
    }
    const ai = new GoogleGenAI({ apiKey });

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
    let userFriendlyMessage = "Falha ao gerar conteúdo. Verifique sua conexão com a internet e tente novamente.";
    if (error instanceof Error) {
        const lowerCaseError = error.message.toLowerCase();
        if (lowerCaseError.includes('api key not valid') || lowerCaseError.includes('invalid api key')) {
           userFriendlyMessage = "Sua chave de API é inválida ou expirou. Por favor, verifique-a nas configurações e tente novamente.";
        } else if (lowerCaseError.includes('quota') || lowerCaseError.includes('429')) {
            userFriendlyMessage = "Você atingiu o limite de requisições para sua chave de API. Por favor, tente novamente mais tarde ou verifique seu plano.";
        } else if (lowerCaseError.includes('safety')) {
            userFriendlyMessage = "O conteúdo não pôde ser gerado devido às políticas de segurança. Tente refinar o tema ou as ideias criativas para ser mais específico e claro.";
        } else if (lowerCaseError.includes('billing')) {
            userFriendlyMessage = "Há um problema com o faturamento da sua conta Google Cloud. Por favor, verifique se o faturamento está ativo para o seu projeto.";
        } else {
             userFriendlyMessage = "Falha ao gerar conteúdo. Verifique se sua chave de API está correta, se há conexão com a internet e tente novamente.";
        }
    }
    throw new Error(userFriendlyMessage);
  }
};


// --- Regeneration Logic ---

const regenerationPrompts: Record<keyof GeneratedContent, (input: UserInput, current: GeneratedContent, idea: string) => string> = {
    script: (input, current, idea) => `Você é um teólogo e roteirista. Baseado no tema "${input.theme}", tom "${input.tone}" e público "${input.audience}", gere novamente um roteiro narrativo com aproximadamente 10.500 caracteres. Incorpore esta nova ideia criativa: "${idea}". A ideia criativa original era "${input.creativeIdea}". O roteiro deve ser apenas o texto da narração e terminar com uma chamada para ação.`,
    titles: (input, current, idea) => `Você é um especialista em SEO para YouTube. Para um vídeo com o tema "${input.theme}" e cujo roteiro começa com: "${current.script.substring(0, 400)}...", gere 5 novos títulos criativos e otimizados para SEO. Leve em conta esta nova sugestão: "${idea}". Pelo menos um título deve ter uma CTA.`,
    tags: (input, current, idea) => `Você é um especialista em SEO para YouTube. Para um vídeo com o tema "${input.theme}" e títulos como "${current.titles.join(', ')}", gere uma nova lista de 10 a 15 tags de YouTube relevantes. Considere esta nova ideia: "${idea}".`,
    description: (input, current, idea) => `Você é um especialista em SEO para YouTube. Para um vídeo com o tema "${input.theme}" e um resumo do roteiro: "${current.script.substring(0, 400)}...", escreva uma nova descrição de YouTube otimizada para SEO, bem estruturada e com até 2.000 caracteres. Ela deve terminar com uma forte CTA. Incorpore esta nova ideia: "${idea}".`,
    thumbnailPrompts: (input, current, idea) => `Você é um diretor de arte criativo. Para um vídeo com o tema "${input.theme}" e o título "${current.titles[0]}", gere 3 novos prompts visualmente impactantes para a thumbnail. Os prompts devem estar em Português (Brasil). Incorpore esta nova ideia criativa: "${idea}".`,
};

const regenerationSchemas: Record<keyof GeneratedContent, any> = {
    script: { type: Type.OBJECT, properties: { script: contentSchema.properties.script }, required: ['script'] },
    titles: { type: Type.OBJECT, properties: { titles: contentSchema.properties.titles }, required: ['titles'] },
    tags: { type: Type.OBJECT, properties: { tags: contentSchema.properties.tags }, required: ['tags'] },
    description: { type: Type.OBJECT, properties: { description: contentSchema.properties.description }, required: ['description'] },
    thumbnailPrompts: { type: Type.OBJECT, properties: { thumbnailPrompts: contentSchema.properties.thumbnailPrompts }, required: ['thumbnailPrompts'] },
};


export const regenerateSectionContent = async (
    apiKey: string,
    section: keyof GeneratedContent,
    userInput: UserInput,
    currentContent: GeneratedContent,
    idea: string
): Promise<Partial<GeneratedContent>> => {
    const prompt = regenerationPrompts[section](userInput, currentContent, idea || 'Use sua criatividade para melhorar o conteúdo existente.');
    const schema = regenerationSchemas[section];

    try {
        if (!apiKey) {
            throw new Error("API Key não fornecida.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.9, // Higher temperature for more creative regeneration
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Partial<GeneratedContent>;

    } catch (error) {
        console.error(`Error regenerating section "${section}":`, error);
        let userFriendlyMessage = `Falha ao regenerar a seção de ${section}.`;
         if (error instanceof Error) {
            const lowerCaseError = error.message.toLowerCase();
            if (lowerCaseError.includes('api key not valid') || lowerCaseError.includes('invalid api key')) {
               userFriendlyMessage = "Sua chave de API é inválida ou expirou. Não foi possível regenerar o conteúdo.";
            } else if (lowerCaseError.includes('quota') || lowerCaseError.includes('429')) {
                userFriendlyMessage = "Você atingiu o limite de requisições. Não foi possível regenerar o conteúdo.";
            } else if (lowerCaseError.includes('safety')) {
                userFriendlyMessage = "A regeneração foi bloqueada por políticas de segurança. Tente uma ideia diferente.";
            } else if (lowerCaseError.includes('billing')) {
                userFriendlyMessage = "Problema de faturamento na sua conta Google Cloud. A regeneração falhou.";
            }
        }
        throw new Error(userFriendlyMessage);
    }
};