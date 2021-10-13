import { Payoff, Strategy, StrategyDistribution, StrategyName } from "../module/strategy";
import * as data from '../../config.json';
import { Config, PopulationInfo, Agent } from "../module";
import { CommunicationService } from "../network";


export class StrategyService {
    config = (data as any).default as Config;

    constructor(private populationInfo: PopulationInfo, private communicationService: CommunicationService) {}

    computeStrategySwitch(agentA: Agent, agentB: Agent, initialAgents: Agent[]): boolean {

        switch (this.config.strategy.decisionMethod) {
            case 'best': {
                return this.strategySwitchBest(agentA, agentB, initialAgents);
            }
            case 'original-wealth': {
                return this.strategySwitchOriginalWealth(agentA, agentB, initialAgents);
            }
        }


        
    }


    strategySwitchOriginalWealth(agentA: Agent, agentB: Agent, initialAgents: Agent[]): boolean {
        const wealthA = agentA.wealth - agentA.payoffHistory[agentA.payoffHistory.length - 1];
        const wealthB = agentB.wealth - agentB.payoffHistory[agentB.payoffHistory.length - 1];

        let prob = Math.max(0, wealthB - wealthA) / 
        (this.populationInfo.possibleWealth.individual.max - this.populationInfo.possibleWealth.individual.min);

        prob += this.getCommunicationModifier(agentA, agentB, prob, initialAgents);
        return Math.random() < prob;
    }


    /**
     * Vergleicht die beiden Reichtümer vor dem Handel und falls B reicher ist wird true zurück gegeben.
     */
    strategySwitchBest(agentA: Agent, agentB: Agent, initialAgents: Agent[]): boolean {
        const wealthA = agentA.wealth - agentA.payoffHistory[agentA.payoffHistory.length - 1];
        const wealthB = agentB.wealth - agentB.payoffHistory[agentB.payoffHistory.length - 1];
        return wealthB > wealthA;
    }



    getStrategyDistribution(agents: Agent[]): StrategyDistribution {
        const result: StrategyDistribution = { tc: 0, tp: 0, uc: 0, up: 0};

        agents.forEach(agent => {
            result[agent.strategy.name]++;
        });
        return result;
    }

    getCommunicationModifier(agentA: Agent, agentB: Agent, prob: number, initialAgents: Agent[]): number {
        if ((prob === 0 && !this.config.communication.modifyAlways) || !this.config.communication.enabled) {
            return 0;
        }

        const neighbours = initialAgents.filter(agent => this.communicationService.getNeighbourIDs(agentA.id).includes(agent.id) && agentA.id !== agent.id);
        const maxStrategies: StrategyName[] = [];

        let tp = 0;
        let tc = 0;
        let uc = 0;
        let up = 0;

        neighbours.forEach(neighbour => {
            if (neighbour.strategy.name === 'tc') {tc++; }
            else if (neighbour.strategy.name === 'tp') {tp++; }
            else if (neighbour.strategy.name === 'up') {up++; }
            else if (neighbour.strategy.name === 'uc') {uc++; }
        });

        const max = Math.max(tp, tc, uc, up);
        if (tc === max) {maxStrategies.push('tc')}
        if (tp === max) {maxStrategies.push('tp')}
        if (up === max) {maxStrategies.push('up')}
        if (uc === max) {maxStrategies.push('uc')}
        

        if (maxStrategies.includes(initialAgents.find(agent => agent.id === agentB.id).strategy.name)) {
            
            return this.config.communication.modifier;
        }    
        return 0;
    }
}