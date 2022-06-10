import Discord, { InteractionReplyOptions } from "discord.js";
import PlayerTeleportManager from "../../data/player/playerTeleportManager";
import TeleportRanking from "../../data/player/teleportRanking";
import UUIDManager from "../../data/player/uuidManager";
import TeleportRankPagedEmbed from "../../resources/pagedEmbed/trankPagedEmbed";
import Util from "../util";

//Handles generating the teleport embeds

export default class TeleportRankViewer {
  

  public static displayOnCommandInteraction(
    interaction: Discord.CommandInteraction, type: string
  ): InteractionReplyOptions {
    return this.generateOptions(type, 0);
  }

  /**
   * Edit the options when a button is clicked
   * @param interaction 
   * @param id 
   */
  public static editOnButtonInteraction(interaction: Discord.ButtonInteraction , id: string) {
    const [sess, player, page, x] = id.split("-");
    interaction.update(this.generateOptions(player, parseInt(page)))
  }
/**
 * Generates options to use in an interactionReply
 * @param player Player to search for
 * @param page page to get
 * @returns options to generate a new message
 */
  public static generateOptions(type: string, page: number = 0) {
    const pagedEmbed = new TeleportRankPagedEmbed(type);
    const totalPageCount = Math.ceil(TeleportRanking.openTeleportDataFile().length / 25)
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId(`trank-${type}-0-start`)
        .setEmoji("⏪")
        .setDisabled(page == 0)
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId(`trank-${type}-${page - 1}`)
        .setEmoji("⬅")
        .setDisabled(page == 0)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId(`trank-${type}-${page + 1}`)
        .setEmoji("➡")
        .setDisabled(totalPageCount == page + 1)
        .setStyle("PRIMARY"),
        new Discord.MessageButton()
        .setCustomId(`trank-${type}-${totalPageCount - 1}-end`)
        .setEmoji("⏩")
        .setDisabled(page == totalPageCount - 1)
        .setStyle("SUCCESS"),
        new Discord.MessageButton()
        .setCustomId(`trank-${type}-${page}-refresh`)
        .setEmoji("🔄")
        .setStyle("SECONDARY")
    );

    return {
      embeds: [pagedEmbed.getEmbed(page)],
      components: [row],
    };
  }
}
