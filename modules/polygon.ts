import Town from "./cytmarker";
import { Bounds, Coords, Polygon } from "./types";

export default class PolygonUtil {
  public static getPolygonBounds(polygon: Polygon): Bounds {
    const minX = Math.min(...polygon.points.map((point) => point.x));
    const minZ = Math.min(...polygon.points.map((point) => point.z));
    const maxX = Math.max(...polygon.points.map((point) => point.x));
    const maxZ = Math.max(...polygon.points.map((point) => point.z));

    return {
      min: {
        x: minX,
        z: minZ,
      },
      max: {
        x: maxX,
        z: maxZ,
      },
    };
  }

  public static isPointInPolygon(point: Coords, polygon: Polygon): boolean {

    const x = point.x;
    const z = point.z;

    let inside = false;
    let i = 0;
    let j = polygon.points.length - 1;

    for (i; i < polygon.points.length; i++) {
      const p1 = polygon.points[i];
      const p2 = polygon.points[j];

      if (
        p1.z > z != p2.z > z &&
        x < ((p2.x - p1.x) * (z - p1.z)) / (p2.z - p1.z) + p1.x
      ) {
        inside = !inside;
      }

      j = i;
    }

    return inside;
  }

  public static getAreaOfPolygon(polygon: Polygon): number {
    const bounds = PolygonUtil.getPolygonBounds(polygon);
    const minX = bounds.min.x;
    const minZ = bounds.min.z;
    const maxX = bounds.max.x;
    const maxZ = bounds.max.z;

    let area = 0;

    for (let x = minX; x < maxX; x++) {
      for (let z = minZ; z < maxZ; z++) {
        const point = { x, z };
        if (PolygonUtil.isPointInPolygon(point, polygon)) {
          area++;
        }
      }
    }

    return area;
  }

  public static fromTown(town: Town): Polygon[] {
    
    let out: Polygon[] = [];
    
    town.points.forEach((group) => {
    
      out.push({points: group});

    });

    return out
  }

  public static getChunkCount(town: Town) {

    const polygon = PolygonUtil.fromTown(town);

    let total = 0;

    polygon.forEach((poly) => {
      total += PolygonUtil.getAreaOfPolygon(poly);
    });

    return total / (16 * 16);

  }

  public static markerPointsToCoords(markerPoints: [[{x: number, z: number}]]): Coords[][] { 
    return markerPoints as Coords[][];
  }
}

