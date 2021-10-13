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
exports.Simulation = void 0;
var data = __importStar(require("../config.json"));
var network_1 = require("./network");
var service_1 = require("./service");
var logger_1 = require("./util/logger");
var Simulation = /** @class */ (function () {
    function Simulation() {
        this.logger = new logger_1.Logger();
        this.config = data.default;
        this.dataService = new service_1.DataService();
        this.populationInfo = this.dataService.createPopulationInfo();
        this.networkService = new network_1.NetworkService();
        this.communicationService = new network_1.CommunicationService();
        this.pairingService = new service_1.PairingService(this.networkService);
        this.strategyService = new service_1.StrategyService(this.populationInfo, this.communicationService);
        this.strategies = this.dataService.createStrategies();
        this.agents = this.dataService.createAgents(this.strategies);
        this.runSimulation();
    }
    Simulation.prototype.runSimulation = function () {
        this.logger.system("Starting Simulation: " + this.config.simulationData.name + " with " + this.config.simulationData.agents + " agents, Communication: " + this.config.communication.enabled);
        this.networkService.createGraph(this.agents);
        this.communicationService.createCommunicationGraph(this.agents);
        this.populationInfo.simulationInfo.strategyDistribution.initial = this.strategyService.getStrategyDistribution(this.agents);
        // console.log(this.networkService.getDistancesForAgents(this.agents[2], [this.agents[80], this.agents[45]]));
        // ___
        for (var repitition = 1; repitition <= this.config.simulationData.repititions; repitition++) {
            this.logger.system('Starting Repition ' + repitition);
            // agenten für jeden Durchlauf kopieren damit man ein neues Set hat
            var agents = JSON.parse(JSON.stringify(this.agents));
            for (var step = 1; step <= this.config.simulationData.steps; step++) {
                this.logger.logStep(step);
                // console.log("- Starting Step", step);
                this.makeAllAgentsAvailableForTrading(agents);
                var agentsAtTheBeginningOfTheStep = JSON.parse(JSON.stringify(agents));
                // 2 Agenten zum Handeln suchen
                // Strategie auswählen
                switch (this.config.network.pairingMethod) {
                    case 'simple': {
                        var availableAgentsCounter = agents.length;
                        var _loop_1 = function () {
                            // solange wie es Paare gibt die Handeln können, werden sie gesucht und es wird gehandelt.
                            var availableAgents = agents.filter(function (agent) { return !agent.didTradeInThisStep; });
                            availableAgentsCounter = availableAgents.length;
                            var agentsToTrade = this_1.pairingService.simplePair(availableAgents);
                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                return "break";
                            }
                            // Handel
                            this_1.trade(agentsToTrade.agentA, agentsToTrade.agentB);
                            // strategiewechsel berechnen...
                            if (this_1.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                // a switcht zu b
                                agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentB.id; }).strategy;
                            }
                            if (this_1.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                // b switcht zu a
                                agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentA.id; }).strategy;
                            }
                        };
                        var this_1 = this;
                        while (availableAgentsCounter > 1) {
                            var state_1 = _loop_1();
                            if (state_1 === "break")
                                break;
                        }
                        break;
                    }
                    case 'dijkstra': {
                        var availableAgentsCounter = agents.length;
                        var _loop_2 = function () {
                            // solange wie es Paare gibt die Handeln können, werden sie gesucht und es wird gehandelt.
                            var availableAgents = agents.filter(function (agent) { return !agent.didTradeInThisStep; });
                            availableAgentsCounter = availableAgents.length;
                            var agentsToTrade = this_2.pairingService.dijkstraPair(availableAgents, step);
                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                // es wurde kein gültiges Paar gefunden, Agent bricht den Handel ab.
                                if (agentsToTrade.agentA) {
                                    agentsToTrade.agentA.didTradeInThisStep = true;
                                    agentsToTrade.agentA.payoffHistory.push(0);
                                }
                                else {
                                    agentsToTrade.agentB.didTradeInThisStep = true;
                                    agentsToTrade.agentB.payoffHistory.push(0);
                                }
                            }
                            else {
                                // Handel
                                this_2.trade(agentsToTrade.agentA, agentsToTrade.agentB);
                                // strategiewechsel berechnen...
                                if (this_2.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                    // a switcht zu b
                                    agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentB.id; }).strategy;
                                }
                                if (this_2.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                    // b switcht zu a
                                    agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentA.id; }).strategy;
                                }
                            }
                        };
                        var this_2 = this;
                        while (availableAgentsCounter > 3) {
                            _loop_2();
                        }
                        break;
                    }
                    case 'network': {
                        var availableAgentsCounter = agents.length;
                        var _loop_3 = function () {
                            var availableAgents = agents.filter(function (agent) { return !agent.didTradeInThisStep; });
                            availableAgentsCounter = availableAgents.length;
                            var agentsToTrade = this_3.pairingService.networkPair(agents);
                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                // es wurde kein gültiges Paar gefunden, Agent bricht den Handel ab.
                                if (agentsToTrade.agentA) {
                                    agentsToTrade.agentA.didTradeInThisStep = true;
                                    agentsToTrade.agentA.payoffHistory.push(0);
                                }
                                else {
                                    agentsToTrade.agentB.didTradeInThisStep = true;
                                    agentsToTrade.agentB.payoffHistory.push(0);
                                }
                            }
                            else {
                                // Es wurde ein gültiges paar gefunden und es handelt
                                // Handel
                                this_3.trade(agentsToTrade.agentA, agentsToTrade.agentB);
                                // strategiewechsel berechnen...
                                if (this_3.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                    // a switcht zu b
                                    agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentB.id; }).strategy;
                                }
                                if (this_3.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                    // b switcht zu a
                                    agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(function (agent) { return agent.id === agentsToTrade.agentA.id; }).strategy;
                                }
                            }
                        };
                        var this_3 = this;
                        while (availableAgentsCounter > 3) {
                            _loop_3();
                        }
                        break;
                    }
                }
                // PopulationInfo updaten
                this.updatePopulationInfo(step, agents, repitition);
            }
            // Ende des Durchlaufs
            console.log('\n', this.strategyService.getStrategyDistribution(agents));
            this.populationInfo.simulationInfo.strategyDistribution.final.push(this.strategyService.getStrategyDistribution(agents));
        }
        this.populationInfo.simulationInfo.end = new Date().toISOString();
        this.populationInfo.simulationInfo.duration = (new Date(this.populationInfo.simulationInfo.end).getTime() - new Date(this.populationInfo.simulationInfo.start).getTime()) / 1000;
        this.populationInfo.simulationInfo.durationMinutes = this.populationInfo.simulationInfo.duration / 60;
        this.populationInfo.simulationInfo.durationHours = this.populationInfo.simulationInfo.durationMinutes / 60;
        this.logger.writeFile(this.populationInfo);
        // console.log("Connections saved: ", this.networkService.distances.length, "used saved: ", this.networkService.usedSavedDistance);
        // this.logger.write(this.networkService.distances, 'distances.json')
    };
    /**
     * Setzt alle Agenten auf verfügbar.
     */
    Simulation.prototype.makeAllAgentsAvailableForTrading = function (agents) {
        agents.forEach(function (agent) {
            agent.didTradeInThisStep = false;
        });
    };
    /**
     * Die beiden Agenten handeln miteinander.
     */
    Simulation.prototype.trade = function (agentA, agentB) {
        var payoffA = agentA.strategy.payoff[agentB.strategy.name];
        agentA.wealth += payoffA;
        agentA.payoffHistory.push(payoffA);
        agentA.didTradeInThisStep = true;
        var payoffB = agentB.strategy.payoff[agentA.strategy.name];
        agentB.wealth += payoffB;
        agentB.payoffHistory.push(payoffB);
        agentB.didTradeInThisStep = true;
    };
    Simulation.prototype.updatePopulationInfo = function (step, agents, repition) {
        this.populationInfo.possibleWealth.individual.max += this.dataService.getMaxPayoff();
        this.populationInfo.possibleWealth.individual.min += this.dataService.getMinPayoff();
        // Strategieverteilung im Verlauf für jede Wiederholung hinzufügen
        if (this.populationInfo.strategyDistribution.length === 0) {
            this.populationInfo.strategyDistribution.push({
                rep: repition,
                distributions: [this.strategyService.getStrategyDistribution(agents)]
            });
        }
        else {
            var exists = false;
            for (var i = 0; i < this.populationInfo.strategyDistribution.length; i++) {
                if (repition === this.populationInfo.strategyDistribution[i].rep) {
                    this.populationInfo.strategyDistribution[i].distributions.push(this.strategyService.getStrategyDistribution(agents));
                    exists = true;
                }
            }
            if (!exists) {
                this.populationInfo.strategyDistribution.push({
                    rep: repition,
                    distributions: [this.strategyService.getStrategyDistribution(agents)]
                });
            }
        }
    };
    return Simulation;
}());
exports.Simulation = Simulation;
