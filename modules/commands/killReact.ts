import { SlashCommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';

const Command = {
    data: new SlashCommandBuilder()
        .setName('reactpurge')
        .setDescription('ADMIN COMMAND'),
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
           if (interaction.user.id != "232510731067588608") {
               return interaction.reply('You are not allowed to use this command');
           }
           interaction.deferReply()
           let count = 0;

           interaction.guild?.channels.cache.forEach(channel => {
                if (!channel.isText()) return
                channel.messages.fetch({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        count += message.reactions.cache.size
                        message.reactions.removeAll()
                    })
                })
           })

           interaction.reply(`Removed ${count} reactions`)
            
        }
}
module.exports = Command;