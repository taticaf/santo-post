
import { GoogleGenAI } from "@google/genai";

export async function generateCatholicPost(bibleText: string, phrase: string): Promise<string> {
  // Inicializamos o SDK dentro da função para garantir o uso da chave mais recente do process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Ilustre lindamente a seguinte leitura bíblica: "${bibleText}".
    O estilo deve ser uma mistura sublime de arte sacra clássica, realismo fotográfico e um toque de ilustração estilizada moderna (estilo Disney/Pixar), criando uma atmosfera divina, acolhedora e inspiradora para o público jovem católico.
    Use iluminação cinematográfica, tons dourados e cores vibrantes mas profundas.
    IMPORTANTE: Integre artisticamente a frase "${phrase}" dentro da composição da imagem, garantindo que seja legível e harmoniosa.
    Formato da imagem: 3:4. Alta definição, 2K.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "2K"
        }
      },
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Não foi possível extrair a imagem da resposta da IA.");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Erro detalhado da API Gemini:", error);
    const errorMessage = error?.message || "";
    
    // Captura erros de permissão, chave inexistente ou modelo não encontrado (comum quando a chave não tem acesso ao Pro Image)
    if (
      errorMessage.includes("Requested entity was not found") || 
      errorMessage.toLowerCase().includes("permission denied") ||
      errorMessage.toLowerCase().includes("api key") ||
      errorMessage.includes("403") ||
      errorMessage.includes("401")
    ) {
      throw new Error("KEY_NOT_FOUND");
    }
    
    throw new Error(`Falha ao chamar a API Gemini: ${errorMessage}`);
  }
}
