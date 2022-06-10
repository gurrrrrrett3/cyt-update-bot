import { SlashCommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import TeleportRanking from "../data/player/teleportRanking";

const Command = {
  data: new SlashCommandBuilder()
    .setName("trankdb")
    .setDescription("Shows info about the current state of the Teleport Rank Databse"),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    let data = TeleportRanking.getDataSummary();
    let des = [
      ` **${data.uses}** total uses`,
      `**${data.total}** total teleports`,
      `**${data.players}** total players`,
      `**${data.unique}** unique players`,
    ];
    await interaction.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setTitle("Teleport Rank Database")
          .setDescription(des.join("\n"))
          .setColor("#0099ff")
          .setTimestamp(Date.now())
          .setFooter({ text: "Teleport Rank Database" }),
      ],
    });
  },
};
module.exports = Command;
