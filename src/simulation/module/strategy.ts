export interface Strategy {
    id: number;
    name: StrategyName;
    payoff: Payoff;
    distribution: number;
}

export interface Payoff {
    tc: number;
    tp: number;
    uc: number;
    up: number;
}

export interface StrategyDistribution {
    tc: number;
    tp: number;
    uc: number;
    up: number;
}

export type StrategyName = 'tc' | 'tp' | 'uc' | 'up';