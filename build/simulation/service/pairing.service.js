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
exports.PairingService = void 0;
var data_service_1 = require("./data.service");
var data = __importStar(require("../../config.json"));
var util_1 = require("../util");
var PairingService = /** @class */ (function () {
    function PairingService(networkService) {
        this.networkService = networkService;
        this.config = data.default;
        this.dataService = new data_service_1.DataService();
        this.logger = new util_1.Logger();
    }
    PairingService.prototype.simplePair = function (agents) {
        var a = agents[Math.floor(Math.random() * agents.length)];
        var otherAgents = agents.filter(function (agent) { return agent.id !== a.id; });
        var b = otherAgents[Math.floor(Math.random() * otherAgents.length)];
        return {
            agentA: a,
            agentB: b
        };
    };
    PairingService.prototype.dijkstraPair = function (agentsIn, step) {
        this.logger.inline(' ');
        var preferredDistance = this.config.network.dijkstra.preferredDistance;
        var maxDistance = this.config.network.dijkstra.maxDistance;
        var agentA = agentsIn[Math.floor(Math.random() * agentsIn.length)];
        var agents = agentsIn.filter(function (agent) { return agentA.id !== agent.id; });
        var _loop_1 = function (index) {
            var id = this_1.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
            if (id != null) {
                return { value: {
                        agentA: agentA,
                        agentB: agentsIn.find(function (agent) { return agent.id === id; })
                    } };
            }
        };
        var this_1 = this;
        for (var index = preferredDistance; index > 0; index--) {
            var state_1 = _loop_1(index);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var _loop_2 = function (index) {
            var id = this_2.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
            if (id != null) {
                return { value: {
                        agentA: agentA,
                        agentB: agentsIn.find(function (agent) { return agent.id === id; })
                    } };
            }
        };
        var this_2 = this;
        for (var index = preferredDistance + 1; index <= maxDistance; index++) {
            var state_2 = _loop_2(index);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        var distance = this.networkService.getDistancesForAgents(agentA, agents);
        console.log(distance);
        // testing
        console.log("ended here", agentsIn.length);
    };
    PairingService.prototype.networkPair = function (agentsIn) {
        this.logger.inline(' ');
        var agentA = agentsIn[Math.floor(Math.random() * agentsIn.length)];
        var edgeWeight = this.config.network.networkPair.edgeWeight;
        var agents = agentsIn.filter(function (agent) { return agentA.id !== agent.id; });
        // distanz errechnen die der Agent läuft.
        var distance = 1;
        for (var i = 0; i < this.config.simulationData.agents; i++) {
            if (Math.random() > edgeWeight) {
                distance++;
            }
            else {
                break;
            }
        }
        if (this.config.network.networkPair.circleAroundDistance) {
            var _loop_3 = function (index) {
                if (distance - index > 0) {
                    var id_1 = this_3.networkService.findNodeIDWithDistanceOf(agentA, agents, distance - index);
                    if (id_1 != null) {
                        return { value: {
                                agentA: agentA,
                                agentB: agentsIn.find(function (agent) { return agent.id === id_1; })
                            } };
                    }
                }
                var id = this_3.networkService.findNodeIDWithDistanceOf(agentA, agents, distance - index);
                if (id != null) {
                    return { value: {
                            agentA: agentA,
                            agentB: agentsIn.find(function (agent) { return agent.id === id; })
                        } };
                }
            };
            var this_3 = this;
            // "umkreisen"
            for (var index = 1; index < agents.length - distance; index++) {
                var state_3 = _loop_3(index);
                if (typeof state_3 === "object")
                    return state_3.value;
            }
        }
        // durchsuche alle weiter entfernten
        if (this.config.network.networkPair.increaseFurther) {
            var _loop_4 = function (index) {
                var id = this_4.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
                if (id != null) {
                    return { value: {
                            agentA: agentA,
                            agentB: agentsIn.find(function (agent) { return agent.id === id; })
                        } };
                }
            };
            var this_4 = this;
            for (var index = distance; index < agents.length; index++) {
                var state_4 = _loop_4(index);
                if (typeof state_4 === "object")
                    return state_4.value;
            }
        }
        // durchsuche alle näheren
        if (this.config.network.networkPair.decreaseFurther) {
            var _loop_5 = function (index) {
                var id = this_5.networkService.findNodeIDWithDistanceOf(agentA, agents, index);
                if (id != null) {
                    return { value: {
                            agentA: agentA,
                            agentB: agentsIn.find(function (agent) { return agent.id === id; })
                        } };
                }
            };
            var this_5 = this;
            for (var index = distance - 1; index > 0; index--) {
                var state_5 = _loop_5(index);
                if (typeof state_5 === "object")
                    return state_5.value;
            }
        }
        return { agentA: agentA, agentB: null };
    };
    return PairingService;
}());
exports.PairingService = PairingService;
