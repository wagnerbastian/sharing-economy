import { Payoff, Strategy, StrategyDistribution } from "../module/strategy";
import * as data from '../../config.json';
import { Config } from "../module/config";
import { Agent } from "../module/agent";
import { PopulationInfo } from "../module/populationInfo";

export class StrategyService {
    config = (data as any).default as Config;

    constructor(private populationInfo: PopulationInfo) {}

    computeStrategySwitch(agentA: Agent, agentB: Agent): boolean {

        switch (this.config.strategy.decisionMethod) {
            case 'best': {
                return this.strategySwitchBest(agentA, agentB);
            }
            case 'original-wealth': {
                return this.strategySwitchOriginalWealth(agentA, agentB);
            }
        }


        
    }


    strategySwitchOriginalWealth(agentA: Agent, agentB: Agent): boolean {
        const wealthA = agentA.wealth - agentA.payoffHistory[agentA.payoffHistory.length - 1];
        const wealthB = agentB.wealth - agentB.payoffHistory[agentB.payoffHistory.length - 1];

        const prob = Math.max(0, wealthB - wealthA) / 
        (this.populationInfo.possibleWealth.individual.max - this.populationInfo.possibleWealth.individual.min)
        return Math.random() < prob;
    }


    /**
     * Vergleicht die beiden Reichtümer vor dem Handel und falls B reicher ist wird true zurück gegeben.
     */
    strategySwitchBest(agentA: Agent, agentB: Agent): boolean {
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
}