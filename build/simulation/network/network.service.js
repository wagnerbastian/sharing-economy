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
exports.NetworkService = void 0;
var data = __importStar(require("../../config.json"));
var data_service_1 = require("../service/data.service");
var dijkstra_1 = require("../util/dijkstra");
var logger_1 = require("../util/logger");
var NetworkService = /** @class */ (function () {
    function NetworkService() {
        this.config = data.default;
        this.logger = new logger_1.Logger();
        this.dijkstra = new dijkstra_1.DijkstraService();
        this.graph = [];
        this.distances = [];
        this.usedSavedDistance = 0;
        this.dataService = new data_service_1.DataService();
    }
    NetworkService.prototype.createGraph = function (agents) {
        var _this = this;
        this.logger.system("Building Graph");
        agents.forEach(function (agent) {
            _this.graph.push({
                id: agent.id,
                neighbours: []
            });
        });
        this.setupNeighbours(agents);
    };
    NetworkService.prototype.setupNeighbours = function (agents) {
        var _this = this;
        this.logger.system("Building Neighbours");
        var minNeighbours = this.config.network.minNeighbours;
        var maxNeighbours = this.config.network.maxNeighbours;
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
                        this_1.distances.push({
                            from: this_1.graph[index].id,
                            to: possibleNeighbours[i].id,
                            distance: 1
                        });
                    }
                }
                ;
            }
        };
        var this_1 = this;
        for (var index = 0; index < this.graph.length; index++) {
            _loop_1(index);
        }
        this.generateGraphForDijkstraCalculation(agents);
    };
    NetworkService.prototype.generateGraphForDijkstraCalculation = function (agents) {
        var _this = this;
        var graph = {};
        this.graph.forEach(function (node) {
            var n = {};
            node.neighbours.forEach(function (neighbour) {
                n[neighbour.id] = 1;
            });
            graph[node.id] = n;
        });
        this.distanceGraph = graph;
        this.logger.system("finished Graphbuilding");
        var start = new Date();
        this.logger.system("Starting Graph Computing... this needs a lot of time...");
        agents.forEach(function (agent) {
            process.stdout.write(".");
            var d = _this.getDistancesForAgents(agent, agents.filter(function (a) { return a.id !== agent.id; }));
        });
        var end = new Date();
        var duration = (end.getTime() - start.getTime()) / 1000;
        if (duration > 0) {
            console.log('');
        }
        this.logger.system("Finished Graph Computing. Duration: " + duration);
    };
    ;
    NetworkService.prototype.getDistancesForAgents = function (from, to) {
        var _this = this;
        var result = [];
        to.forEach(function (t) {
            var dis = _this.distances.find(function (d) {
                return (d.from === from.id && d.to === t.id) || (d.to === from.id && d.from === t.id);
            });
            if (dis) {
                _this.usedSavedDistance++;
                result.push(dis);
            }
            else {
                // neu...
                var distance = _this.dijkstra.findShortestPath(_this.distanceGraph, from.id, t.id);
                var d = {
                    from: from.id,
                    to: t.id,
                    distance: distance.distance
                };
                _this.distances.push(d);
                result.push(d);
                if (d.distance > 2) {
                    _this.saveMiddleDistance(from.id, distance);
                }
            }
        });
        return result;
    };
    NetworkService.prototype.saveMiddleDistance = function (from, distance) {
        for (var d = 1; d < distance.path.length - 1; d++) {
            this.distances.push({
                from: from,
                to: Number(distance.path[d]),
                distance: d + 1,
            });
        }
    };
    NetworkService.prototype.findNodeIDWithDistanceOf = function (from, availableAgentsIn, distance) {
        var availableAgents = this.dataService.shuffleArray(JSON.parse(JSON.stringify(availableAgentsIn)));
        for (var index = 0; index < availableAgents.length; index++) {
            var dis = this.getDistancesForAgents(from, [availableAgents[index]]);
            if (dis[0].distance === distance) {
                return dis[0].to;
            }
        }
    };
    NetworkService.prototype.getNeighbourIDs = function (id) {
        var neighbours = this.graph.find(function (a) { return a.id === id; }).neighbours;
        var result = [];
        neighbours.forEach(function (n) { result.push(n.id); });
        return result;
    };
    return NetworkService;
}());
exports.NetworkService = NetworkService;
