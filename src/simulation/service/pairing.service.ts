import { Agent } from "../module/agent";

export class PairingService {

    simplePair(agents: Agent[]): {agentA: Agent, agentB: Agent} {
        const a = agents[Math.floor(Math.random() * agents.length)];

        let otherAgents = agents.filter(agent => agent.id !== a.id);

        const b = otherAgents[Math.floor(Math.random() * otherAgents.length)];        

        return {agentA: a, agentB: b};
    }
}