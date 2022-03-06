import Discord from "discord.js";
import config from "../config.json";
import { Online, Players } from "./requestTypes";
import Util from "./util";
export default class EmbedHandler {
    //@ts-expect-error
  private liveInfo: Discord.Message;
    //@ts-expect-error
  private list: Discord.Message;
  private startTime = Date.now();
  private timer: NodeJS.Timer

  constructor(private client: Discord.Client) {
    const channel = client.channels.cache.get(config.embeds.info);
    if (channel && channel.isText() && channel.type == "GUILD_TEXT") {
      channel.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          message.deletable && message.delete();
        });
      });
    }

    this.sendEmbed(channel as Discord.TextChannel);
    this.sendOnlineListEmbed(channel as Discord.TextChannel);

    this.timer = setInterval(() => {
        this.sendEmbed(channel as Discord.TextChannel, this.liveInfo);
        this.sendOnlineListEmbed(channel as Discord.TextChannel, this.list);
        }, config.embeds.updateInterval);
  }

  private async sendEmbed(channel: Discord.TextChannel, message?: Discord.Message) {
    Util.sendRequest("/players/online").then((res: Online) => {

        const embed = new Discord.MessageEmbed()
            .setTitle("Live Info")
            .setDescription(Util.formatEmbedDescription(res, Date.now() - this.startTime))
            .setThumbnail("https://media.discordapp.net/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png")
            .setTimestamp()
            .setFooter("CYT Update Bot");


        if (message) {
            message.edit({embeds: [embed]}).then((msg) => {
                this.liveInfo = msg;
            });
        }
        else {
            channel.send({embeds: [embed]}).then((msg) => {
                this.liveInfo = msg;
            })
        }


    });
  }

  public async sendOnlineListEmbed(channel: Discord.TextChannel, message?: Discord.Message) {
        Util.sendRequest("/players").then((res: Players) => {
            const embed = new Discord.MessageEmbed()
                .setTitle("Online List")
                .setDescription(Util.formatPlayerList(res))
                .setThumbnail("https://media.discordapp.net/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png")
                .setTimestamp()
                .setFooter("CYT Update Bot");

            if (message) {
                message.edit({embeds: [embed]}).then((msg) => {
                    this.list = msg;
                });
            }
            else {
                channel.send({embeds: [embed]}).then((msg) => {
                    this.list = msg;
                })
            }
        });
  }
}
