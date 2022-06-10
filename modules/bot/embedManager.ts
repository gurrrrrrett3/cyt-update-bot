import Discord from "discord.js";
import { EmbedClass } from "../resources/types";
import PlayerListEmbed from "./embeds/playerListEmbed";

export type EmbedTypes = "playerlist";

//This class is largly unsed at the moment

export default class EmbedManager {
  public embeds = new Map<string, EmbedClass | PlayerListEmbed>();

  constructor(public client: Discord.Client) {}

  public async registerEmbed(name: string, channel: string, embed: EmbedTypes): Promise<void> {
    const embedClass = this.getEmbed(embed, await this.resolveChannel(channel));
    this.embeds.set(name, embedClass);

    console.log(`Registered embed ${name}`);
  }

  public updateEmbeds(): void {
    this.embeds.forEach((embed) => {
      embed.update();
    });
  }

  public updateSingleEmbed(name: string): void {
    const embed = this.embeds.get(name);
    if (embed) {
      embed.update();
    } else {
      console.error(`Embed ${name} not found`);
    }
  }

  private getEmbed(embed: EmbedTypes, channel: Discord.TextChannel) {
    switch (embed) {
      case "playerlist":
        return new PlayerListEmbed(channel);
        break;
    }
  }

  private async resolveChannel(channel: string): Promise<Discord.TextChannel> {
    const c = await this.client.channels.fetch(channel).then((c) => {
      if (c instanceof Discord.TextChannel) {
        return c;
      } else {
        throw new Error(`Channel ${channel} is not a text channel`);
      }
    });
    if (!c) {
      throw new Error("Channel not found");
    }
    return c;
  }
}
