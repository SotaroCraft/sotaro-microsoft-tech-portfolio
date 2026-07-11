import type {
  AiChatRequest,
  AiChatResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiProvider,
} from "./types";

interface GeminiConfig {
  apiKey: string;
  chatModel: string;
  embeddingModel: string;
}

function readGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Gemini is not configured. Set GEMINI_API_KEY in app settings.",
    );
  }

  return {
    apiKey,
    chatModel: process.env.GEMINI_CHAT_MODEL ?? "gemini-2.0-flash",
    embeddingModel:
      process.env.GEMINI_EMBEDDING_MODEL ?? "text-embedding-004",
  };
}

export class GeminiProvider implements AiProvider {
  readonly id = "gemini" as const;
  private readonly config: GeminiConfig;

  constructor(config?: GeminiConfig) {
    this.config = config ?? readGeminiConfig();
  }

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.chatModel}:generateContent?key=${this.config.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: request.messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          maxOutputTokens: request.maxTokens ?? 1024,
          temperature: request.temperature ?? 0.4,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini chat failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
      };
    };

    const content =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ??
      "";

    return {
      content,
      model: this.config.chatModel,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount ?? 0,
            completionTokens: data.usageMetadata.candidatesTokenCount ?? 0,
          }
        : undefined,
    };
  }

  async embed(request: AiEmbeddingRequest): Promise<AiEmbeddingResponse> {
    const inputs = Array.isArray(request.input) ? request.input : [request.input];
    const embeddings: number[][] = [];

    for (const text of inputs) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.embeddingModel}:embedContent?key=${this.config.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${this.config.embeddingModel}`,
          content: { parts: [{ text }] },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Gemini embed failed (${response.status}): ${body}`);
      }

      const data = (await response.json()) as {
        embedding?: { values?: number[] };
      };
      embeddings.push(data.embedding?.values ?? []);
    }

    return {
      embeddings,
      model: this.config.embeddingModel,
    };
  }
}
