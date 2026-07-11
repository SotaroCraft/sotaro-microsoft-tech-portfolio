import type { HttpResponseInit } from "@azure/functions";
import { AuthRequiredError } from "./auth";

export function jsonResponse(
  status: number,
  body: unknown,
): HttpResponseInit {
  return {
    status,
    jsonBody: body,
  };
}

export function noContentResponse(): HttpResponseInit {
  return { status: 204 };
}

export function errorResponse(error: unknown): HttpResponseInit {
  if (error instanceof AuthRequiredError) {
    return jsonResponse(error.status, { error: error.message });
  }

  if (error instanceof Error) {
    return jsonResponse(500, { error: error.message });
  }

  return jsonResponse(500, { error: "Internal server error" });
}

export async function readJsonBody<T>(request: {
  json(): Promise<unknown>;
}): Promise<T> {
  return (await request.json()) as T;
}
