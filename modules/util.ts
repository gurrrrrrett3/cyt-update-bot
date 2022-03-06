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

  const worldIndex = [
    "parkour",
    "world_the_end",
    "world_nether",
    "earth",
    "world"
  ]

  data.sort((a, b) => {
    if (this.isPlayerAfk(a)) return -1
    if (this.isPlayerAfk(b)) return 1
    return worldIndex.indexOf(a.world) - worldIndex.indexOf(b.world); 
  });


  data.forEach((player) => {
    this.isPlayerAfk(player) ? d.push(`[**${player.world}**] ${player.name}`) : d.push(`[**afk**] *${player.name}*`);
  })

  let tooBig = d.join("\n").length > 2000

  while (d.join("\n").length > 1980) {
    d.pop();
  } 

  tooBig !&& d.push(`...and ${data.length - d.length} more`);

  //Sort

  return d.join("\n");
}

public static isPlayerAfk(player: Player): boolean {
    return player.x == 25 && player.z == 42;
}

}