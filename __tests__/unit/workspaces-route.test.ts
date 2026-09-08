// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  createWorkspace: vi.fn(),
}));

vi.mock("@/lib/auth/server", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("@/services/workspace.service", () => ({
  createWorkspace: mocks.createWorkspace,
}));

import { POST } from "@/app/api/workspaces/route";

const USER_ID = "507f1f77bcf86cd799439011";

const TENANT_ID = "507f1f77bcf86cd799439012";

const user = {
  id: USER_ID,
  email: "owner@example.com",
  name: "Workspace Owner",
};

const tenant = {
  _id: TENANT_ID,
  companyName: "Acme Inc",
  subdomain: "acme",
  billingEmail: "billing@acme.com",
  plan: "free",
  status: "trialing",
};

function createRequest(body?: unknown): NextRequest {
  return new Request("http://app.blu.test:3000/api/workspaces", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/workspaces", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getCurrentUser.mockResolvedValue(user);

    mocks.createWorkspace.mockResolvedValue(tenant);
  });

  it("returns 201 for a successfully created workspace", async () => {
    const response = await POST(
      createRequest({
        companyName: "Acme Inc",
        subdomain: "acme",
        billingEmail: "billing@acme.com",
        logo: "",
      }),
    );

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body).toEqual({
      success: true,
      workspace: {
        id: TENANT_ID,
        name: "Acme Inc",
        subdomain: "acme",
        billingEmail: "billing@acme.com",
        plan: "free",
        status: "trialing",
      },
    });

    expect(mocks.createWorkspace).toHaveBeenCalledOnce();

    expect(mocks.createWorkspace).toHaveBeenCalledWith(USER_ID, {
      companyName: "Acme Inc",
      subdomain: "acme",
      billingEmail: "billing@acme.com",
      logo: "",
    });
  });

  it("returns 401 when there is no authenticated user", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        companyName: "Acme Inc",
        subdomain: "acme",
        billingEmail: "billing@acme.com",
      }),
    );

    expect(response.status).toBe(401);

    const body = await response.json();

    expect(body).toEqual({
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    });

    expect(mocks.createWorkspace).not.toHaveBeenCalled();
  });

  it("maps AppError to the correct HTTP response", async () => {
    const error = new Error("This workspace subdomain is already taken.");

    Object.assign(error, {
      name: "AppError",
      statusCode: 409,
      errorCode: "CONFLICT",
      isOperational: true,
    });

    mocks.createWorkspace.mockRejectedValue(error);

    const response = await POST(
      createRequest({
        companyName: "Acme Inc",
        subdomain: "acme",
        billingEmail: "billing@acme.com",
      }),
    );

    expect(response.status).toBe(409);

    const body = await response.json();

    expect(body).toMatchObject({
      error: "This workspace subdomain is already taken.",
      code: "CONFLICT",
    });
  });

  it("returns details when AppError contains details", async () => {
    const error = new Error("Invalid workspace information.");

    Object.assign(error, {
      name: "AppError",
      statusCode: 400,
      errorCode: "BAD_REQUEST",
      isOperational: true,
      details: {
        companyName: ["Company name is too short."],
      },
    });

    mocks.createWorkspace.mockRejectedValue(error);

    const response = await POST(
      createRequest({
        companyName: "A",
        subdomain: "acme",
        billingEmail: "invalid",
      }),
    );

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body).toEqual({
      error: "Invalid workspace information.",
      code: "BAD_REQUEST",
      details: {
        companyName: ["Company name is too short."],
      },
    });
  });

  it("returns 500 for unexpected errors", async () => {
    mocks.createWorkspace.mockRejectedValue(new Error("database exploded"));

    const response = await POST(
      createRequest({
        companyName: "Acme Inc",
        subdomain: "acme",
        billingEmail: "billing@acme.com",
      }),
    );

    expect(response.status).toBe(500);

    const body = await response.json();

    expect(body).toEqual({
      error: "Unable to create workspace.",
      code: "INTERNAL_ERROR",
    });
  });

  it("returns 400 when the JSON body is null", async () => {
    const response = await POST(createRequest(null));

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body).toEqual({
      error: "Missing required fields.",
      code: "BAD_REQUEST",
    });
  });

  it("handles malformed JSON", async () => {
    const request = new Request("http://app.blu.test:3000/api/workspaces", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: "{invalid-json",
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
