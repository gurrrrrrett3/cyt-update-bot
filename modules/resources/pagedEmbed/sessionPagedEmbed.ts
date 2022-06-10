import Discord from "discord.js";
import UUIDManager from "../../data/player/uuidManager";
import PlayerSessionManager from "../../data/player/playerSessionManager";
import Util from "../../bot/util";
import PlayerLoginManager from "../../data/playerLoginManager";
export default class SessionPagedEmbed {
  public username: string;
  public uuid: string;

  constructor(username: string) {
    this.username = username;
    this.uuid = UUIDManager.getUUID(username) || "";
  }

  public getEmbed(page: number, date?: string , time?: number): Discord.MessageEmbed {
    const sessions = PlayerSessionManager.getPlayerSessionsByPage(page, {
      uuid: this.uuid,
      amount: 0,
      after: time ?? 0,
    });

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${this.username}'s sessions`)
      .setFooter({ text: `Page ${page + 1} of ${Math.ceil(PlayerSessionManager.getTimedSessionCount(this.uuid, time ?? 0) / 10)}` });

    let disc: string[] = [];
    disc.push(`**${PlayerSessionManager.getTimedSessionCount(this.uuid, time ?? 0)} sessions found over ${Util.formatTime(PlayerSessionManager.getPlayerPlaytime({uuid: this.uuid, after: time ?? 0}))} ${time ? `(Over ${date})` : ""}**`);

    let i = 0

    for (const session of sessions) {
      const login = session.login.time;
      const logout = session.logout.time;
      const sessionCount = PlayerSessionManager.getTimedSessionCount(this.uuid, time ?? 0) - (page * 10 + i)

      if (logout == 0) {
        disc.push(`\`${sessionCount}\` ${Util.formatDiscordTime(login, "shortDateTime")} - Currently online | ${PlayerLoginManager.getFormattedPlaytime(this.username)}`);
      } else {
        disc.push(
          `\`${sessionCount}\` ${Util.formatDiscordTime(login, "shortDateTime")} - ${Util.formatDiscordTime(
            logout,
            "shortDateTime"
          )} | ${Util.formatTime(logout - login)}`
        );
      }
      i++
    }

    embed.setDescription(disc.join("\n"));

    return embed;
  }
}
