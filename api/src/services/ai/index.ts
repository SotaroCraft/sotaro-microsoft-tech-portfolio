import { AzureOpenAiProvider } from "./azure-provider";
import { GeminiProvider } from "./gemini-provider";
import { MockAiProvider } from "./mock-provider";
import type { AiProvider, AiProviderId } from "./types";

export type {
  AiChatMessage,
  AiChatRequest,
  AiChatResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiProvider,
  AiProviderId,
} from "./types";

export { AzureOpenAiProvider } from "./azure-provider";
export { GeminiProvider } from "./gemini-provider";
export { MockAiProvider } from "./mock-provider";
export { runContextMatch } from "./match";

const VALID_PROVIDERS: AiProviderId[] = ["mock", "gemini", "azure"];

function resolveProviderId(): AiProviderId {
  const explicit = process.env.AI_PROVIDER as AiProviderId | undefined;
  if (explicit) {
    if (!VALID_PROVIDERS.includes(explicit)) {
      throw new Error(
        `Invalid AI_PROVIDER="${explicit}". Expected: ${VALID_PROVIDERS.join(", ")}`,
      );
    }
    return explicit;
  }

  if (process.env.APP_ENV === "local" || !process.env.APP_ENV) {
    return "mock";
  }

  return "azure";
}

let cachedProvider: AiProvider | undefined;

export function getAiProvider(): AiProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const id = resolveProviderId();

  switch (id) {
    case "mock":
      cachedProvider = new MockAiProvider();
      break;
    case "azure":
      cachedProvider = new AzureOpenAiProvider();
      break;
    case "gemini":
      cachedProvider = new GeminiProvider();
      break;
    default:
      throw new Error(`Unsupported AI provider: ${id satisfies never}`);
  }

  return cachedProvider;
}

/** Test-only: reset singleton between unit tests */
export function resetAiProviderForTests(): void {
  cachedProvider = undefined;
}
