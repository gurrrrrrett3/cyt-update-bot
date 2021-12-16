export type World = "world" | "earth" | "world_nether" | "world_the_end"
export type mapWorld = "world" | "earth" | "world_nether" | "world_the_end" | "extras" | "parkour"

export type Coords = {
    x: number
    z: number
}

export type Zoom = "1" | "2" | "3" | "4" | "5"
export type MapZoom = "0" | "1" | "2" | "3"

export type MarkerPolygonData = {

    "fillColor": string,
    "popup": string,
    "color": string,
    "tooltip": string,
    "type": "polygon",
    "points": [[{
        "x": number,
        "z": number
    }]]


}

export type MarkerIconData = {

    "tooltip_anchor": {
        "z": number,
        "x": number
    },
    "popup": string,
    "size": {
        "z": number,
        "x": number
    },
    "anchor": {
        "z": number,
        "x": number
    },
    "tooltip": string,
    "icon": string,
    "type": "icon",
    "point": {
        "z": number,
        "x": number
    }
}