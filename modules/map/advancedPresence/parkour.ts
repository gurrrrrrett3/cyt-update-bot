import Util from "../../bot/util";
import { Coords, WorldLocation } from "../../resources/types";
import { Group } from "./types";

const groups: Group[] = [
  {
    name: "Doing Rainbow Parkour",
    corner1: { x: 5, z: 40 },
    corner2: { x: -45, z: 36 },
  },

  {
    name: "Doing The Beginner Parkour",
    corner1: { x: 5, z: 34 },
    corner2: { x: -45, z: 29 },
  },
  {
    name: "Doing Aesthetic Parkour",
    corner1: { x: 5, z: 27 },
    corner2: { x: -45, z: 21 },
  },

  {
    name: "Doing Frost Parkour",
    corner1: { x: 5, z: 19 },
    corner2: { x: -45, z: 13 },
  },
  {
    name: "Doing Over the Fence Parkour",
    corner1: { x: 5, z: 11 },
    corner2: { x: -45, z: 3 },
  },
  {
    name: "Doing Invis Parkour",
    corner1: { x: 5, z: 1 },
    corner2: { x: -45, z: -5 },
  },
  {
    name: "Doing The Demon Parkour",
    corner1: { x: 5, z: -7 },
    corner2: { x: -45, z: -15 },
  },
  {
    name: "Doing End Game Parkour",
    corner1: { x: 5, z: -17 },
    corner2: { x: -45, z: -27 },
  },
  {
    name: "Doing The Eternal Parkour",
    corner1: { x: 5, z: -29 },
    corner2: { x: -45, z: -43 },
  },
  {
    name: "Doing very fun Parkour",
    corner1: { x: 5, z: -45 },
    corner2: { x: -45, z: -59 },
  },
  {
    name: "At spawn",
    corner1: { x: 6, z: 9 },
    corner2: { x: 10, z: 5 },
  },
];

export default function ParkourAdvancedPresence(loc: WorldLocation) {
  if (loc.world !== "parkour") return "";

  const group = groups.find((g) => {
    return isInGroup(loc, g);
  });

  const percent = ((loc.x * -1) / 40) * 100;

  if (group) {
    if (group.name == "At spawn") {
      return `${group.name}`;
    } else {
      return `${group.name} | ${Util.bound(percent, 0, 100).toFixed(2)}%`;
    }
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
