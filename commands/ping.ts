import { SlashCommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';

const Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('gets info on the bot\'s ping'),
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            const pingMessage = await interaction.channel?.send('Pinging...').catch(console.error);
            if (!pingMessage) {
                interaction.reply('Could not send ping message');
                return
            }
            interaction.reply({ephemeral: true, content: `Pong! Latency is ${pingMessage.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms.`}).then(() => {
                pingMessage?.delete();
            })
                
        }
}

module.exports = Command;