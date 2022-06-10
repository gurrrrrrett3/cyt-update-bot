import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import SessionsViewer from "../bot/viewers/sessionsViewer";

const Command = {
  data: new SlashCommandBuilder()
    .setName("sessions")
    .setDescription("Get the recent sessions of a player")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("player")
        .setRequired(true)
        .setDescription("The player to get the sessions of")
    )
    .addStringOption(
      new SlashCommandStringOption().setName("time").setDescription("How far back to look for sessions")
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const o = SessionsViewer.displayOnCommandInteraction(interaction);
    if (o) {
      interaction.reply(o);
    }
  },
};
module.exports = Command;
