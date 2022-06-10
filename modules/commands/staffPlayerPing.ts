import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';
import config from "../../config.json"
import NotifyManager from '../data/notifyManager';

const Command = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('STAFF COMMAND: Manage getting pinged when a certian player')
            .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName("add")
                .setDescription("Add a player to your ping list.")
                .addStringOption(new SlashCommandStringOption()
                    .setName("name")
                    .setDescription("The username of the player")
                    .setRequired(true)    
                ) 
            )
            .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName("remove")
                .setDescription("Remove a player from your ping list.")
                    .addStringOption(new SlashCommandStringOption()
                        .setName("name")
                        .setDescription("The username of the player")
                        .setRequired(true)
                    )
            )
            .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription("Show your ping list.")
            )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
               const roles = interaction.member?.roles as Discord.GuildMemberRoleManager
               if (!roles.cache.has(config.ROLES.SERVER_STAFF)) {
                   interaction.reply({
                       content: "You do not have permission to use this command."
                   })
               } else {
                const name = interaction.options.getString("name", true)
                const sub = interaction.options.getSubcommand(true)

                switch (sub) {
                    case "add": 
                        const o = NotifyManager.getNotfyByID(interaction.user.id)
                        const u = o.find((n) => {n.playerIGN == name})
                        if (u) {
                            interaction.reply(`${name} is already in your notify list!`)
                        } else {
                            NotifyManager.newNotify(interaction.user.id, name)
                            interaction.reply(`${name} added to your notify list!`)
                        }
                    break;
                    case "remove": 
                    
                }       

               }
        }
}
module.exports = Command;