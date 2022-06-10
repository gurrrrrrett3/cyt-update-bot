import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import { bot } from "../..";
import Linking from "../bot/linking";

const Command = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link your minecraft account to your discord account")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("username")
        .setDescription("Minecraft username")
        .setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const username = interaction.options.getString("username", true);
    const links = Linking.openFile();

    if (links.find((l) => l.id === interaction.user.id)) {
      interaction.reply("You are already linked to a minecraft account. Use /unlink to unlink your account.");
      return;
    } else {
    bot.linkManager.newLink(interaction, username);
    }

  },
};
module.exports = Command;
