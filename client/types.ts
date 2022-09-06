export type ProjectStatus = "CREATING" | "CREATED";

export type SandboxDocument = {
  lastError?: string;
  sandboxId: string;
  status: ProjectStatus;
  type: string;
};
