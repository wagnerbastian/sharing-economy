import {
    Agent, AgentPair
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
import { Logger } from "../util";

export class PairingService {
    config = (data as any).default as Config;
    dataService = new DataService();
    logger = new Logger();
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

    dijkstraPair(agentsIn: Agent[], step: number): AgentPair {
        this.logger.inline(' ')
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

    networkPair(agentsIn: Agent[]): AgentPair {
        this.logger.inline(' ')
        const agentA = agentsIn[Math.floor(Math.random() * agentsIn.length)];
        const edgeWeight = this.config.network.networkPair.edgeWeight;
        const agents = agentsIn.filter(agent => agentA.id !== agent.id);

        // distanz errechnen die der Agent l??uft.
        let distance = 1;
        for (let i = 0; i < this.config.simulationData.agents; i++) {
            if (Math.random() > edgeWeight) {
                distance++;
            } else {
                break;
            }
        }

        if (this.config.network.networkPair.circleAroundDistance) {
            // "umkreisen"
            for (let index = 1; index < agents.length - distance; index++) {
                if (distance - index > 0) {
                    const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, distance - index);
                    if (id != null) {
                        return {
                            agentA,
                            agentB: agentsIn.find(agent => agent.id === id)
                        }
                    }
                }

                const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, distance - index);
                    if (id != null) {
                        return {
                            agentA,
                            agentB: agentsIn.find(agent => agent.id === id)
                        }
                    }
            }
        }

        // durchsuche alle weiter entfernten
        if (this.config.network.networkPair.increaseFurther) {
            for (let index = distance; index < agents.length; index++) {
                const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
                if (id != null) {
                    return {
                        agentA,
                        agentB: agentsIn.find(agent => agent.id === id)
                    }
                }
            }   
        }

        // durchsuche alle n??heren
        if (this.config.network.networkPair.decreaseFurther) {
            for (let index = distance - 1; index > 0; index--) {
                const id = this.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
    
                if (id != null) {
                    return {
                        agentA,
                        agentB: agentsIn.find(agent => agent.id === id)
                    }
                }
            }
        }

        
        
        return {agentA, agentB: null}

    }
}
