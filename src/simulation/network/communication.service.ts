import { Agent, Config, Distance, Node } from "../module";
import * as data from '../../config.json';
import { DataService } from "../service/data.service";
import { Logger, DijkstraService } from "../util";

export class CommunicationService {
    config = (data as any).default as Config;
    logger = new Logger();
    dijkstra = new DijkstraService();
    dataService = new DataService();
    graph: Node[] = [];


    createCommunicationGraph(agents: Agent[]): void {
        if (!this.config.communication.enabled) {return; }

        this.logger.system("Building Communication Graph");

        agents.forEach(agent => {
            this.graph.push({
                id: agent.id,
                neighbours: []
            });
        });

        this.setupNeighbours();
    }

    setupNeighbours(): void {
        this.logger.system("Building Communication Neighbours")
        const minNeighbours = this.config.communication.minNeighbours;
        const maxNeighbours = this.config.communication.maxNeighbours;

        for (let index = 0; index < this.graph.length; index++) {
            if (this.graph[index].neighbours.length < maxNeighbours) {
                // Anzahl der Nachbarn zufällig generieren

            let possibleNeighbours = this.graph.filter(node => {
                return node.neighbours.length < maxNeighbours && node.id !== this.graph[index].id;
            });

            const n = Math.min((Math.floor(Math.random() * (maxNeighbours - minNeighbours))) + minNeighbours, possibleNeighbours.length);


            possibleNeighbours = this.dataService.shuffleArray(possibleNeighbours);

            //Nachbarn zuweisen
            for (let i = 0; i < n; i++) {
                if (possibleNeighbours[i].neighbours.length < maxNeighbours && this.graph[index].neighbours.length < maxNeighbours) {
                    this.graph[index].neighbours.push(possibleNeighbours[i]);
                    possibleNeighbours[i].neighbours.push(this.graph[index]);
                }

            };
            }

        }

        this.logger.system("Finished Building Communication Graph");
    }

    getNeighbourIDs(id: number): number[] {
        const result: number[] = [];
        this.graph.find(node => node.id === id).neighbours.forEach(neighbour => {
            result.push(neighbour.id);
        });
        
        return result;
    }

    
}