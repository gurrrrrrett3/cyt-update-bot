import { WorldLocation } from "../../resources/types";
import ExtrasAdvancedPresence from "./extras";
import ParkourAdvancedPresence from "./parkour";
import WorldAdvancedPresence from "./world";

export function getPresence(loc: WorldLocation) {
  switch (loc.world) {
    case "world":
      return WorldAdvancedPresence(loc);
    case "parkour":
      return ParkourAdvancedPresence(loc);
    case "extras":
        return ExtrasAdvancedPresence(loc);
    default:
      return "";
  }
}
