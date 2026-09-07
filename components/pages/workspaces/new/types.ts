import type { z } from "zod";

import { createWorkspaceSchema } from "@/lib/validations/workspace";

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
