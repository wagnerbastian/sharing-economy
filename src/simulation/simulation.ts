import * as data from '../config.json';
import {
    Agent,
    Config,
    PopulationInfo,
    Strategy
} from './module';
import { NetworkService, CommunicationService } from './network';
import { DataService, PairingService, StrategyService } from './service';
import { Analyzer } from './util/analyzer';
import { Logger } from './util/logger';

export class Simulation {
    logger = new Logger();
    config = (data as any).default as Config;
    analyzer = new Analyzer();
    dataService = new DataService();
    populationInfo: PopulationInfo = this.dataService.createPopulationInfo();

    networkService = new NetworkService();
    communicationService = new CommunicationService();
    pairingService = new PairingService(this.networkService);
    strategyService = new StrategyService(this.populationInfo, this.communicationService);


    strategies: Strategy[] = this.dataService.createStrategies();
    agents: Agent[] = this.dataService.createAgents(this.strategies);


    constructor() {
        this.runSimulation();
    }


    runSimulation(): void {
        this.logger.system(`Starting Simulation: ${this.config.simulationData.name} with ${this.config.simulationData.agents} agents, Communication: ${this.config.communication.enabled}`);
        this.networkService.createGraph(this.agents);
        this.communicationService.createCommunicationGraph(this.agents);

        this.populationInfo.simulationInfo.strategyDistribution.initial = this.strategyService.getStrategyDistribution(this.agents);

        // console.log(this.networkService.getDistancesForAgents(this.agents[2], [this.agents[80], this.agents[45]]));

        // ___
        for (let repitition = 1; repitition <= this.config.simulationData.repititions; repitition++) {
            this.logger.system('Starting Repition ' + repitition)
            // agenten für jeden Durchlauf kopieren damit man ein neues Set hat
            const agents: Agent[] = JSON.parse(JSON.stringify(this.agents));

            for (let step = 1; step <= this.config.simulationData.steps; step++) {
                this.logger.logStep(step);
                // console.log("- Starting Step", step);
                this.makeAllAgentsAvailableForTrading(agents);
                const agentsAtTheBeginningOfTheStep: Agent[] = JSON.parse(JSON.stringify(agents)) as Agent[];


                // 2 Agenten zum Handeln suchen
                // Strategie auswählen
                switch (this.config.network.pairingMethod) {
                    case 'simple': {
                        let availableAgentsCounter = agents.length;
                        while (availableAgentsCounter > 1) {
                            // solange wie es Paare gibt die Handeln können, werden sie gesucht und es wird gehandelt.
                            let availableAgents = agents.filter(agent => !agent.didTradeInThisStep);
                            availableAgentsCounter = availableAgents.length;

                            let agentsToTrade = this.pairingService.simplePair(availableAgents);
                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                break;
                            }

                            // Handel
                            this.trade(agentsToTrade.agentA, agentsToTrade.agentB);

                            // strategiewechsel berechnen...
                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                // a switcht zu b
                                agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentB.id).strategy;
                            }

                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                // b switcht zu a
                                agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentA.id).strategy;
                            }
                        }
                        break;
                    }
                    case 'dijkstra': {


                        let availableAgentsCounter = agents.length;
                        while (availableAgentsCounter > 3) {
                            // solange wie es Paare gibt die Handeln können, werden sie gesucht und es wird gehandelt.
                            let availableAgents = agents.filter(agent => !agent.didTradeInThisStep);
                            availableAgentsCounter = availableAgents.length;

                            let agentsToTrade = this.pairingService.dijkstraPair(availableAgents, step);
                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                // es wurde kein gültiges Paar gefunden, Agent bricht den Handel ab.
                                if (agentsToTrade.agentA) {
                                    agentsToTrade.agentA.didTradeInThisStep = true;
                                    agentsToTrade.agentA.payoffHistory.push(0)
                                } else {
                                    agentsToTrade.agentB.didTradeInThisStep = true;
                                    agentsToTrade.agentB.payoffHistory.push(0)
                                }
                            } else {
                                // Handel
                                this.trade(agentsToTrade.agentA, agentsToTrade.agentB);

                                // strategiewechsel berechnen...
                                if (this.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                    // a switcht zu b
                                    agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentB.id).strategy;
                                }

                                if (this.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                    // b switcht zu a
                                    agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentA.id).strategy;
                                }
                            }




                        }
                        break;
                    }

                    case 'network': {
                        let availableAgentsCounter = agents.length;
                        while (availableAgentsCounter > 3) {
                            let availableAgents = agents.filter(agent => !agent.didTradeInThisStep);
                            availableAgentsCounter = availableAgents.length;
                            const agentsToTrade = this.pairingService.networkPair(agents);


                            if (agentsToTrade.agentA == null || agentsToTrade.agentB == null) {
                                // es wurde kein gültiges Paar gefunden, Agent bricht den Handel ab.
                                if (agentsToTrade.agentA) {
                                    agentsToTrade.agentA.didTradeInThisStep = true;
                                    agentsToTrade.agentA.payoffHistory.push(0)
                                } else {
                                    agentsToTrade.agentB.didTradeInThisStep = true;
                                    agentsToTrade.agentB.payoffHistory.push(0)
                                }

                            } else {
                                // Es wurde ein gültiges paar gefunden und es handelt
                                // Handel
                                this.trade(agentsToTrade.agentA, agentsToTrade.agentB);

                                // strategiewechsel berechnen...
                                if (this.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB, agentsAtTheBeginningOfTheStep)) {
                                    // a switcht zu b
                                    agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentB.id).strategy;
                                }

                                if (this.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA, agentsAtTheBeginningOfTheStep)) {
                                    // b switcht zu a
                                    agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentA.id).strategy;
                                }

                            }

                        }
                        break;
                    }
                }


                // PopulationInfo updaten
                this.updatePopulationInfo(step, agents, repitition);
                
            }
            // Ende des Durchlaufs
            console.log('\n', this.strategyService.getStrategyDistribution(agents));
            this.populationInfo.simulationInfo.strategyDistribution.final.push(this.strategyService.getStrategyDistribution(agents))
        }
        this.populationInfo.simulationInfo.end = new Date().toISOString();
        this.populationInfo.simulationInfo.duration = (new Date(this.populationInfo.simulationInfo.end).getTime() - new Date(this.populationInfo.simulationInfo.start).getTime()) / 1000;

        this.populationInfo.simulationInfo.durationMinutes = this.populationInfo.simulationInfo.duration / 60;
        this.populationInfo.simulationInfo.durationHours = this.populationInfo.simulationInfo.durationMinutes / 60;

        this.analyzer.analyzeRun(this.populationInfo);
        this.logger.writeFile(this.populationInfo);
        // console.log("Connections saved: ", this.networkService.distances.length, "used saved: ", this.networkService.usedSavedDistance);
        // this.logger.write(this.networkService.distances, 'distances.json')
    }

    /**
     * Setzt alle Agenten auf verfügbar.
     */
    makeAllAgentsAvailableForTrading(agents: Agent[]): void {
        agents.forEach(agent => {
            agent.didTradeInThisStep = false;
        })
    }

    /**
     * Die beiden Agenten handeln miteinander.
     */
    trade(agentA: Agent, agentB: Agent): void {
        const payoffA = agentA.strategy.payoff[agentB.strategy.name];
        agentA.wealth += payoffA;
        agentA.payoffHistory.push(payoffA);
        agentA.didTradeInThisStep = true;

        const payoffB = agentB.strategy.payoff[agentA.strategy.name];
        agentB.wealth += payoffB;
        agentB.payoffHistory.push(payoffB);
        agentB.didTradeInThisStep = true;

    }

    updatePopulationInfo(step: number, agents: Agent[], repition: number): void {
        this.populationInfo.possibleWealth.individual.max += this.dataService.getMaxPayoff();
        this.populationInfo.possibleWealth.individual.min += this.dataService.getMinPayoff();

        // Strategieverteilung im Verlauf für jede Wiederholung hinzufügen
        if (this.populationInfo.strategyDistribution.length === 0) {
            this.populationInfo.strategyDistribution.push({
                rep: repition,
                distributions: [this.strategyService.getStrategyDistribution(agents)]
            })
        } else {
            let exists = false;
            for (let i = 0; i < this.populationInfo.strategyDistribution.length; i++) {
                if (repition === this.populationInfo.strategyDistribution[i].rep) {
                    this.populationInfo.strategyDistribution[i].distributions.push(
                        this.strategyService.getStrategyDistribution(agents)
                    );
                    exists = true;
                }
            }

            if (!exists) {
                this.populationInfo.strategyDistribution.push({
                    rep: repition,
                    distributions: [this.strategyService.getStrategyDistribution(agents)]
                })
            }
        }
    }




}