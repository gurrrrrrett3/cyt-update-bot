import { SlashCommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import fs from "fs";
import { Command as CommandType } from "../modules/types";

const Command = {
  data: new SlashCommandBuilder().setName("help").setDescription("shows a list of commands"),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

    let list: string[] = [];

    for (const file of commandFiles) {
      const command: CommandType = require(`../commands/${file}`);
      list.push(`**${command.data.name}** - ${command.data.description}`);
    }

    interaction.reply({
      embeds: [
        new Discord.MessageEmbed().setTitle("Commands").setDescription(list.join("\n")).setColor("#0099ff"),
      ],
    });
  },
};

module.exports = Command;
