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
exports.CommunicationService = void 0;
var data = __importStar(require("../../config.json"));
var data_service_1 = require("../service/data.service");
var util_1 = require("../util");
var CommunicationService = /** @class */ (function () {
    function CommunicationService() {
        this.config = data.default;
        this.logger = new util_1.Logger();
        this.dijkstra = new util_1.DijkstraService();
        this.dataService = new data_service_1.DataService();
        this.graph = [];
    }
    CommunicationService.prototype.createCommunicationGraph = function (agents) {
        var _this = this;
        if (!this.config.communication.enabled) {
            return;
        }
        this.logger.system("Building Communication Graph");
        agents.forEach(function (agent) {
            _this.graph.push({
                id: agent.id,
                neighbours: []
            });
        });
        this.setupNeighbours();
    };
    CommunicationService.prototype.setupNeighbours = function () {
        var _this = this;
        this.logger.system("Building Communication Neighbours");
        var minNeighbours = this.config.communication.minNeighbours;
        var maxNeighbours = this.config.communication.maxNeighbours;
        var _loop_1 = function (index) {
            if (this_1.graph[index].neighbours.length < maxNeighbours) {
                // Anzahl der Nachbarn zufällig generieren
                var possibleNeighbours = this_1.graph.filter(function (node) {
                    return node.neighbours.length < maxNeighbours && node.id !== _this.graph[index].id;
                });
                var n = Math.min((Math.floor(Math.random() * (maxNeighbours - minNeighbours))) + minNeighbours, possibleNeighbours.length);
                possibleNeighbours = this_1.dataService.shuffleArray(possibleNeighbours);
                //Nachbarn zuweisen
                for (var i = 0; i < n; i++) {
                    if (possibleNeighbours[i].neighbours.length < maxNeighbours && this_1.graph[index].neighbours.length < maxNeighbours) {
                        this_1.graph[index].neighbours.push(possibleNeighbours[i]);
                        possibleNeighbours[i].neighbours.push(this_1.graph[index]);
                    }
                }
                ;
            }
        };
        var this_1 = this;
        for (var index = 0; index < this.graph.length; index++) {
            _loop_1(index);
        }
        this.logger.system("Finished Building Communication Graph");
    };
    CommunicationService.prototype.getNeighbourIDs = function (id) {
        var result = [];
        this.graph.find(function (node) { return node.id === id; }).neighbours.forEach(function (neighbour) {
            result.push(neighbour.id);
        });
        return result;
    };
    return CommunicationService;
}());
exports.CommunicationService = CommunicationService;
