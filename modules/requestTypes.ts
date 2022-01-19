import { Player } from "./types";

export type Players = Player[];

export type NearbyPlayers = {
  name: string;
  distance: number;
}[];

export type Online = {
    total: number;
    afk: number;
    worlds: {
        name: string;
        count: number;
    }[]
}

export type TownsOnline = {
    town: string;
    online: number;
}[]

