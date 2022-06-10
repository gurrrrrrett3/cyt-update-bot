import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandUserOption,
} from "@discordjs/builders";
import Discord from "discord.js";
import { bot } from "../..";

const Command = {
  data: new SlashCommandBuilder()
    .setName("kicklist")
    .setDescription("ADMIN COMMAND")
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("add")
        .setDescription("Adds a user to the kicklist")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("user")
            .setDescription("Select user by mention")
            .addUserOption(
              new SlashCommandUserOption()
                .setName("user")
                .setDescription("The user to add to the kicklist")
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("id")
            .setDescription("Select user by id")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("id")
                .setDescription("The id of the user to add to the kicklist")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("remove")
        .setDescription("Removes a user from the kicklist")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("id")
            .setDescription("Select user by id")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("id")
                .setDescription("The id of the user to remove from the kicklist")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("list")
        .setDescription("Lists all users on the kicklist")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription("Lists all users on the kicklist")
        )
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
      interaction.reply("You do not have permission to use this command.");
      return;
    }
    const kickmanager = bot.kickmanager;

    const options = interaction.options;
    const group = options.getSubcommandGroup();
    const user = options.getUser("user");
    const id = options.getString("id");

    //@ts-ignore
    const userToKick = id ?? user.id

    if (group === "list") {
      await interaction.reply(`\`\`\`${kickmanager.getKicklist().join("\n")}\`\`\``);
      return;
    }

    if (!userToKick) {
      interaction.reply("Invalid user.");
      return;
    }

    switch (group) {
      case "add":
        kickmanager.addUser(userToKick);
        interaction.reply(`Added ${userToKick} to the kicklist.`);
        break;
      case "remove":
        kickmanager.removeUser(userToKick);
        interaction.reply(`Removed ${userToKick} from the kicklist.`);
        break;
      default:
        interaction.reply("Invalid subcommand.");
        break;
    }
  },
};
module.exports = Command;
