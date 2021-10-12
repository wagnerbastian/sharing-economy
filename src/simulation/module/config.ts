export type DecisionMethod = 'best' | 'original-wealth';
export type PairingMethod = 'simple' | 'dijkstra';

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
        pairingMethod: PairingMethod,
        enabled: boolean,
        minNeighbours: number,
        maxNeighbours: number,
        firstStepSubsetModifier: number,
        dijkstra: {
            preferredDistance: number,
            maxDistance: number
        }
    }
}


