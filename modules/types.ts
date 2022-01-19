import { Client, Message } from "discord.js";

export type Command = {
  name: string;
  description: string;
  category: string;
  aliases: string[];
  execute: (Client: Client, message: Message, args: string[]) => void;
};

export type Player = {
    world: string;
    armor: number;
    name: string;
    x: number;
    health: number;
    z: number;
    uuid: string;
    yaw: number;
  };
  
  export type Town = {
    name: string;
    mayor: string;
    assistants: string[];
    residents: string[];
    pvp: boolean;
    world: string;
    coords: Coords;
  };
  
  export type Coords = {
    x: number;
    z: number;
  };