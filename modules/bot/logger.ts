import Discord, { ColorResolvable, TextChannel } from "discord.js";
import Util from "./util";

export default class Logger {
  public static Settings = {
    colors: {
      success: "#00ff00" as ColorResolvable,
      warning: "#ffff00" as ColorResolvable,
      changed: "#ff9100" as ColorResolvable,
      error: "#ff0000" as ColorResolvable,
      default: "#007bff" as ColorResolvable,
    },
    channels: {
      messageLog: "976538753000693760",
    },
    guild: "953522718215655425",
  };

  constructor(public client: Discord.Client) {
    client.on("messageUpdate", (om, nm) => {
      if (om.content != nm.content) {
        let embed = new Discord.MessageEmbed()
        //@ts-ignore
          .setTitle(`Message edited in ${nm.channel.name}`)
          .setColor(Logger.Settings.colors.changed)
          .setDescription(
            `Old message:\n${Util.cb(om.content ?? "")}\n\nNew Message:\n${Util.cb(nm.content ?? "")}\nIn ${nm.channel}`
          )
          .setAuthor({
            name: om.author?.tag ?? "unknown",
            iconURL: om.author?.avatarURL() ?? undefined,
          })
          .setTimestamp();
        let channel = this.client.channels.cache.get(Logger.Settings.channels.messageLog);
        if (!channel?.isText()) return;
        channel.send({
          embeds: [embed],
        });
      }
    });

    client.on("messageDelete", (message) => {
      let embed = new Discord.MessageEmbed()
      //@ts-ignore
        .setTitle(`Message deleted in ${message.channel.name}`)
        .setColor(Logger.Settings.colors.error)
        .setDescription(
          message.content ??
            Util.cb("No Content") + message.attachments.map((a, i) => `[Image ${i + 1}](${a.url})\nIn ${message.channel}`)
        )
        .setAuthor({
          name: message.author?.tag ?? "unknown",
          iconURL: message.author?.avatarURL() ?? undefined,
        })
        .setTimestamp();
      let channel = this.client.channels.cache.get(Logger.Settings.channels.messageLog);
      if (!channel?.isText()) return;
      channel.send({
        embeds: [embed],
      });
    });
  }
}
