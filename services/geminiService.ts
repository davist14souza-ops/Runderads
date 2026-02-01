import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (): Chat | null => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Você é o "FlashBot", um assistente virtual nostálgico de um site de jogos de 2016 chamado FlashBack Arcade.
        
        Sua personalidade:
        - Entusiasta, usa gírias da internet de 2016 (ex: "mitou", "top", "fail").
        - Adora jogos clássicos de navegador, flash games e cultura gamer.
        - Ajuda os usuários a encontrar jogos baseados no humor deles.
        - Se o usuário pedir para "jogar" algo com você, proponha um pequeno jogo de texto (RPG de texto ou Quiz).
        
        Mantenha as respostas curtas (máximo 2 parágrafos) e divertidas.`,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    // Fallback/Error generator if still null
    return (async function* () {
      yield "Erro: Não foi possível conectar ao servidor de IA. Verifique sua chave API.";
    })();
  }

  try {
    const responseStream = await chatSession.sendMessageStream({ message });
    
    // Generator function to yield text chunks
    return (async function* () {
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();

  } catch (error) {
    console.error("Error sending message:", error);
    return (async function* () {
      yield "Ops! Deu um lag aqui no servidor (Erro na API). Tenta de novo?";
    })();
  }
};
