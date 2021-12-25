import fs from "fs";
import fetch from "node-fetch";

import staticData from "./staticData";

export default class getData {
  public static async getData(): Promise<void> {
    let endpoints = staticData.endpoints;

    for (let i = 0; i < endpoints.length; i++) {
      let endpoint = endpoints[i];
      let name = endpoint.name;
      let url = endpoint.url;
      let saveLocation = endpoint.saveLocation;
    
        let response = await fetch(staticData.defaultUrl + url, {
            method: "GET",
            headers: staticData.fetch.headers
        });

        let data = await response.json().catch(error => {
            console.log(`${name} failed to download. Using local data.`);
        });

        let dataString = JSON.stringify(data, null, 2);

        fs.writeFileSync(saveLocation, dataString)
    }
  }
}
