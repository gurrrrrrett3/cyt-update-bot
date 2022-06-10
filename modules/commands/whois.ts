import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Discord from "discord.js";
import Linking from "../bot/linking";

const Command = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get info about yourself or a user")
    .addUserOption(
      new SlashCommandUserOption().setName("user").setDescription("User to get info on, leave blank to run on yourself")
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (!interaction.inGuild() || !interaction.guild) return
    const user = interaction.options.getUser("user", false) ?? interaction.user
    const member = interaction.guild.members.cache.get(user.id)

    if (!member || !member.joinedAt) {
        interaction.reply({content: "Could not retrieve user", ephemeral: true})
        return
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(user.tag)
        .setThumbnail(user.avatarURL({dynamic: true, format: "png", size: 1024}) ?? "")
        .setDescription(`
        Created: <t:${Math.floor(user.createdAt.getTime() / 1000)}> (<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>)
        Joined:  <t:${Math.floor((member.joinedAt.getTime()  ) / 1000)}> (<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>)

        Linked: ${Linking.getLinkByID(user.id) ? `Linked to ${Linking.getLinkByID(user.id)?.ign}` : "Not Linked"}
        Rank: <@&${member.roles.highest.id}>
        `)

      interaction.reply({
        embeds: [embed]
      })
  },
};
module.exports = Command;
