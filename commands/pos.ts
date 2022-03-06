import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import Discord from 'discord.js';
import { Player } from '../modules/types';
import Util from '../modules/util';

const Command = {
    data: new SlashCommandBuilder()
        .setName('pos')
        .setDescription('gets info on a player\'s position')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('player')
                .setRequired(true)
                .setDescription('the player to get info on')
        ),
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            const player = interaction.options.getString('player')
            Util.sendRequest(`/player/${player}`).then((res: Player) => {
                const embed = new Discord.MessageEmbed()
                  .setTitle(`${res.name}'s Position`)
                  .setDescription(`World: ${res.world}`)
                  .setTimestamp()
                  .setThumbnail(
                    "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
                  )
                  .addField("X", res.x.toString())
                  .addField("Z", res.z.toString())
                  .addField("Yaw", res.yaw.toString());
              
                interaction.reply({ embeds: [embed] });
              });
        }
}

module.exports = Command;