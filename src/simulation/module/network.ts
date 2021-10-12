export interface Node {
    id: number;
    neighbours: Node[]
}

export interface Distance {
    distance: number;
    from: number;
    to: number;
}