"use client";

import type { UseFormReturn } from "react-hook-form";

import type { CreateWorkspaceFormData } from "../types";

interface Props {
  form: UseFormReturn<CreateWorkspaceFormData>;
}

export default function WorkspaceConfigStep({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Workspace configuration</h1>

        <p className="mt-2 text-sm text-slate-500">
          Configure the workspace owner and billing contact.
        </p>
      </div>

      <div>
        <label
          htmlFor="billingEmail"
          className="mb-2 block text-sm font-medium"
        >
          Billing email
        </label>

        <input
          id="billingEmail"
          type="email"
          {...register("billingEmail")}
          placeholder="billing@acme.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
        />

        {errors.billingEmail && (
          <p className="mt-2 text-sm text-red-600">
            {errors.billingEmail.message}
          </p>
        )}
      </div>
    </section>
  );
}
