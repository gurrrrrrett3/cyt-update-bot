//@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
import fetch from "node-fetch"
import fs from "fs"
const fuzzyset = require("fuzzyset")

import Player from './cytplayer';
import Town, { World } from "./cytmarker"
import { MarkerIconData, MarkerPolygonData } from './cytmarker';
import { Client } from "..";
import { MessageEmbed } from "discord.js";
import { startTime, townUpdate } from "./infochannels";
import dailyUpdate from "./dailyupdate";

const playerDataFile = "./data/fetchPlayers.json"
const worldMarkerDataFile = "./data/fetchWorldMarkers.json"
const earthMarkerDataFile = "./data/fetchEarthMarkers.json"
const townsDataFile = "./data/towns.json"

const onlineDataFile = "./data/onlineData.json"

const cookieFile = "./data/cookie.json"

const defaultAddress: string = "https://zion.craftyourtown.com"
const playerEndpoint: string = "/tiles/players.json"
const worldMarkerEndpoint: string = "/tiles/world/markers.json"
const earthMarkerEndpoint: string = "/tiles/earth/markers.json"

const worldList: World[] = ["world", "earth", "world_nether", "world_the_end"]


export default class cyt {

    private newTowns: Town[]
    private fuzzy: any
    private interval = setInterval(async () => {
       await this.fetch()
    }, 5000)

    public address: string
    public cookie: string
    public townCount: number
    public oldPlayers: {
        players?: Player[]
    }
    public players: {

        players?: Player[]

    } = JSON.parse(fs.readFileSync(playerDataFile).toString())

    constructor(address?: string) {

        this.newTowns = []
        this.players = {players: []}
        this.oldPlayers = {players: []}
        this.address = address ?? defaultAddress

        this.fuzzy = null
        this.cookie = JSON.parse(fs.readFileSync(cookieFile).toString()).cookie

        this.townCount = 0
    }


    public getOnlineCount() {

        const onlineData = JSON.parse(fs.readFileSync(onlineDataFile).toString())
        const d = new Date()
        const playerCount = this.players.players?.length

        if (!onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`]) {onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`] = {}} 
        onlineData[`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`][`${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`] = playerCount
        fs.writeFileSync(onlineDataFile, JSON.stringify(onlineData, null, 4))

        //Check for join

        if(this.oldPlayers.players?.length == 0) {
            this.oldPlayers = this.players
        }

        this.players.players?.forEach((player) => {

        if (!this.oldPlayers.players?.find((oldPlayer) => oldPlayer.name == player.name))

        Client.channels.cache.get("909871500939624449")?.fetch().then((channel) => {

            if(channel.isText()) {

                channel.send({embeds: [new MessageEmbed().setAuthor(`${player.name} Joined.`).setTimestamp().setThumbnail(`https://visage.surgeplay.com/bust/128/${player.uuid}`)]})

            }

        })

        })
        this.oldPlayers = this.players

        return playerCount

    }

    public getTownCount() {

        return this.townCount 

    }

    public async getPos(playerName: string) {

        const playerData = this.fuzzy.get(playerName)
        if(!playerData) return new Player({armor: 0, health: 0, name: "Error", uuid: "Player not found", world: "null", x: 0, z: 0, yaw: 0})
        const nameData = playerData[0]
        const name = nameData[1]
        const percentage = nameData[0]
        const data: {
            players?: [
                {
                    armor: number,
                    health: number,
                    name: string,
                    uuid: string,
                    world: string,
                    x: number,
                    z: number,
                    yaw: number

                }
            ]
        } = JSON.parse(fs.readFileSync(playerDataFile).toString())

        const player = new Player(data.players?.find((p) => p.name == name))

        console.log(player)

        return player.export()

    }

    private makeFuzzy() {

        const playerMap = this.players.players?.map((p) => (p.name))

        this.fuzzy = fuzzyset(playerMap)

    }

    private async fetch() {

        try {

            //fetch players

            let playerRes = await fetch(defaultAddress + playerEndpoint, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "max-age=0",
                    "if-modified-since": "Sun, 14 Nov 2021 14:18:43 GMT",
                    "if-none-match": "\"1636899523701\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "sec-gpc": "1",
                    "upgrade-insecure-requests": "1",
                    "cookie": this.cookie
                },
                "method": "GET"
            });


            const json: any = await playerRes.json()

            this.players = json

            if(Date.now() - startTime > 10000) {
                this.oldPlayers = this.players
            }

            this.makeFuzzy()

            fs.writeFileSync(playerDataFile, JSON.stringify(this.players, null, 4))

            worldList.forEach(async (world) => {

                await this.getMarkers(world)

            })
         
            //Get saved towns

            let towns: Town[] = JSON.parse(fs.readFileSync(townsDataFile).toString())
            this.newTowns = []

            //Create list of town data

            //sort
            this.newTowns.sort((a, b) => {

                const aName = a.name.toUpperCase()
                const bName = b.name.toUpperCase()

                return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            })

            //Compare

            //Check for new towns

            this.newTowns.forEach((nt) => {
                const ret = towns.find((ot) => {
                return ot.name == nt.name
            })

            if (!ret) {
                //town is new, announce it
                townUpdate(nt, "CREATE")
            }
        })

         //Check for fallen towns

         towns.forEach((ot) => {
             const ret = this.newTowns.find((nt) => {
                 return nt.name == ot.name
             })
             if (!ret) {
                //town has fallen, announce it
                townUpdate(ot, "DELETE")
             }
         })

            //save
           fs.writeFileSync(townsDataFile, JSON.stringify(this.newTowns, null, 4))

           this.townCount = this.newTowns.length

        } catch (error) { 
            console.log(error)
        }


        return

    }

    private genEndpoint(world: World) {

        return `/tiles/${world}/markers.json`

    }

    private genDataFile(world: World) {

        return `./data/fetch${world}Markers.json`

    }


    private async getMarkers(world: World) {

        let res = await fetch(defaultAddress + this.genEndpoint(world), {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "if-modified-since": "Sun, 14 Nov 2021 14:18:43 GMT",
                "if-none-match": "\"1636899523701\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1",
                "cookie": this.cookie
            },
            "method": "GET"
        });

        const json: any = await res.json()

        fs.writeFileSync(this.genDataFile(world), JSON.stringify(json, null, 4))

         //find the order of the towns/worldborder markers, it seems to be random lmao

         const markerOrder =  json[0].id == "towny" ? 0 : 1

          //process towns
          json[markerOrder].markers.forEach((marker: MarkerIconData | MarkerPolygonData) => {

            let t = new Town(world)
            if (marker.type == "icon") {
                t = t.fromIcon(marker, world)
                    this.newTowns.push(t)
            }
        })
    }

}
