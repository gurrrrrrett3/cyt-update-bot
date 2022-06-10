import Util from "../bot/util";
import { Coords } from "./types";

export default class ProxMember {

    pos: Coords

    constructor(public userID: string, public username: string) {

        const player = Util.getOnlinePlayer(username);
        if (player) {
            this.pos = {
                x: player.x,
                z: player.z,
            };
        } else {
            this.pos = {
                x: 0,
                z: 0,
            };
            
        }

    }

}