import { Point } from "../map/markerTypes";
import { WorldLocation } from "./types";

export default class Region {
  public name: string;
  public world: string;
  public points: Point[][] = [];

  constructor(name: string, world: string, points: Point[][]) {
    this.name = name;
    this.world = world;
    this.points = points;
  }

  public isInRegion(loc: WorldLocation) {
    let isIn = false;

    this.points.forEach((point) => {
      if (point.length > 0) {
        const firstPoint = point[0];
        const lastPoint = point[point.length - 1];

        if (firstPoint.x == lastPoint.x && firstPoint.z == lastPoint.z) {
          if (point.length == 2) {
            if (loc.x == firstPoint.x && loc.z == firstPoint.z) {
              isIn = true;
            }
          } else {
            const isInPolygon = this.isInPolygon(loc, point);

            if (isInPolygon) {
              isIn = true;
            }
          }
        }
      }
    });

    return isIn;
  }

  public isInPolygon(loc: WorldLocation, polygon: Point[]) {
    let isIn = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const zi = polygon[i].z;
      const xj = polygon[j].x;
      const zj = polygon[j].z;

      const intersect = zi > loc.z != zj > loc.z && loc.x < ((xj - xi) * (loc.z - zi)) / (zj - zi) + xi;

      if (intersect) {
        isIn = !isIn;
      }
    }

    return isIn;
  }
}
