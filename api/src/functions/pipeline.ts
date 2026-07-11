import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  createApplicationInputSchema,
  createCompanyInputSchema,
} from "@microbootcan/shared";
import { requireAuth } from "../lib/auth";
import { errorResponse, jsonResponse, readJsonBody } from "../lib/http";
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplicationStage,
} from "../services/cosmos/repositories/applications";
import {
  createCompany,
  deleteCompany,
  listCompanies,
} from "../services/cosmos/repositories/companies";

app.http("companies", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "companies",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);

      if (request.method === "GET") {
        return jsonResponse(200, await listCompanies(auth.userId));
      }

      const body = await readJsonBody<unknown>(request);
      const input = createCompanyInputSchema.parse(body);
      const company = await createCompany(auth.userId, input);
      return jsonResponse(201, company);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("companyById", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "companies/{id}",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const id = request.params.id;
      if (!id) {
        return jsonResponse(400, { error: "Missing company id" });
      }

      const deleted = await deleteCompany(auth.userId, id);
      if (!deleted) {
        return jsonResponse(404, { error: "Company not found" });
      }
      return { status: 204 };
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("applications", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "applications",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);

      if (request.method === "GET") {
        return jsonResponse(200, await listApplications(auth.userId));
      }

      const body = await readJsonBody<unknown>(request);
      const input = createApplicationInputSchema.parse(body);
      const application = await createApplication(auth.userId, input);
      return jsonResponse(201, application);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

app.http("applicationById", {
  methods: ["PATCH", "DELETE"],
  authLevel: "anonymous",
  route: "applications/{id}",
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const auth = requireAuth(request);
      const id = request.params.id;
      if (!id) {
        return jsonResponse(400, { error: "Missing application id" });
      }

      if (request.method === "PATCH") {
        const body = (await readJsonBody<{ stage?: string }>(request)) ?? {};
        if (!body.stage) {
          return jsonResponse(400, { error: "Missing stage" });
        }
        const updated = await updateApplicationStage(
          auth.userId,
          id,
          body.stage,
        );
        if (!updated) {
          return jsonResponse(404, { error: "Application not found" });
        }
        return jsonResponse(200, updated);
      }

      const deleted = await deleteApplication(auth.userId, id);
      if (!deleted) {
        return jsonResponse(404, { error: "Application not found" });
      }
      return { status: 204 };
    } catch (error) {
      return errorResponse(error);
    }
  },
});
