import Discord from "discord.js";
import TeleportRanking from "../../data/player/teleportRanking";
export default class TeleportRankPagedEmbed {
  public type: string;
  constructor(type: string) {
    this.type = type;
  }

  public getEmbed(page: number): Discord.MessageEmbed {
    let data = TeleportRanking.openTeleportDataFile()

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Teleport Rank Leaderboard`)
      .setFooter({
        text: `Page ${page + 1} of ${Math.floor(data.length / 25)}`,
      });

    let disc: string[] = [];

    if (this.type === "unique") {
        disc.push("Teleport ranks are sorted by the number of unique users who used them.")
        data = data.sort((a, b) => b.players.length - a.players.length)
      } else if (this.type === "uses") {
        disc.push("Teleport ranks are sorted by the number of times they are used.");
        data = data.sort((a, b) => b.count - a.count)
      } else if (this.type === "ratio") {
        disc.push("Teleport ranks are sorted by the ratio of unique users to total users who used them.");
        data = data.sort((a, b) => (b.count / b.players.length) - (a.count / a.players.length))
      }

      data = data.slice(page * 25, page * 25 + 25);

    let i = 0;

    data.forEach((rank, index) => {
      disc.push(`${page * 25 + index + 1}. **${rank.name}** - ${
        this.type == "uses" || this.type == "unique"
          ? rank.count
          : (rank.count / rank.players.length).toFixed(2)
      } | ${rank.world} [${rank.x}, ${rank.z}]`);
    });

    embed.setDescription(disc.join("\n")).setColor("#0099ff").setFooter({
      text: "Use /trank view [name] to view a teleport rank.",
    });

    return embed;
  }
}
