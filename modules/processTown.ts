import fs from "fs";

import Town from "./town";
import { Marker, World } from "./types";
import staticData from "./staticData";
import getData from "./getData";

export default class ProcessTown {
  public static async Run(): Promise<void> {
    //save start time for later

    let startTime = Date.now();
    
    //Get Data
    await getData.getData();

    let fileLocations = staticData.fileLocations;
    //@ts-ignore

    //Load Markers
    let markers = this.getMarkers(fileLocations);

    //Process Markers

    let { towns, polygons } = this.processIcons(markers);
    
    //Add Polygons to Towns

    console.log(`${towns.length} towns loaded.`);
    console.log(`${polygons.length} polygons loaded.`);

    //add polygon data to towns as it's processed seprately

    let processedTowns = this.addPolygonsToTowns(towns, polygons);

    console.log(`${processedTowns.length} towns with polygons loaded.`);

    //add missing towns back to the list

    towns = this.addMissingTowns(processedTowns, towns);

    //Save

    fs.writeFileSync("./data/towns.json", JSON.stringify(towns, null, 2));

    console.log(`${towns.length} towns loaded, took ${Date.now() - startTime}ms.`);
  }

  public static getTown(town: string) {
    let towns = this.getTowns();

    return towns.find((t) => {
        return t.name == town;
    });
  }

  public static getTowns(): Town[] {
    let towns: Town[] = JSON.parse(fs.readFileSync("./data/towns.json").toString());

    return towns;
  }

  private static getMarkers(fileLocations: { location: string; world: World }[]): [Marker] {
    //@ts-ignore
    let ret: [Marker] = [];

    fileLocations.forEach((fileLocation) => {
      let data = fs.readFileSync(fileLocation.location).toString();

      let json = JSON.parse(data)

      const markerOrder = json[0].id == "towny" ? 0 : 1;

      json[markerOrder].markers.forEach((marker: Marker) => {
        marker.world = fileLocation.world;
        ret.push(marker);
      });
    });
    console.log(`${ret.length} markers loaded.`);
    return ret;
  }

  private static processIcons(markers: [Marker]): { towns: Town[]; polygons: Marker[] } {
    let towns: Town[] = [];
    let polygons: Marker[] = [];

    markers.forEach((marker) => {
      if (marker.type == "icon") {
        let t = Town.fromIcon(marker, marker.world);
        towns.push(t);
      } else {
        polygons.push(marker);
      }
    });

    return {
      towns,
      polygons,
    };
  }

  private static addPolygonsToTowns(towns: Town[], polygons: Marker[]): Town[] {

    let retTowns: Town[] = [];

    polygons.forEach((polygon) => {
        
        let town = towns.find((town) => {
            return town.name == Town.parsePolygonTooltip(polygon.tooltip);
        });

        if (!town) return;

      town = Town.addPolygonData(town, polygon);

      if (town) retTowns.push(town);
    });

    return retTowns;
  }

    private static addMissingTowns(processedTowns: Town[], towns: Town[]): Town[] {

    let retTowns: Town[] = towns;
    let count = 0;

    towns.forEach((town) => {
        let processedTown = processedTowns.find((processedTown) => {
            return processedTown.name == town.name;
        });

        if (!processedTown) {
            retTowns.push(town);
            count++;
        }
    });

    console.log(`${count} towns missing were added.`);

    return retTowns;
  }
}
