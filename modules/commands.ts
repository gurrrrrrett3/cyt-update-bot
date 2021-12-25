import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "./types";
import Util from "./util";

const commands: Command[] = [
  {
    name: "ping",
    description: "Get the latency of the bot",
    category: "General",
    aliases: ["pong"],
    execute: async (Client: Client, message: Message) => {
      const m = await message.channel.send("Ping?");
      m.edit(
        `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(
          Client.ws.ping
        )}ms`
      );
    },
  },
  {
    name: "help",
    description: "Get a list of commands",
    category: "General",
    aliases: ["h"],
    execute: async (Client: Client, message: Message) => {
      const embed = new MessageEmbed()
        .setTitle("CYT Commands")
        .setDescription("Command List")
        .setTimestamp()
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
        );

      const commandFields = mapCommands();

        embed.addField("Commands", commandFields);

      message.reply({ embeds: [embed] });
    },
  },
  {
    name: "info",
    description: "Get information about the bot",
    category: "General",
    aliases: ["i"],
    execute: async (Client: Client, message: Message) => {
        
        const embed = new MessageEmbed()
        .setTitle("CYT Update Bot")
        .setDescription("By Gucci Garrett#9211")
        .setTimestamp()
        .setThumbnail(
            "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
        )
        .addField("Version", process.env.npm_package_version?.toString() ?? "Unknown")
        .addField("GitHub", process.env.npm_package_repository?.toString() ?? "Unknown")
        .addField("Uptime", Util.formatTime(process.uptime()))
        .addField("CPU Usage", `${(process.cpuUsage().user / 1000000).toFixed(2)}%`)
        .addField("Memory Usage", `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`)
        .addField("Node Version", process.version)
        

        message.reply({ embeds: [embed] });


    },
  },
  {
    name: "online",
    description: "Get the number of players online",
    category: "CYT",
    aliases: ["o"],
    execute: async (Client: Client, message: Message) => {},
  },
  {
    name: "pos",
    description: "Get the position of a player",
    category: "CYT",
    aliases: ["position", "location"],
    execute: async (Client: Client, message: Message) => {},
  },
  {
    name: "town",
    description: "Get information about a town",
    category: "CYT",
    aliases: ["t"],
    execute: async (Client: Client, message: Message) => {},
  },
];

function mapCommands() {
  return commands.map((c) => `**${c.name}** - ${c.description}`).join("\n");
}

export default commands;
