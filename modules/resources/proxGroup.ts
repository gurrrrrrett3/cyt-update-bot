import { Client, GuildMember, VoiceChannel } from "discord.js";
import ProxMember from "./proxMember";
import config from "../../config.json";
import Player from "./player";

export default class ProxGroup {
  public members: ProxMember[] = [];
  public channel: VoiceChannel

  constructor(public client: Client, channel: VoiceChannel) {
    this.channel = channel;
  }

  public addMember(member: ProxMember) {
    this.members.push(member);
  }

  public removeMember(member: ProxMember) {
    this.members = this.members.filter((m) => m.userID !== member.userID);
    this.channel.members.get(member.userID)?.voice.disconnect()
  }

  public async update(players: Player[]) {
    const updateMembers: (
      | {
          member: GuildMember;
          stillIn: boolean;
        }
      | undefined
    )[] = this.members.map((m) => {
      const member = this.client.guilds.cache.get(config.GUILD)?.members.cache.get(m.userID);
      if (member) {
        return {
          member,
          stillIn: true,
        };
      }
      return undefined;
    });

    const stillIn = updateMembers.filter((m) => {
      return m && m?.stillIn;
    }) as {
      member: GuildMember;
      stillIn: boolean;
    }[];

    const left = this.members.filter((m) => {
      return !stillIn.find((s) => s.member.id === m.userID);
    });

    left.forEach((m) => {
        this.removeMember(m);
        });

  }

  
  
}
