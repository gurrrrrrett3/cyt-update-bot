import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import plm from "../data/playerLoginManager"
import Discord from "discord.js";
import Util from "../bot/util";

const lm = new plm()

const Command = {
  data: new SlashCommandBuilder()
    .setName("seen")
    .setDescription("Gets the last login time of a player")
    .addStringOption(
      new SlashCommandStringOption().setName("username").setDescription("IGN of the player").setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const username = interaction.options.getString("username", true)
    const lt = plm.getLoginTime(username)

    if (!lt) {
        interaction.reply({
            content: `${username} hasn't played on this se9rver, or the bot hasn't tracked them.`,
            ephemeral: true
        })
        return
    }

    if (Util.getOnlinePlayer(username)) {
        interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Seen for ${username}`)
                .setDescription(`**${username}** is currently online. They have been online for ${plm.getFormattedPlaytime(username)}`)
                .setThumbnail(`https://mc-heads.net/head/${username}`)
                .setTimestamp()
            ]
        })
    }
    
    interaction.reply({
        embeds: [
            new Discord.MessageEmbed()
            .setTitle(`Seen for ${username}`)
            .setDescription(`**${username}** was last seen on <t:${Math.floor(lt / 1000)}> (<t:${Math.floor(lt / 1000)}:R>)`)
            .setThumbnail(`https://mc-heads.net/head/${username}`)
            .setTimestamp()
        ]
    })
},
};
module.exports = Command;
