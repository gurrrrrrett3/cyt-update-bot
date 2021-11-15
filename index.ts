//@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
import Discord, { MessageEmbed } from "discord.js"
import cyt from "./modules/cyt"
import { update } from "./modules/infochannels"
import dotenv from "dotenv"

dotenv.config()

const token = process.env.TOKEN 

export const CYT = new cyt()

export const Client = new Discord.Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS", "GUILD_WEBHOOKS", "GUILD_MESSAGES"]})

Client.login(token)

Client.once("ready", () => {

    console.log(`Ready, logged in as ${Client.user?.tag}`)
    Client.user?.setActivity({type: "PLAYING", name: `On CYT | craftyour.town`})

    setInterval(() => {
        update()
    }, 10000)

})

Client.on("messageCreate", async (message) => {
    console.log(message.content)

    if (message.author.bot || message.channel.type != "GUILD_TEXT") return

    if(!message.content.startsWith("-")) return

    const content = message.content.slice(1)
    const split = content.split(" ")
    const command = split[0].toLowerCase()
    const args = split.slice(1)

    if (command == "pos") {

        const data = await CYT.getPos(args[0])

        message.reply({embeds:[new MessageEmbed().setTitle(`Position of ${data?.name}`).setDescription(`**World:** ${data?.world}\n**X:** ${data?.x}\n**Z:** ${data?.z}`)]})

    }

})