import Discord from "discord.js";
import UUIDManager from "../../data/player/uuidManager";
import PlayerTeleportManager from "../../data/player/playerTeleportManager";
import Util from "../../bot/util";
export default class TeleportPagedEmbed {
  public username: string;
  public uuid: string;

  constructor(username: string) {
    this.username = username;
    this.uuid = UUIDManager.getUUID(username) || "";
  }

  public getEmbed(page: number, date?: string , time?: number): Discord.MessageEmbed {
    const teleports = PlayerTeleportManager.getPlayerTeleportsByPage(page, {
      uuid: this.uuid,
      amount: 0,
      after: time ?? 0,
    });

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${this.username}'s Teleports`)
      .setFooter({ text: `Page ${page + 1} of ${Math.ceil(PlayerTeleportManager.getTimedTeleportCount(this.uuid, time ?? 0) / 10)}` });

    let disc: string[] = [];
    disc.push(`**${PlayerTeleportManager.getTimedTeleportCount(this.uuid, time ?? 0)} Teleports found ${time ? `(Over ${date})` : ""}**`);

    let i = 0

    for (const teleport of teleports) {
      const start = teleport.start;
      const end = teleport.end;
      const t = teleport.time
      const teleportCount = PlayerTeleportManager.getTimedTeleportCount(this.uuid, time ?? 0) - (page * 10 + i)

      disc.push(`\`${teleportCount}\`${Util.formatDiscordTime(t)} **${start.world}** ${start.x}, ${start.z} → **${end.world}** ${end.x}, ${end.z} ${start.world == end.world ? `(${Util.getDistance(start, end).toFixed(2)} blocks)` : ""}`)
      i++
    }

    embed.setDescription(disc.join("\n"));

    return embed;
  }
}
