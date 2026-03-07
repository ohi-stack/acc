import { randomUUID } from "crypto";
import { Agent } from "../types/models";

export class AgentManager {
  private agents: Agent[] = [];

  list(): Agent[] {
    return this.agents;
  }

  create(input: Pick<Agent, "name" | "type" | "capabilities">): Agent {
    const agent: Agent = {
      id: randomUUID(),
      name: input.name,
      type: input.type,
      capabilities: input.capabilities,
      status: "idle",
      createdAt: new Date().toISOString()
    };

    this.agents.push(agent);
    return agent;
  }
}
