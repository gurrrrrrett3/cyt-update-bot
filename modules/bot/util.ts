import Discord from "discord.js";
import fs from "fs";
import { RankedTeleportEndData } from "../data/player/types";
import { getPresence } from "../map/advancedPresence/presenceManager";
import Player, { PlayerOptions } from "../resources/player";
import Town, { TownData } from "../resources/town";
import { Coords, TownDataFile, WorldLocation } from "../resources/types";

//An absoulute fuck ton of util functions that I use a lot (I move them here if they get used more than once, but don't need a whole class)

export default class Util {
  /**
   * Deletes {limit} number of messages from {channel}
   * @param channel 
   * @param limit 
   */
  public static async purgeChannel(channel: Discord.TextChannel, limit: number) {
    const messages = await channel.messages.fetch({ limit: limit });

    await channel.bulkDelete(messages);
  }
  /**
   * Gets the list of towns from storage
   */
  public static getTownFile(): Town[] {
    const towns = JSON.parse(fs.readFileSync("./data/towns.json", "utf8")) as TownDataFile[];
    return towns.map((t) => new Town(t.world, t as TownData));
  }

  /**
   * Gets the list of players from storage
   */
  public static getPlayerFile(): Player[] {
    const players = JSON.parse(fs.readFileSync("./data/players.json", "utf8")) as PlayerOptions[];
    return players.map((p) => new Player(p));
  }

  /**
   * Escapes all underscores in playernames, so that we don't get funny discord markdown syntax
   */
  public static formatPlayer(player: string): string {
    //escape all underscores
    return player.replace(/_/g, "\\_");
  }

  /**
  * Limits {value} between {min} and {max} 
  */
  public static bound(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Gets a list of residents from every single town
   */
  public static getMemberList() {
    const towns = Util.getTownFile();
    let residents: string[] = [];
    towns.forEach((town) => {
      town.residents.forEach((resident) => {
        residents.push(resident);
      });
    });
    return residents;
  }

  /**
   * Gets a list of all town names
   */
  public static getTownList() {
    const towns = Util.getTownFile();
    let townsList: string[] = [];
    towns.forEach((town) => {
      townsList.push(town.name);
    });
    return townsList;
  }


/**
 * A list of residents and their top rank
 */
  public static getResidentRankList(): {
    name: string;
    rank: "resident" | "assistant" | "mayor";
  }[] {
    const towns = Util.getTownFile();
    let residents: {
      name: string;
      rank: "resident" | "assistant" | "mayor";
    }[] = [];
    towns.forEach((town) => {
      town.residents.forEach((resident) => {
        residents.push({
          name: resident,
          rank:
            town.mayor === resident ? "mayor" : town.assistants.includes(resident) ? "assistant" : "resident",
        });
      });
    });
    return residents;
  }

  /**
   * Gets a user's top rank
   */  
  public static getUserRank(user: string): "resident" | "assistant" | "mayor" | "none" {
    const residents = Util.getResidentRankList();
    const resident = residents.find((r) => r.name === user);
    if (resident) {
      return resident.rank;
    }
    return "none";
  }

/**
 * Gets a town by name
 * @returns undefined if that town does not exist
 */
  public static getTown(name: string) {
    const towns = Util.getTownFile();
    return towns.find((t) => t.name === name);
  }

  /**
   * Gets the town that a user is in
   * @returns undefined if user does not exist
   */
  public static getUserTown(user: string) {
    const towns = Util.getTownFile();
    return towns.find((t) => t.residents.includes(user));
  }

  /**
   * Gets online player data
   */
  public static getOnlinePlayer(name: string) {
    return Util.getPlayerFile().find((p) => p.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Gets the distance between 2 coordnates
   */
  public static getDistance(a: Coords, b: Coords): number 
  public static getDistance(a: WorldLocation, b: WorldLocation): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.z - b.z, 2));
  }

  /**
   * Gets a list of all players in Broglands nation
   */
  public static getPlayersInBroglands() {
    const players = Util.getPlayerFile();

    return players.filter((p) => {
      const playerTown = Util.getUserTown(p.name);
      return playerTown && playerTown.nation === "Broglands";
    });
  }

  /**
   * Gets the number of residents in broglands nation
   */
  public static getBroglandsResidentCount() {
    let playercount = 0;
    const towns = Util.getTownFile();
    towns.forEach((town) => {
      if (town.nation === "Broglands") {
        playercount += town.residents.length;
      }
    });
    return playercount;
  }

  public static getBroglandsTownCount() {
    let towncount = 0;
    const towns = Util.getTownFile();
    towns.forEach((town) => {
      if (town.nation === "Broglands") {
        towncount++;
      }
    });
    return towncount;
  }

  /**
   * Get total count of residents in the database
   */
  public static getPlayersInDatabase() {
    let playercount = 0;
    const towns = Util.getTownFile();
    towns.forEach((town) => {
      playercount += town.residents.length;
    });
    return playercount;
  }

  /**
   * Get list of afk players in the database
   */  
  public static getAfkPlayers() {
    const players = Util.getPlayerFile();
    return players.filter((p) => p.isAfk());
  }

