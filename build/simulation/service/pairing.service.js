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
var PairingService = /** @class */ (function () {
    function PairingService(networkService) {
        this.networkService = networkService;
        this.config = data.default;
        this.dataService = new data_service_1.DataService();
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
    return PairingService;
}());
exports.PairingService = PairingService;
