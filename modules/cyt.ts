//@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
import fetch from "node-fetch";
import fs from "fs";
const fuzzyset = require("fuzzyset");

import Player from "./cytplayer";
import Town from "./cytmarker";
import { MarkerIconData, MarkerPolygonData } from "./cytmarker";
import { Client } from "..";
import { MessageEmbed } from "discord.js";
import { startTime, townUpdate } from "./infochannels";
import dailyUpdate from "./dailyupdate";
import Pinata from "./pinata";
import PolygonUtil from "./polygon";

const playerDataFile = "./data/fetchPlayers.json";
const worldMarkerDataFile = "./data/fetchWorldMarkers.json";
const earthMarkerDataFile = "./data/fetchEarthMarkers.json";
const townsDataFile = "./data/towns.json";

const onlineDataFile = "./data/onlineData.json";

const cookieFile = "./data/cookie.json";

const defaultAddress: string = "https://zion.craftyourtown.com";
const playerEndpoint: string = "/tiles/players.json";
const worldMarkerEndpoint: string = "/tiles/world/markers.json";
const earthMarkerEndpoint: string = "/tiles/earth/markers.json";

let ready = false;

let dlFails = {
  players: false,
  worldMarkers: false,
  earthMarkers: false
}

export default class cyt {
  private lastFetch: number;
  private playerFuzzy: any;
  private townFuzzy: any;
  private interval = setInterval(async () => {
    await this.fetch();
    Pinata.update()
  }, 5000);

  public address: string;
  public cookie: string;
  public townCount: number;
  public oldPlayers: {
    players?: Player[];
  };
  public players: {
    players?: Player[];
  } = JSON.parse(fs.readFileSync(playerDataFile).toString());

  public towns: Town[] = JSON.parse(fs.readFileSync(townsDataFile).toString());

  public polygons: MarkerPolygonData[]

  constructor(address?: string) {
    this.players = { players: [] };
    this.oldPlayers = { players: [] };
    this.address = address ?? defaultAddress;

    this.lastFetch = Date.now();
    this.playerFuzzy = null;
    this.townFuzzy = null;
    this.cookie = JSON.parse(fs.readFileSync(cookieFile).toString()).cookie;

    this.townCount = 0;

    this.polygons = []
  }

