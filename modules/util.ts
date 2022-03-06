import fetch from "node-fetch";
import config from "../config.json";
import { Online, Players } from "./requestTypes";
import { Player } from "./types";
export default class Util {

    /**
 * Formats a number of seconds into a human readable time string
 * @param time Time in seconds
 * @returns String of the time in the format of "HH:MM:SS"
 */
public static formatTime(time: string | number) {
    time = parseInt(time.toString());
  
    const h = Math.floor(time / 3600);
    time = time % 3600;
    const m = Math.floor(time / 60);
    time = time % 60;
  
    return `${this.parseNumber(h)}:${this.parseNumber(m)}:${this.parseNumber(time)}`;
  }
  
  private static parseNumber(s: number) {
    return s.toString().length == 1 ? `0${s}` : s;
  }

  public static sendRequest(endpoint: string): Promise<any> {
    
    return new Promise((resolve, reject) => {
        fetch(config.host +  endpoint)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
  }

  public static async getPlayers(): Promise<Players> {
    return new Promise((resolve, reject) => {
       fetch(config.players)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
}

public static formatEmbedDescription(data: Online, uptime: number): string {
    const d: String[] = [];
    d.push(`**Players Online:**`);
    d.push(`**Total:** ${data.total}`);
    d.push(`**AFK:** ${data.afk}`);
    d.push(``)

    data.worlds.forEach((world) => {
        d.push(`**${world.name}:** ${world.count}`);
    });

    d.push(``)

    d.push(`**Uptime:** ${this.formatTime(uptime / 1000)}`);
    d.push(`**CPU Usage:** ${(process.cpuUsage().user / 1000000).toFixed(2)}%`);
    d.push(`**Memory Usage:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    d.push(`**Node Version:** ${process.version}`);

    return d.join("\n");
}

public static formatPlayerList(data: Players): string {
  const d: string[] = [];


  data.sort((a, b) => {
    return this.isPlayerAfk(a) ? 1 : -1;
  });


  data.forEach((player) => {
    this.isPlayerAfk(player) ? d.push(`[**afk**] ${this.sanitize(player.name)}`) : d.push(`[**${player.world}**] [${this.sanitize(player.name)}](${this.generateMapLink(player.world, player.x, player.z)})`);
  })

  let tooBig = d.join("\n").length > 4080

  while (d.join("\n").length > 4080) {
    d.pop();
  } 

  tooBig !&& d.push(`...and ${data.length - d.length} more`);

  //Sort
  return d.join("\n");
}

public static isPlayerAfk(player: Player): boolean {
    return (player.x == 25 && player.z == 42) || (player.x == 0 && player.z == 0);
}

public static sanitize(str: string): string {
  //escape underscores
  return str.replace(/_/g, "\\_");
}

public static generateMapLink(world: string, x: number, z: number): string {
    return `https://map.craftyourtown.com#${world};flat;${x},64,${z};5`;
}

}