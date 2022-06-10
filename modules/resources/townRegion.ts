import { Point } from "../map/markerTypes";
import MarkerParser from "../map/parse";
import { PolygonMarker } from "../map/markerTypes";

export default class TownRegion {

    public name: string;
    public world: string;
    public points: Point[][][] = [];

    constructor(data: PolygonMarker, world: string) {

        this.name = MarkerParser.parsePolygonTownName(data);
        this.world = world;
        this.points = data.points;

    }
}