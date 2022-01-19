import { Client, Message, MessageEmbed, EmbedFieldData } from "discord.js";
import { Online } from "./requestTypes";
import { Command, Player, Town } from "./types";
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
        .addField("Node Version", process.version);

      message.reply({ embeds: [embed] });
    },
  },
  {
    name: "online",
    description: "Get the number of players online",
    category: "CYT",
    aliases: ["o"],
    execute: async (Client: Client, message: Message) => {
      Util.sendRequest("/players/online").then((res: Online) => {
        let feilds: EmbedFieldData[] = [];

        res.worlds.forEach((world) => {
          feilds.push({ name: world.name, value: world.count.toString() });
        });

        const embed = new MessageEmbed()
          .setTitle("Players Online")
          .setDescription(`${res.total} players online\n${res.afk} players AFK`)
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
          )
          .setTimestamp()
          .setFields(feilds);

        message.reply({ embeds: [embed] });
      });
    },
  },
  {
    name: "onlinelist",
    description: "Get a list of players online",
    category: "CYT",
    aliases: ["ol"],
    execute: async (Client: Client, message: Message) => {
      Util.sendRequest("/players").then((res: Player[]) => {
        let worlds: string[] = [];

        res.forEach((player) => {
          if (!worlds.includes(player.world)) {
            worlds.push(player.world);
          }
        });

        let feilds: EmbedFieldData[] = [];

        worlds.forEach((world) => {
          let players: string[] = [];

          res.forEach((player) => {
            if (player.world === world) {
              players.push(player.name + ((player.x == 25 && player.z == 42) ? "*(AFK)*" : ""));
            }
          });

          feilds.push({ name: world, value: players.join(", ") });
        });

        const embed = new MessageEmbed()
          .setTitle("Players Online")
          .setDescription(`${res.length} players online`)
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
          )
          .setTimestamp()
          .setFields(feilds);

        message.reply({ embeds: [embed] });
      });
    },
  },
  {
    name: "pos",
    description: "Get the position of a player",
    category: "CYT",
    aliases: ["position", "location"],
    execute: async (Client: Client, message: Message) => {
      const args = message.content.split(" ");
      const player = args[1];

      if (!player) {
        message.reply("Please provide a player name");
        return;
      }

      Util.sendRequest(`/player/${player}`).then((res: Player) => {
        const embed = new MessageEmbed()
          .setTitle(`${res.name}'s Position`)
          .setDescription(`World: ${res.world}`)
          .setTimestamp()
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
          )
          .addField("X", res.x.toString())
          .addField("Z", res.z.toString())
          .addField("Yaw", res.yaw.toString());

        message.reply({ embeds: [embed] });
      });
    },
  },
  {
    name: "town",
    description: "Get information about a town",
    category: "CYT",
    aliases: ["t"],
    execute: async (Client: Client, message: Message) => {
      const args = message.content.split(" ");
      const town = args[1];

      if (!town) {
        message.reply("Please provide a town name");
        return;
      }

      Util.sendRequest(`/town/${town}`).then((res: Town) => {
        const embed = new MessageEmbed()
          .setTitle(`${res.name}`)
          .setDescription(`World: ${res.world}\nX: ${res.coords.x}\nZ: ${res.coords.z}`)
          .setTimestamp()
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/909840674990469180/909840709580894218/CYT_UpdateBotIcon.png"
          )
          .addField("Mayor", res.mayor)
          .addField("PVP", res.pvp.toString())
          .addField("Assistants", res.assistants.length > 0 ? res.assistants.join(", ") : "None")
          .addField("Residents", res.residents.join("\n"));

        message.reply({ embeds: [embed] });
      });
    },
  },
];

function mapCommands() {
  return commands.map((c) => `**${c.name}** - ${c.description}`).join("\n");
}

export default commands;
