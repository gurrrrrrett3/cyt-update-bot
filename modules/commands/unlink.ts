import { SlashCommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import Linking from "../bot/linking";

const Command = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Unlink your minecraft account from your discord account"),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const links = Linking.openFile();

    const link = links.find((l) => l.id === interaction.user.id);

    if (!link) {
      interaction.reply("You are not linked to a minecraft account. Use /link to link your account.");
      return;
    }

    links.splice(links.indexOf(link), 1);
    Linking.saveFile(links);
    interaction.reply(
      "You have been unlinked from your minecraft account. If you ever want to link again, use /link."
    );
  },
};
module.exports = Command;
