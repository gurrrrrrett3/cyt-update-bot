import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import Util from "../bot/util";
import PlayerTeleportManager from "../data/player/playerTeleportManager";
import { RankedTeleportData, RankedTeleportEndData, TeleportData } from "../data/player/types";
import UUIDManager from "../data/player/uuidManager";

const Command = {
  data: new SlashCommandBuilder()
    .setName("ptrank")
    .setDescription("View your personal teleport rank data.")
    .addStringOption(
      new SlashCommandStringOption().setName("name").setDescription("Your username").setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {

    const username = interaction.options.getString("name", true);
    let uuid = UUIDManager.getUUID(username);

    if (!uuid) return interaction.reply(`UUID not found for ${username}.`);

    //get teleports

    let teleports = PlayerTeleportManager.getPlayerTeleports({
      uuid,
      amount: -1,
    });

    let teleportLb: RankedTeleportEndData[] = [];

    teleports.forEach((v) => {
        let l = teleportLb.find((f) => Util.matchTeleportLocations(f, v.end))
      if (l) {
          let i = teleportLb.findIndex((f) => Util.matchTeleportLocations(f, v.end))
        teleportLb[i] = {
            count: teleportLb[i].count + 1,
            world: l.world,
            x: l.x,
            z: l.z
        }
      } else {
          teleportLb.push({
             count: 1,
             world: v.end.world,
             x: v.end.x,
             z: v.end.z
          })
      }
    });

    teleportLb = teleportLb.sort((a, b) => b.count - a.count).slice(0, 25)

    let desArray: string[] = []

    teleportLb.forEach((v, i) => {
        desArray.push(`\`${i+1}\` [\`${v.count}\`] ${v.world} - ${v.x}, ${v.z}`)
    })

    interaction.reply({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle(`${username}'s top teleports`)
                .setDescription(desArray.join("\n"))
                .setColor("#0099ff")
                .setTimestamp()
        ]
    })
  },
};
module.exports = Command;
