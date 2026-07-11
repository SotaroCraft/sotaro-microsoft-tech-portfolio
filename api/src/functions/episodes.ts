import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  createEpisodeInputSchema,
  updateEpisodeInputSchema,
} from "@microstar/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import {
  createEpisode,
  deleteEpisode,
  getEpisode,
  listEpisodes,
  updateEpisode,
} from "../services/cosmos/repositories/episodes";

app.http("episodes", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "episodes",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);

      if (request.method === "GET") {
        const episodes = await listEpisodes(auth.userId);
        return jsonResponse(200, episodes);
      }

      const body = await readJsonBody<unknown>(request);
      const input = createEpisodeInputSchema.parse(body);
      const episode = await createEpisode(auth.userId, input);
      return jsonResponse(201, episode);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("episodeById", {
  methods: ["GET", "PUT", "DELETE"],
  authLevel: "anonymous",
  route: "episodes/{id}",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const id = request.params.id;
      if (!id) {
        return jsonResponse(400, { error: "Missing episode id" });
      }

      if (request.method === "GET") {
        const episode = await getEpisode(auth.userId, id);
        if (!episode) {
          return jsonResponse(404, { error: "Episode not found" });
        }
        return jsonResponse(200, episode);
      }

      if (request.method === "PUT") {
        const body = await readJsonBody<unknown>(request);
        const input = updateEpisodeInputSchema.parse(body);
        const episode = await updateEpisode(auth.userId, id, input);
        if (!episode) {
          return jsonResponse(404, { error: "Episode not found" });
        }
        return jsonResponse(200, episode);
      }

      const deleted = await deleteEpisode(auth.userId, id);
      if (!deleted) {
        return jsonResponse(404, { error: "Episode not found" });
      }
      return { status: 204 };
    } catch (error) {
      return errorResponse(error);
    }
  },
});
