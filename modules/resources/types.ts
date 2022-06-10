import { Message, TextChannel } from "discord.js";
import Player from "./player";
import Polygon from "./polygon";

export interface Coords {
  x: number;
  z: number;
}

export interface WorldLocation extends Coords {
  world: string;
}

export interface PlayersFetchReturnPlayer {
    world: string;
    armor: number;
    name: string;
    x: number;
    health: number;
    z: number;
    uuid: string;
    yaw: number;
}

export interface PlayersFetchReturn {
    players: PlayersFetchReturnPlayer[];
    max: number;
}

export interface EmbedClass {
    channel: TextChannel;
    message: Message | null;
    update(): void;
}

export interface TownDataFile {
  world: string;
  nation: string;
  name: string;
  mayor: string;
  pvp: boolean;
  capital: boolean;
  outpost: boolean;
  residents: string[];
  assistants: any[];
  coords: Coords;
  polygon: Polygon[] | undefined
}

export interface PlayerSelfSessionOptions {
  amount: number,
  before?: number,
  after?: number
}