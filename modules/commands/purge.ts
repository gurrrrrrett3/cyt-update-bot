import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";
import Discord from "discord.js";

const Command = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clear x messages")
    .addIntegerOption(
      new SlashCommandIntegerOption()
        .setName("amount")
        .setDescription("Amount of messages to delete")
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(1)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (!interaction.member || !interaction.channel || interaction.channel.type == "DM") return;
    if (!interaction.memberPermissions?.has("MANAGE_MESSAGES")) {
      interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
      return;
    }
    interaction.channel.bulkDelete(interaction.options.getInteger("amount", true)).then(() => {
        interaction.reply({ content: `Deleted ${interaction.options.getInteger("amount", true)} messages.`, ephemeral: true });
        })
  },
};
module.exports = Command;
