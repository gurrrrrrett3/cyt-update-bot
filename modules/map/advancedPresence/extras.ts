import Util from "../../bot/util";
import { Coords, WorldLocation } from "../../resources/types";
import { Group } from "./types";

const groups: Group[] = [
    {
        name: "Angel tower | level 1",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 2",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 3",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 4",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 5",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 6",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Angel tower | level 7",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Demon tower | level 1",
        corner1: { x: 1201, z: 1006 },
        corner2: { x: 1248, z: 1066 },
    },
    {
        name: "Demon tower | level 2",
        corner1: { x: 1251, z: 1117 },
        corner2: { x: 1211, z: 1157 },
    },
    {
        name: "Demon tower | level 3",
        corner1: { x: 1248, z: 1232 },
        corner2: { x: 1214, z: 1269 },
    },
    {
        name: "Demon tower | level 4",
        corner1: { x: 1253, z: 969 },
        corner2: { x: 1211, z: 947 },
    },
    {
        name: "Demon tower | level 5",
        corner1: { x: 1253, z: 1327 },
        corner2: { x: 1211, z: 1369 },
    },
    {
        name: "Demon tower | level 6",
        corner1: { x: 1246, z: 1452 },
        corner2: { x: 1219, z: 1435 },
    },
    {
        name: "Demon tower | level 7",
        corner1: { x: 1248, z: 1526 },
        corner2: { x: 1215, z: 1560 },
    },
    {
        name: "Envoys",
        corner1: { x: -1784, z: -639 },
        corner2: { x: -1501, z: -915 },
    }


];

export default function ExtrasAdvancedPresence(loc: WorldLocation) {
  if (loc.world !== "extras") return "";

  const group = groups.find((g) => {
    return isInGroup(loc, g);
  });

  if (group) {
      return `${group.name}`;
  } else {
    return "";
  }
}

function isInGroup(loc: WorldLocation, group: Group) {
  return (
    (loc.x >= group.corner1.x && loc.x <= group.corner2.x && loc.z >= group.corner1.z && loc.z <= group.corner2.z) ||
    (loc.x <= group.corner1.x && loc.x >= group.corner2.x && loc.z <= group.corner1.z && loc.z >= group.corner2.z) ||
    (loc.x >= group.corner1.x && loc.x <= group.corner2.x && loc.z <= group.corner1.z && loc.z >= group.corner2.z) ||
    (loc.x <= group.corner1.x && loc.x >= group.corner2.x && loc.z >= group.corner1.z && loc.z <= group.corner2.z)
  );
}