  /**
   * Get's the live server player count
   * @returns Player count
   */
  public getOnlineCount(): number | undefined {
    const onlineData = JSON.parse(fs.readFileSync(onlineDataFile).toString());
    const d = new Date();
    const playerCount = this.players.players?.length;

    if (!onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`]) {
      onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`] = {};
    }
    onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`][
      `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`
    ] = playerCount;
    fs.writeFileSync(onlineDataFile, JSON.stringify(onlineData, null, 4));

    //Check for join

    if (this.oldPlayers.players?.length == 0) {
      this.oldPlayers = this.players;
    }

    this.players.players?.forEach((player) => {
      if (
        !this.oldPlayers.players?.find(
          (oldPlayer) => oldPlayer.name == player.name
        )
      )
        Client.channels.cache
          .get("909871500939624449")
          ?.fetch()
          .then((channel) => {
            if (channel.isText()) {
              channel.send({
                embeds: [
                  new MessageEmbed()
                    .setAuthor(`${player.name} Joined.`)
                    .setTimestamp()
                    .setThumbnail(
                      `https://visage.surgeplay.com/bust/128/${player.uuid}`
                    ),
                ],
              });
            }
          });
    });
    this.oldPlayers = this.players;

    return playerCount;
  }

  /**
   * Get's a live town count 
   * @returns Number of Towns
   */
  public getTownCount(): number {
    return this.townCount;
  }

  public async getPos(playerName: string) {
    const playerData = this.playerFuzzy.get(playerName);
    if (!playerData)
      return new Player({
        armor: 0,
        health: 0,
        name: "Error",
        uuid: "Player not found",
        world: "null",
        x: 0,
        z: 0,
        yaw: 0,
      });
    const nameData = playerData[0];
    const name = nameData[1];
    const percentage = nameData[0];
    const data: {
      players?: [
        {
          armor: number;
          health: number;
          name: string;
          uuid: string;
          world: string;
          x: number;
          z: number;
          yaw: number;
        }
      ];
    } = JSON.parse(fs.readFileSync(playerDataFile).toString());

    const player = new Player(data.players?.find((p) => p.name == name));

    console.log(player);

    return player.export();
  }


  public async getTown(townName: string) {

    const townData = this.townFuzzy.get(townName)[0];
    if (!townData){
      return null;
    }
   
    const town = this.towns.find((t) => t.name == townData[1]);

    return town;
    
  }
        

  /**
   * Creates the playerFuzzy search object
   */
  private makeFuzzy() {
    const playerMap = this.players.players?.map((p) => p.name);

    this.playerFuzzy = fuzzyset(playerMap);

    const townMap = this.towns.map((t) => t.name);
    this.townFuzzy = fuzzyset(townMap);

    ready = true;
  }

  /**
   * MASSIVE fetch function, fetches all data from the server, formats it, and saves it to the data files.
   * @returns nothing
   */
  private async fetch() {
    try {
      //fetch players

      let playerRes = await fetch(defaultAddress + playerEndpoint, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "if-modified-since": "Sun, 14 Nov 2021 14:18:43 GMT",
          "if-none-match": '"1636899523701"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "sec-gpc": "1",
          "upgrade-insecure-requests": "1",
          cookie: this.cookie,
        },
        method: "GET",
      });

      let json: any = undefined

      json = await playerRes.json().catch((e) => {
        dlFails.players = true;
        console.log("Failed to download players, grabbing locally");
        json = JSON.parse(fs.readFileSync(playerDataFile).toString());
      });

      this.players = json;

      if (Date.now() - startTime > 10000) {
        this.oldPlayers = this.players;
      }

      fs.writeFileSync(playerDataFile, JSON.stringify(this.players, null, 4));

      //fetch world towns

      let worldRes = await fetch(defaultAddress + worldMarkerEndpoint, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "if-modified-since": "Sun, 14 Nov 2021 14:18:43 GMT",
          "if-none-match": '"1636899523701"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "sec-gpc": "1",
          "upgrade-insecure-requests": "1",
          cookie: this.cookie,
        },
        method: "GET",
      });

      let worldMarkerJSON: any = undefined;

      worldMarkerJSON = await worldRes.json().catch((e) => {
      dlFails.worldMarkers = true;
      console.log("Failed to fetch world towns, grabbing locally");
      worldMarkerJSON = JSON.parse(fs.readFileSync(worldMarkerDataFile).toString());
      });

      fs.writeFileSync(
        worldMarkerDataFile,
        JSON.stringify(worldMarkerJSON, null, 4)
      );

      //fetch earth towns

      let earthRes = await fetch(defaultAddress + earthMarkerEndpoint, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "if-modified-since": "Sun, 14 Nov 2021 14:18:43 GMT",
          "if-none-match": '"1636899523701"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "sec-gpc": "1",
          "upgrade-insecure-requests": "1",
          cookie: this.cookie,
        },
        method: "GET",
      });

      let earthMarkerJSON: any = undefined;

      earthMarkerJSON = await earthRes.json().catch((e) => {
      dlFails.earthMarkers = true;
      console.log("Failed to fetch earth towns, grabbing locally");
      earthMarkerJSON = JSON.parse(fs.readFileSync(earthMarkerDataFile).toString());
      });

      fs.writeFileSync(
        earthMarkerDataFile,
        JSON.stringify(earthMarkerJSON, null, 4)
      );

      //Get saved towns

      this.towns = JSON.parse(fs.readFileSync(townsDataFile).toString());
      let newTowns: Town[] = [];
      let count = 0;

      //Create list of town data

      //find the order of the towns/worldborder markers, it seems to be random lmao

      const markerOrder = worldMarkerJSON[0].id == "towny" ? 0 : 1;

      //process overworld towns
      worldMarkerJSON[markerOrder].markers.forEach(
        (marker: MarkerIconData | MarkerPolygonData) => {
          let t = new Town("world");
          if (marker.type == "icon") {
            t = t.fromIcon(marker, "world");
            newTowns.push(t);
            //console.log(`Processing Overworld towns... ${count} towns processed`)
            count++;
          } else {
            this.polygons.push(marker);
          }
        }
      );

      //process earth towns

      earthMarkerJSON[markerOrder].markers.forEach(
        (marker: MarkerIconData | MarkerPolygonData) => {
          let t = new Town("earth");
          if (marker.type == "icon") {
            t = t.fromIcon(marker, "earth");
            newTowns.push(t);
            //console.log(`Processing Earth towns... ${count} towns processed`)
            count++;
          } else {
            this.polygons.push(marker);
          }
        }
      );
      //sort
      newTowns.sort((a, b) => {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();

        return aName < bName ? -1 : aName > bName ? 1 : 0;
      });

      this.polygons.forEach((polygon: MarkerPolygonData) => {

        let townPolygon = Town.markerToTownPolygon(polygon);

        const town = newTowns.find(t => t.name == townPolygon.name);
        if (town) {
          town.points = townPolygon.points;
          town.chunks = PolygonUtil.getChunkCount(town);
          town.color = townPolygon.color;
        }

      })

      //Make Fuzzy

      this.makeFuzzy();

      //Compare

      //Check for new towns

      newTowns.forEach((nt) => {
        const ret = this.towns.find((ot) => {
          return ot.name == nt.name;
        });

        if (!ret) {
          //town is new, announce it
          townUpdate(nt, "CREATE");
        }
      });

      //Check for fallen towns

      this.towns.forEach((ot) => {
        const ret = newTowns.find((nt) => {
          return nt.name == ot.name;
        });
        if (!ret) {
          //town has fallen, announce it
          townUpdate(ot, "DELETE");

          //Notify the "Town Fall Noftification" role by mentioning them
        }
      });

      //save
      fs.writeFileSync(townsDataFile, JSON.stringify(newTowns, null, 4));
      //update town count variable
      this.townCount = newTowns.length;
    } catch (error) {
      console.log(error);
    }

    return;
  }

  public isReady(): boolean {

    return ready;
  }

}
