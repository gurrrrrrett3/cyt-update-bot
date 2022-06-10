import { VoiceChannel } from "discord.js";
import Util from "../bot/util";
import ProxGroup from "../resources/proxGroup";
import ProxMember from "../resources/proxMember";
import config from "../../config.json";

//Nowhere near ready yet, not even going to work on this for a while

export default class ProxManager {
  public static readonly PROX_CATEGORY: string = "960759625421045841";
  public static readonly LOBBY_CHANNEL: string = "960759691351326750";

  public groups: ProxGroup[] = [];

  public update() {
    const players = Util.getPlayerFile();
    this.groups.forEach((g) => {
      g.update(players);
    });
  }

  public static moveMemberToLobby(group: ProxGroup, id: string) {
    const member = group.channel.members.get(id);
    if (member) {
      member.voice.setChannel(group.client.channels.cache.get(ProxManager.LOBBY_CHANNEL) as VoiceChannel);
    }
  }

  public static isMemberWithinRadius(a: ProxMember, b: ProxMember) {
    const distance = Util.getDistance(a.pos, b.pos);
    return distance <= config.PROX.RADIUS;
  }
}
