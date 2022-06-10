import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import GetPlayerInfo from "../data/getPlayerInfo";
import MapInterface from "../map/mapInterface";

const Command = {
  data: new SlashCommandBuilder()
    .setName("res")
    .setDescription("Get info on player")
    .addStringOption(
      new SlashCommandStringOption().setName("name").setDescription("Player IGN").setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options
    const data = GetPlayerInfo.res(options.getString("name", true))
    const online = data.online ? `Online, on ${data.online.world}` : "Offline"
    
    const embed = new Discord.MessageEmbed()
        .setTitle(GetPlayerInfo.getPlayerNameCapitalized(data.name) || data.name)
        .setColor(data.online ? "#00ff00" : "#ff0000")
        .addField("Town", data.town, true)
        .addField("Status", online, true)
        
    if (data.online) embed.addField("Coords", `${data.online.x}, ${data.online.z}`, true)
    if (data.mayor) embed.addField("Role", `Mayor`, true)
    if (data.assistant) embed.addField("Role", `Assistant`, true)
    if (!data.mayor && !data.assistant) embed.addField("Role", `Resident`, true)
    if (data.online) {
        embed.setURL(MapInterface.generateMapLink(data.online, 5))
        embed.setFooter({text: "You can click the title of this embed to open the map"})
    }

    
    interaction.reply({embeds: [embed]})
  },
};
module.exports = Command;
