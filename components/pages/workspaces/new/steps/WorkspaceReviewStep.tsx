"use client";

import type { UseFormReturn } from "react-hook-form";

import { createWorkspaceSchema } from "@/lib/validations/workspace";

import { getWorkspaceBaseDomain } from "../workspace-domain";
import type { CreateWorkspaceFormData } from "../types";

interface Props {
  form: UseFormReturn<CreateWorkspaceFormData>;
}

export default function WorkspaceReviewStep({ form }: Props) {
  const values = createWorkspaceSchema.parse(form.getValues());

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Review workspace</h1>

      <p className="mt-2 text-sm text-slate-500">
        Make sure everything looks correct before creating the workspace.
      </p>

      <dl className="mt-8 divide-y divide-slate-100">
        <div className="flex justify-between py-4">
          <dt className="text-sm text-slate-500">Company</dt>

          <dd className="text-sm font-medium">{values.companyName}</dd>
        </div>

        <div className="flex justify-between py-4">
          <dt className="text-sm text-slate-500">Workspace URL</dt>

          <dd className="text-sm font-medium">
            {values.subdomain}.{getWorkspaceBaseDomain()}
          </dd>
        </div>

        <div className="flex justify-between py-4">
          <dt className="text-sm text-slate-500">Billing email</dt>

          <dd className="text-sm font-medium">{values.billingEmail}</dd>
        </div>
      </dl>
    </section>
  );
}
