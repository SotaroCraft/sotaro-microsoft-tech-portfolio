import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
} from "@microstar/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  touchProjectOpened,
  updateProject,
} from "../services/cosmos/repositories/projects";

app.http("projects", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "projects",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);

      if (request.method === "GET") {
        return jsonResponse(200, await listProjects(auth.userId));
      }

      const body = await readJsonBody<unknown>(request);
      const input = createProjectInputSchema.parse(body);
      const project = await createProject(auth.userId, input);
      return jsonResponse(201, project);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("projectById", {
  methods: ["GET", "PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "projects/{id}",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const id = request.params.id;
      if (!id) {
        return jsonResponse(400, { error: "Missing project id" });
      }

      if (request.method === "GET") {
        const project = await getProject(auth.userId, id);
        if (!project) {
          return jsonResponse(404, { error: "Project not found" });
        }
        return jsonResponse(200, project);
      }

      if (request.method === "DELETE") {
        const deleted = await deleteProject(auth.userId, id);
        if (!deleted) {
          return jsonResponse(404, { error: "Project not found" });
        }
        return { status: 204 };
      }

      const body = await readJsonBody<unknown>(request);
      const input = updateProjectInputSchema.parse(body);
      const updated = await updateProject(auth.userId, id, input);
      if (!updated) {
        return jsonResponse(404, { error: "Project not found" });
      }
      return jsonResponse(200, updated);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("projectOpen", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "projects/{id}/open",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const id = request.params.id;
      if (!id) {
        return jsonResponse(400, { error: "Missing project id" });
      }

      const project = await touchProjectOpened(auth.userId, id);
      if (!project) {
        return jsonResponse(404, { error: "Project not found" });
      }
      return jsonResponse(200, project);
    } catch (error) {
      return errorResponse(error);
    }
  },
});
