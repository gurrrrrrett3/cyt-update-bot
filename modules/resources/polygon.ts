import pointInPolygon from "point-in-polygon"
import Point from "./point";

export interface PolygonData {
    points: {
        x: number,
        z: number
    }[]
}

export default class Polygon {
  public points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  public isInside(point: Point) {
        const p = [point.x, point.z]
        const polygon = this.points.map((p) => [p.x, p.z])

        const out =  pointInPolygon(p, polygon)

        return out
  }

  
}
