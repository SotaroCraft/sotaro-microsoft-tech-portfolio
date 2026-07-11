import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { updateCareerSummaryInputSchema } from "@microstar/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import {
  getCareerSummary,
  upsertCareerSummary,
} from "../services/cosmos/repositories/summary";

app.http("summary", {
  methods: ["GET", "PUT"],
  authLevel: "anonymous",
  route: "summary",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);

      if (request.method === "GET") {
        const summary = await getCareerSummary(auth.userId);
        return jsonResponse(200, summary);
      }

      const body = await readJsonBody<unknown>(request);
      const input = updateCareerSummaryInputSchema.parse(body);
      const summary = await upsertCareerSummary(auth.userId, input);
      return jsonResponse(200, summary);
    } catch (error) {
      return errorResponse(error);
    }
  },
});
