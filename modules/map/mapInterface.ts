import fetch from "node-fetch";
import Player from "../resources/player";
import fs from "fs";
import { PlayersFetchReturn, WorldLocation } from "../resources/types";
import { Marker, MarkerFile } from "./markerTypes";
export default class MapInterface {
  public static getPlayers(): Promise<Player[]> {
    return fetch("https://map.craftyourtown.com/tiles/players.json")
      .then((res) => res.json())
      .then((res: PlayersFetchReturn) => {
        const playerList = res.players.map(p => new Player(p));
        fs.writeFileSync("./data/players.json", JSON.stringify(playerList, null, 4));
        return playerList;
      });
  }
  public static async getWorldMarkers(): Promise<MarkerFile> {
    return new Promise((resolve, reject) => { 
    fetch("https://map.craftyourtown.com/tiles/world/markers.json")
      .then((res) => res.json())
      .then((res: MarkerFile) => resolve(res))
      .catch((err) => reject(err));
    });
  }

  public static async getEarthMarkers(): Promise<MarkerFile> {
    return new Promise((resolve, reject) => {
    fetch("https://map.craftyourtown.com/tiles/earth/markers.json")
      .then((res) => res.json())
      .then((res: MarkerFile) => resolve(res)).
      catch((err) => {
        reject(err);
      })
  })
}

  public static generateMapLink(location: WorldLocation, zoom: number): string {
    return `https://map.craftyourtown.com/#${location.world};flat;${location.x},0,${location.z};${zoom}`;
  }
}
