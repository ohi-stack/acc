import { randomUUID } from "crypto";
import { Workflow } from "../types/models";

export class WorkflowRegistry {
  private workflows: Workflow[] = [];

  list(): Workflow[] {
    return this.workflows;
  }

  create(input: Pick<Workflow, "name" | "steps">): Workflow {
    const workflow: Workflow = {
      id: randomUUID(),
      name: input.name,
      steps: input.steps,
      status: "draft",
      createdAt: new Date().toISOString()
    };

    this.workflows.push(workflow);
    return workflow;
  }
}
