import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import Discord from 'discord.js';
import Util from '../bot/util';
import UUIDManager from '../data/player/uuidManager';

const Command = {
    data: new SlashCommandBuilder()
        .setName('uuid')
        .setDescription('Get A player UUID')
            .addStringOption(new SlashCommandStringOption()
                .setName("username")
                .setDescription("The Player username that you want to get the UUID for.")
                .setRequired(true)
            )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            const uuid = UUIDManager.getUUID(interaction.options.getString("username", true))

            if (uuid) {
                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setTitle(`${UUIDManager.getUsername(uuid)}'s UUID`)
                        .setDescription(Util.cb(uuid))
                        .setThumbnail(Util.getHead(uuid))
                    ]
                })
            } else {
                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Player not found")
                    ]
                })
            }
        }
}
module.exports = Command;