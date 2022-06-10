import { Coords, WorldLocation } from '../../resources/types';
import Util from '../../bot/util';
import Player from '../../resources/player';

export type AreaLogShape = "RECT" | "RADIUS" | "POLY"

export default class AreaLog {

    public type: AreaLogShape;
    public name: string;
    public alerted: string[] = []

    public world: string
    public x1: Coords | undefined;
    public x2: Coords | undefined;
    public radius: number | undefined

    public players: string[] = []

    public joinAlert: Function | undefined
    public leaveAlert: Function | undefined

    constructor (type: "RECT", name: string, world: string, x1: Coords, x2: Coords)
    constructor (type: "RADIUS", name: string, world: string, location: Coords, radius: number)
    constructor (type: "POLY", name: string, world: string, ...points: Coords[])
    constructor (type: AreaLogShape, name: string, world: string , ...args: any[]) {
        this.type = type;
        this.name = name;
        this.world = world;

        if (type === "RECT") {
            this.x1 = args[0];
            this.x2 = args[1];
        } else if (type === "RADIUS") {
            this.x1 = args[0];
            this.radius = args[1];
        }

        

    }

    public addAlert(user: string) {
        this.alerted.push(user);
    }

    public removeAlert(user: string) {
        this.alerted = this.alerted.filter(u => u !== user);   
    }

    public check(player: Player) {
        let alert = false;
        if (this.type === "RECT") {
            alert = this.checkRect(player.getLocation()) ? true : alert;
        } else if (this.type === "RADIUS") {
            alert = this.checkRadius(player.getLocation()) ? true : alert;
        } 

        if (alert) {
            if (!this.players.includes(player.uuid)) {
                this.players.push(player.uuid);
                if (this.joinAlert) {
                    this.joinAlert(player);
                }
            } 
        } else {
            if (this.players.includes(player.uuid)) {
                this.players = this.players.filter(p => p !== player.uuid);
                if (this.leaveAlert) {
                    this.leaveAlert(player);
                }
            }
        }
    }

    private checkRect(location: WorldLocation) {
        if (location.world !== this.world) {
            return false;
        }

        if (this.x1 && this.x2) {
            if (location.x >= this.x1.x && location.x <= this.x2.x && location.z >= this.x1.z && location.z <= this.x2.z) {
                return true;
            }
        }
    }

    private checkRadius(location: WorldLocation) {
        if (location.world !== this.world) {
            return false;
        }

        if (this.x1 && this.radius) {
            const distance = Util.getDistance(location, this.x1);
            return distance <= this.radius;
        }
        
    }


    public toJSON() {
        return {
            type: this.type,
            name: this.name,
            alerted: this.alerted,
            world: this.world,
            x1: this.x1,
            x2: this.x2,
            radius: this.radius
            
        }
    }
}