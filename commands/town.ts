import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import Discord from 'discord.js';
import { Player, Town } from '../modules/types';
import Util from '../modules/util';

const Command = {
    data: new SlashCommandBuilder()
        .setName('town')
        .setDescription('gets info on a town')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('town')
                .setRequired(true)
                .setDescription('the town to get info on')
        ),
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
          const town = interaction.options.getString('town')

            Util.sendRequest(`/town/${town}`).then((res: Town) => {
                const embed = new Discord.MessageEmbed()
                  .setTitle(`Info about **${res.name}**`)
                  .setDescription(`World: ${res.world}`)
                  .setTimestamp()
                  .setThumbnail(
                    "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
                  )
                  .addField("X", res.coords.x.toString())
                  .addField("Z", res.coords.z.toString())
                  .addField("Mayor", res.mayor)
                  .addField("Assistants", res.assistants.join(", "))
                  .addField("Residents", res.residents.join(", "))
                  .addField("PVP", res.pvp.toString());
              
                interaction.reply({ embeds: [embed] });
              });
        }
}

module.exports = Command;