import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { createWorkspace } from "@/services/workspace.service";

function isAppErrorLike(error: unknown): error is AppError & {
  statusCode: number;
  errorCode: string;
  details?: unknown;
} {
  return (
    !!error &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "AppError" &&
    "statusCode" in error &&
    "errorCode" in error
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw AppError.unauthorized();
    }

    const body = await request.json();

    const tenant = await createWorkspace(user.id, body);

    return NextResponse.json(
      {
        success: true,
        workspace: {
          id: tenant._id.toString(),
          name: tenant.companyName,
          subdomain: tenant.subdomain,
          billingEmail: tenant.billingEmail,
          plan: tenant.plan,
          status: tenant.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AppError || isAppErrorLike(error)) {
      const appError = error as AppError & {
        statusCode: number;
        errorCode: string;
        details?: unknown;
      };

      return NextResponse.json(
        {
          error: appError.message,
          code: appError.errorCode,
          ...(appError.details ? { details: appError.details } : {}),
        },
        { status: appError.statusCode },
      );
    }
    logger.error(
      error instanceof Error ? error : undefined,
      "Failed to create workspace",
    );

    return NextResponse.json(
      {
        error: "Unable to create workspace.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
