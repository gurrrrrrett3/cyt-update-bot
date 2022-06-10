import { Coords } from "../resources/types";

export interface ShopProperties {

    shopId: ShopID
    owner: ShopOwner
    location: ShopArea
    shopName: string

}

export interface ShopOwner {
    ign: string
    id: string
}

export interface ShopArea {
    world: string;
    a: Coords
    b: Coords
}

export interface ShopSession {
    uuid: string
    path: PathInstance[]
    entered: number
}

export interface PathInstance {
    time: number;
    x: number
    z: number
    yaw: number
}

export type ShopIDInterface = "S" | "T"
export type ShopID = `${ShopIDInterface}${number}`