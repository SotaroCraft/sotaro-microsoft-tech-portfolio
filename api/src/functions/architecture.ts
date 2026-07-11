import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { buildMockArchitectureResponse } from "@microbootcan/shared";

app.http("architecture", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "architecture",
  handler: async (
    _request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    return {
      status: 200,
      jsonBody: buildMockArchitectureResponse(),
    };
  },
});
