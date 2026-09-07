"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CreateWorkspaceFormData } from "../types";

interface Props {
  form: UseFormReturn<CreateWorkspaceFormData>;
}

export default function WorkspaceBasicsStep({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create your workspace</h1>

        <p className="mt-2 text-sm text-slate-500">
          Start by telling us a little about your workspace.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium"
          >
            Company name
          </label>

          <input
            id="companyName"
            {...register("companyName")}
            placeholder="Acme Inc"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />

          {errors.companyName && (
            <p className="mt-2 text-sm text-red-600">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subdomain" className="mb-2 block text-sm font-medium">
            Workspace URL
          </label>

          <div className="flex items-center rounded-xl border border-slate-200">
            <input
              id="subdomain"
              {...register("subdomain")}
              placeholder="acme"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 outline-none"
            />

            <span className="px-4 text-sm text-slate-500">.blu.test</span>
          </div>

          {errors.subdomain && (
            <p className="mt-2 text-sm text-red-600">
              {errors.subdomain.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
