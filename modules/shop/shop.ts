import { ShopArea, ShopID, ShopOwner, ShopProperties } from "./types";

export default class Shop {

    public owner: ShopOwner
    public location: ShopArea
    public id: ShopID
    public name: string

    constructor(properties: ShopProperties) {
        this.owner = properties.owner
        this.location = properties.location
        this.id = properties.shopId
        this.name = properties.shopName

    }
}