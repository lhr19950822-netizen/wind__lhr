
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from "../types";

const getAIClient = () => {
  // 确保 API KEY 存在，否则会在运行时报错
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const brainstormGameIdea = async (prompt: string, history: ChatMessage[]): Promise<string> => {
  const ai = getAIClient();
  
  // 转换历史记录格式
  // 仅保留最近的 10 条对话，避免 payload 过大导致请求失败
  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview', // 使用 Flash 模型以获得更稳定的连接
      config: {
        systemInstruction: "你是一位世界级的复古游戏设计师。协助用户进行像素游戏想法的头脑风暴、机制设计、背景设定及技术实现。请保持回答简洁、富有启发性，并使用 Markdown 格式。",
        temperature: 0.7, // 降低一点温度以提高稳定性
      },
      history: recentHistory as any,
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || 'AI 未返回任何响应。';
  } catch (error: any) {
    console.error("Gemini Brainstorming Error Detail:", error);
    // 如果是 500 错误且包含 XHR，尝试给出更明确的提示
    if (error.message?.includes('xhr') || error.message?.includes('500')) {
      throw new Error("模型连接超时或后端服务波动，请稍后再试。");
    }
    throw error;
  }
};

export const generatePixelSprite = async (description: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-quality 2D pixel art sprite of ${description}. Pure white background, clean outlines, high contrast, retro 16-bit console style, game asset.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image Generation Error:", error);
  }
  return null;
};

export const generateTarotMbtiConcept = async (mbti: string, tarot: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `结合 MBTI 类型 "${mbti}" 和塔罗牌 "${tarot}"，为一个像素风格游戏创造一个深刻的角色原型或世界观概念。
  请包括：
  1. 概念名称 (Concept Name)
  2. 角色故事背景 (Backstory)
  3. 核心游戏机制/技能 (Core Mechanic)
  4. 像素视觉设计建议 (Visual Style Guide)
  请使用专业、充满神秘感且富有想象力的语言，以 Markdown 格式输出。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // 同样建议在塔罗设计中也使用 flash 以保证高成功率
      contents: prompt,
      config: {
        systemInstruction: "你是一位精通荣格心理学（MBTI）和神秘学（塔罗）的游戏叙事设计师。你的任务是为像素游戏提供极具创意的角色和世界观原型。",
        temperature: 0.9,
      },
    });
    return response.text || '无法编织命运之线。';
  } catch (error) {
    console.error("Tarot Concept Error:", error);
    return "命理波动异常，请重新尝试抽取。";
  }
};
