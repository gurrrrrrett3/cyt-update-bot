export type MarkerFile = MarkerGroup[];

export interface MarkerGroup {
  hide: boolean;
  z_index: number;
  name: string;
  control: boolean;
  id: string;
  markers: Marker[];
  order: number;
  timestamp: number;
}

export interface Marker {
  color?: string;
  tooltip: string;
  type: "icon" | "polygon";
  points?: Point[][][];
  fillColor?: string;
  popup?: string;
  tooltip_anchor?: Point;
  size?: Point;
  anchor?: Point;
  icon?: string;
  point?: Point;
}

export interface IconMarker {
  tooltip_anchor: Point;
  popup: string;
  size: Point;
  type: "icon";
  tooltip: string;
  anchor: Point;
  icon: string;
  point: Point;
}

export interface Point {
  z: number;
  x: number;
}

export interface PolygonMarker {
  fillColor: string;
  popup: string;
  color: string;
  tooltip: string;
  type: "polygon";
  points: Point[][][];
}

export function isIconMarker(marker: Marker): marker is IconMarker {
  return marker.type === "icon";
}

export function isPolygonMarker(marker: Marker): marker is PolygonMarker {
  return marker.type === "polygon"
}