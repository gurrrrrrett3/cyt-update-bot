import { parse } from "node-html-parser";
import PolygonUtil from "./polygon";
import { Polygon, Coords, MarkerIconData, MarkerPolygonData, townPolygon, World, PolygonGroup, Marker } from "./types";

export default class Town {
  public name: string;
  public mayor: string;
  public assistants: string[];
  public color: string;
  public residents: string[];
  public pvp: boolean;
  public chunks: number;
  public world: World;
  public coords: Coords;
  public polygon: PolygonGroup;

  constructor(world: World) {
    this.world = world;
    this.name = "";
    this.chunks = 0;
    this.color = "";
    this.mayor = "";
    this.pvp = false;
    this.residents = [""];
    this.assistants = [""];

    this.coords = {
      x: 0,
      z: 0,
    };

    this.polygon = [];
  }

  /**
   * Takes a HTML string and parses it into a Town object
   * @param data String of HTML data
   * @param world World of the icon
   * @returns Town object
   */
  public static fromIcon(data: MarkerIconData, world: World): Town {
    let town = new Town(world);

    town.coords = data.point;
    town.chunks = 0;

    const popupData = parse(data.popup).rawText.split("\n");

    town.name = popupData[2].trim().replace(/ \(.+\)/g, "");
    town.mayor = popupData[5].trim();
    town.assistants = popupData[8]
      .trim()
      .split(",")
      .map((r) => r.trim());
    town.pvp = popupData[11].trim() == "true" ? true : false;
    town.residents = popupData[13]
      .trim()
      .replace("Residents: ", "")
      .split(",")
      .map((r) => r.trim());

    return town;
  }

  public static addPolygonData(town: Town, polygon: Marker) {
    if (polygon.type == "polygon") {
    town.chunks += PolygonUtil.getChunkCount(polygon);
    town.color = polygon.color;
    town.polygon = polygon.points;
    return town;
    }
  }

  public static markerToTownPolygon(marker: MarkerPolygonData) {

    const out: townPolygon = {

      points: marker.points,
      type: marker.type,
      color: marker.color,
      popup: marker.popup,
      name: parse(marker.tooltip).rawText.trim(),
    };

    return out;

  }

  public static parsePolygonTooltip(tooltip: string) {

    let parsed = parse(tooltip).rawText.trim().split(" ")[0].trim();

    return parsed
  }

  public distanceFrom(point: Coords) {

    const x = this.coords.x - point.x;
    const z = this.coords.z - point.z;

    return Math.sqrt(x * x + z * z);

  }

}

