import Util from "../../bot/util";
import { Coords, WorldLocation } from "../../resources/types";
import { Group } from "./types";

const groups: Group[] = [
    {
        name: "Looking at crates",
        corner1: { x: 31, z: 6 },
        corner2: { x: 50, z: -7 },
    },
    {
        name: "Singin campfire songs",
        corner1: { x: 73, z: -4 },
        corner2: { x: 67, z: 5 },

    },
    {
        name: "Smackin the pinata",
        corner1: { x: -6, z: 6 },
        corner2: { x: -16, z: -7 },
    },
    {
        name: "Enchanting",
        corner1: { x: 29, z: 12 },
        corner2: { x: 23, z: 18 },
    },
    {
        name: "In the mine",
        corner1: { x: 8, z: 10 },
        corner2: { x: -5, z: -8 },  
    },
    {
        name: "Sleeping in cozy corner",
        corner1: { x: 28, z: 40 },
        corner2: { x: 21, z: 45 },
    },
    {
        name: "Spending vote tokens",
        corner1: { x: 53, z: 11 },
        corner2: { x: 59, z: 18 },
    },
    {
        name: "At the vendor",
        corner1: { x: 45, z: 17 },
        corner2: { x: 52, z: 24 },
    },
    {
        name: "Looking at the community chest",
        corner1: { x: 52, z: 5 },
        corner2: { x: 52, z: 10 },
    },
    {
        name: "In Spawn",
          corner1: { x: -52, z: 77 },
          corner2: { x: 98, z: -73 },
    }
];

export default function WorldAdvancedPresence(loc: WorldLocation) {
  if (loc.world !== "world") return "";

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
