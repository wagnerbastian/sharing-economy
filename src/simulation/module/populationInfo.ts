import { StrategyDistribution } from "./strategy";

export interface PopulationInfo {
    possibleWealth: {
        total: {
            max: number,
            min: number
        },
        individual: {
            max: number,
            min: number
        }
    };
    strategyDistribution: 
        {
            rep: number,
            distributions: StrategyDistribution[]
        }[]
    
}