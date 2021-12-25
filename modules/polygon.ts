import Town from "./town";
import { Bounds, Coords, Marker, Polygon, PolygonGroup } from "./types";

export default class PolygonUtil {
  public static getPolygonBounds(polygon: Polygon): Bounds {
    const minX = Math.min(...polygon.map((point) => point.x));
    const minZ = Math.min(...polygon.map((point) => point.z));
    const maxX = Math.max(...polygon.map((point) => point.x));
    const maxZ = Math.max(...polygon.map((point) => point.z));

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
    let j = polygon.length - 1;

    for (i; i < polygon.length; i++) {
      const p1 = polygon[i];
      const p2 = polygon[j];

      if (p1.z > z != p2.z > z && x < ((p2.x - p1.x) * (z - p1.z)) / (p2.z - p1.z) + p1.x) {
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

  public static fromTown(town: Town): PolygonGroup {
    let out: Polygon[] = [];

    town.points.forEach((group) => {
      out.push(group);
    });

    return out;
  }

  public static getChunkCount(polygon: Marker) {
    if (polygon.type === "polygon") {
      let total = 0;

      polygon.points.forEach((poly) => {
        total += PolygonUtil.getAreaOfPolygon(poly);
      });

      return total / (16 * 16);
    } else {
      return 0;
    }
  }

  public static markerPointsToCoords(markerPoints: [[{ x: number; z: number }]]): Coords[][] {
    return markerPoints as Coords[][];
  }
}
