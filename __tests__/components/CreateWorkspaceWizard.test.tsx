import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import CreateWorkspaceWizard from "@/components/pages/workspaces/new/CreateWorkspaceWizard";

describe("CreateWorkspaceWizard", () => {
  it("advances to the second step when the first-step fields are valid", async () => {
    const user = userEvent.setup();

    render(<CreateWorkspaceWizard />);

    await user.type(screen.getByLabelText("Company name"), "Acme Inc");
    await user.type(screen.getByLabelText("Workspace URL"), "acme");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.getByText("Workspace configuration")).toBeInTheDocument();
    });
  });
});
