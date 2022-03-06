import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: Discord.CommandInteraction, ...args: any[]): Promise<void>;
}

export interface ButtonFile {
    data: {
        customId: string;
        execute: (interaction: Discord.ButtonInteraction, ...args: any[]) => Promise<void>;
    };
}

export interface SelectMenuFile {
    data: {
        customId: string;
        execute: (interaction: Discord.SelectMenuInteraction, ...args: any[]) => Promise<void>;
    };
}
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