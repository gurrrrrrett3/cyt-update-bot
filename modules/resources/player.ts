import Util from "../bot/util";
import PlayerSessionManager from "../data/player/playerSessionManager";
import { Coords, PlayerSelfSessionOptions, WorldLocation } from "./types";

export interface PlayerOptions {
  world: string;
  armor: number;
  name: string;
  x: number;
  health: number;
  z: number;
  uuid: string;
  yaw: number;
}

export default class Player {
  public world: string;
  public armor: number;
  public name: string;
  public x: number;
  public health: number;
  public z: number;
  public uuid: string;
  public yaw: number;

  constructor(options: PlayerOptions) {
    this.world = options.world;
    this.armor = options.armor;
    this.name = options.name;
    this.x = options.x;
    this.health = options.health;
    this.z = options.z;
    this.uuid = options.uuid;
    this.yaw = options.yaw;
  }

  public getCoords(): Coords {
    return {
      x: this.x,
      z: this.z,
    };
  }

  public getLocation(): WorldLocation {
    return {
      world: this.world,
      x: this.x,
      z: this.z,
    };
  }

  public isAfk(): boolean {
    return (
      (this.x == 0 && this.z == 0 && this.world == "world") ||
      (this.x == 25 && this.z == 42 && this.world == "world")
    );
  }

  public getName(): string {
    return Util.formatPlayer(this.name)
  }

  public getSessions(data: PlayerSelfSessionOptions) {
    PlayerSessionManager.getPlayerSessions({
      uuid: this.uuid,
      amount: data.amount,
      before: data.before,
      after: data.after
    })
  }
}
