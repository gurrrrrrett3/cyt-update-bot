import { SlashCommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';

const Command = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('ADMIN COMMAND: Restart the bot'),
        async execute(interaction: Discord.ButtonInteraction, ...args: any[]) {
            if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
                interaction.reply({content: "You can't do that!", ephemeral: true})
                return
            }

            interaction.reply({
                content: "Restarting... \nhttps://www.youtube.com/watch?v=Gb2jGy76v0Y",
                ephemeral: true
            }).then(() => {
                process.exit(0)
            })
        }
}
module.exports = Command;