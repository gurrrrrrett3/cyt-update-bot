import { SlashCommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import Util from "../bot/util";
import PlayerSessionManager from "../data/player/playerSessionManager";
import { SessionData } from "../data/player/types";
import UUIDManager from "../data/player/uuidManager";

const Command = {
  data: new SlashCommandBuilder()
    .setName("playtimelb")
    .setDescription("Get the leaderboard for the players with the most playtime! WARNING TAKES A WHILE"),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {



    let uuids = UUIDManager.openFile();

    let sessions: {
      uuid: string;
      username: string;
      playtime: number;
    }[] = [];

    let totalPlaytime = 0

    uuids.forEach((uuid) => {
        let p = PlayerSessionManager.getPlayerPlaytime({
            uuid: uuid.UUID,
          })
      sessions.push({
        playtime: p,
        uuid: uuid.UUID,
        username: uuid.username,
      });
      totalPlaytime += p
      
    });

    let cleanSessions = sessions.sort((a, b) => b.playtime- a.playtime).splice(0, 50).map((v, i) => {
        return `${i + 1}: **${Util.formatPlayer(v.username)}** ${Util.formatTime(v.playtime)}`
    }).join("\n")

    let embed = new Discord.MessageEmbed()
    .setTitle("Playtime Leaderboard")
    .setDescription(cleanSessions)    
    .setTimestamp()
    .setFooter({
        text: `Total Playtime: ${Util.formatTime(totalPlaytime)}`
    })
    .setColor("BLUE")

    interaction.reply({embeds: [embed]})
  },
};
module.exports = Command;
