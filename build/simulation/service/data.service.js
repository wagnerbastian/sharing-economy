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
exports.DataService = void 0;
var data = __importStar(require("../../config.json"));
var agent_1 = require("../module/agent");
var DataService = /** @class */ (function () {
    function DataService() {
        this.config = data.default;
    }
    DataService.prototype.createStrategies = function () {
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
        ];
    };
    DataService.prototype.createAgents = function (strategies) {
        var agents = [];
        for (var index = 0; index < this.config.simulationData.agents; index++) {
            agents.push(new agent_1.Agent(index));
        }
        return this.distributeStrategies(agents, strategies);
    };
    DataService.prototype.distributeStrategies = function (agents, strategies) {
        var numberOfAgents = this.config.simulationData.agents;
        for (var index = 0; index < this.config.simulationData.agents; index++) {
            if (numberOfAgents * strategies[0].distribution > index) {
                agents[index].strategy = strategies[0];
            }
            else if (numberOfAgents * strategies[1].distribution > index) {
                agents[index].strategy = strategies[1];
            }
            else if (numberOfAgents * strategies[2].distribution > index) {
                agents[index].strategy = strategies[2];
            }
            else if (numberOfAgents * strategies[3].distribution > index) {
                agents[index].strategy = strategies[3];
            }
        }
        return this.shuffleArray(agents);
    };
    DataService.prototype.createPopulationInfo = function () {
        return {
            simulationInfo: {
                strategyDistribution: {
                    initial: null,
                    final: []
                }
            },
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
        };
    };
    DataService.prototype.shuffleArray = function (a) {
        var _a;
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
        }
        return a;
    };
    DataService.prototype.getMaxPayoff = function () {
        return Math.max(this.config.payoff.r, this.config.payoff.s * -1, this.config.payoff.x, this.config.payoff.x * -1, this.config.payoff.temp);
    };
    DataService.prototype.getMinPayoff = function () {
        return Math.min(this.config.payoff.r, this.config.payoff.s * -1, this.config.payoff.x, this.config.payoff.x * -1, this.config.payoff.temp);
    };
    return DataService;
}());
exports.DataService = DataService;
