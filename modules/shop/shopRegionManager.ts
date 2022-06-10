import { ShopArea, ShopProperties } from "./types";
import path from "path";
import fs from "fs";
export default class ShopRegionManager {
  public static shops: ShopProperties[] = [];
  public static readonly SHOP_DATA_FOLDER = path.resolve("data/shop/plots");

  public static loadShops() {
    const shops = fs.readdirSync(this.SHOP_DATA_FOLDER);
    shops.forEach((shop) => {
      this.loadShop(shop);
    });

    console.log(`Loaded ${this.shops.length} shops`);
  }

  public static loadShop(folder: string) {
   
    if (!fs.existsSync(path.resolve(this.SHOP_DATA_FOLDER, folder, "properties.json"))) {
      let data = {
        shopId: folder.toUpperCase(),
        owner: "Unknown",
        location: {
          world: "earth",
          a: { x: 0, z: 0 },
          b: { x: 0, z: 0 },
        },
        shopName: "Unknown",
      }
      fs.writeFileSync(path.resolve(this.SHOP_DATA_FOLDER, folder, "properties.json"), JSON.stringify(data));
    }

    let shop = fs.readFileSync(path.resolve(this.SHOP_DATA_FOLDER, folder, "properties.json"), "utf8");
    const shopProperties = JSON.parse(shop) as ShopProperties;
    this.shops.push(shopProperties);
    //@ts-ignore
    shopProperties.shopId = folder.toUpperCase();
    fs.writeFileSync(path.resolve(this.SHOP_DATA_FOLDER, folder, "properties.json"), JSON.stringify(shopProperties, null, 2));
  }
}
