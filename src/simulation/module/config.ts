export type DecisionMethod = 'best' | 'original-wealth';
export type PairingMethod = 'simple';

export interface Config {
    simulationData: {
        agents: number,
        steps: number,
        repititions: number
    },
    payoff: {
        r: number,
        temp: number,
        s: number,
        x: number
    },
    strategy: {
        decisionMethod: DecisionMethod,
        distribution: number[]
    },
    network: {
        pairingMethod: PairingMethod
    }
}


