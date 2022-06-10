import Discord from "discord.js";
import fs from "fs";
import path from "path";

//Class mostly explains itself, just a funnier form of banning

export default class KickManager {
  private static readonly KICK_FILE_LOCATION = path.resolve("./data/kicklist.json");
  public kicklist: string[] = [];

  constructor(client: Discord.Client) {
    this.loadKicklist();
    client.on("guildMemberAdd", (member) => {
      if (this.getKicklist().includes(member.user.id)) {
          member.kick(`${member.user.tag} was kicked for being on the kicklist.`);
      }
    });
  }

  public addUser(userId: string) {
    this.kicklist.push(userId);
    this.saveKicklist();
  }

  public removeUser(userId: string) {
    this.kicklist = this.kicklist.filter((id) => id !== userId);
    this.saveKicklist();
  }

  public getKicklist(): string[] {
    return this.kicklist;
  }

  private saveKicklist() {
    fs.writeFileSync(KickManager.KICK_FILE_LOCATION, JSON.stringify(this.kicklist));
  }

  private loadKicklist() {
    if (!fs.existsSync(KickManager.KICK_FILE_LOCATION)) {
      return;
    }

    const kicklist = fs.readFileSync(KickManager.KICK_FILE_LOCATION, "utf8");
    this.kicklist = JSON.parse(kicklist) as string[];
  }
}
