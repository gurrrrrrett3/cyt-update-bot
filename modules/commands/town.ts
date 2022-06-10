import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import Util from "../bot/util";
import MapInterface from "../map/mapInterface";

const Command = {
  data: new SlashCommandBuilder()
    .setName("town")
    .setDescription("Get's info on a town.")
    .addStringOption(
      new SlashCommandStringOption().setName("name").setDescription("The name of the town.").setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const name = interaction.options.getString("name", true);
    const towns = Util.getTownFile();
    let town = towns.find((t) => t.name.toLowerCase() === name.toLowerCase().replace(/\s/g, "_"));

    if (!town) {
      return interaction.reply("Town not found.");
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(town.name)
      .setURL(MapInterface.generateMapLink(town.getLocation(), 5))
      .addField("Mayor", town.mayor, true)
      .addField("Nation", town.nation ?? "None", true)
      .addField("Population", town.residents.length.toString(), true)
      .addField(
        "Assistants",
        town.assistants.length > 0 ? town.assistants.map((r) => Util.formatPlayer(r)).join(", ") : "None",
        true
      )
      .addField("Residents", town.residents.map((r) => Util.formatPlayer(r)).join(", "), true);

    interaction.reply({ embeds: [embed] });
  },
};
module.exports = Command;
