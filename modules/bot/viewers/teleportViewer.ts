import Discord, { InteractionReplyOptions } from "discord.js";
import PlayerTeleportManager from "../../data/player/playerTeleportManager";
import UUIDManager from "../../data/player/uuidManager";
import TeleportPagedEmbed from "../../resources/pagedEmbed/teleportPagedEmbed";
import Util from "../util";

//Handles generating the teleport embeds

export default class TeleportViewer {
  
  /**
   * Generates an embed set on page 0 for player sessions
   * @param interaction CommandInteraction from the /sessions command
   * @returns options to generate a new message
   */
  public static displayOnCommandInteraction(
    interaction: Discord.CommandInteraction
  ): InteractionReplyOptions | null {
    let player = interaction.options.getString("player", true);
    let timeSearch = interaction.options.getString("time", false);
    if (!timeSearch) {
      timeSearch = "";
    } else {
      const ts = Util.timeSearch(timeSearch);
      if (!ts) {
        interaction.reply("Invalid time format");
        return null;
      }
      return this.generateOptions(player, 0, ts.f, Date.now() - ts.d);
    }
    return this.generateOptions(player, 0);
  }

  /**
   * Edit the options when a button is clicked
   * @param interaction 
   * @param id 
   */
  public static editOnButtonInteraction(interaction: Discord.ButtonInteraction , id: string) {
    const [sess, player, page, date, time, x] = id.split("-");
    interaction.update(this.generateOptions(player, parseInt(page), date, parseInt(time)))
  }
/**
 * Generates options to use in an interactionReply
 * @param player Player to search for
 * @param page page to get
 * @returns options to generate a new message
 */
  public static generateOptions(player: string, page: number = 0, date: string = "", time: number = 0) {
    const pagedEmbed = new TeleportPagedEmbed(player);
    const totalPageCount = Math.ceil(PlayerTeleportManager.getTimedTeleportCount(UUIDManager.getUUID(player) ?? "", time) / 10)
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId(`teleport-${player}-0-${date}-${time}-start`)
        .setEmoji("⏪")
        .setDisabled(page == 0)
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId(`teleport-${player}-${page - 1}-${date}-${time}`)
        .setEmoji("⬅")
        .setDisabled(page == 0)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId(`teleport-${player}-${page + 1}-${date}-${time}`)
        .setEmoji("➡")
        .setDisabled(totalPageCount == page + 1)
        .setStyle("PRIMARY"),
        new Discord.MessageButton()
        .setCustomId(`teleport-${player}-${totalPageCount - 1}-${date}-${time}-end`)
        .setEmoji("⏩")
        .setDisabled(page == totalPageCount - 1)
        .setStyle("SUCCESS"),
    );

    return {
      embeds: [pagedEmbed.getEmbed(page, date, time)],
      components: [row],
    };
  }
}
