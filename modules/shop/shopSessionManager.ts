import Player from "../resources/player";
import { ShopSession } from "./types";

export default class ShopSessionManager {
    public static currentSessions: ShopSession[] = [];
    
    public static getShopSession(player: Player): ShopSession | null {
        return this.currentSessions.find(session => session.uuid === player.uuid) || null;
    }

    public static isValid(player: Player): boolean {
        return this.getShopSession(player) != null;
    }

    public static updateSession(player: Player) {
        const session = this.getShopSession(player);
        
        session?.path.push({
            time: Date.now(),
            x: player.x,
            z: player.z,
            yaw: player.yaw            
        })
        
        
    }

}