import fs from "fs";
import Player from "./cytplayer";
import PolygonUtil from "./polygon";

import ProcessTown from "./processTown";
import Town from "./town";

export default class DataManager {
  public static getTown(name: string): Town | string {
    const t = ProcessTown.getTown(name);
    if (t) {
      return t;
    } else {
      return "Town not found";
    }
  }

  public static getPlayer(username: string) {
    const players = this.getPlayers();

    return players.find((p: Player) => {
      return p.name == username;
    });
  }

  public static getTownOnlineMembers(townName: string) {
    const town = ProcessTown.getTown(townName);

    let players: string[] = [];

    if (town) {
      town.residents.forEach((resident) => {
        if (this.getPlayer(resident)) {
          players.push(resident);
        }
      });
    }
  }

  private static getPlayers() {
    return JSON.parse(fs.readFileSync("./data/players.json").toString());
  }

  private static getClosestTown(player: Player): Town {
    const towns = ProcessTown.getTowns();

    let closestTown: Town = towns[0];

    towns.forEach((town) => {
      if (
        town.distanceFrom({ x: player.x, z: player.z }) <
        closestTown.distanceFrom({ x: player.x, z: player.z })
      ) {
        closestTown = town;
      }
    });

    return closestTown;
  }

  public static findPlayerCurrnentTown(player: Player): Town | null {
    let town: Town = this.getClosestTown(player);

    const polygonGroup = town.polygon;

    let out = false;

    polygonGroup.forEach((polygon) => {
      out = out == false ? PolygonUtil.isPointInPolygon({ x: player.x, z: player.z }, polygon) : out;
    });

    return out ? town : null;

  }
}
