import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { healthResponseSchema } from "@microstar/shared";

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async (
    _request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    const body = healthResponseSchema.parse({
      status: "ok",
      app: "microstar-api",
      env: process.env.APP_ENV ?? "local",
      timestamp: new Date().toISOString(),
    });

    return {
      status: 200,
      jsonBody: body,
    };
  },
});
