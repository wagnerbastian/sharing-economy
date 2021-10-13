import { Agent, Config, Distance, Node } from "../module";
import * as data from '../../config.json';
import { DataService } from "../service/data.service";
import { DijkstraService } from "../util/dijkstra";
import { Logger } from "../util/logger";

export class NetworkService {
    config = (data as any).default as Config;
    logger = new Logger();
    dijkstra = new DijkstraService();
    graph: Node[] = [];
    distanceGraph: any;
    distances: Distance[] = [];

    usedSavedDistance = 0;

    dataService = new DataService();

    createGraph(agents: Agent[]): void {

        this.logger.system("Building Graph")
        agents.forEach(agent => {
            this.graph.push({
                id: agent.id,
                neighbours: []
            });
        });


        this.setupNeighbours();

    }


    setupNeighbours(): void {
        this.logger.system("Building Neighbours")
        const minNeighbours = this.config.network.minNeighbours;
        const maxNeighbours = this.config.network.maxNeighbours;

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

                    this.distances.push({
                        from: this.graph[index].id,
                        to: possibleNeighbours[i].id,
                        distance: 1
                    })
                    this.distances.push({
                        to: this.graph[index].id,
                        from: possibleNeighbours[i].id,
                        distance: 1
                    })
                }

            };
            }

        }
        this.generateGraphForDijkstraCalculation();
    }

    generateGraphForDijkstraCalculation(): void {
        let graph: any = {};

        this.graph.forEach(node => {
            let n: any = {};
            node.neighbours.forEach(neighbour => {
                n[neighbour.id] = 1;
            })
            graph[node.id] = n;
        })
        this.distanceGraph = graph;
        this.logger.system("finished Graphbuilding")
    };

    getDistancesForAgents(from: Agent, to: Agent[]): Distance[] {
        let result: Distance[] = [];

        to.forEach(t => {
            let dis = this.distances.find(d => {
                return d.from === from.id && d.to === t.id;
            });

            if (dis) {
                this.usedSavedDistance++;
                result.push(dis);
            } else {
                // neu...
                let distance = this.dijkstra.findShortestPath(this.distanceGraph, from.id, t.id);
                let d: Distance = {
                    to: t.id,
                    from: from.id,
                    distance: distance.distance
                };
                let dInverse: Distance = {
                    from: t.id,
                    to: from.id,
                    distance: distance.distance
                };
                this.distances.push(d);
                this.distances.push(dInverse);
                result.push(d);
            }
        })
        return result;
    }

    findNodeIDWithDistanceOf(from: Agent, availableAgentsIn: Agent[], distance: number): number {
        const availableAgents: Agent[] = this.dataService.shuffleArray(JSON.parse(JSON.stringify(availableAgentsIn)));

        for (let index = 0; index < availableAgents.length; index++) {
            const dis = this.getDistancesForAgents(from, [availableAgents[index]]);
            if (dis[0].distance === distance) {
                return dis[0].to;
            }
        }
    }

    getNeighbourIDs(id: number): number[] {
        const neighbours = this.graph.find(a => a.id === id).neighbours;
        const result: number[] = [];
        neighbours.forEach(n => {result.push(n.id)});
        return result;
    }
}
