import type {
  AiChatRequest,
  AiChatResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiProvider,
} from "./types";

interface AzureOpenAiConfig {
  endpoint: string;
  apiKey: string;
  chatDeployment: string;
  embeddingDeployment: string;
}

function readAzureConfig(): AzureOpenAiConfig {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const chatDeployment =
    process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ?? "gpt-5-mini";
  const embeddingDeployment =
    process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ?? "text-embedding-3-small";

  if (!endpoint || !apiKey) {
    throw new Error(
      "Azure OpenAI is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.",
    );
  }

  return { endpoint, apiKey, chatDeployment, embeddingDeployment };
}

export class AzureOpenAiProvider implements AiProvider {
  readonly id = "azure" as const;
  private readonly config: AzureOpenAiConfig;

  constructor(config?: AzureOpenAiConfig) {
    this.config = config ?? readAzureConfig();
  }

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const url = `${this.config.endpoint}/openai/deployments/${this.config.chatDeployment}/chat/completions?api-version=2024-08-01-preview`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.config.apiKey,
      },
      body: JSON.stringify({
        messages: request.messages,
        max_tokens: request.maxTokens ?? 1024,
        temperature: request.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Azure OpenAI chat failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
      model?: string;
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    return {
      content: data.choices[0]?.message.content ?? "",
      model: data.model ?? this.config.chatDeployment,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }

  async embed(request: AiEmbeddingRequest): Promise<AiEmbeddingResponse> {
    const url = `${this.config.endpoint}/openai/deployments/${this.config.embeddingDeployment}/embeddings?api-version=2024-08-01-preview`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.config.apiKey,
      },
      body: JSON.stringify({ input: request.input }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Azure OpenAI embedding failed (${response.status}): ${body}`,
      );
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
      model?: string;
      usage?: { total_tokens: number };
    };

    return {
      embeddings: data.data.map((row) => row.embedding),
      model: data.model ?? this.config.embeddingDeployment,
      usage: data.usage
        ? { totalTokens: data.usage.total_tokens }
        : undefined,
    };
  }
}
