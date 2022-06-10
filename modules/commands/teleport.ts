import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import TeleportViewer from "../bot/viewers/teleportViewer";

const Command = {
  data: new SlashCommandBuilder()
    .setName("teleports")
    .setDescription("Get the recent teleports of a player")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("player")
        .setRequired(true)
        .setDescription("The player to get the teleports of")
    )
    .addStringOption(
      new SlashCommandStringOption().setName("time").setDescription("How far back to look for teleports")
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const o = TeleportViewer.displayOnCommandInteraction(interaction);
    if (o) {
      interaction.reply(o);
    }
  },
};
module.exports = Command;
