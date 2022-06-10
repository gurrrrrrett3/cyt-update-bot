import Player from "../resources/player";
import { bot } from "../..";
import PlayerLoginManager from "../data/playerLoginManager";
import PlayerSessionManager from "../data/player/playerSessionManager";
import UUIDManager from "../data/player/uuidManager";
import PlayerTeleportManager from "../data/player/playerTeleportManager";

export default class playerUpdate {
  public players: Player[] = [];
  public oldPlayers: Player[] = [];

  constructor() {}

  public update(players: Player[]) {
    this.players = players;

    if (this.oldPlayers.length == 0) {
      this.oldPlayers = players; // First time
    }

    // Check for new players
    this.players.forEach((p) => {
      if (!this.oldPlayers.find((op) => op.name == p.name)) {
        // New player
        bot.updateEmbedManager.playerJoin(p);
        PlayerLoginManager.newLogin(p.name);
        PlayerSessionManager.onPlayerLogin(p);
        UUIDManager.update(p);
      }
    });

    // Check for players that left
    this.oldPlayers.forEach((op) => {
      if (!this.players.find((p) => p.name == op.name)) {
        // Player left
        bot.updateEmbedManager.playerLeave(op);
        PlayerSessionManager.onPlayerLogout(op);
      }
    });

    PlayerTeleportManager.handleTeleports(this.oldPlayers, this.players)

    this.oldPlayers = this.players;
  }
}
