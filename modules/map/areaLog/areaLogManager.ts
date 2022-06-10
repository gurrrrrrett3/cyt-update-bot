import AreaLog from './areaLog';
import { WorldLocation } from '../../resources/types';
import { bot } from '../../..';
import Util from '../../bot/util';
import Player from '../../resources/player';
import { TextBasedChannel } from 'discord.js';
export default class AreaLogManager {

    constructor() {
        bot.timerManager.on("1", () => {
            let players = Util.getPlayerFile()
            for (const areaLog of this.areaLogs.values()) {
                for (const player of players) {
                    areaLog.check(player);
                }
            }
        })
    }

    public areaLogs: Map<string, AreaLog> = new Map<string, AreaLog>();

    public addAreaLog(areaLog: AreaLog) {
        areaLog.joinAlert = this.alert(areaLog, "entered")
        areaLog.leaveAlert = this.alert(areaLog, "left")
        this.areaLogs.set(areaLog.name, areaLog);

    }

    public removeAreaLog(areaLog: AreaLog) {
        this.areaLogs.delete(areaLog.name);
    }

    

    public alert(areaLog: AreaLog, method: string) {
        return (player: Player) => {
            const channel = bot.Client.channels.cache.get("984688580490321920") as TextBasedChannel
            channel.send(`${areaLog.alerted.map((v) => `<@${v}>`).join(" ")} ${player.getName()} has ${method} ${areaLog.name}!`)
        }
    }



}