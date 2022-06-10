import Discord = require("discord.js");
import { bot } from "../../..";
import PlayerLoginManager from "../../data/playerLoginManager";
import ParkourAdvancedPresence from "../../map/advancedPresence/parkour";
import { getPresence } from "../../map/advancedPresence/presenceManager";
import MapInterface from "../../map/mapInterface";
import { EmbedClass } from "../../resources/types";
import Util from "../util";

const cb = Util.cb;

export default class PlayerListEmbed {
  public channel: Discord.TextChannel;
  public playerListMessage: Discord.Message | null = null;
  public playerAFKMessage: Discord.Message | null = null;
  public dataMessage: Discord.Message | null = null;
  public preformanceMessage: Discord.Message | null = null;
  public timer: NodeJS.Timer = setTimeout(() => {
    this.resend();
    //10 minutes
  }, 600000);

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
    return this;
  }

  public async update(): Promise<void> {
    if (this.playerListMessage && this.playerAFKMessage && this.dataMessage && this.preformanceMessage) {
      const content = await this.getMessage();
      this.playerListMessage.edit(content[0]);
      this.playerAFKMessage.edit(content[1]);
      this.dataMessage.edit(content[2]);
      this.preformanceMessage.edit(content[3]);
    } else {
      this.resend();
    }
  }
  public async resend(): Promise<void> {
    Util.purgeChannel(this.channel, 100).then(async () => {
      this.channel
        .send({ content: (await this.getMessage()).at(0) })
        .then((msg) => {
          this.playerListMessage = msg;
        })
        .then(async () => {
          this.channel
            .send({ content: (await this.getMessage()).at(1) })
            .then((msg) => {
              this.playerAFKMessage = msg;
            })
            .then(async () => {
              this.channel
                .send({ content: (await this.getMessage()).at(2) })
                .then((msg) => {
                  this.dataMessage = msg;
                })
                .then(async () => {
                  this.channel.send({ content: (await this.getMessage()).at(3) }).then((msg) => {
                    this.preformanceMessage = msg;
                  });
                });
            });
        });
    });
  }

  public async getMessage(): Promise<string[]> {
    const players = Util.getPlayerFile();
    players.sort((a, b) => {
      let score = Util.getWorldLevel(a.world) - Util.getWorldLevel(b.world);
      score += a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return score;
    });

    const afkPlayers = Util.getAfkPlayers();
    const nonAfkPlayers = players.filter((player) => {
      return !player.isAfk();
    });

    //Format each line of the player list embed

    const firstLine = `ONLINE LIST\n   ${Util.padAfter("World", 16)} | ${Util.padAfter(
      "Username",
      20
    )}| ${Util.padAfter("Current Location", 19)}`;

    const playerList = nonAfkPlayers.map(
      (p) =>
        `${Util.getNationStatusSymbol(p)} ${Util.padAfter(p.world, 16)} | ${Util.padAfter(
          p.name,
          20
        )}${Util.formatPresence(p)}`
    );

    const afkList = afkPlayers.map(
      (p) =>
        `${Util.getNationStatusSymbol(p)} ${Util.padAfter(
          p.name,
          20
        )} | ${PlayerLoginManager.getFormattedPlaytime(p.name)}`
    );

    //formatted list of all players
    const allPlayers = playerList.concat(afkList);

    //percentage of players in Broglands Nation
    const broglandsPercent = (Util.getPlayersInBroglands().length / players.length) * 100;

    //Player list
    const livePlayerList = firstLine + "\n\n" + playerList.join("\n");

    //afk
    const liveAFKList = `AFK LIST\n\n` + afkList.join("\n");

    //data
    let data = [
      `Total: ${allPlayers.length} players`,
      `Non AFK: ${nonAfkPlayers.length}`,
      `AFK: ${afkList.length}`,
      `AFK Percentage: ${((afkPlayers.length / allPlayers.length) * 100).toFixed(2)}%`,
      `Online in Nation: ${Util.getPlayersInBroglands().length}`,
      `Nation Percentage: ${broglandsPercent.toFixed(2)}%`,
      `Nation Size: ${Util.getBroglandsResidentCount()} Players`,
      `Players in database: ${Util.getPlayersInDatabase()} Players`,
    ].join("\n");

    //preformance
    const preformance = [
      `Last updated: <t:${Math.floor(Date.now() / 1000)}>`,
      `Embed limit: ${((livePlayerList.length / 4096) * 100).toFixed(2)}% (${livePlayerList.length} / 4096)`,
      `RAM: ${Math.round(process.memoryUsage().rss / 1000000)}MB`,
      `Uptime: ${Util.formatTime(process.uptime() * 1000)}`,
      `Node version: ${process.version}`,
    ].join("\n");

    let out = [cb(livePlayerList), cb(liveAFKList), cb(data), preformance];

    return out;
  }
}
