export type DecisionMethod = 'best' | 'original-wealth';
export type PairingMethod = 'simple' | 'dijkstra' | 'network';

export interface Config {
    simulationData: {
        name: string,
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
        },
        networkPair: {
            edgeWeight: number,
            increaseFurther: boolean,
            decreaseFurther: boolean,
            circleAroundDistance: boolean
        }
    },
    communication: {
        enabled: boolean,
        minNeighbours: number,
        maxNeighbours: number,
        modifier: number,
        modifyAlways: boolean
    },
    analysis: {
        analyseLastPercentage: number
    }
}


