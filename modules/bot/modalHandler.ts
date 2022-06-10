import Discord from "discord.js"
import ReportEmbed from "./embeds/reportEmbed"
export default class ModalHandler {
    constructor (public client: Discord.Client) {
        this.client.on("interactionCreate", (interaction) => {
            if (!interaction.isModalSubmit()) return 

            console.log(interaction.customId)

            switch (interaction.customId) {
                case "reportModal":
                    ReportEmbed.handle(interaction)
                    break;
                default:
                    break;
            }
        })
    }
}