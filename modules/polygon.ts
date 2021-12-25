import Town from "./town";
import { Bounds, Coords, Marker, Polygon, PolygonGroup } from "./types";

export default class PolygonUtil {
  public static getPolygonBounds(polygon: Polygon): Bounds {

    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;

    polygon.forEach((point) => {
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.z < minZ) {
        minZ = point.z;
      }
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.z > maxZ) {
        maxZ = point.z;
      }
    });

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

    for (i; i < polygon.length; i+=8){
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

    town.polygon.forEach((group) => {
      out.push(group);
    });

    return out;
  }

  public static getChunkCount(polygon: Marker) {
if (polygon.type === "polygon") {
      let total = 0;

      polygon.points.forEach((polygonGroup) => {
        polygonGroup.forEach((polygon) => {
          //@ts-ignore
          total += PolygonUtil.getAreaOfPolygon(polygon);
        });
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
