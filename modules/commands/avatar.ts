import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Discord from "discord.js";

const Command = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get the avatar of a user.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("The user whose avatar you want to get.")
        .setRequired(false)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;
    const user = options.getUser("user", false) ?? interaction.user;

    const embed = new Discord.MessageEmbed()
        .setTitle(`${user.tag}'s avatar`)
        .setColor("#0099ff")
        .setImage(user.displayAvatarURL({ format: "png", size: 1024 }))

    interaction.reply({ embeds: [embed] });
  },
};
module.exports = Command;
