"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
var data = __importStar(require("../../config.json"));
var StrategyService = /** @class */ (function () {
    function StrategyService(populationInfo) {
        this.populationInfo = populationInfo;
        this.config = data.default;
    }
    StrategyService.prototype.computeStrategySwitch = function (agentA, agentB) {
        switch (this.config.strategy.decisionMethod) {
            case 'best': {
                return this.strategySwitchBest(agentA, agentB);
            }
            case 'original-wealth': {
                return this.strategySwitchOriginalWealth(agentA, agentB);
            }
        }
    };
    StrategyService.prototype.strategySwitchOriginalWealth = function (agentA, agentB) {
        var wealthA = agentA.wealth - agentA.payoffHistory[agentA.payoffHistory.length - 1];
        var wealthB = agentB.wealth - agentB.payoffHistory[agentB.payoffHistory.length - 1];
        var prob = Math.max(0, wealthB - wealthA) /
            (this.populationInfo.possibleWealth.individual.max - this.populationInfo.possibleWealth.individual.min);
        return Math.random() < prob;
    };
    /**
     * Vergleicht die beiden Reichtümer vor dem Handel und falls B reicher ist wird true zurück gegeben.
     */
    StrategyService.prototype.strategySwitchBest = function (agentA, agentB) {
        var wealthA = agentA.wealth - agentA.payoffHistory[agentA.payoffHistory.length - 1];
        var wealthB = agentB.wealth - agentB.payoffHistory[agentB.payoffHistory.length - 1];
        return wealthB > wealthA;
    };
    StrategyService.prototype.getStrategyDistribution = function (agents) {
        var result = { tc: 0, tp: 0, uc: 0, up: 0 };
        agents.forEach(function (agent) {
            result[agent.strategy.name]++;
        });
        return result;
    };
    return StrategyService;
}());
exports.StrategyService = StrategyService;
