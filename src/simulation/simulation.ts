import * as data from '../config.json';
import { Agent, Config, PopulationInfo, Strategy } from './module';
import { NetworkService } from './network/network.service';
import { DataService } from './service/data.service';
import { PairingService } from './service/pairing.service';
import { StrategyService } from './service/strategy.service';
import { Logger } from './util/logger';

export class Simulation {
    logger = new Logger();
    config = (data as any).default as Config;
    dataService = new DataService();
    populationInfo: PopulationInfo = this.dataService.createPopulationInfo();

    networkService = new NetworkService();
    pairingService = new PairingService(this.networkService);
    strategyService = new StrategyService(this.populationInfo);


    strategies: Strategy[] = this.dataService.createStrategies();
    agents: Agent[] = this.dataService.createAgents(this.strategies);


    constructor() {
        this.runSimulation();
    }


    runSimulation(): void {
        this.logger.system('Starting Simulation');
        this.networkService.createGraph(this.agents);

        this.populationInfo.simulationInfo.strategyDistribution.initial = this.strategyService.getStrategyDistribution(this.agents);

        // console.log(this.networkService.getDistancesForAgents(this.agents[2], [this.agents[80], this.agents[45]]));

        // ___
        for (let repitition = 1; repitition <= this.config.simulationData.repititions; repitition++) {
            this.logger.system('Starting Repition ' + repitition)
            // agenten für jeden Durchlauf kopieren damit man ein neues Set hat
            const agents: Agent[] = JSON.parse(JSON.stringify(this.agents));

            for (let step = 1; step <= this.config.simulationData.steps; step++) {
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
                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB)) {
                                // a switcht zu b
                                agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentB.id).strategy;
                            }

                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA)) {
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
                                break;
                            }

                            // Handel
                            this.trade(agentsToTrade.agentA, agentsToTrade.agentB);

                            // strategiewechsel berechnen...
                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentA, agentsToTrade.agentB)) {
                                // a switcht zu b
                                agentsToTrade.agentA.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentB.id).strategy;
                            }

                            if (this.strategyService.computeStrategySwitch(agentsToTrade.agentB, agentsToTrade.agentA)) {
                                // b switcht zu a
                                agentsToTrade.agentB.strategy = agentsAtTheBeginningOfTheStep.find(agent => agent.id === agentsToTrade.agentA.id).strategy;
                            }


                        }
                        break;
                    }
                }


                // PopulationInfo updaten
                this.updatePopulationInfo(step, agents, repitition);
                this.logger.logStep(step);
            }
            // Ende des Durchlaufs
            console.log('\n', this.strategyService.getStrategyDistribution(agents));
            this.populationInfo.simulationInfo.strategyDistribution.final.push(this.strategyService.getStrategyDistribution(agents))
            this.logger.writeFile(this.populationInfo);
        }
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
