import {
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import Discord from "discord.js";

const Command = {
  data: new SlashCommandBuilder()
    .setName("head")
    .setDescription("Gets a player's minecraft head")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("flat")
        .setDescription("Flat front facing head")
        .addStringOption(
          new SlashCommandStringOption().setName("name").setDescription("Player name").setRequired(true)
        )
        .addBooleanOption(
          new SlashCommandBooleanOption().setName("helm").setDescription("Show helm").setRequired(false)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("3d")
        .setDescription("3D head")
        .addStringOption(
          new SlashCommandStringOption().setName("name").setDescription("Player name").setRequired(true)
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("facing")
            .setDescription("Facing direction")
            .setRequired(true)
            .addChoice("Left", "left")
            .addChoice("Right", "right")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("body")
        .setDescription("3d full body")
        .addStringOption(
          new SlashCommandStringOption().setName("name").setDescription("Player name").setRequired(true)
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("facing")
            .setDescription("Facing direction")
            .setRequired(true)
            .addChoice("Left", "left")
            .addChoice("Right", "right")
        )
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;
    const subcommand = options.getSubcommand();

    const name = options.getString("name", true);
    const helm = options.getBoolean("helm", false);
    const facing = options.getString("facing", false);
    const embed = new Discord.MessageEmbed().setColor("#0099ff");

    switch (subcommand) {
      case "flat":
        embed.setImage(`https://mc-heads.net/avatar/${name}${helm ? "" : "/nohelm"}`).setTitle(`${name}'s head`)
        break;
      case "3d":
        embed.setImage(`https://mc-heads.net/head/${name}/${facing}`).setTitle(`${name}'s head`)
        break;
      case "body":
        embed.setImage(`https://mc-heads.net/body/${name}/${facing}`).setTitle(`${name}'s skin`)
        break;
      default:
        embed.setDescription("Invalid subcommand");
        break;
    }
    interaction.reply({ embeds: [embed] });
  },
};
module.exports = Command;
