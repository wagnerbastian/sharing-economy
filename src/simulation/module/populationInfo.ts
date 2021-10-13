import { StrategyDistribution } from "./strategy";

export interface PopulationInfo {
  simulationInfo: {
    name: string,
    agents: number,
    steps: number,
    repititions: number,
    strategyDistribution: {
      initial: StrategyDistribution,
      final: StrategyDistribution[]
    },
    start: string,
    end: string,
    duration: number,
    durationMinutes: number,
    durationHours: number
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
