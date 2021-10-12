import { Strategy, StrategyName } from "./strategy";

export class Agent {
    id: number;
    wealth: number;
    strategy: Strategy;
    payoffHistory: number[];
    didTradeInThisStep: boolean;

    constructor(id: number) {
        this.id = id;
        this.wealth = 0;
        this.payoffHistory = [];
        this.didTradeInThisStep = false;
    }

}