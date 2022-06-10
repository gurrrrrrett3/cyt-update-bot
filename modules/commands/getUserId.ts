import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Discord from "discord.js";

const Command = {
  data: new SlashCommandBuilder()
    .setName("id")
    .setDescription("Get the ID of a user.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("The user whose ID you want to get.")
        .setRequired(false)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;
    const user = options.getUser("user", false) ?? interaction.user;

    const embed = new Discord.MessageEmbed()
      .setTitle(`${user.tag}'s ID`)
      .setColor("#0099ff")
      .setDescription(user.id);

    interaction.reply({ embeds: [embed] });
  },
};
module.exports = Command;
