import { StrategyDistribution } from "./strategy";

export interface PopulationInfo {
  simulationInfo: {
    strategyDistribution: {
      initial: StrategyDistribution,
      final: StrategyDistribution[]
    }
  },
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
