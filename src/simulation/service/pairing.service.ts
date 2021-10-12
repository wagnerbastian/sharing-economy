import {
    Agent
} from "../module/agent";
import {
    NetworkService
} from "../network/network.service";
import {
    DataService
} from "./data.service";
import * as data from '../../config.json';
import {
    Config
} from "../module";

export class PairingService {
    config = (data as any).default as Config;
    dataService = new DataService();

    constructor(private networkService: NetworkService) {}

    simplePair(agents: Agent[]): {
        agentA: Agent,
        agentB: Agent
    } {
        const a = agents[Math.floor(Math.random() * agents.length)];

        let otherAgents = agents.filter(agent => agent.id !== a.id);

        const b = otherAgents[Math.floor(Math.random() * otherAgents.length)];

        return {
            agentA: a,
            agentB: b
        };
    }

    dijkstraPair(agentsIn: Agent[], step: number): {
        agentA: Agent,
        agentB: Agent
    } {
        const preferredDistance = this.config.network.dijkstra.preferredDistance;
        const maxDistance = this.config.network.dijkstra.maxDistance;
        const agentA = agentsIn[Math.floor(Math.random() * agentsIn.length)];
        const agents = agentsIn.filter(agent => agentA.id !== agent.id);

        for (let index = preferredDistance; index > 0; index--) {
            const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, index);

            if (id != null) {
                return {
                    agentA,
                    agentB: agentsIn.find(agent => agent.id === id)
                }
            }
        }
        for (let index = preferredDistance + 1; index <= maxDistance; index++) {
            const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, index);

            if (id != null) {
                return {
                    agentA,
                    agentB: agentsIn.find(agent => agent.id === id)
                }
            }
        }

        let distance = this.networkService.getDistancesForAgents(agentA, agents);
        console.log(distance);

        // testing
        console.log("ended here", agentsIn.length);


    }
}
