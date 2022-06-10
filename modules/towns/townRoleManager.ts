import { Client, Guild } from "discord.js";
import Linking from "../bot/linking";
import Util from "../bot/util";
import Town from "../resources/town";

export default class TownRoleManager {
  constructor(public client: Client) {
    this.client = client;
  }

  public async addTownRoles(town: Town) {
    const guild = this.client.guilds.cache.get("953522718215655425") as Guild;
    const townRole = guild.roles.cache.find((r) => r.name === town.name);
    if (townRole) {
      return;
    }
    const townMemberRole = guild.roles.create({
      name: town.name,
      hoist: false,
      mentionable: true,
      color: "#0099ff",
    });
    const townAssistantRole = guild.roles.create({
      name: town.name + "-Assistant",
      hoist: false,
      mentionable: true,
      color: "#00ff99",
    });
    const townMayorRole = guild.roles.create({
      name: town.name + "-Mayor",
      hoist: false,
      mentionable: true,
      color: "#9900ff",
    });
  }

  public onLink(ign: string) {
    const guild = this.client.guilds.cache.get("953522718215655425") as Guild;
    const town = Util.getTownFile().find((t) => t.residents.includes(ign));

    if (!town) return

    let townRank = "";
    if (town.mayor === ign) {
      townRank = "Mayor";
    } else if (town.assistants.includes(ign)) {
      townRank = "Assistant";
    }

    const townRole = guild.roles.cache.find((r) => r.name === town.name + "-" + townRank);
    if (!townRole) return

    const id = Linking.getLinkByIGN(ign)?.id;
    if (!id) return;

    const member = guild.members.cache.get(id);
    if (!member) return;

    member.roles.add(townRole);
    
  }
}