  public static formatTime(time: number) {
    const days = Math.floor(time / 86400000);
    const hours = Math.floor((time % 86400000) / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor(time % 1000);

    const out = [
      days > 0 ? `${days}d` : "",
      hours > 0 ? `${hours}h` : "",
      minutes > 0 ? `${minutes}m` : "",
      seconds > 0 ? `${seconds}s` : "",
    ]
      .filter((t) => t !== "")
      .join(" ");

    return out === "" ? "0s" : out;
  }

  /**
   * Sort the worlds in the playrlist
   */

  public static getWorldLevel(world: string) {
    const worlds = [
      "world",
      "earth",
      "parkour",
      "extras",
      "hotel",
      "world_nether",
      "world_the_end",
      "resource",
      "nether_resource",
    ];

    return worlds.indexOf(world);
  }
/**
 * Devides {time} by 1000 then rounds
 */
  public static getTimeInSeconds(time: number) {
    return Math.floor(time / 1000);
  }

  /**
   * Converts time in ms to discord timestamps
   */
  public static formatDiscordTime(
    time: number,
    mode:
      | "shortTime"
      | "longTime"
      | "shortDate"
      | "longDate"
      | "shortDateTime"
      | "longDateTime"
      | "relative" = "shortTime"
  ) {
    const t = this.getTimeInSeconds(time);

    switch (mode) {
      case "shortTime":
        return `<t:${t}:t>`;
      case "longTime":
        return `<t:${t}:T>`;
      case "shortDate":
        return `<t:${t}:d>`;
      case "longDate":
        return `<t:${t}:D>`;
      case "shortDateTime":
        return `<t:${t}:f>`;
      case "longDateTime":
        return `<t:${t}:F>`;
      case "relative":
        return `<t:${t}:R>`;
      default:
        return `<t:${t}:f>`;
    }
  }

  public static isPlayerInTown(player: Player) {
    const towns = this.getTownFile().filter((t) => t.world == player.world)
    let out = "The Wild"
    towns.forEach((town) => {
      if (town.polygon) {
        town.polygon.forEach((polygon) => {
          if (polygon.isInside(player.getCoords())) {
            out = town.name
          }
        })
      }
    })
    return player.world == "world" || player.world == "earth" ? `${out}` : ""  
  }

  public static formatPresence(player: Player) {
    const pres = getPresence(player.getLocation())
    return pres == "" ? this.isPlayerInTown(player) : pres
  }

  public static padAfter(text: string, length: number) {
    const amountToAdd = length < text.length ? text.length : length - text.length
    return text + " ".repeat(amountToAdd)
  }

  public static cb(text: string) {
    return "```" + text + "```"
  }

  public static getNationStatusSymbol(player: Player) {
    const allyList = ["Harmonia", "Republic", "Hot_Boy_Nation", "IWW"]
    const playerTown = this.getUserTown(player.name)
    if (!playerTown || !playerTown.nation) {
      return "🔴"
    }

    if (allyList.includes(playerTown.nation)) {
      return "🟡"
    }

    if (playerTown.nation == "Broglands") {
      return "🟢"
    }

    return "🔴"
  }

  public static timeSearch(time: string) {
    const timeMatch = time.match(/^(\d+)([hdwmy]|hour|day|week|month|year)$/);
        if (!timeMatch) {
            return null;
        }

      let timeFrame = 0;

        const timeAmount = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2];
        let formattedUnit = "";

        switch (timeUnit) {
            case "h":
            case "hour":
                timeFrame = timeAmount * 3600000;
                formattedUnit = "hour";
                break;
            case "d":
            case "day":
                timeFrame = timeAmount * 86400000;
                formattedUnit = "day";
                break;
            case "w":
            case "week":
                timeFrame = timeAmount * 604800000;
                formattedUnit = "week";
                break;
            case "m":
            case "month":
                timeFrame = timeAmount * 2592000000;
                formattedUnit = "month";
                break;
            case "y":
            case "year":
                timeFrame = timeAmount * 31536000000;
                formattedUnit = "year";
                break;
        }     

        return {
            d: timeFrame,
            f: `${timeAmount} ${formattedUnit}${timeAmount > 1 ? "s" : ""}`
        }
  }
  
  public static getHead(identifier: string) {
      return `https://mc-heads.net/avatar/${identifier}`
  }

  public static areCoordsInArea(coords: Coords, corner1: Coords, corner2: Coords) {
    return (
      (coords.x >= corner1.x && coords.x <= corner2.x && coords.z >= corner1.z && coords.z <= corner2.z) ||
      (coords.x <= corner1.x && coords.x >= corner2.x && coords.z <= corner1.z && coords.z >= corner2.z) ||
      (coords.x >= corner1.x && coords.x <= corner2.x && coords.z <= corner1.z && coords.z >= corner2.z) ||
      (coords.x <= corner1.x && coords.x >= corner2.x && coords.z >= corner1.z && coords.z <= corner2.z)
    );
  }

  public static matchTeleportLocations(a: WorldLocation | RankedTeleportEndData, b: WorldLocation | RankedTeleportEndData) {
    return a.world == b.world && a.x == b.x && a.z == b.z
  }
}
