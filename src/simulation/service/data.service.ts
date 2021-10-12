import { Payoff, Strategy } from "../module/strategy";
import * as data from '../../config.json';
import { Config } from "../module/config";
import { Agent } from "../module/agent";
import { PopulationInfo } from "../module/populationInfo";


export class DataService {
    config = (data as any).default as Config;


    createStrategies(): Strategy[] {
        return [
            {
                id: 0,
                name: 'tp',
                payoff: {
                    tp: 0,
                    tc: this.config.payoff.r,
                    up: 0,
                    uc: this.config.payoff.s * -1
                },
                distribution: this.config.strategy.distribution[0]
            },
            {
                id: 1,
                name: 'tc',
                payoff: {
                    tp: this.config.payoff.r,
                    tc: 0,
                    up: this.config.payoff.x * -1,
                    uc: 0
                },
                distribution: this.config.strategy.distribution[1]
            },
            {
                id: 2,
                name: 'up',
                payoff: {
                    tp: 0,
                    tc: this.config.payoff.x,
                    up: 0,
                    uc: this.config.payoff.x
                },
                distribution: this.config.strategy.distribution[2]
            },
            {
                id: 3,
                name: 'uc',
                payoff: {
                    tp: this.config.payoff.temp,
                    tc: 0,
                    up: this.config.payoff.x * -1,
                    uc: 0
                },
                distribution: this.config.strategy.distribution[3]
            }
        ]
    }



    createAgents(strategies: Strategy[]): Agent[] {
        const agents = [];
        for (let index = 0; index < this.config.simulationData.agents; index++) {
            agents.push(
                new Agent(index)
            );
        }
        return this.distributeStrategies(agents, strategies);
    }

    distributeStrategies(agents: Agent[], strategies: Strategy[]): Agent[] {
        const numberOfAgents = this.config.simulationData.agents;
        for (let index = 0; index < this.config.simulationData.agents; index++) {
            if (numberOfAgents * strategies[0].distribution > index) {
                agents[index].strategy = strategies[0];
            } else if (numberOfAgents * strategies[1].distribution > index) {
                agents[index].strategy = strategies[1];
            } else if (numberOfAgents * strategies[2].distribution > index) {
                agents[index].strategy = strategies[2];
            } else if (numberOfAgents * strategies[3].distribution > index) {
                agents[index].strategy = strategies[3];
            }
        }
        return this.shuffleArray(agents);
    }


    createPopulationInfo(): PopulationInfo {
        return {
            possibleWealth: {
                total: {
                    max: 0,
                    min: 0
                },
                individual: {
                    max: 0,
                    min: 0
                }
            },
            strategyDistribution: []
        }
    }


    shuffleArray (a: any[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    getMaxPayoff(): number {
        return Math.max(
            this.config.payoff.r,
            this.config.payoff.s * -1,
            this.config.payoff.x,
            this.config.payoff.x * -1,
            this.config.payoff.temp,
        )
    }

    getMinPayoff(): number {
        return Math.min(
            this.config.payoff.r,
            this.config.payoff.s * -1,
            this.config.payoff.x,
            this.config.payoff.x * -1,
            this.config.payoff.temp,
        )
    }
}