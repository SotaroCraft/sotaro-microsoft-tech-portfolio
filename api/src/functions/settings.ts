import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { milestoneUpdateSchema } from "@microstar/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import {
  getUserSettings,
  updateMilestoneTarget,
} from "../services/cosmos/repositories/settings";

app.http("settings", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "settings",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const settings = await getUserSettings(auth.userId);
      return jsonResponse(200, settings);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("settingsMilestone", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "settings/milestone",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const body = await readJsonBody<unknown>(request);
      const input = milestoneUpdateSchema.parse(body);
      const settings = await updateMilestoneTarget(
        auth.userId,
        input.milestoneTargetIso,
      );
      return jsonResponse(200, settings);
    } catch (error) {
      return errorResponse(error);
    }
  },
});
