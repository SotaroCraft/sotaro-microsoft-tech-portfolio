import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { matchRequestSchema, matchResponseSchema } from "@microstar/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import { runContextMatch } from "../services/ai/match";

app.http("match", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "match",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const body = await readJsonBody<unknown>(request);
      const input = matchRequestSchema.parse(body);
      const result = await runContextMatch(auth.userId, input);
      return jsonResponse(200, matchResponseSchema.parse(result));
    } catch (error) {
      return errorResponse(error);
    }
  },
});
