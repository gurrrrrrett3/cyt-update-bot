import { Interaction } from "discord.js";
import fs from "fs";
import path from "path";
import { Link } from "./botTypes";

//The Data storage Manager for the /link command

export default class Linking {
  public static readonly filePath = path.join(__dirname, "../../../data/links.json");
  

  public static newLink(id: string, ign: string) {
    const links = this.openFile();
    links.push({ id, ign });
    this.saveFile(links);
  }

  public static getLinkByID(id: string) {
    return this.openFile().find((link) => link.id === id);
  }

  public static getLinkByIGN(ign: string) {
    return this.openFile().find((link) => link.ign === ign);
  }

  public static openFile() {
    return JSON.parse(fs.readFileSync(Linking.filePath, "utf8")) as Link[];
  }

  public static saveFile(data: Link[]) {
    fs.writeFileSync(Linking.filePath, JSON.stringify(data, null, 4));
  }  
}
