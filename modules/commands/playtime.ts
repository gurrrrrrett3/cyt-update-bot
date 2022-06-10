import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import Util from "../bot/util";
import PlayerSessionManager from "../data/player/playerSessionManager";
import UUIDManager from "../data/player/uuidManager";

const Command = {
  data: new SlashCommandBuilder()
    .setName("playtime")
    .setDescription("Get a player's playtime")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("player")
        .setRequired(true)
        .setDescription("The player to get the playtime of")
    )
    .addStringOption(
      new SlashCommandStringOption().setName("time").setDescription("How far back to look for playtime")
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;
    const name = options.getString("player", true);
    const time = options.getString("time", false);

    const uuid = UUIDManager.getUUID(name);
    if (!uuid) {
        interaction.reply("Could not find a UUID for that player");
        return;
    }

    let timeFrame = 0
    let timeFormat = ""

    if (time) {
        let tf = Util.timeSearch(time);
        if (tf) {
            timeFrame = tf.d;
            timeFormat = tf.f;
        } else {
            interaction.reply("Invalid time format");
            return;
        }
    } else {
        timeFrame = 0;
    }

    const sessions = PlayerSessionManager.getPlayerSessions({
        uuid,
        amount: 0,
        after: timeFrame == 0 ? 0 : Date.now() - timeFrame
    })
   
    let playtime = 0;
    for (const session of sessions) {
        playtime += (session.logout.time == 0 ? Date.now() : session.logout.time) - session.login.time;
    }

    console.log(playtime);
    const playtimeString = Util.formatTime(playtime);

    interaction.reply(`${name} has played for ${playtimeString}${timeFrame != 0 ? ` (last ${timeFormat})` : ""}.`);
  },
};
module.exports = Command;
